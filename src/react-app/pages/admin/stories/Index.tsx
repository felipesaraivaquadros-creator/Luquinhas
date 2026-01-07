import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Story {
  id: string;
  title: string;
  is_active: boolean;
}

export default function AdminStoriesIndex() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("stories")
      .select("id, title, is_active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStories(data);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar
          </button>

          <h1 className="text-4xl font-bold text-gray-800">
            Histórias
          </h1>

          <button
            onClick={() => navigate("/admin/stories/new")}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus className="w-5 h-5" />
            Nova História
          </button>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <p className="text-gray-500">Carregando histórias...</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma história cadastrada ainda.
          </p>
        ) : (
          <div className="grid gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() =>
                  navigate(`/admin/stories/${story.id}`)
                }
                className="card cursor-pointer hover:scale-[1.02] transition"
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  {story.is_active ? "Ativa" : "Inativa"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
