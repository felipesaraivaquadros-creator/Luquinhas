import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Save } from "lucide-react";

interface PartItemProps {
  storyId: string;
  onSaved: () => void;
}

export default function PartItem({ storyId, onSaved }: PartItemProps) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function savePart() {
    if (!content.trim() && !file) {
      alert("Informe um texto ou uma imagem");
      return;
    }

    try {
      setSaving(true);

      let imageUrl: string | null = null;

      // Upload da imagem
      if (file) {
        const filePath = `${storyId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("stories")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("stories")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Insert no banco
      const { error } = await supabase.from("story_parts").insert({
        story_id: storyId,
        content: content.trim() || null,
        image_url: imageUrl,
        part_order: Date.now(),
      });

      if (error) throw error;

      alert("Parte salva com sucesso ✅");
      setContent("");
      setFile(null);
      onSaved();

    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar parte:\n" + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      {/* Texto */}
      <textarea
        placeholder="Escreva o conteúdo da parte..."
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setContent(e.target.value)
        }
        className="w-full min-h-[120px] rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Upload de imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] || null)
        }
        className="block w-full text-sm"
      />

      {/* Botão salvar */}
      <button
        onClick={savePart}
        disabled={saving}
        className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Salvar Parte
          </>
        )}
      </button>
    </div>
  );
}
