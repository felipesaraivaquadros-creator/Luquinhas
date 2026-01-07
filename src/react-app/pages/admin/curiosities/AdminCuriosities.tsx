import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabaseClient'
import { Home, Trash2, Edit2, Save, X } from 'lucide-react'

interface Curiosity {
  id: string
  title: string
  description: string
  image_url: string | null
  category: string | null
  status: string
  created_at: string
}

export default function AdminCuriosities() {
  const navigate = useNavigate()
  const [curiosities, setCuriosities] = useState<Curiosity[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
  })

  const fetchCuriosities = async () => {
    const { data } = await supabase
      .from('curiosities')
      .select('*')
      .order('created_at', { ascending: false })

    setCuriosities(data || [])
  }

  useEffect(() => {
    fetchCuriosities()
  }, [])

  // ➕ Criar
  const handleCreate = async () => {
    if (!form.title || !form.description) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('curiosities').insert({
      title: form.title,
      description: form.description,
      image_url: form.image_url || null,
      category: form.category || null,
      status: 'draft',
      created_by: user?.id,
    })

    setForm({ title: '', description: '', image_url: '', category: '' })
    fetchCuriosities()
  }

  // ✏️ Editar
  const handleUpdate = async (id: string) => {
    await supabase
      .from('curiosities')
      .update({
        title: form.title,
        description: form.description,
        image_url: form.image_url || null,
        category: form.category || null,
        updated_at: new Date(),
      })
      .eq('id', id)

    setEditingId(null)
    setForm({ title: '', description: '', image_url: '', category: '' })
    fetchCuriosities()
  }

  // 🟢 Status
  const toggleStatus = async (id: string, status: string) => {
    await supabase
      .from('curiosities')
      .update({ status: status === 'active' ? 'draft' : 'active' })
      .eq('id', id)

    fetchCuriosities()
  }

  // ❌ Excluir
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta curiosidade?')) return
    await supabase.from('curiosities').delete().eq('id', id)
    fetchCuriosities()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

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
            Curiosidades
          </h1>

          <div className="w-24" />
        </div>

        {/* Form */}
        <div className="card mb-8">
          <input
            className="input mb-3"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input mb-3"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <input
            className="input mb-3"
            placeholder="URL da imagem"
            value={form.image_url}
            onChange={(e) =>
              setForm({ ...form, image_url: e.target.value })
            }
          />
          <input
            className="input mb-3"
            placeholder="Categoria"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <button className="btn-primary" onClick={handleCreate}>
            Adicionar curiosidade
          </button>
        </div>

        {/* Listagem */}
        <ul className="space-y-4">
          {curiosities.map((c) => (
            <li key={c.id} className="card">
              {editingId === c.id ? (
                <>
                  <input
                    className="input mb-2"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                  <textarea
                    className="input mb-2"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdate(c.id)}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl">{c.title}</h3>
                    <p className="text-gray-600">{c.description}</p>
                    <p className="text-sm mt-1">
                      Status:{' '}
                      <strong>
                        {c.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </strong>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(c.id)
                        setForm({
                          title: c.title,
                          description: c.description,
                          image_url: c.image_url || '',
                          category: c.category || '',
                        })
                      }}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => toggleStatus(c.id, c.status)}
                    >
                      {c.status === 'active' ? 'Desativar' : 'Ativar'}
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
