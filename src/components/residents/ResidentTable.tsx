import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, PencilIcon, Trash2Icon, LogOutIcon } from 'lucide-react';
import { Resident } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { useData } from '../../context/DataContext';
export function ResidentTable({
  residents,
  onEdit,
  onDelete,
  onLeave





}: {residents: Resident[];onEdit: (r: Resident) => void;onDelete: (r: Resident) => void;onLeave?: (r: Resident) => void;}) {
  const navigate = useNavigate();
  const { rooms } = useData();
  const roomNo = (rid: string | null) =>
  rooms.find((r) => r.id === rid)?.roomNumber ?? '—';
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Room</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((r, i) =>
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
              className="border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800">
              
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    {r.gender}. {r.fullName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {r.cnic || 'No CNIC'}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  {r.phone}
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  {roomNo(r.roomId)}
                </td>
                <td className="px-5 py-3">
                  <Badge tone="blue">{r.studentType}</Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={r.status === 'Active' ? 'green' : 'red'}>
                    {r.status}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                    onClick={() => navigate(`/residents/${r.id}`)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                    title="View">
                    
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                    onClick={() => onEdit(r)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                    title="Edit">
                    
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    {onLeave && r.status === 'Active' &&
                  <button
                    onClick={() => onLeave(r)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10"
                    title="Mark Left">
                    
                        <LogOutIcon className="h-4 w-4" />
                      </button>
                  }
                    <button
                    onClick={() => onDelete(r)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    title="Delete">
                    
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}