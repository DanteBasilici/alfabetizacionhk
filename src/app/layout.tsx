import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Alfabetización - Esc. Helen Keller",
  description: "App de alfabetización accesible",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased flex h-screen overflow-hidden">
        <ThemeProvider>
          {/* Panel Lateral (Sidebar) */}
          <Sidebar />
          
          {/* Área principal donde irán los ejercicios */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
