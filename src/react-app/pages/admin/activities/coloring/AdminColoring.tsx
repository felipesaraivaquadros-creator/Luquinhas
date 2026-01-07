import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Home, Trash2, Plus, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router'

interface ColoringPage {
  id: string
  title: string
  image_url: string
  status: 'active' | 'inactive'
}

export default function AdminColoring() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<ColoringPage[]>([])

  async function fetchPages() {
    const { data } = await supabase
      .from('coloring_pages')
      .select('*')
      .order('created_at', { ascending: true })

    setPages(data || [])
  }

  useEffect(() => {
    fetchPages()
  }, [])

  async function toggleStatus(id: string, status: string) {
    await supabase
      .from('coloring_pages')
      .update({ status: status === 'active' ? 'inactive' : 'active' })
      .eq('id', id)

    fetchPages()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este desenho?')) return

    await supabase.from('coloring_pages').delete().eq('id', id)
    fetchPages()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar
          </button>

          <h1 className="text-4xl font-bold text-luquinhas-blue">
            Desenhos para Colorir
          </h1>

          <button
            onClick={() => navigate('/admin/activities/coloring/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo
          </button>
        </div>

        {/* Listagem */}
        <ul className="space-y-4">
          {pages.map((p) => (
            <li key={p.id} className="card flex justify-between items-center">
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-gray-500">
                  {p.status === 'active' ? 'Ativo' : 'Inativo'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/admin/activities/coloring/${p.id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => toggleStatus(p.id, p.status)}
                >
                  {p.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>

                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
