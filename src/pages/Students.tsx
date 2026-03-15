import { useState } from "react";
import { useStore } from "@/lib/store";
import { HALLS, getWhatsAppReminderUrl } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentDetails } from "@/components/StudentDetails";
import { Search, MessageSquare } from "lucide-react";

export default function Students() {
  const { students, allocations } = useStore();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const enriched = students
    .filter((s) => s.status !== "inactive")
    .map((s) => {
      const alloc = allocations.find((a) => a.student_id === s.id && a.active);
      const hall = HALLS.find((h) => h.id === alloc?.hall_name);
      return { ...s, alloc, hallName: hall?.name ?? "—" };
    })
    .filter(
      (s) =>
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.mobile_number.includes(search)
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Students</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or mobile..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Mobile</th>
              <th className="text-left p-3 font-medium">Hall</th>
              <th className="text-left p-3 font-medium">Desk</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Expiry</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((s) => {
              const isExpired = s.status === "expired" || (s.alloc && new Date(s.alloc.end_date) < new Date());
              return (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-secondary/30 cursor-pointer"
                  onClick={() => setSelectedStudent(s.id)}
                >
                  <td className="p-3 font-medium">{s.full_name}</td>
                  <td className="p-3 hidden sm:table-cell">{s.mobile_number}</td>
                  <td className="p-3">{s.hallName}</td>
                  <td className="p-3">{s.alloc?.desk_number ?? "—"}</td>
                  <td className="p-3 hidden md:table-cell">
                    {s.alloc ? new Date(s.alloc.end_date).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isExpired ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" asChild>
                      <a href={getWhatsAppReminderUrl(s.mobile_number)} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="h-4 w-4 text-success" />
                      </a>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {enriched.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No students found</p>
        )}
      </div>

      {selectedStudent && (
        <StudentDetails
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          studentId={selectedStudent}
        />
      )}
    </div>
  );
}
