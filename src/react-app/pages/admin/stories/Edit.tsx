import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PartsList from "./parts/PartsList";
import AddPartButtons from "./parts/AddPartButtons";

export default function AdminStoryEdit() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (id) fetchStory();
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
      <AddPartButtons
        storyId={id!}
        onSaved={() => setReload((r) => !r)}
      />

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
