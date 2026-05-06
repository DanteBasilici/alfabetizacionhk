"use client";
import { CheckCircle, XCircle } from "lucide-react";

interface ProgressProps {
  correctos: number;
  errores: number;
  total: number;
}

export default function ProgressHeader({ correctos, errores, total }: ProgressProps) {
  const progreso = total === 0 ? 0 : ((correctos + errores) / total) * 100;

  return (
    <div className="mb-8 space-y-4 w-full max-w-4xl mx-auto" aria-live="polite">
      {/* Tarjetas de Puntuación */}
      <div className="flex gap-4">
        <div className="flex-1 flex items-center justify-between p-4 rounded-3xl bg-card shadow-lg border-2 border-transparent">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-hk-blue" size={32} />
            <span className="text-xl font-bold text-card-foreground">Aciertos</span>
          </div>
          <span className="text-3xl font-black text-hk-blue">{correctos}</span>
        </div>

        <div className="flex-1 flex items-center justify-between p-4 rounded-3xl bg-card shadow-lg border-2 border-transparent">
          <div className="flex items-center gap-3">
            <XCircle className="text-hk-red" size={32} />
            <span className="text-xl font-bold text-card-foreground">Errores</span>
          </div>
          <span className="text-3xl font-black text-hk-red">{errores}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className="h-full bg-hk-yellow transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}