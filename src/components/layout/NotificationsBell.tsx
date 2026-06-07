import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  ReceiptIcon,
  UserPlusIcon,
  UserXIcon,
  InfoIcon } from
'lucide-react';
import { useData } from '../../context/DataContext';
import { AppNotification } from '../../lib/types';
import { formatDistanceToNow } from 'date-fns';
const iconFor = (t: AppNotification['type']) => {
  switch (t) {
    case 'receipt':
      return ReceiptIcon;
    case 'resident':
      return UserPlusIcon;
    case 'left':
      return UserXIcon;
    default:
      return InfoIcon;
  }
};
export function NotificationsBell() {
  const { notifications, markAllRead } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) markAllRead();
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label="Notifications">
        
        <BellIcon className="h-5 w-5" />
        {unread > 0 &&
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        }
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
            scale: 0.97
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -8,
            scale: 0.97
          }}
          transition={{
            duration: 0.15
          }}
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ?
            <p className="px-4 py-8 text-center text-sm text-slate-400">
                  No notifications yet
                </p> :

            notifications.slice(0, 30).map((n) => {
              const Icon = iconFor(n.type);
              return (
                <div
                  key={n.id}
                  className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-700/50">
                  
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {n.message}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatDistanceToNow(new Date(n.date), {
                        addSuffix: true
                      })}
                        </p>
                      </div>
                    </div>);

            })
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}