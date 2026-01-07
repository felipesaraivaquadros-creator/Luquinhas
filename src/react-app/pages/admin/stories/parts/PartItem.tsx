import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

      /* 1️⃣ Upload da imagem (se existir) */
      if (file) {
        const filePath = `${storyId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("stories")
          .upload(filePath, file, {
            upsert: false,
          });

        if (uploadError) {
          console.error("Erro upload:", uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("stories")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      /* 2️⃣ Próximo part_order (blindado) */
      const { data: orderData, error: orderError } = await supabase
        .rpc("get_next_part_order", {
          p_story_id: storyId,
        });

      if (orderError) {
        console.error("Erro RPC:", orderError);
        throw orderError;
      }

      const partOrder =
        typeof orderData === "number" && orderData > 0
          ? orderData
          : 1;

      /* 3️⃣ Insert da parte */
      const { error: insertError } = await supabase
        .from("story_parts")
        .insert({
          story_id: storyId,
          part_order: partOrder,
          text: content.trim() !== "" ? content.trim() : "", // NUNCA null
          image_url: imageUrl,
        });

      if (insertError) {
        console.error("Erro insert:", insertError);
        throw insertError;
      }

      /* 4️⃣ Sucesso */
      alert("Parte salva com sucesso");
      setContent("");
      setFile(null);
      onSaved();

    } catch (err: any) {
      console.error("Erro COMPLETO ao salvar parte:", err);
      alert(
        "Erro ao salvar parte:\n" +
          (err?.message || JSON.stringify(err, null, 2))
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <Textarea
        placeholder="Escreva o conteúdo da parte..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button
        onClick={savePart}
        disabled={saving}
        className="flex items-center gap-2"
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
      </Button>
    </div>
  );
}
