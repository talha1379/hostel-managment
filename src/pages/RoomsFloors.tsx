import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2Icon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  LayersIcon,
  DoorOpenIcon } from
'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../context/DataContext';
import { Floor, Room } from '../lib/types';
import { useScreenInit } from '../useScreenInit';
export function RoomsFloors() {
  useScreenInit('Rooms & Floors');
  const {
    floors,
    rooms,
    roomOccupancy,
    addFloor,
    updateFloor,
    deleteFloor,
    addRoom,
    updateRoom,
    deleteRoom
  } = useData();
  const [floorModal, setFloorModal] = useState<Floor | 'new' | null>(null);
  const [roomModal, setRoomModal] = useState<Room | 'new' | null>(null);
  const [floorForm, setFloorForm] = useState({
    floorNumber: '',
    name: ''
  });
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    floorId: '',
    totalSeats: 2
  });
  const openFloor = (f?: Floor) => {
    if (f) {
      setFloorForm({
        floorNumber: f.floorNumber,
        name: f.name
      });
      setFloorModal(f);
    } else {
      setFloorForm({
        floorNumber: '',
        name: ''
      });
      setFloorModal('new');
    }
  };
  const saveFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (floorModal === 'new') addFloor(floorForm);else
    if (floorModal) updateFloor(floorModal.id, floorForm);
    setFloorModal(null);
  };
  const openRoom = (r?: Room) => {
    if (r) {
      setRoomForm({
        roomNumber: r.roomNumber,
        floorId: r.floorId,
        totalSeats: r.totalSeats
      });
      setRoomModal(r);
    } else {
      setRoomForm({
        roomNumber: '',
        floorId: floors[0]?.id ?? '',
        totalSeats: 2
      });
      setRoomModal('new');
    }
  };
  const saveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.floorId) return;
    if (roomModal === 'new')
    addRoom({
      ...roomForm,
      totalSeats: Number(roomForm.totalSeats)
    });else
    if (roomModal)
    updateRoom(roomModal.id, {
      ...roomForm,
      totalSeats: Number(roomForm.totalSeats)
    });
    setRoomModal(null);
  };
  return (
    <div>
      <PageHeader
        title="Rooms & Floors"
        subtitle="Manage floors, rooms and seat capacity"
        action={
        <>
            <Button variant="outline" onClick={() => openFloor()}>
              <LayersIcon className="h-4 w-4" /> Add Floor
            </Button>
            <Button onClick={() => openRoom()} disabled={floors.length === 0}>
              <PlusIcon className="h-4 w-4" /> Add Room
            </Button>
          </>
        } />
      

      {floors.length === 0 ?
      <EmptyState
        icon={Building2Icon}
        title="No floors yet"
        description="Add a floor first, then add rooms to it."
        action={
        <Button onClick={() => openFloor()}>
              <LayersIcon className="h-4 w-4" /> Add Floor
            </Button>
        } /> :


      <div className="space-y-6">
          {floors.map((floor) => {
          const floorRooms = rooms.filter((r) => r.floorId === floor.id);
          return (
            <div key={floor.id}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    <LayersIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {floor.name}
                  </h3>
                  <Badge tone="slate">Floor {floor.floorNumber}</Badge>
                  <div className="ml-auto flex gap-1">
                    <button
                    onClick={() => openFloor(floor)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10">
                    
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                    onClick={() => {
                      if (
                      window.confirm('Delete this floor and all its rooms?'))

                      deleteFloor(floor.id);
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                    
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {floorRooms.length === 0 ?
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700">
                    No rooms on this floor
                  </p> :

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {floorRooms.map((room, i) => {
                  const occ = roomOccupancy(room.id);
                  const full = occ.empty <= 0;
                  return (
                    <motion.div
                      key={room.id}
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        delay: i * 0.04
                      }}>
                      
                          <Card interactive className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <DoorOpenIcon className="h-5 w-5 text-brand-600" />
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                  Room {room.roomNumber}
                                </span>
                              </div>
                              <Badge tone={full ? 'red' : 'green'}>
                                {full ? 'Full' : `${occ.empty} free`}
                              </Badge>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {occ.total}
                                </p>
                                <p className="text-xs text-slate-400">Total</p>
                              </div>
                              <div>
                                <p className="font-bold text-brand-600">
                                  {occ.occupied}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Occupied
                                </p>
                              </div>
                              <div>
                                <p className="font-bold text-emerald-600">
                                  {occ.empty}
                                </p>
                                <p className="text-xs text-slate-400">Empty</p>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => openRoom(room)}>
                            
                                <PencilIcon className="h-3.5 w-3.5" /> Edit
                              </Button>
                              <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (window.confirm('Delete this room?'))
                              deleteRoom(room.id);
                            }}>
                            
                                <Trash2Icon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>);

                })}
                  </div>
              }
              </div>);

        })}
        </div>
      }

      <Modal
        open={!!floorModal}
        onClose={() => setFloorModal(null)}
        title={floorModal === 'new' ? 'Add Floor' : 'Edit Floor'}>
        
        <form onSubmit={saveFloor} className="space-y-4">
          <Input
            label="Floor Number"
            value={floorForm.floorNumber}
            onChange={(e) =>
            setFloorForm((f) => ({
              ...f,
              floorNumber: e.target.value
            }))
            }
            placeholder="e.g. 1" />
          
          <Input
            label="Floor Name"
            value={floorForm.name}
            onChange={(e) =>
            setFloorForm((f) => ({
              ...f,
              name: e.target.value
            }))
            }
            placeholder="e.g. Ground Floor" />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFloorModal(null)}>
              
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!roomModal}
        onClose={() => setRoomModal(null)}
        title={roomModal === 'new' ? 'Add Room' : 'Edit Room'}>
        
        <form onSubmit={saveRoom} className="space-y-4">
          <Input
            label="Room Number"
            value={roomForm.roomNumber}
            onChange={(e) =>
            setRoomForm((r) => ({
              ...r,
              roomNumber: e.target.value
            }))
            }
            placeholder="e.g. 101" />
          
          <Select
            label="Floor"
            value={roomForm.floorId}
            onChange={(e) =>
            setRoomForm((r) => ({
              ...r,
              floorId: e.target.value
            }))
            }>
            
            {floors.map((f) =>
            <option key={f.id} value={f.id}>
                {f.name}
              </option>
            )}
          </Select>
          <Input
            label="Total Seats"
            type="number"
            min={1}
            value={roomForm.totalSeats}
            onChange={(e) =>
            setRoomForm((r) => ({
              ...r,
              totalSeats: Number(e.target.value)
            }))
            } />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRoomModal(null)}>
              
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>);

}