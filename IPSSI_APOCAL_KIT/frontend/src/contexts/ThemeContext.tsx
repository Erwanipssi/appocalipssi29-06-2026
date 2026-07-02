/**
 * Contexte de thème clair / sombre.
 *
 * Trois modes : clair, sombre, ou système (prefers-color-scheme).
 * La classe `dark` sur <html> pilote Tailwind (darkMode: 'class').
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  /** Thème effectivement appliqué (résolu). */
  theme: ResolvedTheme;
  /** Préférence utilisateur (stockée). */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Bascule rapide clair ↔ sombre (ignore le mode système). */
  toggleTheme: () => void;
};

const STORAGE_KEY = 'edututor-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') return preference;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeClass(theme: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference);
  const [theme, setTheme] = useState<ResolvedTheme>(() => resolveTheme(getStoredPreference()));

  useEffect(() => {
    const resolved = resolveTheme(preference);
    setTheme(resolved);
    applyThemeClass(resolved);
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const resolved = resolveTheme('system');
      setTheme(resolved);
      applyThemeClass(resolved);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = (next: ThemePreference) => setPreferenceState(next);

  const toggleTheme = () => {
    setPreferenceState(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  return ctx;
}
