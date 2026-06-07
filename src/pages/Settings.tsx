import React, { useEffect, useState } from 'react';
import { SaveIcon, CheckCircle2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsType } from '../lib/types';
import { useScreenInit } from '../useScreenInit';
export function Settings() {
  useScreenInit('Settings');
  const { settings, updateSettings } = useData();
  const { setTheme } = useTheme();
  const [form, setForm] = useState<SettingsType>(settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setForm(settings);
  }, [settings]);
  const set = (k: keyof SettingsType, v: any) =>
  setForm((f) => ({
    ...f,
    [k]: v
  }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setTheme(form.defaultTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure hostel information used across the app and receipts" />
      

      <form onSubmit={save} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
            Hostel Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Hostel Name"
              value={form.hostelName}
              onChange={(e) => set('hostelName', e.target.value)} />
            
            <Input
              label="Warden Name"
              value={form.wardenName}
              onChange={(e) => set('wardenName', e.target.value)} />
            
            <Textarea
              label="Hostel Address"
              rows={2}
              value={form.hostelAddress}
              onChange={(e) => set('hostelAddress', e.target.value)} />
            
            <Input
              label="Contact Phone"
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)} />
            
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
            Preferences & Receipt
          </h3>
          <div className="space-y-4">
            <Input
              label="Currency Symbol"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)} />
            
            <Select
              label="Default Theme"
              value={form.defaultTheme}
              onChange={(e) => set('defaultTheme', e.target.value)}>
              
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
            <Textarea
              label="Receipt Footer Note"
              rows={2}
              value={form.receiptFooter}
              onChange={(e) => set('receiptFooter', e.target.value)} />
            
            <Input
              label="Signature Label"
              value={form.signatureLabel}
              onChange={(e) => set('signatureLabel', e.target.value)} />
            
          </div>
        </Card>

        <div className="flex items-center gap-3 lg:col-span-2">
          <Button type="submit">
            <SaveIcon className="h-4 w-4" /> Save Settings
          </Button>
          <AnimatePresence>
            {saved &&
            <motion.span
              initial={{
                opacity: 0,
                x: -8
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              
                <CheckCircle2Icon className="h-4 w-4" /> Settings saved
              </motion.span>
            }
          </AnimatePresence>
        </div>
      </form>
    </div>);

}