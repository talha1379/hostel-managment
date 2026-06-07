import React, { useState } from 'react';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Resident } from '../../lib/types';
import { useData } from '../../context/DataContext';
type FormData = Omit<Resident, 'id'>;
const empty: FormData = {
  fullName: '',
  fatherName: '',
  gender: 'Mr',
  phone: '',
  cnic: '',
  occupation: '',
  studentType: 'University',
  instituteName: '',
  address: '',
  guardianName: '',
  guardianPhone: '',
  emergencyContact: '',
  joiningDate: new Date().toISOString().slice(0, 10),
  leavingDate: null,
  status: 'Active',
  notes: '',
  roomId: null
};
export function ResidentForm({
  initial,
  onSubmit,
  onCancel




}: {initial?: Resident;onSubmit: (data: FormData) => void;onCancel: () => void;}) {
  const { rooms, floors, roomOccupancy } = useData();
  const [data, setData] = useState<FormData>(
    initial ?
    {
      ...initial
    } :
    empty
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof FormData, v: any) =>
  setData((d) => ({
    ...d,
    [k]: v
  }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = 'Full name is required';
    if (!data.phone.trim()) e.phone = 'Phone is required';
    if (data.cnic && !/^\d{5}-\d{7}-\d$/.test(data.cnic))
    e.cnic = 'Format: 12345-1234567-1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(data);
  };
  const roomLabel = (rid: string) => {
    const room = rooms.find((r) => r.id === rid);
    if (!room) return '';
    const fl = floors.find((f) => f.id === room.floorId);
    const occ = roomOccupancy(rid);
    return `Room ${room.roomNumber} • ${fl?.name ?? ''} (${occ.empty} free)`;
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full Name *"
          name="fullName"
          value={data.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          error={errors.fullName} />
        
        <Input
          label="Father Name"
          name="fatherName"
          value={data.fatherName}
          onChange={(e) => set('fatherName', e.target.value)} />
        
        <Select
          label="Gender"
          name="gender"
          value={data.gender}
          onChange={(e) => set('gender', e.target.value)}>
          
          <option value="Mr">Mr</option>
          <option value="Miss">Miss</option>
        </Select>
        <Input
          label="Phone Number *"
          name="phone"
          value={data.phone}
          onChange={(e) => set('phone', e.target.value)}
          error={errors.phone} />
        
        <Input
          label="CNIC"
          name="cnic"
          placeholder="12345-1234567-1"
          value={data.cnic}
          onChange={(e) => set('cnic', e.target.value)}
          error={errors.cnic} />
        
        <Input
          label="Occupation"
          name="occupation"
          value={data.occupation}
          onChange={(e) => set('occupation', e.target.value)} />
        
        <Select
          label="Student Type"
          name="studentType"
          value={data.studentType}
          onChange={(e) => set('studentType', e.target.value)}>
          
          <option value="School">School</option>
          <option value="College">College</option>
          <option value="University">University</option>
        </Select>
        <Input
          label="Institute Name"
          name="instituteName"
          value={data.instituteName}
          onChange={(e) => set('instituteName', e.target.value)} />
        
        <Input
          label="Guardian Name"
          name="guardianName"
          value={data.guardianName}
          onChange={(e) => set('guardianName', e.target.value)} />
        
        <Input
          label="Guardian Phone"
          name="guardianPhone"
          value={data.guardianPhone}
          onChange={(e) => set('guardianPhone', e.target.value)} />
        
        <Input
          label="Emergency Contact"
          name="emergencyContact"
          value={data.emergencyContact}
          onChange={(e) => set('emergencyContact', e.target.value)} />
        
        <Input
          type="date"
          label="Joining Date"
          name="joiningDate"
          value={data.joiningDate}
          onChange={(e) => set('joiningDate', e.target.value)} />
        
        <Select
          label="Assign Room"
          name="roomId"
          value={data.roomId ?? ''}
          onChange={(e) => set('roomId', e.target.value || null)}>
          
          <option value="">— No room —</option>
          {rooms.map((r) => {
            const occ = roomOccupancy(r.id);
            const full = occ.empty <= 0 && data.roomId !== r.id;
            return (
              <option key={r.id} value={r.id} disabled={full}>
                {roomLabel(r.id)}
                {full ? ' — FULL' : ''}
              </option>);

          })}
        </Select>
        <Select
          label="Status"
          name="status"
          value={data.status}
          onChange={(e) => set('status', e.target.value)}>
          
          <option value="Active">Active</option>
          <option value="Left Hostel">Left Hostel</option>
        </Select>
      </div>
      <Textarea
        label="Address"
        name="address"
        rows={2}
        value={data.address}
        onChange={(e) => set('address', e.target.value)} />
      
      <Textarea
        label="Notes"
        name="notes"
        rows={2}
        value={data.notes}
        onChange={(e) => set('notes', e.target.value)} />
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? 'Save Changes' : 'Add Resident'}
        </Button>
      </div>
    </form>);

}