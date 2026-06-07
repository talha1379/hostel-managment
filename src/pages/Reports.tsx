import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { ClockIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useScreenInit } from '../useScreenInit';
export function Reports() {
  useScreenInit('Reports');
  const { fees, residents, attendance, settings } = useData();
  const { theme } = useTheme();
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b';
  const feeData = useMemo(() => {
    const map: Record<
      string,
      {
        collected: number;
        pending: number;
      }> =
    {};
    fees.forEach((f) => {
      const paid = f.payments.reduce((s, p) => s + p.amount, 0);
      const m = f.month;
      if (!map[m])
      map[m] = {
        collected: 0,
        pending: 0
      };
      map[m].collected += paid;
      map[m].pending += Math.max(0, f.totalFee - paid);
    });
    return Object.entries(map).
    sort().
    map(([month, v]) => ({
      month,
      ...v
    }));
  }, [fees]);
  const studentTypes = useMemo(() => {
    const map: Record<string, number> = {};
    residents.
    filter((r) => r.status === 'Active').
    forEach((r) => {
      map[r.studentType] = (map[r.studentType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [residents]);
  const attSummary = useMemo(() => {
    const map: Record<string, number> = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Late: 0
    };
    attendance.forEach((a) => {
      map[a.status] = (map[a.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [attendance]);
  const COLORS = ['#3563ff', '#10b981', '#f59e0b', '#ef4444'];
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Insights across fees, occupancy and attendance" />
      

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}>
          
          <Card className="p-6">
            <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
              Fees: Collected vs Pending
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeData}>
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
                      background: theme === 'dark' ? '#1e293b' : '#fff'
                    }} />
                  
                  <Bar
                    dataKey="collected"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36} />
                  
                  <Bar
                    dataKey="pending"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36} />
                  
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
            delay: 0.1
          }}>
          
          <Card className="p-6">
            <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
              Active Residents by Type
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentTypes}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={(e) => e.name}>
                    
                    {studentTypes.map((_, i) =>
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
            delay: 0.2
          }}>
          
          <Card className="p-6">
            <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
              Attendance Summary
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attSummary}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
                    vertical={false} />
                  
                  <XAxis
                    dataKey="name"
                    stroke={axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false} />
                  
                  <YAxis
                    stroke={axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false} />
                  
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      background: theme === 'dark' ? '#1e293b' : '#fff'
                    }} />
                  
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {attSummary.map((_, i) =>
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    )}
                  </Bar>
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
          
          <Card className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-700/50">
              <ClockIcon className="h-6 w-6" />
            </div>
            <Badge tone="blue">Coming Soon</Badge>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              More detailed reports
            </h3>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Exportable PDF reports, date-range filtering and per-resident
              statements are on the way.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>);

}