import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PartsList from "./parts/PartsList";
import NewPartForm from "./parts/NewPartForm";

export default function AdminStoryEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [creatingPart, setCreatingPart] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  async function fetchStory() {
    const { data } = await supabase
      .from("stories")
      .select("title")
      .eq("id", id)
      .single();

    if (data) setTitle(data.title);
    setLoading(false);
  }

  async function updateTitle() {
    await supabase.from("stories").update({ title }).eq("id", id);
  }

  if (loading) return <p>Carregando história...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Título */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={updateTitle}
        className="text-3xl font-bold w-full border-b focus:outline-none"
      />

      {/* Ações */}
      {!creatingPart && (
        <button
          onClick={() => setCreatingPart(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ➕ Criar Parte
        </button>
      )}

      {/* Formulário */}
      {creatingPart && (
        <NewPartForm
          storyId={id!}
          onCancel={() => setCreatingPart(false)}
          onSaved={() => {
            setCreatingPart(false);
            setReload(r => !r);
          }}
        />
      )}

      {/* Lista */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Partes da História
        </h2>

        <PartsList storyId={id!} reload={reload} />
      </section>
    </div>
  );
}
