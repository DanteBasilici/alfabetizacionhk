"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BookOpen, Ear, Smile, Moon, Sun, Menu, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Evita el error de hidratación en Next.js
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: "Fonemas", path: "/ejercicios/fonemas", icon: Ear },
    { name: "Posición Boca", path: "/ejercicios/boca", icon: Smile },
    { name: "¿Qué escuchas?", path: "/ejercicios/escucha", icon: BookOpen },
    { name: "Memotest", path: "/ejercicios/memotest", icon: Gamepad2 },
  ];

  return (
    <>
      <button 
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-hk-blue text-white rounded-2xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <aside className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300
        fixed md:static z-40 w-72 h-full flex flex-col
        bg-card text-card-foreground shadow-2xl rounded-r-3xl md:rounded-none border-r border-gray-800/20 dark:border-gray-800
      `}>
        <div className="p-6 flex items-center gap-4 border-b border-gray-800/20 dark:border-gray-800">
          <img src="/logo-escuela.png" alt="Logo Esc. 2-006 Helen Keller" className="w-12 h-12 object-contain" />
          {/* Aquí usamos text-card-foreground para que siempre se lea */}
          <h1 className="font-bold text-lg leading-tight text-card-foreground">
            Esc. 2-006<br/>
            <span className="text-hk-yellow">Helen Keller</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className="flex items-center gap-3 p-4 rounded-2xl hover:bg-hk-blue hover:text-white transition-all font-medium text-lg"
              aria-label={`Ir al ejercicio ${item.name}`}
            >
              <item.icon size={24} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800/20 dark:border-gray-800">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-black/20 hover:bg-black/40 text-card-foreground transition-all"
            aria-label="Cambiar modo claro o escudo"
          >
            {mounted ? (
              theme === 'dark' ? <Sun size={20} className="text-hk-yellow"/> : <Moon size={20} className="text-hk-blue"/>
            ) : <div className="w-5 h-5" />}
            <span>{mounted ? (theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro') : 'Cargando...'}</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}