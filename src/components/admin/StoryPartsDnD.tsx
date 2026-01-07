import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface StoryPart {
  id: string;
  content: string;
  part_order: number;
  type: string;
}

interface Props {
  storyId: string;
}

export default function StoryPartsDnD({ storyId }: Props) {
  const [parts, setParts] = useState<StoryPart[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts();
  }, [storyId]);

  async function fetchParts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("story_parts")
      .select("id, content, part_order, type")
      .eq("story_id", storyId)
      .order("part_order", { ascending: true });

    if (!error && data) {
      setParts(data);
    }

    setLoading(false);
  }

  function onDrop(toIndex: number) {
    if (dragIndex === null || dragIndex === toIndex) return;

    const updated = [...parts];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(toIndex, 0, moved);

    setParts(updated);
    setDragIndex(null);

    saveOrder(updated);
  }

  async function saveOrder(updatedParts: StoryPart[]) {
    const orderedIds = updatedParts.map((p) => p.id);

    await fetch("/admin/story-parts/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        story_id: storyId,
        ordered_part_ids: orderedIds,
      }),
    });
  }

  if (loading) return <p>Carregando partes...</p>;

  return (
    <div className="space-y-3">
      {parts.map((part, index) => (
        <div
          key={part.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(index)}
          className="p-4 bg-white rounded-2xl shadow cursor-move hover:ring-2 hover:ring-blue-300 transition"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Parte {index + 1}</span>
            <span>{part.type}</span>
          </div>

          <div className="text-gray-800">
            {part.content.slice(0, 120)}
            {part.content.length > 120 && "..."}
          </div>
        </div>
      ))}
    </div>
  );
}
