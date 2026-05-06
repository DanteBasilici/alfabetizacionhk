"use client";
import { useState, useEffect, useCallback } from "react";
import ProgressHeader from "@/components/ProgressHeader";
import { Volume2, Smile, RefreshCw } from "lucide-react";

const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Tipado para nuestras cartas
type Carta = {
  id: string;
  letra: string;
  tipo: "sonido" | "boca";
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemotestPage() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  
  const [correctos, setCorrectos] = useState(0); // Parejas encontradas
  const [errores, setErrores] = useState(0);     // Intentos fallidos
  const [mensajeLector, setMensajeLector] = useState(""); // Feedback para no videntes

  // Función para inicializar o reiniciar el juego
  const iniciarJuego = useCallback(() => {
    // 1. Elegir 6 letras al azar
    const letrasMezcladas = [...abecedario].sort(() => Math.random() - 0.5).slice(0, 6);
    
    // 2. Crear las 12 cartas (2 por cada letra elegida)
    const nuevasCartas: Carta[] = letrasMezcladas.flatMap((letra, index) => [
      { id: `${letra}-sonido-${index}`, letra, tipo: "sonido", isFlipped: false, isMatched: false },
      { id: `${letra}-boca-${index}`, letra, tipo: "boca", isFlipped: false, isMatched: false }
    ]);

    // 3. Mezclar las 12 cartas
    nuevasCartas.sort(() => Math.random() - 0.5);

    setCartas(nuevasCartas);
    setFlippedIndexes([]);
    setCorrectos(0);
    setErrores(0);
    setMensajeLector("Juego de memoria iniciado. Hay 12 cartas en el tablero.");
  }, []);

  // Evitar error de hidratación al montar
  useEffect(() => {
    const timer = setTimeout(() => iniciarJuego(), 0);
    return () => clearTimeout(timer);
  }, [iniciarJuego]);

  // Reproducir sonido al dar vuelta carta de tipo 'sonido'
  const playAudio = (letra: string) => {
    try {
      const audio = new Audio(`/audio/${letra}.mp3`);
      audio.play().catch(() => console.log("Audio no encontrado:", letra));
    } catch (e) {
      console.error(e);
    }
  };

  // Lógica al hacer clic en una carta
  const handleCardClick = (index: number) => {
    // Si ya hay 2 volteadas o si esta ya está volteada/encontrada, no hacer nada
    if (flippedIndexes.length === 2 || cartas[index].isFlipped || cartas[index].isMatched) return;

    const nuevasCartas = [...cartas];
    nuevasCartas[index].isFlipped = true;
    setCartas(nuevasCartas);

    const nuevosFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nuevosFlipped);

    // Feedback auditivo inmediato
    const cartaActual = nuevasCartas[index];
    if (cartaActual.tipo === "sonido") {
      playAudio(cartaActual.letra);
      setMensajeLector(`Carta volteada: Sonido de la letra ${cartaActual.letra}`);
    } else {
      setMensajeLector(`Carta volteada: Imagen de boca de la letra ${cartaActual.letra}`);
    }

    // Si volteamos 2 cartas, verificamos si coinciden
    if (nuevosFlipped.length === 2) {
      const carta1 = nuevasCartas[nuevosFlipped[0]];
      const carta2 = nuevasCartas[nuevosFlipped[1]];

      if (carta1.letra === carta2.letra) {
        // ¡Coinciden!
        setTimeout(() => {
          setCartas(prev => prev.map((c, i) => nuevosFlipped.includes(i) ? { ...c, isMatched: true } : c));
          setFlippedIndexes([]);
          setCorrectos(prev => prev + 1);
          setMensajeLector(`¡Correcto! Encontraste la pareja de la letra ${carta1.letra}`);
        }, 500);
      } else {
        // No coinciden, voltear de nuevo después de 1.5s
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
      {/* Anunciador invisible para lectores de pantalla */}
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
          /* Tablero de Cartas */
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {cartas.map((carta, index) => {
              const visible = carta.isFlipped || carta.isMatched;

              // Estilos de la carta dependiendo de su estado
              let bgClass = "bg-hk-blue hover:bg-sky-400"; // Carta boca abajo
              if (carta.isMatched) bgClass = "bg-green-500/20 border-green-500 border-4 scale-95 opacity-80"; // Pareja encontrada
              else if (carta.isFlipped) bgClass = "bg-card border-2 border-hk-yellow transform scale-105"; // Carta volteada temporalmente

              return (
                <button
                  key={carta.id}
                  onClick={() => handleCardClick(index)}
                  disabled={visible}
                  aria-label={
                    carta.isMatched ? `Pareja encontrada de la letra ${carta.letra}` :
                    carta.isFlipped ? `Carta volteada: ${carta.tipo === 'sonido' ? 'Sonido' : 'Boca'} de la letra ${carta.letra}` :
                    `Carta número ${index + 1}, boca abajo`
                  }
                  className={`relative flex items-center justify-center h-40 md:h-48 rounded-3xl transition-all duration-300 outline-none focus:ring-4 focus:ring-hk-yellow shadow-lg overflow-hidden ${bgClass}`}
                >
                  {/* Contenido de la carta (solo se muestra si está volteada o encontrada) */}
                  {visible && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-2 animate-in fade-in zoom-in duration-200">
                      
                      {carta.tipo === "sonido" ? (
                        <>
                          <Volume2 size={48} className={carta.isMatched ? "text-green-500" : "text-hk-blue"} />
                          <span className="text-3xl font-black mt-2 text-foreground">{carta.letra}</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <img 
                            src={`/img/${carta.letra.toLowerCase()}.png`} 
                            alt={`Boca ${carta.letra}`}
                            className="w-full h-full max-h-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="text-sm text-gray-500 font-bold text-center">Sin imagen<br/>${carta.letra}</div>`;
                            }}
                          />
                          {/* Pequeña ayuda visual en la esquina superior */}
                          <Smile size={16} className="absolute top-3 left-3 text-gray-400" />
                        </div>
                      )}
                      
                    </div>
                  )}

                  {/* Diseño de la carta boca abajo (Logo de la escuela bien visible) */}
                  {!visible && (
                    <div className="w-full h-full flex items-center justify-center">
                      {/* Círculo de fondo para que el logo resalte contra el azul de la carta */}
                      <div className="bg-white/100 p-3 md:p-4 rounded-full shadow-inner backdrop-blur-sm">
                        <img 
                          src="/logo-escuela.png" 
                          alt="" 
                          aria-hidden="true" 
                          className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
                        />
                      </div>
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