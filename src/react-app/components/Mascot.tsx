export default function Mascot() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-8 mt-4">
      <div className="animate-float relative w-32 h-32 mx-auto">
        {/* Cabeça do porquinho */}
        <div className="relative w-32 h-32 bg-pink-100 rounded-full border-2 border-white shadow-lg mx-auto">

          {/* Chapeuzinho triangular */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0
             border-l-[16px] border-r-[16px] border-b-[32px]
             border-l-transparent border-r-transparent border-b-green-500"></div>

          {/* Orelhinhas animadas */}
          <div className="absolute -top-4 -left-2 w-8 h-12 bg-pink-100 rounded-t-full border-2 border-white origin-bottom animate-ear-left"></div>
          <div className="absolute -top-4 -right-2 w-8 h-12 bg-pink-100 rounded-t-full border-2 border-white origin-bottom animate-ear-right"></div>

          {/* Olhos */}
          <div className="absolute top-10 left-8 w-5 h-5 bg-white rounded-full overflow-hidden">
            <div className="w-2 h-2 bg-black rounded-full mt-1.5 ml-1.5 animate-blink-happy"></div>
          </div>
          <div className="absolute top-10 right-8 w-5 h-5 bg-white rounded-full overflow-hidden">
            <div className="w-2 h-2 bg-black rounded-full mt-1.5 ml-1.5 animate-blink-happy"></div>
          </div>

          {/* Focinho animado */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-8 bg-pink-200 rounded-full border-2 border-pink-300 animate-sniff">
            <div className="absolute top-2 left-3 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-2 right-3 w-2 h-2 bg-black rounded-full"></div>
          </div>

          {/* Sorriso animado */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 border-b-2 border-black rounded-full animate-smile"></div>

          {/* Caudinha atrás da cabeça */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-200 rounded-full border-2 border-pink-300 animate-tail"></div>
        </div>

        {/* Sombra sutil */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black/10 rounded-full blur-sm"></div>
      </div>

      {/* Estilos customizados */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes blink-happy {
          0%, 85%, 100% { transform: scaleY(1); }
          88%, 92% { transform: scaleY(0.1); }
        }

        @keyframes sniff {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes ear-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }

        @keyframes ear-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }

        @keyframes tail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(25deg); }
        }

        @keyframes smile {
          0%, 40%, 100% { border-bottom-width: 2px; }
          20%, 60% { border-bottom-width: 4px; }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blink-happy { animation: blink-happy 4s infinite; transform-origin: center; }
        .animate-sniff { animation: sniff 2s ease-in-out infinite; }
        .animate-ear-left { animation: ear-left 2s ease-in-out infinite; transform-origin: bottom center; }
        .animate-ear-right { animation: ear-right 2s ease-in-out infinite; transform-origin: bottom center; }
        .animate-tail { animation: tail 2s ease-in-out infinite; transform-origin: top center; }
        .animate-smile { animation: smile 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
