"use client";
import { useState, useEffect, useCallback } from "react";
import ProgressHeader from "@/components/ProgressHeader";
import { Volume2 } from "lucide-react";

// Datos de las letras (igual que en el ejercicio 1)
const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const letrasData = abecedario.flatMap(letra => {
  if (letra === "C") {
    return [
      { id: "C-k", letra: "C", audio: "/audio/C.mp3" },
      { id: "C-s", letra: "C", audio: "/audio/C como s.mp3" }
    ];
  }
  return [{ id: letra, letra, audio: `/audio/${letra}.mp3` }];
});

type LetraObj = typeof letrasData[0];

export default function EscuchaPage() {
  const [correctos, setCorrectos] = useState(0);
  const [errores, setErrores] = useState(0);

  // Estados del juego
  const [target, setTarget] = useState<LetraObj | null>(null);
  const [opciones, setOpciones] = useState<LetraObj[]>([]);
  const [estadoRespuesta, setEstadoRespuesta] = useState<'idle' | 'correct' | 'error'>('idle');
  const [seleccion, setSeleccion] = useState<string | null>(null);

  // Función para generar una nueva ronda
  const generarPregunta = useCallback(() => {
    // Elegir letra correcta al azar
    const correct = letrasData[Math.floor(Math.random() * letrasData.length)];
    
    // Elegir 2 distractores que no sean la letra correcta
    const distractors: LetraObj[] = [];
    while (distractors.length < 2) {
      const random = letrasData[Math.floor(Math.random() * letrasData.length)];
      if (random.letra !== correct.letra && !distractors.find(d => d.letra === random.letra)) {
        distractors.push(random);
      }
    }

    // Mezclar opciones
    const mezcladas = [correct, ...distractors].sort(() => Math.random() - 0.5);
    
    setTarget(correct);
    setOpciones(mezcladas);
    setEstadoRespuesta('idle');
    setSeleccion(null);
  }, []);

  // Iniciar la primera pregunta al cargar
  useEffect(() => {
    const timer = setTimeout(() => generarPregunta(), 0);
    return () => clearTimeout(timer);
  }, [generarPregunta]);

  // Reproducir el audio
  const playAudio = () => {
    if (!target) return;
    try {
      const audio = new Audio(target.audio);
      audio.play().catch(() => console.log("Audio no encontrado aún:", target.audio));
    } catch (e) {
      console.error(e);
    }
  };

  // Verificar la respuesta del alumno
  const verificar = (opcion: LetraObj) => {
    if (estadoRespuesta !== 'idle' || !target) return; // Si ya respondió, bloquear clics

    setSeleccion(opcion.id);

    if (opcion.id === target.id) {
      setEstadoRespuesta('correct');
      setCorrectos(prev => prev + 1);
    } else {
      setEstadoRespuesta('error');
      setErrores(prev => prev + 1);
    }

    // Esperar 1.5 segundos para mostrar el color (verde o rojo) y pasar a la siguiente
    setTimeout(() => {
      generarPregunta();
    }, 1500);
  };

  if (!target) return null; // Evita errores de renderizado en carga

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-black mb-6 text-hk-blue text-center" tabIndex={0}>
        ¿Qué letra escuchas?
      </h2>
      
      {/* Barra de progreso, asumiendo un máximo de 28 letras para llenar la barra */}
      <ProgressHeader correctos={correctos} errores={errores} total={letrasData.length} />

      <div className="flex-1 flex flex-col items-center justify-center gap-12 pb-10">
        
        {/* Botón Gigante de Reproducción */}
        <button
          onClick={playAudio}
          aria-label="Escuchar el sonido a adivinar"
          className="flex flex-col items-center justify-center w-64 h-64 bg-hk-blue text-white rounded-[3rem] shadow-2xl shadow-hk-blue/30 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-8 focus:ring-hk-yellow"
        >
          <Volume2 size={100} strokeWidth={1.5} />
          <span className="text-2xl font-bold mt-4">Escuchar</span>
        </button>

        {/* Opciones (3 Tarjetas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {opciones.map((opcion) => {
            // Lógica de colores para cuando responde
            const isSelected = seleccion === opcion.id;
            const isCorrect = target.id === opcion.id;
            
            let colorClases = "bg-card border-gray-200 dark:border-gray-700 text-card-foreground hover:border-hk-blue";
            
            if (estadoRespuesta !== 'idle') {
              if (isCorrect) {
                // Si ya respondió, siempre iluminamos la correcta de verde para que sepa cuál era
                colorClases = "bg-green-500 border-green-600 text-white shadow-green-500/50 shadow-lg scale-105";
              } else if (isSelected && !isCorrect) {
                // Si la seleccionó y estaba mal, la ponemos roja
                colorClases = "bg-red-500 border-red-600 text-white shadow-red-500/50 shadow-lg";
              } else {
                // Las demás que no eligió y están mal, se apagan un poco
                colorClases = "bg-card border-gray-200 dark:border-gray-700 text-card-foreground opacity-50";
              }
            }

            return (
              <button
                key={opcion.id}
                onClick={() => verificar(opcion)}
                disabled={estadoRespuesta !== 'idle'}
                aria-label={`Opción ${opcion.letra}`}
                className={`flex items-center justify-center h-48 border-2 rounded-[2.5rem] text-7xl font-black shadow-md transition-all duration-300 outline-none focus:ring-4 focus:ring-hk-yellow ${colorClases}`}
              >
                {opcion.letra}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}