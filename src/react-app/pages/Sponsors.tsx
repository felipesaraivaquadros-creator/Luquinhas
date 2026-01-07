import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Home, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
}

export default function Sponsors() {
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  async function fetchSponsors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sponsors")
      .select("id, name, logo_url, website_url")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar patrocinadores:", error);
    } else {
      setSponsors(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>

          <h1 className="text-5xl font-bold text-luquinhas-pink">
            Patrocinadores
          </h1>

          <div className="w-24" />
        </div>

        {/* Mensagem */}
        <div className="card text-center mb-8 bg-gradient-to-br from-luquinhas-pink-light/20 to-luquinhas-yellow-light/20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Obrigado aos nossos parceiros!
          </h2>
          <p className="text-xl text-gray-600">
            Eles tornam possível este conteúdo educativo gratuito para todas as crianças.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-lg">
            Carregando patrocinadores...
          </p>
        )}

        {/* Empty */}
        {!loading && sponsors.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            Nenhum patrocinador disponível no momento.
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md hover:scale-105 transition-all duration-300"
            >
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className="max-w-full h-40 sm:h-44 object-contain mb-6"
              />

              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {sponsor.name}
              </h3>

              <div className="flex items-center gap-2 text-luquinhas-blue">
                <span className="text-sm">Visitar site</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
