import React, { useMemo, Children, Component } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  BedDoubleIcon,
  WalletIcon,
  TrendingUpIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid } from
'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useScreenInit } from '../useScreenInit';
const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    y: 16
  },
  show: {
    opacity: 1,
    y: 0
  }
};
function StatCard({
  icon: Icon,
  label,
  value,
  tone







}: {icon: ComponentType<{className?: string;}>;label: string;value: string;tone: string;}) {
  return (
    <motion.div variants={item}>
      <Card interactive className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {value}
            </p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
            
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>);

}
export function Dashboard() {
  useScreenInit('Dashboard');
  const { residents, rooms, fees, settings } = useData();
  const { theme } = useTheme();
  const stats = useMemo(() => {
    const active = residents.filter((r) => r.status === 'Active').length;
    const left = residents.filter((r) => r.status === 'Left Hostel').length;
    const totalSeats = rooms.reduce((s, r) => s + r.totalSeats, 0);
    const occupied = residents.filter(
      (r) => r.status === 'Active' && r.roomId
    ).length;
    const collected = fees.reduce(
      (s, f) => s + f.payments.reduce((a, p) => a + p.amount, 0),
      0
    );
    const pending = fees.reduce((s, f) => {
      const paid = f.payments.reduce((a, p) => a + p.amount, 0);
      return s + Math.max(0, f.totalFee - paid);
    }, 0);
    return {
      active,
      left,
      total: residents.length,
      totalSeats,
      occupied,
      empty: Math.max(0, totalSeats - occupied),
      collected,
      pending
    };
  }, [residents, rooms, fees]);
  const monthly = useMemo(() => {
    const map: Record<string, number> = {};
    fees.forEach((f) =>
    f.payments.forEach((p) => {
      const m = p.date.slice(0, 7);
      map[m] = (map[m] || 0) + p.amount;
    })
    );
    return Object.entries(map).
    sort().
    map(([month, amount]) => ({
      month,
      amount
    }));
  }, [fees]);
  const occupancy = [
  {
    name: 'Occupied',
    value: stats.occupied
  },
  {
    name: 'Empty',
    value: stats.empty
  }];

  const COLORS = ['#3563ff', '#cbd5e1'];
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b';
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back to ${settings.hostelName}`} />
      

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <StatCard
          icon={UsersIcon}
          label="Total Residents"
          value={String(stats.total)}
          tone="bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" />
        
        <StatCard
          icon={UserCheckIcon}
          label="Active Residents"
          value={String(stats.active)}
          tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" />
        
        <StatCard
          icon={UserXIcon}
          label="Left Hostel"
          value={String(stats.left)}
          tone="bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" />
        
        <StatCard
          icon={BedDoubleIcon}
          label="Empty Seats"
          value={`${stats.empty}/${stats.totalSeats}`}
          tone="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" />
        
        <StatCard
          icon={WalletIcon}
          label="Fees Collected"
          value={`${settings.currency} ${stats.collected.toLocaleString()}`}
          tone="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400" />
        
        <StatCard
          icon={TrendingUpIcon}
          label="Fees Pending"
          value={`${settings.currency} ${stats.pending.toLocaleString()}`}
          tone="bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" />
        
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          className="lg:col-span-2">
          
          <Card className="p-6">
            <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
              Monthly Fee Collection
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
                    vertical={false} />
                  
                  <XAxis
                    dataKey="month"
                    stroke={axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false} />
                  
                  <YAxis
                    stroke={axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false} />
                  
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      background: theme === 'dark' ? '#1e293b' : '#fff',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }} />
                  
                  <Bar
                    dataKey="amount"
                    fill="#3563ff"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48} />
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}>
          
          <Card className="p-6">
            <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
              Seat Occupancy
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancy}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value">
                    
                    {occupancy.map((_, i) =>
                    <Cell key={i} fill={COLORS[i]} />
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      background: theme === 'dark' ? '#1e293b' : '#fff'
                    }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-5 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-600" /> Occupied
                ({stats.occupied})
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-300" /> Empty (
                {stats.empty})
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>);

}