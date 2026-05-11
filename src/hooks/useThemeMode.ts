import { useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

function applyDarkClass(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useThemeMode() {
  const initialMode: ThemeMode = useMemo(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "dark";
  }, []);

  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    applyDarkClass(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    // In case initialMode was computed before document is ready.
    applyDarkClass(mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return { mode, setMode, toggle };
}

