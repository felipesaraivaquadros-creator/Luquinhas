import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Trophy, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  number: number;
}

const POINTS: Point[] = [
  { x: 400, y: 150, number: 1 },   // Top of head
  { x: 450, y: 180, number: 2 },   // Right side of head
  { x: 460, y: 230, number: 3 },   // Right neck
  { x: 450, y: 280, number: 4 },   // Right body top
  { x: 500, y: 320, number: 5 },   // Right wing
  { x: 480, y: 370, number: 6 },   // Right body middle
  { x: 460, y: 420, number: 7 },   // Right body bottom
  { x: 400, y: 450, number: 8 },   // Bottom center
  { x: 340, y: 420, number: 9 },   // Left body bottom
  { x: 320, y: 370, number: 10 },  // Left body middle
  { x: 300, y: 320, number: 11 },  // Left wing
  { x: 350, y: 280, number: 12 },  // Left body top
  { x: 340, y: 230, number: 13 },  // Left neck
  { x: 350, y: 180, number: 14 },  // Left side of head
  { x: 400, y: 150, number: 15 }   // Back to top
];

export default function LigarPontos() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connectedPoints, setConnectedPoints] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    drawCanvas();
  }, [connectedPoints]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connected lines
    if (connectedPoints.length > 1) {
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 4;
      ctx.beginPath();
      connectedPoints.forEach((pointNumber, index) => {
        const point = POINTS.find(p => p.number === pointNumber);
        if (!point) return;
        
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }

    // Draw points
    POINTS.forEach(point => {
      const isConnected = connectedPoints.includes(point.number);
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = isConnected ? '#4CAF50' : '#FFC107';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw number
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Fredoka';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.number.toString(), point.x, point.y);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked point
    const clickedPoint = POINTS.find(point => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      return distance <= 20;
    });

    if (!clickedPoint) return;

    // Check if it's the next point in sequence
    const nextNumber = connectedPoints.length + 1;
    if (clickedPoint.number === nextNumber) {
      const newConnected = [...connectedPoints, clickedPoint.number];
      setConnectedPoints(newConnected);

      if (newConnected.length === POINTS.length) {
        setIsComplete(true);
      }
    }
  };

  const handleReset = () => {
    setConnectedPoints([]);
    setIsComplete(false);
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
              Você completou o desenho do mosquito!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
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
          <h1 className="text-4xl font-bold text-luquinhas-blue">
            Ligar os Pontos
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-luquinhas-green hover:text-luquinhas-green-dark"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mb-8">
          <div className="card inline-block px-8">
            <div className="text-3xl font-bold text-luquinhas-blue">
              {connectedPoints.length}/{POINTS.length}
            </div>
            <div className="text-gray-600 font-semibold">Pontos conectados</div>
          </div>
        </div>

        {/* Canvas */}
        <div className="card">
          <p className="text-xl text-gray-700 text-center mb-6">
            Clique nos números em ordem para revelar o desenho!
          </p>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full border-4 border-gray-200 rounded-2xl cursor-pointer bg-white mx-auto"
            style={{ maxWidth: '800px' }}
          />
        </div>
      </div>
    </div>
  );
}
