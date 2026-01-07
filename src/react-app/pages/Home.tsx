import { useNavigate } from 'react-router';
import { Book, Lightbulb, Gamepad2, Award, Settings } from 'lucide-react';
import Mascot from '@/react-app/components/Mascot';
import NavigationButton from '@/react-app/components/NavigationButton';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-luquinhas-blue mb-4 wiggle inline-block">
            Luquinhas
          </h1>
          <p className="text-2xl text-luquinhas-green font-medium">
            Aprenda brincando sobre saúde!
          </p>
        </div>

        {/* Mascot */}
        <Mascot />

        {/* Navigation Menu */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <NavigationButton
            icon={Book}
            label="Histórias"
            onClick={() => navigate('/stories')}
            color="blue"
          />
          <NavigationButton
            icon={Lightbulb}
            label="Curiosidades"
            onClick={() => navigate('/curiosities')}
            color="green"
          />
          <NavigationButton
            icon={Gamepad2}
            label="Atividades"
            onClick={() => navigate('/activities')}
            color="yellow"
          />
          <NavigationButton
            icon={Award}
            label="Patrocinadores"
            onClick={() => navigate('/sponsors')}
            color="pink"
          />
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Painel Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
