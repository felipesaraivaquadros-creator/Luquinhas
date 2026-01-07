import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 10;
const WORDS = ['DENGUE', 'MOSQUITO', 'AGUA', 'FEBRE', 'VACINA'];

interface Cell {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFound: boolean;
}

export default function CacaPalavras() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, row) =>
      Array(GRID_SIZE).fill(null).map((_, col) => ({
        letter: '',
        row,
        col,
        isSelected: false,
        isFound: false
      }))
    );

    // Place words horizontally
    WORDS.forEach((word, index) => {
      const row = index * 2;
      const startCol = Math.floor(Math.random() * (GRID_SIZE - word.length));
      
      for (let i = 0; i < word.length; i++) {
        newGrid[row][startCol + i].letter = word[i];
      }
    });

    // Fill empty cells with random letters
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].letter) {
          newGrid[row][col].letter = randomLetters[Math.floor(Math.random() * randomLetters.length)];
        }
      }
    }

    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setIsComplete(false);
  };

  const handleCellClick = (cell: Cell) => {
    if (cell.isFound) return;

    const newSelected = [...selectedCells];
    const cellIndex = newSelected.findIndex(c => c.row === cell.row && c.col === cell.col);

    if (cellIndex >= 0) {
      newSelected.splice(cellIndex, 1);
    } else {
      newSelected.push(cell);
    }

    setSelectedCells(newSelected);
    checkForWord(newSelected);
  };

  const checkForWord = (selected: Cell[]) => {
    if (selected.length === 0) return;

    const word = selected.map(cell => cell.letter).join('');
    
    if (WORDS.includes(word) && !foundWords.includes(word)) {
      // Mark cells as found
      const newGrid = grid.map(row =>
        row.map(cell => {
          const isInWord = selected.some(s => s.row === cell.row && s.col === cell.col);
          return isInWord ? { ...cell, isFound: true, isSelected: false } : cell;
        })
      );
      setGrid(newGrid);
      setFoundWords([...foundWords, word]);
      setSelectedCells([]);

      if (foundWords.length + 1 === WORDS.length) {
        setIsComplete(true);
      }
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-luquinhas-yellow" />
            <h1 className="text-5xl font-bold text-luquinhas-green mb-4">
              Parabéns!
            </h1>
            <p className="text-3xl text-gray-700 mb-8">
              Você encontrou todas as palavras!
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-4xl font-bold text-luquinhas-pink">
            Caça-palavras
          </h1>
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 text-luquinhas-green hover:text-luquinhas-green-dark"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Word List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Palavras para encontrar:
              </h2>
              <div className="space-y-3">
                {WORDS.map(word => (
                  <div
                    key={word}
                    className={`p-4 rounded-2xl font-bold text-xl transition-all ${
                      foundWords.includes(word)
                        ? 'bg-luquinhas-green text-white line-through'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-luquinhas-blue">
                  {foundWords.length}/{WORDS.length}
                </div>
                <div className="text-gray-600 font-semibold">Encontradas</div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-2">
            <div className="card">
              <p className="text-lg text-gray-700 text-center mb-6">
                Clique nas letras para selecionar uma palavra
              </p>
              <div className="grid grid-cols-10 gap-1 max-w-2xl mx-auto">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isSelected = selectedCells.some(
                      c => c.row === cell.row && c.col === cell.col
                    );
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(cell)}
                        className={`aspect-square rounded-lg font-bold text-lg transition-all ${
                          cell.isFound
                            ? 'bg-luquinhas-green text-white'
                            : isSelected
                            ? 'bg-luquinhas-blue text-white scale-110'
                            : 'bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-200'
                        }`}
                      >
                        {cell.letter}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedCells.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setSelectedCells([])}
                    className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
                  >
                    Limpar Seleção
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
