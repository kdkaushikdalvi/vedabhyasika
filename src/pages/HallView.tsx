import { useState } from "react";
import { useParams } from "react-router-dom";
import { DeskGrid } from "@/components/DeskGrid";
import { AdmissionForm } from "@/components/AdmissionForm";
import { StudentDetails } from "@/components/StudentDetails";
import { HALLS, type DeskStatus } from "@/lib/constants";

export default function HallView() {
  const { hallId } = useParams<{ hallId: string }>();

  // Hall D merged view
  const isHallD = hallId === "hall-d" || hallId === "hall-d-ac";
  const [dMode, setDMode] = useState<"normal" | "ac">(hallId === "hall-d-ac" ? "ac" : "normal");

  // Hall B merged view
  const isHallB = hallId === "hall-b" || hallId === "hall-b-reserve";
  const [bMode, setBMode] = useState<"normal" | "reserve">(hallId === "hall-b-reserve" ? "reserve" : "normal");

  const effectiveHallId = isHallD
    ? dMode === "ac" ? "hall-d-ac" : "hall-d"
    : isHallB
      ? bMode === "reserve" ? "hall-b-reserve" : "hall-b"
      : hallId;

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

  const hasToggle = isHallD || isHallB;
  const toggleOptions = isHallD
    ? [
        { value: "normal", label: "Normal", icon: "🪑" },
        { value: "ac", label: "AC", icon: "❄️" },
      ]
    : [
        { value: "normal", label: "Normal", icon: "🪑" },
        { value: "reserve", label: "Reserve", icon: "🔒" },
      ];
  const activeToggle = isHallD ? dMode : bMode;
  const setToggle = isHallD
    ? (v: string) => setDMode(v as "normal" | "ac")
    : (v: string) => setBMode(v as "normal" | "reserve");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {isHallD ? "Hall D" : isHallB ? "Hall B" : hall.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {hall.desks} desks — ₹{hall.fee}/month
          </p>
        </div>

        {hasToggle && (
          <div className="flex rounded-xl bg-muted/80 p-1 shadow-inner">
            {toggleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setToggle(opt.value)}
                className={`
                  relative flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200
                  ${activeToggle === opt.value
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
              >
                <span className="text-base">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
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
