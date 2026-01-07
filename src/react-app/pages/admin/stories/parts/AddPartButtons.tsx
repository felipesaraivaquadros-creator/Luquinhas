import { useState } from "react";
import NewPartForm from "./NewPartForm";

export default function AddPartButtons({
  storyId,
  onSaved,
}: {
  storyId: string;
  onSaved: () => void;
}) {
  const [type, setType] = useState<"text" | "image" | null>(null);

  if (type) {
    return (
      <NewPartForm
        storyId={storyId}
        type={type}
        onCancel={() => setType(null)}
        onSaved={() => {
          setType(null);
          onSaved();
        }}
      />
    );
  }

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setType("text")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Nova Parte (Texto)
      </button>

      <button
        onClick={() => setType("image")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Nova Parte (Imagem)
      </button>
    </div>
  );
}
