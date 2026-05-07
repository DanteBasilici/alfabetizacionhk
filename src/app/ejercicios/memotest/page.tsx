"use client";
import { useState, useEffect, useCallback } from "react";
import ProgressHeader from "@/components/ProgressHeader";
import { Volume2, RefreshCw } from "lucide-react";

const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Tipado actualizado: ahora es "sonido" vs "letra"
type Carta = {
  id: string;
  letra: string;
  tipo: "sonido" | "letra";
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemotestPage() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  
  const [correctos, setCorrectos] = useState(0); 
  const [errores, setErrores] = useState(0);     
  const [mensajeLector, setMensajeLector] = useState(""); 

  const iniciarJuego = useCallback(() => {
    const letrasMezcladas = [...abecedario].sort(() => Math.random() - 0.5).slice(0, 6);
    
    // Creamos una carta de sonido y una de letra pura
    const nuevasCartas: Carta[] = letrasMezcladas.flatMap((letra, index) => [
      { id: `${letra}-sonido-${index}`, letra, tipo: "sonido", isFlipped: false, isMatched: false },
      { id: `${letra}-texto-${index}`, letra, tipo: "letra", isFlipped: false, isMatched: false }
    ]);

    nuevasCartas.sort(() => Math.random() - 0.5);

    setCartas(nuevasCartas);
    setFlippedIndexes([]);
    setCorrectos(0);
    setErrores(0);
    setMensajeLector("Juego de memoria iniciado. Hay 12 cartas en el tablero.");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => iniciarJuego(), 0);
    return () => clearTimeout(timer);
  }, [iniciarJuego]);

  const playAudio = (letra: string) => {
    try {
      const audio = new Audio(`/audio/${letra}.mp3`);
      audio.play().catch(() => console.log("Audio no encontrado:", letra));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || cartas[index].isFlipped || cartas[index].isMatched) return;

    const nuevasCartas = [...cartas];
    nuevasCartas[index].isFlipped = true;
    setCartas(nuevasCartas);

    const nuevosFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nuevosFlipped);

    const cartaActual = nuevasCartas[index];
    if (cartaActual.tipo === "sonido") {
      playAudio(cartaActual.letra);
      setMensajeLector(`Carta volteada: Sonido de la letra ${cartaActual.letra}`);
    } else {
      // Mensaje de lector actualizado
      setMensajeLector(`Carta volteada: Letra ${cartaActual.letra}`);
    }

    if (nuevosFlipped.length === 2) {
      const carta1 = nuevasCartas[nuevosFlipped[0]];
      const carta2 = nuevasCartas[nuevosFlipped[1]];

      if (carta1.letra === carta2.letra) {
        setTimeout(() => {
          setCartas(prev => prev.map((c, i) => nuevosFlipped.includes(i) ? { ...c, isMatched: true } : c));
          setFlippedIndexes([]);
          setCorrectos(prev => prev + 1);
          setMensajeLector(`¡Correcto! Encontraste la pareja de la letra ${carta1.letra}`);
        }, 500);
      } else {
        setErrores(prev => prev + 1);
        setTimeout(() => {
          setMensajeLector("Las cartas no coinciden. Se voltearon de nuevo.");
          setCartas(prev => prev.map((c, i) => nuevosFlipped.includes(i) ? { ...c, isFlipped: false } : c));
          setFlippedIndexes([]);
        }, 1500);
      }
    }
  };

  if (cartas.length === 0) return null;

  const juegoTerminado = correctos === 6;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      <div aria-live="assertive" className="sr-only">
        {mensajeLector}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-black text-hk-blue" tabIndex={0}>
          Memotest Inclusivo
        </h2>
        <button 
          onClick={iniciarJuego}
          aria-label="Reiniciar juego de memoria"
          className="flex items-center gap-2 px-4 py-2 bg-card border border-gray-200 dark:border-gray-700 hover:bg-hk-yellow hover:text-black rounded-xl font-bold transition-all shadow-md focus:ring-4 focus:ring-hk-blue outline-none"
        >
          <RefreshCw size={20} />
          Reiniciar
        </button>
      </div>
      
      <ProgressHeader correctos={correctos} errores={errores} total={6} />

      <div className="flex-1 flex flex-col items-center justify-center pb-10">
        
        {juegoTerminado ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <h3 className="text-6xl font-black text-green-500 mb-6 drop-shadow-md">¡Ganaste!</h3>
            <p className="text-2xl text-foreground font-medium mb-8">Encontraste todas las parejas.</p>
            <button 
              onClick={iniciarJuego}
              className="px-10 py-4 bg-hk-blue text-white text-2xl font-black rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              Jugar otra vez
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {cartas.map((carta, index) => {
              const visible = carta.isFlipped || carta.isMatched;

              // Estilos de la carta: ahora por defecto es Gris claro en light mode y Gris oscuro en dark mode
              let bgClass = "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"; 
              if (carta.isMatched) bgClass = "bg-green-500/20 border-green-500 border-4 scale-95 opacity-80"; 
              else if (carta.isFlipped) bgClass = "bg-card border-2 border-hk-yellow transform scale-105"; 

              return (
                <button
                  key={carta.id}
                  onClick={() => handleCardClick(index)}
                  disabled={visible}
                  aria-label={
                    carta.isMatched ? `Pareja encontrada de la letra ${carta.letra}` :
                    carta.isFlipped ? `Carta volteada: ${carta.tipo === 'sonido' ? 'Sonido' : 'Letra'} de ${carta.letra}` :
                    `Carta número ${index + 1}, boca abajo`
                  }
                  className={`relative flex items-center justify-center h-40 md:h-48 rounded-3xl transition-all duration-300 outline-none focus:ring-4 focus:ring-hk-yellow shadow-lg overflow-hidden ${bgClass}`}
                >
                  {/* Carta Volteada */}
                  {visible && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-2 animate-in fade-in zoom-in duration-200">
                      {carta.tipo === "sonido" ? (
                        <>
                          <Volume2 size={48} className={carta.isMatched ? "text-green-500" : "text-hk-blue"} />
                          <span className="text-2xl font-bold mt-2 text-foreground/70">Sonido</span>
                        </>
                      ) : (
                        // Muestra solo la letra gigante en lugar de la boca
                        <span className="text-7xl font-black text-foreground">{carta.letra}</span>
                      )}
                    </div>
                  )}

                  {/* Carta Boca Abajo (Gris y con logo limpio) */}
                  {!visible && (
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src="/logo-escuela.png" 
                        alt="" 
                        aria-hidden="true" 
                        className="w-20 h-20 md:w-24 md:h-24 object-contain" 
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
}