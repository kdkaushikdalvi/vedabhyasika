import { useState } from "react";
import { useParams } from "react-router-dom";
import { DeskGrid } from "@/components/DeskGrid";
import { AdmissionForm } from "@/components/AdmissionForm";
import { StudentDetails } from "@/components/StudentDetails";
import { HALLS, type DeskStatus } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function HallView() {
  const { hallId } = useParams<{ hallId: string }>();

  // Hall D merged view
  const isHallD = hallId === "hall-d" || hallId === "hall-d-ac";
  const [dMode, setDMode] = useState<"normal" | "ac">(hallId === "hall-d-ac" ? "ac" : "normal");

  const effectiveHallId = isHallD ? (dMode === "ac" ? "hall-d-ac" : "hall-d") : hallId;
  const hall = HALLS.find((h) => h.id === effectiveHallId);

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{isHallD ? "Hall D" : hall.name}</h1>
          <p className="text-sm text-muted-foreground">
            {hall.desks} desks — ₹{hall.fee}/month
          </p>
        </div>

        {isHallD && (
          <ToggleGroup
            type="single"
            value={dMode}
            onValueChange={(v) => v && setDMode(v as "normal" | "ac")}
            className="bg-muted rounded-lg p-0.5"
          >
            <ToggleGroupItem value="normal" className="rounded-md px-4 text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm">
              Normal
            </ToggleGroupItem>
            <ToggleGroupItem value="ac" className="rounded-md px-4 text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm">
              AC
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-green-500" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gray-400" /> Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" /> Expired
        </span>
      </div>

      <DeskGrid hallId={effectiveHallId} onDeskClick={handleDeskClick} />

      <AdmissionForm
        open={admissionOpen}
        onClose={() => setAdmissionOpen(false)}
        hallId={effectiveHallId}
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
