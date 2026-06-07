import React, { useMemo, useState, Component } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheckIcon,
  LockIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  PlaneIcon } from
'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../context/DataContext';
import { AttendanceStatus } from '../lib/types';
import { useScreenInit } from '../useScreenInit';
const STATUS: {
  key: AttendanceStatus;
  label: string;
  icon: ComponentType<{
    className?: string;
  }>;
  hover: string;
}[] = [
{
  key: 'Present',
  label: 'Present',
  icon: CheckIcon,
  hover: 'hover:bg-emerald-600 hover:text-white hover:border-transparent'
},
{
  key: 'Absent',
  label: 'Absent',
  icon: XIcon,
  hover: 'hover:bg-red-600 hover:text-white hover:border-transparent'
},
{
  key: 'Leave',
  label: 'Leave',
  icon: PlaneIcon,
  hover: 'hover:bg-brand-600 hover:text-white hover:border-transparent'
},
{
  key: 'Late',
  label: 'Late',
  icon: ClockIcon,
  hover: 'hover:bg-amber-500 hover:text-white hover:border-transparent'
}];

const toneFor = (s: AttendanceStatus) =>
s === 'Present' ?
'green' :
s === 'Absent' ?
'red' :
s === 'Leave' ?
'blue' :
'yellow';
export function Attendance() {
  useScreenInit('Attendance');
  const { residents, attendance, markAttendance } = useData();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const active = useMemo(
    () => residents.filter((r) => r.status === 'Active'),
    [residents]
  );
  const recordFor = (residentId: string) =>
  attendance.find((a) => a.residentId === residentId && a.date === date);
  const mark = (
  residentId: string,
  residentName: string,
  status: AttendanceStatus) =>
  {
    const res = markAttendance(residentId, residentName, date, status);
    if (!res.ok) setError(res.error ?? 'Could not mark attendance');else
    setError('');
  };
  const history = useMemo(() => attendance.slice(0, 40), [attendance]);
  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Mark attendance once per day — entries are permanently locked after marking"
        action={
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError('');
          }}
          className="w-44" />

        } />
      

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
        <LockIcon className="mr-1.5 inline h-4 w-4" />
        Once you mark a member Present / Absent / Leave / Late for a date, it
        cannot be changed.
      </div>
      {error &&
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      }

      {active.length === 0 ?
      <EmptyState
        icon={CalendarCheckIcon}
        title="No members to mark"
        description="Add active residents to record their attendance." /> :


      <div className="space-y-3">
          {active.map((r, i) => {
          const rec = recordFor(r.id);
          return (
            <motion.div
              key={r.id}
              initial={{
                opacity: 0,
                y: 8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.03
              }}>
              
                <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {r.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {r.gender}. {r.fullName}
                      </p>
                      <p className="text-xs text-slate-400">{r.phone}</p>
                    </div>
                  </div>
                  {rec ?
                <div className="flex items-center gap-2">
                      <Badge tone={toneFor(rec.status) as any}>
                        {rec.status}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <LockIcon className="h-3.5 w-3.5" /> Locked
                      </span>
                    </div> :

                <div className="flex flex-wrap gap-2">
                      {STATUS.map((s) =>
                  <button
                    key={s.key}
                    onClick={() => mark(r.id, r.fullName, s.key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:scale-105 dark:border-slate-600 dark:text-slate-300 ${s.hover}`}>
                    
                          <s.icon className="h-3.5 w-3.5" /> {s.label}
                        </button>
                  )}
                    </div>
                }
                </Card>
              </motion.div>);

        })}
        </div>
      }

      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900 dark:text-white">
        Attendance History
      </h2>
      {history.length === 0 ?
      <p className="text-sm text-slate-400">No attendance recorded yet.</p> :

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Member</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) =>
              <tr
                key={a.id}
                className="border-t border-slate-100 dark:border-slate-700/50">
                
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {a.residentName}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {a.date}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={toneFor(a.status) as any}>{a.status}</Badge>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>);

}