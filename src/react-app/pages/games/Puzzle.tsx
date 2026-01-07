import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Trophy, RotateCcw } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
}

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

export default function Puzzle() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    checkCompletion();
  }, [pieces]);

  const initializeGame = () => {
    const newPieces: PuzzlePiece[] = [];
    const positions = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (let i = 0; i < TOTAL_PIECES; i++) {
      newPieces.push({
        id: i,
        currentPosition: positions[i],
        correctPosition: i
      });
    }

    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
  };

  const checkCompletion = () => {
    if (pieces.length === 0) return;
    const complete = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    if (complete && moves > 0) {
      setIsComplete(true);
    }
  };

  const handlePieceClick = (pieceId: number) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    const emptyPiece = pieces.find(p => p.id === TOTAL_PIECES - 1);
    if (!emptyPiece) return;

    const pieceRow = Math.floor(piece.currentPosition / GRID_SIZE);
    const pieceCol = piece.currentPosition % GRID_SIZE;
    const emptyRow = Math.floor(emptyPiece.currentPosition / GRID_SIZE);
    const emptyCol = emptyPiece.currentPosition % GRID_SIZE;

    const isAdjacent =
      (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
      (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow);

    if (isAdjacent) {
      const newPieces = pieces.map(p => {
        if (p.id === pieceId) {
          return { ...p, currentPosition: emptyPiece.currentPosition };
        }
        if (p.id === emptyPiece.id) {
          return { ...p, currentPosition: piece.currentPosition };
        }
        return p;
      });

      setPieces(newPieces);
      setMoves(moves + 1);
    }
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = piece.correctPosition === TOTAL_PIECES - 1 ? 0 : Math.floor(piece.correctPosition / GRID_SIZE);
    const col = piece.correctPosition === TOTAL_PIECES - 1 ? 0 : piece.correctPosition % GRID_SIZE;
    
    return {
      backgroundImage: piece.id === TOTAL_PIECES - 1 ? 'none' : `url(https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=600)`,
      backgroundSize: `${GRID_SIZE * 100}%`,
      backgroundPosition: `${col * 100}% ${row * 100}%`
    };
  };

  if (isComplete) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-luquinhas-yellow" />
            <h1 className="text-5xl font-bold text-luquinhas-blue mb-4">
              Parabéns!
            </h1>
            <p className="text-3xl text-gray-700 mb-8">
              Você completou o quebra-cabeça em {moves} movimentos!
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-4xl font-bold text-luquinhas-blue">
            Quebra-cabeça
          </h1>
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 text-luquinhas-green hover:text-luquinhas-green-dark"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Moves Counter */}
        <div className="text-center mb-8">
          <div className="card inline-block px-8">
            <div className="text-3xl font-bold text-luquinhas-blue">{moves}</div>
            <div className="text-gray-600 font-semibold">Movimentos</div>
          </div>
        </div>

        {/* Puzzle Board */}
        <div className="card max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {pieces
              .sort((a, b) => a.currentPosition - b.currentPosition)
              .map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  className={`aspect-square rounded-xl border-4 border-white transition-all ${
                    piece.id === TOTAL_PIECES - 1
                      ? 'bg-gray-200'
                      : 'bg-cover hover:scale-105 shadow-lg cursor-pointer'
                  }`}
                  style={getPieceStyle(piece)}
                />
              ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-lg">Clique nas peças adjacentes ao espaço vazio para movê-las</p>
        </div>
      </div>
    </div>
  );
}
