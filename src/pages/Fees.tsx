import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletIcon, PlusIcon, ReceiptIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../context/DataContext';
import { useScreenInit } from '../useScreenInit';
const thisMonth = () => new Date().toISOString().slice(0, 7);
export function Fees() {
  useScreenInit('Fee Management');
  const {
    residents,
    fees,
    rooms,
    settings,
    upsertFee,
    recordPayment,
    feeFor,
    generateReceipt
  } = useData();
  const navigate = useNavigate();
  const [month, setMonth] = useState(thisMonth());
  const [payModal, setPayModal] = useState<{
    residentId: string;
  } | null>(null);
  const [amount, setAmount] = useState('');
  const [totalFee, setTotalFee] = useState('12000');
  const active = useMemo(
    () => residents.filter((r) => r.status === 'Active'),
    [residents]
  );
  const paidOf = (residentId: string) => {
    const fee = feeFor(residentId, month);
    if (!fee)
    return {
      total: 0,
      paid: 0,
      remaining: 0,
      feeId: null as string | null
    };
    const paid = fee.payments.reduce((s, p) => s + p.amount, 0);
    return {
      total: fee.totalFee,
      paid,
      remaining: Math.max(0, fee.totalFee - paid),
      feeId: fee.id
    };
  };
  const openPay = (residentId: string) => {
    const fee = feeFor(residentId, month);
    setTotalFee(String(fee?.totalFee ?? 12000));
    setAmount('');
    setPayModal({
      residentId
    });
  };
  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModal) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    const fee = upsertFee(payModal.residentId, month, Number(totalFee));
    recordPayment(fee.id, amt, new Date().toISOString().slice(0, 10));
    setPayModal(null);
  };
  const makeReceipt = (residentId: string) => {
    const resident = residents.find((r) => r.id === residentId)!;
    const fee = upsertFee(residentId, month, Number(totalFee || 12000));
    const paid = fee.payments.reduce((s, p) => s + p.amount, 0);
    const room = rooms.find((r) => r.id === resident.roomId);
    const receipt = generateReceipt({
      residentId,
      residentName: resident.fullName,
      roomNumber: room?.roomNumber ?? '—',
      paidAmount: paid,
      remainingAmount: Math.max(0, fee.totalFee - paid),
      date: new Date().toISOString().slice(0, 10),
      month
    });
    navigate(`/receipts/${receipt.id}`);
  };
  return (
    <div>
      <PageHeader
        title="Fee Management"
        subtitle="Track monthly fees, record payments and generate receipts"
        action={
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-44" />

        } />
      

      {active.length === 0 ?
      <EmptyState
        icon={WalletIcon}
        title="No active residents"
        description="Add active residents to manage their fees." /> :


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Resident</th>
                  <th className="px-5 py-3 font-semibold">Total Fee</th>
                  <th className="px-5 py-3 font-semibold">Paid</th>
                  <th className="px-5 py-3 font-semibold">Remaining</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {active.map((r, i) => {
                const f = paidOf(r.id);
                const status =
                f.feeId == null ?
                'No record' :
                f.remaining <= 0 ?
                'Paid' :
                f.paid > 0 ?
                'Partial' :
                'Unpaid';
                const tone =
                status === 'Paid' ?
                'green' :
                status === 'Partial' ?
                'yellow' :
                status === 'Unpaid' ?
                'red' :
                'slate';
                return (
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
                        {settings.currency} {f.total.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-emerald-600 dark:text-emerald-400">
                        {settings.currency} {f.paid.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-red-600 dark:text-red-400">
                        {settings.currency} {f.remaining.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={tone as any}>{status}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPay(r.id)}>
                          
                            <PlusIcon className="h-3.5 w-3.5" /> Payment
                          </Button>
                          <Button size="sm" onClick={() => makeReceipt(r.id)}>
                            <ReceiptIcon className="h-3.5 w-3.5" /> Receipt
                          </Button>
                        </div>
                      </td>
                    </motion.tr>);

              })}
              </tbody>
            </table>
          </div>
        </div>
      }

      <Modal
        open={!!payModal}
        onClose={() => setPayModal(null)}
        title="Record Payment">
        
        <form onSubmit={submitPayment} className="space-y-4">
          <Input
            label="Monthly Total Fee"
            type="number"
            value={totalFee}
            onChange={(e) => setTotalFee(e.target.value)} />
          
          <Input
            label="Payment Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount paid"
            autoFocus />
          
          <p className="text-xs text-slate-400">
            Payment date: {new Date().toISOString().slice(0, 10)} • Month:{' '}
            {month}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPayModal(null)}>
              
              Cancel
            </Button>
            <Button type="submit">Save Payment</Button>
          </div>
        </form>
      </Modal>
    </div>);

}