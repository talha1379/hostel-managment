import React from 'react';
import { twMerge } from 'tailwind-merge';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className, id, ...rest }: InputProps) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        
          {label}
        </label>
      }
      <input
        id={inputId}
        className={twMerge(
          'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...rest} />
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>);

}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}
export function Select({
  label,
  error,
  className,
  id,
  children,
  ...rest
}: SelectProps) {
  const selectId = id || rest.name;
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        
          {label}
        </label>
      }
      <select
        id={selectId}
        className={twMerge(
          'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100',
          error && 'border-red-500',
          className
        )}
        {...rest}>
        
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>);

}
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export function Textarea({ label, className, id, ...rest }: TextareaProps) {
  const taId = id || rest.name;
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={taId}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        
          {label}
        </label>
      }
      <textarea
        id={taId}
        className={twMerge(
          'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100',
          className
        )}
        {...rest} />
      
    </div>);

}