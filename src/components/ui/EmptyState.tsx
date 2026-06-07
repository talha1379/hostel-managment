import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { InboxIcon } from 'lucide-react';
export function EmptyState({
  title,
  description,
  icon: Icon = InboxIcon,
  action







}: {title: string;description?: string;icon?: ComponentType<{className?: string;}>;action?: React.ReactNode;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
      
      <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      {description &&
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      }
      {action && <div className="mt-5">{action}</div>}
    </motion.div>);

}