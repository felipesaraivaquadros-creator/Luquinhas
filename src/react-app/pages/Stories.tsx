import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Story {
  id: string;
  title: string;
}

export default function Stories() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title')
        .order('created_at', { ascending: true });

      if (error) console.error(error);
      else setStories(data || []);
    };

    fetchStories();
  }, []);

  // 🎨 Cores das histórias
  const bgColors = [
    'bg-green-500 hover:bg-green-600',
    'bg-pink-500 hover:bg-pink-600',
    'bg-yellow-400 hover:bg-yellow-500 text-black',
    'bg-amber-700 hover:bg-amber-800',
    'bg-luquinhas-blue hover:bg-luquinhas-blue-dark',
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header padronizado */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>

          <h1 className="text-4xl font-bold text-luquinhas-blue text-center">
            Histórias
          </h1>

          {/* Espaço fantasma para centralizar o título */}
          <div className="w-24"></div>
        </div>

        {/* Lista de histórias */}
        <ul className="space-y-4">
          {stories.map((story, index) => (
            <li
              key={story.id}
              className={`cursor-pointer p-5 text-white rounded-2xl shadow-md transition-all ${
                bgColors[index % bgColors.length]
              }`}
              onClick={() => navigate(`/stories/${story.id}`)}
            >
              <span className="text-xl font-semibold">
                {story.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
