import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PartsList({
  storyId,
  reload,
}: {
  storyId: string;
  reload: boolean;
}) {
  const [parts, setParts] = useState<any[]>([]);

  useEffect(() => {
    fetchParts();
  }, [reload]);

  async function fetchParts() {
    const { data } = await supabase
      .from("story_parts")
      .select("*")
      .eq("story_id", storyId)
      .order("part_order");

    setParts(data || []);
  }

  if (parts.length === 0) {
    return <p className="text-gray-500">Nenhuma parte criada ainda.</p>;
  }

  return (
    <div className="space-y-4">
      {parts.map((part) => (
        <div key={part.id} className="p-4 border rounded bg-gray-50">
          {part.text && <p>{part.text}</p>}
          {part.image_url && (
            <img
              src={part.image_url}
              alt=""
              className="mt-2 max-h-64 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}
