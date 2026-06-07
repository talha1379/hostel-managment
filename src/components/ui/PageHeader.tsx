import React from 'react';
import { motion } from 'framer-motion';
export function PageHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle &&
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        }
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </motion.div>);

}