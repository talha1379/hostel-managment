import React, { useMemo, useState } from 'react';
import { UserCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ResidentForm } from '../components/residents/ResidentForm';
import { ResidentTable } from '../components/residents/ResidentTable';
import { useData } from '../context/DataContext';
import { Resident } from '../lib/types';
import { useScreenInit } from '../useScreenInit';
export function ActiveResidents() {
  useScreenInit('Active Residents');
  const { residents, updateResident, deleteResident, markLeft } = useData();
  const [editing, setEditing] = useState<Resident | null>(null);
  const active = useMemo(
    () => residents.filter((r) => r.status === 'Active'),
    [residents]
  );
  const handleLeave = (r: Resident) => {
    if (window.confirm(`Mark ${r.fullName} as Left Hostel?`))
    markLeft(r.id, new Date().toISOString().slice(0, 10));
  };
  const handleDelete = (r: Resident) => {
    if (window.confirm(`Permanently delete ${r.fullName}?`))
    deleteResident(r.id);
  };
  return (
    <div>
      <PageHeader
        title="Active Residents"
        subtitle={`${active.length} resident(s) currently living in the hostel`} />
      
      {active.length === 0 ?
      <EmptyState icon={UserCheckIcon} title="No active residents" /> :

      <ResidentTable
        residents={active}
        onEdit={setEditing}
        onDelete={handleDelete}
        onLeave={handleLeave} />

      }
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Resident"
        maxWidth="max-w-2xl">
        
        {editing &&
        <ResidentForm
          initial={editing}
          onSubmit={(d) => {
            updateResident(editing.id, d);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)} />

        }
      </Modal>
    </div>);

}