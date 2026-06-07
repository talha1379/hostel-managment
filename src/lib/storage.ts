import {
  Resident,
  Floor,
  Room,
  Fee,
  Receipt,
  AttendanceRecord,
  AppNotification,
  Settings } from
'./types';

const KEY = 'warden_ms_v1';

export interface AppState {
  residents: Resident[];
  floors: Floor[];
  rooms: Room[];
  fees: Fee[];
  receipts: Receipt[];
  attendance: AttendanceRecord[];
  notifications: AppNotification[];
  settings: Settings;
}

export const uid = () =>
Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const defaultSettings: Settings = {
  hostelName: 'Al-Noor Boys Hostel',
  wardenName: 'Mr. Ahmed Raza',
  hostelAddress: 'Block C, University Road, Lahore',
  contactPhone: '+92 300 1234567',
  currency: 'Rs.',
  defaultTheme: 'light',
  receiptFooter:
  'Thank you for your payment. Keep this receipt for your records.',
  signatureLabel: 'Warden Signature'
};

function seed(): AppState {
  const floors: Floor[] = [
  { id: 'f1', floorNumber: '1', name: 'Ground Floor' },
  { id: 'f2', floorNumber: '2', name: 'First Floor' }];

  const rooms: Room[] = [
  { id: 'r1', roomNumber: '101', floorId: 'f1', totalSeats: 3 },
  { id: 'r2', roomNumber: '102', floorId: 'f1', totalSeats: 2 },
  { id: 'r3', roomNumber: '201', floorId: 'f2', totalSeats: 4 }];

  const residents: Resident[] = [
  {
    id: 'res1',
    fullName: 'Bilal Khan',
    fatherName: 'Tariq Khan',
    gender: 'Mr',
    phone: '+92 301 1111111',
    cnic: '35201-1234567-1',
    occupation: 'Student',
    studentType: 'University',
    instituteName: 'Punjab University',
    address: 'Gujranwala',
    guardianName: 'Tariq Khan',
    guardianPhone: '+92 333 2222222',
    emergencyContact: '+92 333 2222222',
    joiningDate: '2026-01-10',
    leavingDate: null,
    status: 'Active',
    notes: 'Final year CS.',
    roomId: 'r1'
  },
  {
    id: 'res2',
    fullName: 'Hamza Ali',
    fatherName: 'Asif Ali',
    gender: 'Mr',
    phone: '+92 302 3333333',
    cnic: '35202-7654321-3',
    occupation: 'Student',
    studentType: 'College',
    instituteName: 'Govt College',
    address: 'Sialkot',
    guardianName: 'Asif Ali',
    guardianPhone: '+92 333 4444444',
    emergencyContact: '+92 333 4444444',
    joiningDate: '2026-02-05',
    leavingDate: null,
    status: 'Active',
    notes: '',
    roomId: 'r1'
  },
  {
    id: 'res3',
    fullName: 'Saad Iqbal',
    fatherName: 'Iqbal Hussain',
    gender: 'Mr',
    phone: '+92 303 5555555',
    cnic: '35203-1112223-5',
    occupation: 'Job',
    studentType: 'University',
    instituteName: 'UET',
    address: 'Faisalabad',
    guardianName: 'Iqbal Hussain',
    guardianPhone: '+92 333 6666666',
    emergencyContact: '+92 333 6666666',
    joiningDate: '2025-11-01',
    leavingDate: '2026-03-20',
    status: 'Left Hostel',
    notes: 'Completed studies.',
    roomId: null
  }];

  const fees: Fee[] = [
  {
    id: 'fee1',
    residentId: 'res1',
    month: '2026-06',
    totalFee: 12000,
    payments: [{ id: 'p1', amount: 8000, date: '2026-06-02' }]
  },
  {
    id: 'fee2',
    residentId: 'res2',
    month: '2026-06',
    totalFee: 12000,
    payments: [{ id: 'p2', amount: 12000, date: '2026-06-01' }]
  },
  {
    id: 'fee3',
    residentId: 'res1',
    month: '2026-05',
    totalFee: 12000,
    payments: [{ id: 'p3', amount: 12000, date: '2026-05-03' }]
  }];

  return {
    floors,
    rooms,
    residents,
    fees,
    receipts: [],
    attendance: [],
    notifications: [
    {
      id: 'n1',
      message: 'Welcome to your Warden Management System',
      date: new Date().toISOString(),
      read: false,
      type: 'info'
    }],

    settings: defaultSettings
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...seed(),
      ...parsed,
      settings: { ...defaultSettings, ...parsed.settings }
    };
  } catch {
    const s = seed();
    return s;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}