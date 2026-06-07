import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserXIcon, EyeIcon, RotateCcwIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useScreenInit } from '../useScreenInit';
export function LeftResidents() {
  useScreenInit('Left Residents');
  const { residents, updateResident } = useData();
  const navigate = useNavigate();
  const left = useMemo(
    () => residents.filter((r) => r.status === 'Left Hostel'),
    [residents]
  );
  const reactivate = (id: string, name: string) => {
    if (
    window.confirm(
      `Re-activate ${name}? They will need a room re-assignment.`
    ))
    {
      updateResident(id, {
        status: 'Active',
        leavingDate: null
      });
    }
  };
  return (
    <div>
      <PageHeader
        title="Left Residents"
        subtitle={`${left.length} former resident(s). Records are kept permanently.`} />
      
      {left.length === 0 ?
      <EmptyState
        icon={UserXIcon}
        title="No former residents"
        description="Residents marked as 'Left Hostel' will appear here with their data preserved." /> :


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Left</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {left.map((r, i) =>
              <motion.tr
                key={r.id}
                initial={{
                  opacity: 0,
                  y: 6
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: i * 0.03
                }}
                className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800">
                
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-100">
                      {r.gender}. {r.fullName}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {r.phone}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {r.joiningDate}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone="red">{r.leavingDate ?? '—'}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                      onClick={() => navigate(`/residents/${r.id}`)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10">
                      
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reactivate(r.id, r.fullName)}>
                      
                          <RotateCcwIcon className="h-3.5 w-3.5" /> Re-activate
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>);

}