import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type ColoringPage = {
  id: number;
  title: string;
  new_svg_clean: string;
};

const COLORS = [
  "#FF0000", "#00AAFF", "#00CC66", "#FFCC00",
  "#FF66CC", "#8A2BE2", "#000000", "#FFFFFF",
];

export default function ColorirPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<ColoringPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("#FF0000");

  const colorRef = useRef(selectedColor);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Atualiza a referência da cor sem re-renderizar o SVG
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  /* =====================================================
     1️⃣ Busca o SVG no Supabase
  ===================================================== */
  useEffect(() => {
    async function fetchColoringPage() {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("coloring_pages")
          .select("id, title, new_svg_clean")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPage(data);
      } catch (error) {
        console.error("Erro ao buscar SVG:", error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    }

    fetchColoringPage();
  }, [id]);

  /* =====================================================
     2️⃣ Função para Limpar o Desenho
  ===================================================== */
  const handleReset = () => {
    if (!svgContainerRef.current) return;
    
    const colorablePaths = svgContainerRef.current.querySelectorAll<SVGElement>(
      '[data-colorable="true"]'
    );
    
    colorablePaths.forEach((path) => {
      path.setAttribute("fill", "#FFFFFF");
    });
  };

  /* =====================================================
     3️⃣ Injeta o SVG e Configura Eventos
  ===================================================== */
  useEffect(() => {
    if (!page || !svgContainerRef.current) return;

    // Injeta o HTML
    svgContainerRef.current.innerHTML = page.new_svg_clean;

    const svg = svgContainerRef.current.querySelector("svg");
    if (!svg) return;

    // Garante que o SVG ocupe o espaço do container
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.display = "block";

    const colorablePaths = svg.querySelectorAll<SVGElement>(
      '[data-colorable="true"]'
    );

    const handlePaint = (e: MouseEvent) => {
      const target = e.currentTarget as SVGElement;
      target.setAttribute("fill", colorRef.current);
    };

    colorablePaths.forEach((path) => {
      path.style.cursor = "pointer";
      path.style.transition = "fill 0.2s ease";
      path.addEventListener("click", handlePaint as any);
    });

    return () => {
      colorablePaths.forEach((path) => {
        path.removeEventListener("click", handlePaint as any);
      });
    };
  }, [page]);

  /* =====================================================
     4️⃣ Estados de Carregamento e Erro
  ===================================================== */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Abrindo estojo de cores...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl font-semibold text-gray-800">Ops! Desenho não encontrado.</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-transform active:scale-95"
        >
          Voltar para Galeria
        </button>
      </div>
    );
  }

  /* =====================================================
     5️⃣ Renderização Principal
  ===================================================== */
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <span>⬅</span> <span className="hidden sm:inline">Sair</span>
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[40%]">
          {page.title}
        </h1>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors font-medium"
        >
          <span className="text-lg">🔄</span>
          <span className="hidden sm:inline">Limpar Tudo</span>
        </button>
      </header>

      {/* Área de Pintura */}
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div 
          className="w-full h-full max-w-[85vh] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 sm:p-8 border-8 border-white"
          style={{ aspectRatio: '1/1' }}
        >
          <div
            ref={svgContainerRef}
            className="w-full h-full flex items-center justify-center"
          />
        </div>
      </main>

      {/* Rodapé: Paleta de Cores */}
      <footer className="bg-white p-6 border-t-2 border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 sm:gap-5 max-w-3xl mx-auto justify-center flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 transition-all duration-300 transform ${
                selectedColor === color
                  ? "border-gray-800 scale-125 -translate-y-2 shadow-xl"
                  : "border-white hover:scale-110 shadow-md"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}