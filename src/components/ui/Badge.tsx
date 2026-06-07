import React from 'react';
import { twMerge } from 'tailwind-merge';
type Tone = 'green' | 'red' | 'yellow' | 'blue' | 'slate' | 'orange';
const tones: Record<Tone, string> = {
  green:
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  yellow:
  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  blue: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  orange:
  'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400'
};
export function Badge({
  tone = 'slate',
  children,
  className




}: {tone?: Tone;children: React.ReactNode;className?: string;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className
      )}>
      
      {children}
    </span>);

}