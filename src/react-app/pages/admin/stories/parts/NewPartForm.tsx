import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NewPartForm({
  storyId,
  onCancel,
  onSaved,
}: {
  storyId: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function savePart() {
    if (!text && !file) {
      alert("Informe um texto ou uma imagem");
      return;
    }

    setSaving(true);
    let imageUrl = null;

    if (file) {
      const path = `${storyId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("stories")
        .upload(path, file);

      if (uploadError) {
        alert("Erro ao enviar imagem");
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("stories")
        .getPublicUrl(path);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("story_parts").insert({
      story_id: storyId,
      content: text || null,
      image_url: imageUrl,
      part_order: Date.now(),
    });

    setSaving(false);

    if (error) {
      alert("Erro ao salvar parte");
    } else {
      alert("Parte salva com sucesso ✅");
      onSaved();
    }
  }

  return (
    <div className="p-4 border rounded bg-white space-y-4">
      <textarea
        placeholder="Texto da parte (opcional)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="flex gap-3">
        <button
          onClick={savePart}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Salvando..." : "Salvar Parte"}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
