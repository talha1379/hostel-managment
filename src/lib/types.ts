export type Gender = 'Mr' | 'Miss';
export type StudentType = 'School' | 'College' | 'University';
export type ResidentStatus = 'Active' | 'Left Hostel';

export interface Resident {
  id: string;
  fullName: string;
  fatherName: string;
  gender: Gender;
  phone: string;
  cnic: string;
  occupation: string;
  studentType: StudentType;
  instituteName: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContact: string;
  joiningDate: string;
  leavingDate: string | null;
  status: ResidentStatus;
  notes: string;
  roomId: string | null;
}

export interface Floor {
  id: string;
  floorNumber: string;
  name: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floorId: string;
  totalSeats: number;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Fee {
  id: string;
  residentId: string;
  month: string; // e.g. "2026-06"
  totalFee: number;
  payments: Payment[];
}

export interface Receipt {
  id: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  paidAmount: number;
  remainingAmount: number;
  date: string;
  month: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface AttendanceRecord {
  id: string;
  residentId: string;
  residentName: string;
  date: string;
  status: AttendanceStatus;
  lockedAt: string;
}

export interface AppNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'receipt' | 'resident' | 'left' | 'info';
}

export interface Settings {
  hostelName: string;
  wardenName: string;
  hostelAddress: string;
  contactPhone: string;
  currency: string;
  defaultTheme: 'light' | 'dark';
  receiptFooter: string;
  signatureLabel: string;
}