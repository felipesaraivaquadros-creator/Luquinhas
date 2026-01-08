import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type NewPartFormProps = {
  storyId: string;
  type: "text" | "image";
  onCancel: () => void;
  onSaved: () => void;
};

export default function NewPartForm({
  storyId,
  type,
  onCancel,
  onSaved,
}: NewPartFormProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function savePart() {
    if (type === "text" && !text.trim()) {
      alert("Informe o texto");
      return;
    }

    if (type === "image" && !file) {
      alert("Selecione uma imagem");
      return;
    }

    try {
      setSaving(true);

      let imageUrl: string | null = null;

      // 🔼 Upload imagem
      if (file) {
        const path = `${storyId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("stories")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("stories")
          .getPublicUrl(path);

        imageUrl = data.publicUrl;
      }

      // ✅ INSERT CORRETO
      const { error } = await supabase
        .from("story_parts")
        .insert({
          story_id: storyId,
          text: type === "text" ? text.trim() : null, // ✅ coluna correta
          image_url: imageUrl,
          part_order: Date.now(), // temporário
        });

      if (error) throw error;

      alert("Parte salva com sucesso ✅");
      setText("");
      setFile(null);
      onSaved();

    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar parte:\n" + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 border rounded bg-white space-y-4">
      {type === "text" && (
        <textarea
          placeholder="Texto da parte"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded"
        />
      )}

      {type === "image" && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />
      )}

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
