import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { HALLS, getWhatsAppReminderUrl } from "@/lib/constants";
import { MessageSquare, UserMinus, RefreshCw, X, Calendar, Phone, MapPin, Hash, User } from "lucide-react";

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

  const startDate = alloc ? new Date(alloc.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const endDate = alloc ? new Date(alloc.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className={`px-6 pt-6 pb-4 ${isExpired ? "bg-destructive/5" : "bg-primary/5"}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{student.full_name}</DialogTitle>
              </DialogHeader>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isExpired 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-success/10 text-success"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isExpired ? "bg-destructive" : "bg-success"}`} />
                {isExpired ? "Expired" : "Active"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info rows */}
        <div className="px-6 py-4 space-y-3">
          <InfoRow icon={Phone} label="Mobile" value={student.mobile_number} />
          <InfoRow icon={MapPin} label="Hall" value={hall?.name || "—"} />
          <InfoRow icon={Hash} label="Desk" value={String(alloc?.desk_number || "—")} />

          {/* Dates - prominent */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-muted/60 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                <Calendar className="h-3 w-3" /> Start
              </div>
              <p className="text-sm font-bold">{startDate}</p>
            </div>
            <div className={`rounded-xl p-3 space-y-1 ${isExpired ? "bg-destructive/8 ring-1 ring-destructive/20" : "bg-muted/60"}`}>
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                <Calendar className="h-3 w-3" /> Expiry
              </div>
              <p className={`text-sm font-bold ${isExpired ? "text-destructive" : ""}`}>{endDate}</p>
            </div>
          </div>
        </div>

        {/* Actions - left aligned */}
        <div className="px-6 pb-6 flex flex-wrap gap-2">
          {isExpired && (
            <Button size="sm" onClick={() => { renewStudent(studentId); onClose(); }} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Renew
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-whatsapp text-whatsapp hover:bg-whatsapp/10"
            asChild
          >
            <a href={getWhatsAppReminderUrl(student.mobile_number)} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4" /> Remind
            </a>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={() => { markStudentLeft(studentId); onClose(); }}
          >
            <UserMinus className="h-4 w-4" /> Remove Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
