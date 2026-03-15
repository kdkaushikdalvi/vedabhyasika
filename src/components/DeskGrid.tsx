import { HALLS, type DeskStatus } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface DeskGridProps {
  hallId: string;
  onDeskClick: (deskNumber: number, status: DeskStatus, studentId?: string) => void;
}

export function DeskGrid({ hallId, onDeskClick }: DeskGridProps) {
  const { allocations, students } = useStore();
  const hall = HALLS.find((h) => h.id === hallId);
  if (!hall) return null;

  const getDeskInfo = (desk: number) => {
    const alloc = allocations.find(
      (a) => a.hall_name === hallId && a.desk_number === desk && a.active
    );
    if (!alloc) return { status: "available" as DeskStatus };

    const student = students.find((s) => s.id === alloc.student_id);
    if (!student || student.status === "inactive")
      return { status: "available" as DeskStatus };

    if (student.status === "expired") {
      return { status: "expired" as DeskStatus, studentId: student.id };
    }

    const now = new Date();
    const endDate = new Date(alloc.end_date);
    if (endDate < now) {
      return { status: "expired" as DeskStatus, studentId: student.id };
    }

    return { status: "occupied" as DeskStatus, studentId: student.id };
  };

  const statusClass: Record<DeskStatus, string> = {
    available: "desk-available",
    occupied: "desk-occupied",
    expired: "desk-expired",
  };

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {Array.from({ length: hall.desks }, (_, i) => i + 1).map((desk) => {
        const { status, studentId } = getDeskInfo(desk);
        return (
          <motion.button
            key={desk}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onDeskClick(desk, status, studentId)}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium shadow-sm transition-colors relative ${statusClass[status]}`}
          >
            {status === "occupied" && (
              <Check className="absolute top-0.5 right-0.5 h-3 w-3 opacity-60" />
            )}
            {desk}
          </motion.button>
        );
      })}
    </div>
  );
}
