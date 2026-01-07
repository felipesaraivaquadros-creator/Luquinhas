import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Trophy, RotateCcw } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🦟', '💧', '🏠', '🌡️', '🌳', '🧪', '💉', '👨‍⚕️'];

export default function Memoria() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = gameEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      cards[id].isFlipped ||
      cards[id].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(matches + 1);

          if (matches + 1 === EMOJIS.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-luquinhas-yellow" />
            <h1 className="text-5xl font-bold text-luquinhas-green mb-4">
              Você Venceu!
            </h1>
            <p className="text-3xl text-gray-700 mb-8">
              Completou em {moves} jogadas
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={initializeGame}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Jogar Novamente
              </button>
              <button
                onClick={() => navigate('/activities')}
                className="btn-secondary flex items-center gap-2"
              >
                <Home className="w-6 h-6" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-4xl font-bold text-luquinhas-yellow text-gray-800">
            Jogo da Memória
          </h1>
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 text-luquinhas-green hover:text-luquinhas-green-dark"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="card text-center px-8">
            <div className="text-3xl font-bold text-luquinhas-blue">{moves}</div>
            <div className="text-gray-600 font-semibold">Jogadas</div>
          </div>
          <div className="card text-center px-8">
            <div className="text-3xl font-bold text-luquinhas-green">{matches}/{EMOJIS.length}</div>
            <div className="text-gray-600 font-semibold">Pares</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-2xl shadow-lg transition-all duration-300 text-6xl flex items-center justify-center ${
                card.isFlipped || card.isMatched
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-luquinhas-blue to-luquinhas-green hover:scale-105'
              } ${card.isMatched ? 'opacity-50' : ''}`}
            >
              {(card.isFlipped || card.isMatched) && card.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
