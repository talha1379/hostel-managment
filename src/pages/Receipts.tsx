import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReceiptIcon, EyeIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useData } from '../context/DataContext';
import { useScreenInit } from '../useScreenInit';
export function Receipts() {
  useScreenInit('Receipts');
  const { receipts, settings } = useData();
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Receipts" subtitle="All generated fee receipts" />
      {receipts.length === 0 ?
      <EmptyState
        icon={ReceiptIcon}
        title="No receipts yet"
        description="Generate a receipt from the Fee Management page."
        action={<Button onClick={() => navigate('/fees')}>Go to Fees</Button>} /> :


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Resident</th>
                  <th className="px-5 py-3 font-semibold">Room</th>
                  <th className="px-5 py-3 font-semibold">Month</th>
                  <th className="px-5 py-3 font-semibold">Paid</th>
                  <th className="px-5 py-3 font-semibold">Remaining</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r, i) =>
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
                      {r.residentName}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {r.roomNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {r.month}
                    </td>
                    <td className="px-5 py-3 text-emerald-600 dark:text-emerald-400">
                      {settings.currency} {r.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      {r.remainingAmount > 0 ?
                  <Badge tone="red">
                          {settings.currency}{' '}
                          {r.remainingAmount.toLocaleString()}
                        </Badge> :

                  <Badge tone="green">Cleared</Badge>
                  }
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {r.date}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/receipts/${r.id}`)}>
                    
                        <EyeIcon className="h-3.5 w-3.5" /> View
                      </Button>
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