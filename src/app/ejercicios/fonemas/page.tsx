"use client";
import { useState } from "react";
import ProgressHeader from "@/components/ProgressHeader";
import { Check, X } from "lucide-react"; // Importamos iconos

const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const letrasData = abecedario.flatMap(letra => {
  if (letra === "C") {
    return [
      { id: "C-k", letra: "C", audio: "/audio/C.mp3", label: "C con sonido fuerte" },
      { id: "C-s", letra: "C", audio: "/audio/C como s.mp3", label: "C con sonido suave" }
    ];
  }
  return [{ id: letra, letra, audio: `/audio/${letra}.mp3`, label: `Letra ${letra}` }];
});

// Definimos los estados posibles para cada letra
type EstadoRespuesta = 'sin_responder' | 'correcto' | 'error';

export default function FonemasPage() {
  // Guardamos un registro de qué respondió en cada letra. Ej: { "A": "correcto", "B": "error" }
  const [respuestas, setRespuestas] = useState<Record<string, EstadoRespuesta>>({});

  // Calculamos los totales leyendo el registro
  const correctos = Object.values(respuestas).filter(r => r === 'correcto').length;
  const errores = Object.values(respuestas).filter(r => r === 'error').length;

  const playAudio = (audioPath: string) => {
    try {
      const audio = new Audio(audioPath);
      audio.play().catch(() => console.log("Audio no encontrado aún:", audioPath));
    } catch (error) {
      console.error(error);
    }
  };

  // Función para que la docente marque si estuvo bien o mal
  const marcarRespuesta = (id: string, estado: 'correcto' | 'error') => {
    setRespuestas(prev => ({ ...prev, [id]: estado }));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto">
      <h2 className="text-4xl font-black mb-6 text-hk-blue" tabIndex={0}>
        Escucha los Fonemas
      </h2>
      
      <ProgressHeader correctos={correctos} errores={errores} total={letrasData.length} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-10">
        {letrasData.map((item) => {
          const estadoActual = respuestas[item.id] || 'sin_responder';
          
          return (
            <div 
              key={item.id} 
              // Agregamos border-gray-200 dark:border-gray-700 para que la tarjeta resalte siempre
              className="flex flex-col bg-card rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:ring-4 focus-within:ring-hk-yellow transition-all"
            >
              {/* Botón superior para reproducir el audio */}
              <button
                onClick={() => playAudio(item.audio)}
                aria-label={`Escuchar ${item.label}`}
                className="group flex-1 flex flex-col items-center justify-center p-6 outline-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-6xl font-black text-card-foreground group-hover:text-hk-blue transition-colors">
                  {item.letra}
                </span>
                {item.letra === "C" && (
                  <span className="text-xs mt-2 text-gray-500 font-bold uppercase tracking-widest">
                    {item.id === "C-k" ? "Fuerte" : "Suave"}
                  </span>
                )}
              </button>

              {/* Botonera de Evaluación para la docente */}
              <div className="flex border-t border-gray-200 dark:border-gray-700 bg-black/5 dark:bg-white/5">
                <button
                  onClick={() => marcarRespuesta(item.id, 'correcto')}
                  aria-label={`Marcar ${item.label} como correcto`}
                  className={`flex-1 flex justify-center py-3 transition-colors ${
                    estadoActual === 'correcto' ? 'bg-green-500 text-white' : 'hover:bg-green-500/20 text-gray-400 hover:text-green-500'
                  }`}
                >
                  <Check size={24} strokeWidth={3} />
                </button>
                <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                <button
                  onClick={() => marcarRespuesta(item.id, 'error')}
                  aria-label={`Marcar ${item.label} como error`}
                  className={`flex-1 flex justify-center py-3 transition-colors ${
                    estadoActual === 'error' ? 'bg-red-500 text-white' : 'hover:bg-red-500/20 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}