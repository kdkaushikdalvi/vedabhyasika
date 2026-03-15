import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { HALLS, getWhatsAppReminderUrl } from "@/lib/constants";
import { MessageSquare, UserMinus, RefreshCw } from "lucide-react";

interface StudentDetailsProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
}

export function StudentDetails({ open, onClose, studentId }: StudentDetailsProps) {
  const { students, allocations, markStudentLeft, renewStudent } = useStore();
  const student = students.find((s) => s.id === studentId);
  const alloc = allocations.find((a) => a.student_id === studentId && a.active);
  const hall = HALLS.find((h) => h.id === alloc?.hall_name);

  if (!student) return null;

  const isExpired = student.status === "expired" || (alloc && new Date(alloc.end_date) < new Date());

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{student.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mobile</span>
            <span>{student.mobile_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hall</span>
            <span>{hall?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Desk</span>
            <span>{alloc?.desk_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Date</span>
            <span>{alloc ? new Date(alloc.start_date).toLocaleDateString("en-IN") : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expiry Date</span>
            <span>{alloc ? new Date(alloc.end_date).toLocaleDateString("en-IN") : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium capitalize ${isExpired ? "text-destructive" : "text-success"}`}>
              {isExpired ? "Expired" : student.status}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {isExpired && (
            <Button onClick={() => { renewStudent(studentId); onClose(); }} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" /> Renew Admission
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full gap-2 border-[hsl(142,70%,49%)] text-[hsl(142,70%,49%)] hover:bg-[hsl(142,70%,49%)]/10"
            asChild
          >
            <a href={getWhatsAppReminderUrl(student.mobile_number)} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4" /> Send Reminder
            </a>
          </Button>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => { markStudentLeft(studentId); onClose(); }}
          >
            <UserMinus className="h-4 w-4" /> Mark Student Left
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
