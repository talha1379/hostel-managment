import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  WalletIcon,
  ReceiptIcon,
  Building2Icon,
  CalendarCheckIcon,
  BarChart3Icon,
  SettingsIcon,
  XIcon,
  HotelIcon } from
'lucide-react';
import { useData } from '../../context/DataContext';
const nav = [
{
  to: '/',
  label: 'Dashboard',
  icon: LayoutDashboardIcon,
  end: true
},
{
  to: '/residents',
  label: 'Residents',
  icon: UsersIcon
},
{
  to: '/residents/active',
  label: 'Active Residents',
  icon: UserCheckIcon
},
{
  to: '/residents/left',
  label: 'Left Residents',
  icon: UserXIcon
},
{
  to: '/fees',
  label: 'Fee Management',
  icon: WalletIcon
},
{
  to: '/receipts',
  label: 'Receipts',
  icon: ReceiptIcon
},
{
  to: '/rooms',
  label: 'Rooms & Floors',
  icon: Building2Icon
},
{
  to: '/attendance',
  label: 'Attendance',
  icon: CalendarCheckIcon
},
{
  to: '/reports',
  label: 'Reports',
  icon: BarChart3Icon
},
{
  to: '/settings',
  label: 'Settings',
  icon: SettingsIcon
}];

function NavItems({ onNavigate }: {onNavigate?: () => void;}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((item) =>
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`
        }>
        
          {({ isActive }) =>
        <>
              <item.icon
            className={`h-[18px] w-[18px] transition-transform group-hover:scale-110 ${isActive ? '' : ''}`} />
          
              <span>{item.label}</span>
            </>
        }
        </NavLink>
      )}
    </nav>);

}
function Brand() {
  const { settings } = useData();
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <HotelIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
          {settings.hostelName}
        </p>
        <p className="text-xs text-slate-400">Warden Panel</p>
      </div>
    </div>);

}
export function Sidebar({
  mobileOpen,
  onClose



}: {mobileOpen: boolean;onClose: () => void;}) {
  return (
    <>
      {/* Desktop */}
      <aside className="glass hidden w-64 shrink-0 flex-col border-r border-slate-200/70 dark:border-slate-700/60 lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto pb-6">
          <NavItems />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen &&
        <>
            <motion.div
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={onClose} />
          
            <motion.aside
            initial={{
              x: -300
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: -300
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 32
            }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:hidden">
            
              <div className="flex items-center justify-between">
                <Brand />
                <button
                onClick={onClose}
                className="mr-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pb-6">
                <NavItems onNavigate={onClose} />
              </div>
            </motion.aside>
          </>
        }
      </AnimatePresence>
    </>);

}