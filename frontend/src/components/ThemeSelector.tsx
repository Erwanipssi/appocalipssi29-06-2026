import { useTheme, type ThemePreference } from '@/contexts/ThemeContext';

const OPTIONS: { value: ThemePreference; label: string; hint: string }[] = [
  { value: 'light', label: 'Clair', hint: 'Fond clair en permanence' },
  { value: 'dark', label: 'Sombre', hint: 'Fond sombre en permanence' },
  { value: 'system', label: 'Système', hint: 'Suit la préférence de votre appareil' },
];

/** Sélecteur de thème (profil ou paramètres). */
export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setPreference(opt.value)}
          title={opt.hint}
          className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
            preference === opt.value
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'btn-secondary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Bouton compact dans la barre de navigation. */
export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-9 h-9 grid place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-label="Basculer le thème clair/sombre"
      aria-pressed={isDark}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
