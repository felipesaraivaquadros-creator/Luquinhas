import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { supabase } from '@/lib/supabaseClient'

export default function EditColoring() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  useEffect(() => {
    loadItem()
  }, [])

  async function loadItem() {
    const { data } = await supabase
      .from('coloring_pages')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setTitle(data.title)
      setImageUrl(data.image_url)
      setStatus(data.status)
    }
  }

  async function handleSave() {
    await supabase
      .from('coloring_pages')
      .update({
        title,
        image_url: imageUrl,
        status,
      })
      .eq('id', id)

    navigate('/admin/activities/coloring')
  }

  async function handleDelete() {
    if (!confirm('Excluir este desenho?')) return

    await supabase.from('coloring_pages').delete().eq('id', id)
    navigate('/admin/activities/coloring')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar desenho</h1>

      <input
        className="input mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input mb-4"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <select
        className="input mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
      >
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </select>

      {imageUrl && (
        <object
          data={imageUrl}
          type="image/svg+xml"
          className="h-48 w-full mb-4 border"
        />
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-luquinhas-blue text-white px-6 py-2 rounded-xl"
        >
          Salvar
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-6 py-2 rounded-xl"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
