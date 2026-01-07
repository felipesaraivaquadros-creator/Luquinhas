import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabaseClient'

export default function NewColoring() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!title || !imageUrl) return

    if (!imageUrl.endsWith('.svg')) {
      alert('A imagem deve ser um arquivo SVG')
      return
    }

    setLoading(true)

    await supabase.from('coloring_pages').insert({
      title,
      image_url: imageUrl,
      status: 'active',
    })

    navigate('/admin/activities/coloring')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Novo desenho (SVG)</h1>

      <input
        className="input mb-4"
        placeholder="Título do desenho"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input mb-4"
        placeholder="URL do SVG (Supabase Storage)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {imageUrl && imageUrl.endsWith('.svg') && (
        <object
          data={imageUrl}
          type="image/svg+xml"
          className="h-48 w-full mb-4 border"
        />
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-luquinhas-blue text-white px-6 py-2 rounded-xl"
      >
        Salvar
      </button>
    </div>
  )
}
