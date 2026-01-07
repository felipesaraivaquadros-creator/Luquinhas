import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabaseClient'
import { Home } from 'lucide-react'

interface ColoringPage {
  id: string
  title: string
  image_url: string
}

export default function ColoringGame() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<ColoringPage[]>([])

  useEffect(() => {
    loadPages()
  }, [])

  async function loadPages() {
    const { data } = await supabase
      .from('coloring_pages')
      .select('id, title, image_url')
      .eq('status', 'active')
      .order('created_at')

    setPages(data || [])
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/activities')}
          className="flex items-center gap-2 text-luquinhas-blue"
        >
          <Home className="w-6 h-6" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-luquinhas-blue">
          Vamos Colorir 🎨
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => navigate(`/games/colorir/${page.id}`)}
            className="bg-white rounded-2xl shadow hover:scale-105 transition p-4 flex flex-col items-center"
          >
            {/* PREVIEW REAL */}
            <div className="w-full aspect-square overflow-hidden rounded-xl border mb-3 bg-gray-50 flex items-center justify-center">
              <img
                src={page.image_url}
                alt={page.title}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            <span className="font-semibold text-sm text-center">
              {page.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
