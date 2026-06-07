import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext } from
'react';
import {
  Resident,
  Floor,
  Room,
  Fee,
  Receipt,
  AttendanceRecord,
  AppNotification,
  Settings,
  Payment,
  AttendanceStatus } from
'../lib/types';
import { AppState, loadState, saveState, uid } from '../lib/storage';
interface DataCtx extends AppState {
  // residents
  addResident: (r: Omit<Resident, 'id'>) => Resident;
  updateResident: (id: string, patch: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  markLeft: (id: string, leavingDate: string) => void;
  // floors
  addFloor: (f: Omit<Floor, 'id'>) => void;
  updateFloor: (id: string, patch: Partial<Floor>) => void;
  deleteFloor: (id: string) => void;
  // rooms
  addRoom: (r: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  assignRoom: (
  residentId: string,
  roomId: string | null)
  => {
    ok: boolean;
    error?: string;
  };
  // fees
  upsertFee: (residentId: string, month: string, totalFee: number) => Fee;
  recordPayment: (feeId: string, amount: number, date: string) => void;
  // receipts
  generateReceipt: (r: Omit<Receipt, 'id'>) => Receipt;
  // attendance
  markAttendance: (
  residentId: string,
  residentName: string,
  date: string,
  status: AttendanceStatus)
  => {
    ok: boolean;
    error?: string;
  };
  // notifications
  pushNotification: (message: string, type: AppNotification['type']) => void;
  markAllRead: () => void;
  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  // helpers
  roomOccupancy: (roomId: string) => {
    occupied: number;
    empty: number;
    total: number;
  };
  feeFor: (residentId: string, month: string) => Fee | undefined;
}
const Ctx = createContext<DataCtx | null>(null);
export function DataProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<AppState>(() => loadState());
  useEffect(() => {
    saveState(state);
  }, [state]);
  const roomOccupancy = useCallback(
    (roomId: string) => {
      const room = state.rooms.find((r) => r.id === roomId);
      const total = room?.totalSeats ?? 0;
      const occupied = state.residents.filter(
        (r) => r.roomId === roomId && r.status === 'Active'
      ).length;
      return {
        occupied,
        empty: Math.max(0, total - occupied),
        total
      };
    },
    [state.rooms, state.residents]
  );
  const pushNotification = useCallback(
    (message: string, type: AppNotification['type']) => {
      setState((s) => ({
        ...s,
        notifications: [
        {
          id: uid(),
          message,
          date: new Date().toISOString(),
          read: false,
          type
        },
        ...s.notifications]

      }));
    },
    []
  );
  const addResident: DataCtx['addResident'] = useCallback((r) => {
    const resident: Resident = {
      ...r,
      id: uid()
    };
    setState((s) => ({
      ...s,
      residents: [resident, ...s.residents],
      notifications: [
      {
        id: uid(),
        message: `New resident added: ${resident.fullName}`,
        date: new Date().toISOString(),
        read: false,
        type: 'resident'
      },
      ...s.notifications]

    }));
    return resident;
  }, []);
  const updateResident: DataCtx['updateResident'] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      residents: s.residents.map((r) =>
      r.id === id ?
      {
        ...r,
        ...patch
      } :
      r
      )
    }));
  }, []);
  const deleteResident: DataCtx['deleteResident'] = useCallback((id) => {
    setState((s) => ({
      ...s,
      residents: s.residents.filter((r) => r.id !== id)
    }));
  }, []);
  const markLeft: DataCtx['markLeft'] = useCallback((id, leavingDate) => {
    setState((s) => {
      const res = s.residents.find((r) => r.id === id);
      return {
        ...s,
        residents: s.residents.map((r) =>
        r.id === id ?
        {
          ...r,
          status: 'Left Hostel',
          leavingDate,
          roomId: null
        } :
        r
        ),
        notifications: [
        {
          id: uid(),
          message: `${res?.fullName ?? 'Resident'} marked as Left Hostel`,
          date: new Date().toISOString(),
          read: false,
          type: 'left'
        },
        ...s.notifications]

      };
    });
  }, []);
  const addFloor: DataCtx['addFloor'] = useCallback((f) => {
    setState((s) => ({
      ...s,
      floors: [
      ...s.floors,
      {
        ...f,
        id: uid()
      }]

    }));
  }, []);
  const updateFloor: DataCtx['updateFloor'] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      floors: s.floors.map((f) =>
      f.id === id ?
      {
        ...f,
        ...patch
      } :
      f
      )
    }));
  }, []);
  const deleteFloor: DataCtx['deleteFloor'] = useCallback((id) => {
    setState((s) => ({
      ...s,
      floors: s.floors.filter((f) => f.id !== id),
      rooms: s.rooms.filter((r) => r.floorId !== id)
    }));
  }, []);
  const addRoom: DataCtx['addRoom'] = useCallback((r) => {
    setState((s) => ({
      ...s,
      rooms: [
      ...s.rooms,
      {
        ...r,
        id: uid()
      }]

    }));
  }, []);
  const updateRoom: DataCtx['updateRoom'] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.map((r) =>
      r.id === id ?
      {
        ...r,
        ...patch
      } :
      r
      )
    }));
  }, []);
  const deleteRoom: DataCtx['deleteRoom'] = useCallback((id) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.filter((r) => r.id !== id),
      residents: s.residents.map((res) =>
      res.roomId === id ?
      {
        ...res,
        roomId: null
      } :
      res
      )
    }));
  }, []);
  const assignRoom: DataCtx['assignRoom'] = useCallback(
    (residentId, roomId) => {
      let result: {
        ok: boolean;
        error?: string;
      } = {
        ok: true
      };
      setState((s) => {
        if (roomId) {
          const room = s.rooms.find((r) => r.id === roomId);
          if (!room) {
            result = {
              ok: false,
              error: 'Room not found'
            };
            return s;
          }
          const occupied = s.residents.filter(
            (r) =>
            r.roomId === roomId &&
            r.status === 'Active' &&
            r.id !== residentId
          ).length;
          if (occupied >= room.totalSeats) {
            result = {
              ok: false,
              error: 'Room is at full capacity'
            };
            return s;
          }
        }
        return {
          ...s,
          residents: s.residents.map((r) =>
          r.id === residentId ?
          {
            ...r,
            roomId
          } :
          r
          )
        };
      });
      return result;
    },
    []
  );
  const feeFor: DataCtx['feeFor'] = useCallback(
    (residentId, month) =>
    state.fees.find((f) => f.residentId === residentId && f.month === month),
    [state.fees]
  );
  const upsertFee: DataCtx['upsertFee'] = useCallback(
    (residentId, month, totalFee) => {
      let fee: Fee | undefined;
      setState((s) => {
        const existing = s.fees.find(
          (f) => f.residentId === residentId && f.month === month
        );
        if (existing) {
          fee = {
            ...existing,
            totalFee
          };
          return {
            ...s,
            fees: s.fees.map((f) => f.id === existing.id ? fee! : f)
          };
        }
        fee = {
          id: uid(),
          residentId,
          month,
          totalFee,
          payments: []
        };
        return {
          ...s,
          fees: [...s.fees, fee]
        };
      });
      return fee!;
    },
    []
  );
  const recordPayment: DataCtx['recordPayment'] = useCallback(
    (feeId, amount, date) => {
      const payment: Payment = {
        id: uid(),
        amount,
        date
      };
      setState((s) => ({
        ...s,
        fees: s.fees.map((f) =>
        f.id === feeId ?
        {
          ...f,
          payments: [...f.payments, payment]
        } :
        f
        )
      }));
    },
    []
  );
  const generateReceipt: DataCtx['generateReceipt'] = useCallback((r) => {
    const receipt: Receipt = {
      ...r,
      id: uid()
    };
    setState((s) => ({
      ...s,
      receipts: [receipt, ...s.receipts],
      notifications: [
      {
        id: uid(),
        message: `Receipt generated for ${receipt.residentName}`,
        date: new Date().toISOString(),
        read: false,
        type: 'receipt'
      },
      ...s.notifications]

    }));
    return receipt;
  }, []);
  const markAttendance: DataCtx['markAttendance'] = useCallback(
    (residentId, residentName, date, status) => {
      let result: {
        ok: boolean;
        error?: string;
      } = {
        ok: true
      };
      setState((s) => {
        const exists = s.attendance.find(
          (a) => a.residentId === residentId && a.date === date
        );
        if (exists) {
          result = {
            ok: false,
            error: 'Attendance already marked and locked for this day'
          };
          return s;
        }
        const rec: AttendanceRecord = {
          id: uid(),
          residentId,
          residentName,
          date,
          status,
          lockedAt: new Date().toISOString()
        };
        return {
          ...s,
          attendance: [rec, ...s.attendance]
        };
      });
      return result;
    },
    []
  );
  const markAllRead: DataCtx['markAllRead'] = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({
        ...n,
        read: true
      }))
    }));
  }, []);
  const updateSettings: DataCtx['updateSettings'] = useCallback((patch) => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        ...patch
      }
    }));
  }, []);
  const value = useMemo<DataCtx>(
    () => ({
      ...state,
      addResident,
      updateResident,
      deleteResident,
      markLeft,
      addFloor,
      updateFloor,
      deleteFloor,
      addRoom,
      updateRoom,
      deleteRoom,
      assignRoom,
      upsertFee,
      recordPayment,
      generateReceipt,
      markAttendance,
      pushNotification,
      markAllRead,
      updateSettings,
      roomOccupancy,
      feeFor
    }),
    [
    state,
    addResident,
    updateResident,
    deleteResident,
    markLeft,
    addFloor,
    updateFloor,
    deleteFloor,
    addRoom,
    updateRoom,
    deleteRoom,
    assignRoom,
    upsertFee,
    recordPayment,
    generateReceipt,
    markAttendance,
    pushNotification,
    markAllRead,
    updateSettings,
    roomOccupancy,
    feeFor]

  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useData() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useData must be used within DataProvider');
  return c;
}