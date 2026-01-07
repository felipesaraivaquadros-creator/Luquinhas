import { useNavigate } from 'react-router'
import {
  Palette,
  Puzzle,
  Search,
  Route,
  Brain,
  AlertTriangle,
  Home,
} from 'lucide-react'

export default function AdminActivities() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar
          </button>

          <h1 className="text-5xl font-bold text-gray-800">
            Atividades
          </h1>

          <div className="w-24"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <ActivityCard
            icon={Palette}
            title="Colorir"
            description="Gerenciar desenhos para colorir"
            onClick={() => navigate('/admin/activities/coloring')}
          />

          <ActivityCard
            icon={Brain}
            title="Quiz"
            description="Perguntas e respostas"
            onClick={() => navigate('/admin/activities/quiz')}
          />

          <ActivityCard
            icon={Search}
            title="Caça-Palavras"
            description="Palavras escondidas"
            onClick={() => navigate('/admin/activities/word-search')}
          />

          <ActivityCard
            icon={Route}
            title="Labirinto"
            description="Caminhos e desafios"
            onClick={() => navigate('/admin/activities/maze')}
          />

          <ActivityCard
            icon={Puzzle}
            title="Jogo da Memória"
            description="Cartas e combinações"
            onClick={() => navigate('/admin/activities/memory')}
          />

          <ActivityCard
            icon={AlertTriangle}
            title="Quebra-cabeça / 7 Erros"
            description="Desafios visuais"
            onClick={() => navigate('/admin/activities/puzzle')}
          />

        </div>
      </div>
    </div>
  )
}

function ActivityCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="card hover:scale-105 transition-transform cursor-pointer"
    >
      <div className="bg-luquinhas-blue text-white p-4 rounded-2xl mb-4 inline-block">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}
