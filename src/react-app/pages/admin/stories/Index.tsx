import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Home, Trash2, Edit2, Save, X } from "lucide-react"

interface Story {
  id: string
  title: string
  status: string
  is_active: boolean
  created_at: string
}

export default function AdminStoriesIndex() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState("")

  async function fetchStories() {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })

    setStories(data || [])
  }

  useEffect(() => {
    fetchStories()
  }, [])

  // ✏️ Atualizar título
  async function handleUpdate(id: string) {
    if (!title.trim()) return

    await supabase
      .from("stories")
      .update({ title })
      .eq("id", id)

    setEditingId(null)
    setTitle("")
    fetchStories()
  }

  // 🟢 Ativar / Desativar
  async function toggleStatus(id: string, isActive: boolean) {
    await supabase
      .from("stories")
      .update({ is_active: !isActive })
      .eq("id", id)

    fetchStories()
  }

  // ❌ Excluir
  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir esta história?")) return

    await supabase.from("stories").delete().eq("id", id)
    fetchStories()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar
          </button>

          <h1 className="text-4xl font-bold text-luquinhas-blue">
            Histórias
          </h1>

          <button
            onClick={() => navigate("/admin/stories/new")}
            className="btn-primary"
          >
            Nova História
          </button>
        </div>

        {/* LISTAGEM */}
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story.id} className="card">

              {editingId === story.id ? (
                <>
                  <input
                    className="input mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdate(story.id)}
                    >
                      <Save className="w-4 h-4" />
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(null)
                        setTitle("")
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="font-bold text-xl">
                      {story.title}
                    </h3>

                    <p className="text-sm mt-1">
                      Status:{" "}
                      <strong>
                        {story.is_active ? "Ativa" : "Inativa"}
                      </strong>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {/* EDITAR */}
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setEditingId(story.id)
                        setTitle(story.title)
                      }}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    {/* STATUS */}
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        toggleStatus(story.id, story.is_active)
                      }
                    >
                      {story.is_active ? "Desativar" : "Ativar"}
                    </button>

                    {/* PARTES */}
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        navigate(`/admin/stories/${story.id}`)
                      }
                    >
                      Gerenciar partes
                    </button>

                    {/* DELETE */}
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(story.id)}
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
