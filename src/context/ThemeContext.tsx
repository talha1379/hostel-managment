import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'light' | 'dark';
interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}
const Ctx = createContext<ThemeCtx | null>(null);
export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('warden_theme') as Theme | null;
    return stored || 'light';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');else
    root.classList.remove('dark');
    localStorage.setItem('warden_theme', theme);
  }, [theme]);
  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState((p) => p === 'light' ? 'dark' : 'light');
  return (
    <Ctx.Provider
      value={{
        theme,
        toggle,
        setTheme
      }}>
      
      {children}
    </Ctx.Provider>);

}
export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used within ThemeProvider');
  return c;
}