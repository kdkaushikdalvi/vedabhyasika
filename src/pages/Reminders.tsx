import { useStore } from "@/lib/store";
import { HALLS, getWhatsAppReminderUrl } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bell } from "lucide-react";

export default function Reminders() {
  const { students, allocations } = useStore();

  const expiringSoon = students
    .filter((s) => s.status === "active" || s.status === "expired")
    .map((s) => {
      const alloc = allocations.find((a) => a.student_id === s.id && a.active);
      const hall = HALLS.find((h) => h.id === alloc?.hall_name);
      const endDate = alloc ? new Date(alloc.end_date) : null;
      const now = new Date();
      const daysLeft = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      return { ...s, alloc, hallName: hall?.name ?? "—", endDate, daysLeft };
    })
    .filter((s) => s.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Student Reminders</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Students expiring within 7 days or already expired
      </p>

      <div className="space-y-2">
        {expiringSoon.map((s) => (
          <div
            key={s.id}
            className="bg-card border rounded-lg p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{s.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {s.hallName} — Desk {s.alloc?.desk_number} — Exp{" "}
                {s.endDate?.toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.daysLeft <= 0 ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                {s.daysLeft <= 0 ? "Expired" : `${s.daysLeft}d left`}
              </span>
              <Button size="sm" variant="outline" className="gap-1 border-success/30 text-success hover:bg-success/10" asChild>
                <a href={getWhatsAppReminderUrl(s.mobile_number)} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-3.5 w-3.5" /> Send
                </a>
              </Button>
            </div>
          </div>
        ))}
        {expiringSoon.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No expiring students 🎉</p>
        )}
      </div>
    </div>
  );
}
