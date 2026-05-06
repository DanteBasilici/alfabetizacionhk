export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center space-y-6">
      <img src="/logo-escuela.png" alt="" className="w-32 h-32 md:w-48 md:h-48 object-contain mb-4 drop-shadow-lg" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl font-black text-hk-blue" tabIndex={0}>
        ¡Bienvenido a la App de Alfabetización!
      </h1>
      <p className="text-xl md:text-2xl font-medium text-foreground max-w-2xl" tabIndex={0}>
        Utiliza el panel izquierdo para seleccionar el ejercicio y comenzar a aprender.
      </p>
    </div>
  );
}
