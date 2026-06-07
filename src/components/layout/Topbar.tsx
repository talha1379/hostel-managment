import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, SearchIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { NotificationsBell } from './NotificationsBell';
export function Topbar({ onMenu }: {onMenu: () => void;}) {
  const { theme, toggle } = useTheme();
  const { settings } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim())
    navigate(`/residents?q=${encodeURIComponent(query.trim())}`);
  };
  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60 sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu">
        
        <MenuIcon className="h-5 w-5" />
      </button>

      <form
        onSubmit={onSearch}
        className="relative hidden flex-1 max-w-md sm:block">
        
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, room, phone, CNIC..."
          className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100" />
        
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Toggle theme">
          
          {theme === 'dark' ?
          <SunIcon className="h-5 w-5" /> :

          <MoonIcon className="h-5 w-5" />
          }
        </button>
        <NotificationsBell />
        <div className="ml-1 flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-700">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {settings.wardenName}
            </p>
            <p className="text-xs text-slate-400">Warden / Admin</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {settings.wardenName.
            replace(/^(Mr|Mrs|Ms|Miss)\.?\s*/i, '').
            charAt(0).
            toUpperCase()}
          </div>
        </div>
      </div>
    </header>);

}