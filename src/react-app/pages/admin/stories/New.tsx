import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function NewStory() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createStory = async () => {
    if (!title.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("stories")
      .insert({
        title,
        is_active: false, // boa prática: começa desativada
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      // ✅ redireciona para a tela de edição existente
      navigate(`/admin/stories/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto card">
        <h1 className="text-3xl font-bold mb-6">Nova História</h1>

        <input
          type="text"
          placeholder="Título da história"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 mb-6"
        />

        <button
          onClick={createStory}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar História"}
        </button>
      </div>
    </div>
  );
}
