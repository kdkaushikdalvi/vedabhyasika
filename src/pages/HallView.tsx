import { useState } from "react";
import { useParams } from "react-router-dom";
import { DeskGrid } from "@/components/DeskGrid";
import { AdmissionForm } from "@/components/AdmissionForm";
import { StudentDetails } from "@/components/StudentDetails";
import { HALLS, type DeskStatus } from "@/lib/constants";

export default function HallView() {
  const { hallId } = useParams<{ hallId: string }>();
  const hall = HALLS.find((h) => h.id === hallId);

  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState("");

  if (!hall) return <div className="p-4">Hall not found</div>;

  const handleDeskClick = (desk: number, status: DeskStatus, studentId?: string) => {
    setSelectedDesk(desk);
    if (status === "available") {
      setAdmissionOpen(true);
    } else if (studentId) {
      setSelectedStudent(studentId);
      setDetailsOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{hall.name}</h1>
        <p className="text-sm text-muted-foreground">{hall.desks} desks — ₹{hall.fee}/month</p>
      </div>

      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-available" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-occupied" /> Occupied</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-expired" /> Expired</span>
      </div>

      <DeskGrid hallId={hall.id} onDeskClick={handleDeskClick} />

      <AdmissionForm
        open={admissionOpen}
        onClose={() => setAdmissionOpen(false)}
        hallId={hall.id}
        deskNumber={selectedDesk}
      />

      {selectedStudent && (
        <StudentDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          studentId={selectedStudent}
        />
      )}
    </div>
  );
}
