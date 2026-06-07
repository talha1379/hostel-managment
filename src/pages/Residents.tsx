import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react";

import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";

import { ResidentForm } from "../components/residents/ResidentForm";
import { ResidentTable } from "../components/residents/ResidentTable";

import { useData } from "../context/DataContext";
import { useScreenInit } from "../useScreenInit";

import { db } from "../firebase";

import { collection, addDoc } from "firebase/firestore";

export function Residents() {
  useScreenInit("Residents");

  const {
    residents,
    rooms,
    addResident,
    updateResident,
    deleteResident,
    markLeft,
  } = useData();

  const [params] = useSearchParams();

  const [query, setQuery] = useState(params.get("q") || "");

  const [modalOpen, setModalOpen] = useState(false);

  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return residents;

    return residents.filter((r) => {
      const room = rooms.find((rm) => rm.id === r.roomId)?.roomNumber || "";

      return [r.fullName, r.phone, r.cnic, room].some((v) =>
        String(v).toLowerCase().includes(q),
      );
    });
  }, [residents, rooms, query]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setModalOpen(true);
  };

  // FIREBASE SAVE
  const handleSubmit = async (data) => {
    try {
      await addDoc(collection(db, "residents"), data);

      if (editing) {
        updateResident(editing.id, data);
      } else {
        addResident(data);
      }

      setModalOpen(false);

      alert("Resident Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Firebase Error");
    }
  };

  const handleDelete = (r) => {
    if (window.confirm(`Delete ${r.fullName}?`)) {
      deleteResident(r.id);
    }
  };

  const handleLeave = (r) => {
    if (window.confirm(`Mark ${r.fullName} as Left Hostel?`)) {
      markLeft(r.id, new Date().toISOString().slice(0, 10));
    }
  };

  return (
    <div>
      <PageHeader
        title="Resident Management"
        subtitle="Add, edit, search and manage residents"
        action={
          <Button onClick={openAdd}>
            <PlusIcon className="h-4 w-4" />
            Add Resident
          </Button>
        }
      />

      <div className="relative mb-5 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resident..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No residents found"
          description="Add a new resident."
          action={
            <Button onClick={openAdd}>
              <PlusIcon className="h-4 w-4" />
              Add Resident
            </Button>
          }
        />
      ) : (
        <ResidentTable
          residents={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          onLeave={handleLeave}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Resident" : "Add Resident"}
        maxWidth="max-w-2xl"
      >
        <ResidentForm
          initial={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
