import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, ChevronRight, Volume2, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface StoryPart {
  part_order: number;
  text: string | null;
  image_url: string | null;
}

interface Story {
  id: string;
  title: string;
  parts: StoryPart[];
}

export default function StoryReader() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, story_parts (part_order, text, image_url)')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else if (data) {
        setStory({
          id: data.id,
          title: data.title,
          parts: (data.story_parts || []).sort(
            (a: StoryPart, b: StoryPart) => a.part_order - b.part_order
          ),
        });
      }
    };

    fetchStory();
  }, [id]);

  if (!story) return <p>Carregando história...</p>;

  const page = story.parts[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === story.parts.length - 1;

  const handlePlayAudio = () => {
    if (!page.text) return;
    const utterance = new SpeechSynthesisUtterance(page.text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/stories')}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold hidden sm:inline">Voltar</span>
          </button>

          <h1 className="text-2xl sm:text-4xl font-bold text-luquinhas-blue text-center flex-1">
            {story.title}
          </h1>

          <div className="w-10" />
        </div>

        {/* Story Card */}
        <div className="card max-w-3xl mx-auto">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-luquinhas-blue-light to-luquinhas-green-light">
            {page.image_url && (
              <img
                src={page.image_url}
                alt={`Parte ${currentPage + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="text-lg sm:text-2xl text-gray-700 text-center leading-relaxed mb-8 px-2 sm:px-4">
            {page.text}
          </p>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Ouvir história */}
            <button
              onClick={handlePlayAudio}
              className="bg-luquinhas-yellow hover:bg-luquinhas-yellow-dark text-gray-800 font-bold py-4 px-8 rounded-full shadow-lg transition-all"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Navegação */}
            <div className="flex w-full gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={isFirstPage}
                className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                  isFirstPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, story.parts.length - 1)
                  )
                }
                disabled={isLastPage}
                className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                  isLastPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Próxima
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Indicador de página */}
          <div className="flex justify-center gap-2 mt-6">
            {story.parts.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full transition-all ${
                  index === currentPage
                    ? 'bg-luquinhas-blue w-8'
                    : 'bg-gray-300 w-3'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
