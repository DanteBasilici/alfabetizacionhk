"use client";
import { useState } from "react";
import { Smile } from "lucide-react";

const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const bocaData = abecedario.map((letra) => ({
  id: letra,
  letra: letra,
  img: `/img/${letra.toLowerCase()}.png`,
  label: `Posición de boca para la letra ${letra}`
}));

export default function BocaPage() {
  // Estado para saber qué letra estamos mostrando en grande
  const [letraSeleccionada, setLetraSeleccionada] = useState(bocaData[0]);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 w-full max-w-7xl mx-auto pb-4">
      
      {/* PANEL IZQUIERDO: Selector de letras */}
      <div className="md:w-1/3 lg:w-1/4 flex flex-col bg-card border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg h-[40vh] md:h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-black/5 dark:bg-white/5">
          <h2 className="text-xl font-bold text-hk-blue flex items-center gap-2" tabIndex={0}>
            <Smile size={24} /> Letras
          </h2>
        </div>
        
        {/* Contenedor con scroll para las letras */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3">
            {bocaData.map(item => {
              const isActive = letraSeleccionada.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setLetraSeleccionada(item)}
                  aria-label={`Seleccionar letra ${item.letra}`}
                  aria-pressed={isActive}
                  className={`flex items-center justify-center p-4 text-2xl font-black rounded-2xl transition-all outline-none focus:ring-4 focus:ring-hk-yellow ${
                    isActive 
                      ? 'bg-hk-blue text-white shadow-md scale-105' 
                      : 'bg-black/5 dark:bg-white/5 hover:bg-hk-yellow/30 text-card-foreground'
                  }`}
                >
                  {item.letra}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: Pizarra limpia (Solo Imagen) */}
      <div 
        className="flex-1 flex items-center justify-center bg-card border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg p-8 relative overflow-hidden"
        aria-live="polite"
      >
        <img 
          src={letraSeleccionada.img} 
          alt={letraSeleccionada.label} 
          className="w-full h-full max-w-3xl object-contain transition-transform duration-500 hover:scale-105"
          // Manejador de error visual si falta la imagen
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="text-center text-gray-500 font-medium text-2xl">Falta imagen:<br/>${letraSeleccionada.letra.toLowerCase()}.png</div>`;
          }}
        />
      </div>

    </div>
  );
}