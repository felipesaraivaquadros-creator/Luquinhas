import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router'
import { Home } from 'lucide-react'

interface ColoringPage {
  id: string
  title: string
  image_url: string
}

export default function Colorir() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<ColoringPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('coloring_pages')
        .select('id, title, image_url')
        .eq('status', 'active')
        .order('created_at', { ascending: true })

      if (!error) setPages(data || [])
      setLoading(false)
    }

    fetchPages()
  }, [])

  if (loading) {
    return <div className="text-center py-20">Carregando...</div>
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-20">
        Nenhum desenho disponível no momento.
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar
          </button>

          <h1 className="text-5xl font-bold text-luquinhas-green">
            Colorir
          </h1>

          <div className="w-24"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => navigate(`/games/colorir/${page.id}`)}
              className="card cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white">
                <img
                  src={page.image_url}
                  alt={page.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-center">
                {page.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
