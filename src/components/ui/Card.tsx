import React from 'react';
import { twMerge } from 'tailwind-merge';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}
export function Card({ className, interactive, children, ...rest }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/60',
        interactive &&
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer',
        className
      )}
      {...rest}>
      
      {children}
    </div>);

}