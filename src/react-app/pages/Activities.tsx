import { useNavigate } from 'react-router';
import { Home, Palette, Link as LinkIcon, Brain, HelpCircle, Grid3x3, Puzzle } from 'lucide-react';
import NavigationButton from '@/react-app/components/NavigationButton';

export default function Activities() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-5xl font-bold text-luquinhas-yellow text-gray-800">
            Atividades
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <NavigationButton
            icon={Palette}
            label="Colorir"
            onClick={() => navigate('/games/colorir')}
            color="pink"
          />
          <NavigationButton
            icon={LinkIcon}
            label="Ligar Pontos"
            onClick={() => navigate('/games/ligar-pontos')}
            color="blue"
          />
          <NavigationButton
            icon={HelpCircle}
            label="Quiz"
            onClick={() => navigate('/games/quiz')}
            color="green"
          />
          <NavigationButton
            icon={Brain}
            label="Jogo da Memória"
            onClick={() => navigate('/games/memoria')}
            color="yellow"
          />
          <NavigationButton
            icon={Grid3x3}
            label="Caça-palavras"
            onClick={() => navigate('/games/caca-palavras')}
            color="pink"
          />
          <NavigationButton
            icon={Puzzle}
            label="Quebra-cabeça"
            onClick={() => navigate('/games/puzzle')}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}
