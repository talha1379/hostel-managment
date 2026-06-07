import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PhoneIcon, MapPinIcon, UserIcon } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useData } from "../context/DataContext";
import { useScreenInit } from "../useScreenInit";
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value || "—"}
      </p>
    </div>
  );
}
export function ResidentDetails() {
  useScreenInit("Resident Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const { residents, rooms, floors, fees } = useData();
  const resident = residents.find((r) => r.id === id);
  if (!resident) {
    return (
      <div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
        <p className="mt-6 text-slate-500">Resident not found.</p>
      </div>
    );
  }
  const room = rooms.find((r) => r.id === resident.roomId);
  const floor = floors.find((f) => f.id === room?.floorId);
  const residentFees = fees.filter((f) => f.residentId === resident.id);
  return (
    <div>
      <PageHeader
        title={`${resident.gender}. ${resident.fullName}`}
        subtitle={resident.instituteName || resident.occupation}
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Details
            </h3>
            <Badge
              tone={resident.status === "Active" ? "green" : "red"}
              className="ml-auto"
            >
              {resident.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <Field label="Father Name" value={resident.fatherName} />
            <Field label="Gender" value={resident.gender} />
            <Field label="Phone" value={resident.phone} />
            <Field label="CNIC" value={resident.cnic} />
            <Field label="Occupation" value={resident.occupation} />
            <Field label="Student Type" value={resident.studentType} />
            <Field label="Institute" value={resident.instituteName} />
            <Field label="Joining Date" value={resident.joiningDate} />
            <Field label="Leaving Date" value={resident.leavingDate} />
            <Field label="Guardian" value={resident.guardianName} />
            <Field label="Guardian Phone" value={resident.guardianPhone} />
            <Field label="Emergency" value={resident.emergencyContact} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 dark:border-slate-700/50">
            <Field
              label="Address"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  {resident.address}
                </span>
              }
            />

            <Field label="Notes" value={resident.notes} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
              Room
            </h3>
            {room ? (
              <div className="space-y-2">
                <Field label="Room Number" value={room.roomNumber} />
                <Field label="Floor" value={floor?.name} />
              </div>
            ) : (
              <p className="text-sm text-slate-400">No room assigned</p>
            )}
          </Card>
          <Card className="p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
              Fee Records
            </h3>
            {residentFees.length === 0 ? (
              <p className="text-sm text-slate-400">No fee records</p>
            ) : (
              <div className="space-y-3">
                {residentFees.map((f) => {
                  const paid = f.payments.reduce((s, p) => s + p.amount, 0);
                  return (
                    <div
                      key={f.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/40"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {f.month}
                      </span>
                      <Badge tone={paid >= f.totalFee ? "green" : "yellow"}>
                        {paid >= f.totalFee
                          ? "Paid"
                          : `Due ${f.totalFee - paid}`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
