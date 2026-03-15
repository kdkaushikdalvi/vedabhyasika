import { useStore } from "@/lib/store";
import { HALLS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Reports() {
  const { students, allocations } = useStore();

  const exportCSV = (type: "active" | "expired" | "all") => {
    let data = students.filter((s) => s.status !== "inactive");
    if (type === "active") data = data.filter((s) => s.status === "active");
    if (type === "expired") data = data.filter((s) => s.status === "expired");

    const rows = data.map((s) => {
      const alloc = allocations.find((a) => a.student_id === s.id && a.active);
      const hall = HALLS.find((h) => h.id === alloc?.hall_name);
      return [
        s.full_name,
        s.mobile_number,
        hall?.name ?? "",
        alloc?.desk_number ?? "",
        alloc ? new Date(alloc.start_date).toLocaleDateString("en-IN") : "",
        alloc ? new Date(alloc.end_date).toLocaleDateString("en-IN") : "",
        s.status,
      ].join(",");
    });

    const csv = ["Name,Mobile,Hall,Desk,Start,Expiry,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCount = students.filter((s) => s.status === "active").length;
  const expiredCount = students.filter((s) => s.status === "expired").length;

  // Seat utilization
  const totalDesks = HALLS.reduce((s, h) => s + h.desks, 0);
  const usedDesks = allocations.filter((a) => {
    const s = students.find((st) => st.id === a.student_id);
    return a.active && s && s.status !== "inactive";
  }).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Students</p>
          <p className="text-2xl font-bold text-success">{activeCount}</p>
          <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => exportCSV("active")}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Expired Students</p>
          <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
          <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => exportCSV("expired")}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Seat Utilization</p>
          <p className="text-2xl font-bold">{Math.round((usedDesks / totalDesks) * 100)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{usedDesks} / {totalDesks} desks</p>
          <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => exportCSV("all")}>
            <Download className="h-3.5 w-3.5" /> Export All
          </Button>
        </div>
      </div>
    </div>
  );
}
