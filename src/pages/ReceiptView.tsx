import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PrinterIcon,
  FileDownIcon,
  HotelIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useScreenInit } from '../useScreenInit';
export function ReceiptView() {
  useScreenInit('Receipt');
  const { id } = useParams();
  const navigate = useNavigate();
  const { receipts, settings } = useData();
  const receipt = receipts.find((r) => r.id === id);
  if (!receipt) {
    return (
      <div>
        <Button variant="outline" onClick={() => navigate('/receipts')}>
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
        <p className="mt-6 text-slate-500">Receipt not found.</p>
      </div>);

  }
  const total = receipt.paidAmount + receipt.remainingAmount;
  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => navigate('/receipts')}>
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <FileDownIcon className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <div className="print-area mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-white dark:text-slate-900 sm:p-10">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
              <HotelIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {settings.hostelName}
              </h1>
              <p className="text-xs text-slate-500">{settings.hostelAddress}</p>
              <p className="text-xs text-slate-500">{settings.contactPhone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase tracking-wide text-slate-900">
              Fee Receipt
            </p>
            <p className="text-xs text-slate-500">
              #{receipt.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 py-6 text-sm">
          <div>
            <span className="text-slate-500">Resident Name</span>
            <p className="font-semibold text-slate-900">
              {receipt.residentName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Room Number</span>
            <p className="font-semibold text-slate-900">{receipt.roomNumber}</p>
          </div>
          <div>
            <span className="text-slate-500">Month</span>
            <p className="font-semibold text-slate-900">{receipt.month}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Date</span>
            <p className="font-semibold text-slate-900">{receipt.date}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex justify-between py-1.5 text-sm">
            <span className="text-slate-600">Total Monthly Fee</span>
            <span className="font-semibold text-slate-900">
              {settings.currency} {total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 text-sm">
            <span className="text-slate-600">Paid Amount</span>
            <span className="font-bold text-emerald-600">
              {settings.currency} {receipt.paidAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-300 pt-2.5 text-sm">
            <span className="font-semibold text-slate-700">
              Remaining Balance
            </span>
            <span className="font-bold text-red-600">
              {settings.currency} {receipt.remainingAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          {settings.receiptFooter}
        </p>

        <div className="mt-12 flex items-end justify-between">
          <div className="text-center">
            <div className="h-12 w-40 border-b border-slate-400" />
            <p className="mt-1 text-xs text-slate-500">Resident Signature</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm font-semibold text-slate-900">
              {settings.wardenName}
            </p>
            <div className="h-12 w-40 border-b border-slate-400" />
            <p className="mt-1 text-xs text-slate-500">
              {settings.signatureLabel}
            </p>
          </div>
        </div>
      </div>
    </div>);

}