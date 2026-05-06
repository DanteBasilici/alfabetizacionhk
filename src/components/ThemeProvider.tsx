"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // force dark mode by default on first load
  return <NextThemesProvider attribute="class" defaultTheme="dark">{children}</NextThemesProvider>;
}