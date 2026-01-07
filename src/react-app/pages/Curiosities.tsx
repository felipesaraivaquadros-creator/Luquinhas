import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Home,
  Bug,
  Droplet,
  Thermometer,
  Trees,
  Microscope,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Curiosity {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

const iconMap: Record<string, React.ElementType> = {
  dengue: Bug,
  zika: Microscope,
  chikungunya: Thermometer,
  malaria: Trees,
  agua: Droplet,
  default: Bug,
};

export default function Curiosities() {
  const navigate = useNavigate();
  const [curiosities, setCuriosities] = useState<Curiosity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuriosities = async () => {
      const { data, error } = await supabase
        .from('curiosities')
        .select('id, title, description, image_url, category')
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar curiosidades:', error);
      } else {
        setCuriosities(data || []);
      }

      setLoading(false);
    };

    fetchCuriosities();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>

          <h1 className="text-5xl font-bold text-luquinhas-green">
            Curiosidades
          </h1>

          <div className="w-24"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 text-xl">
            Carregando curiosidades...
          </div>
        )}

        {/* Empty state */}
        {!loading && curiosities.length === 0 && (
          <div className="text-center text-gray-500 text-xl">
            Nenhuma curiosidade disponível no momento.
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curiosities.map((curiosity) => {
            const Icon =
              iconMap[curiosity.category?.toLowerCase()] ||
              iconMap.default;

            return (
              <div
                key={curiosity.id}
                className="card hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-luquinhas-green-light to-luquinhas-blue-light">
                  <img
                    src={curiosity.image_url}
                    alt={curiosity.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-luquinhas-green text-white p-3 rounded-2xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {curiosity.title}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {curiosity.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
