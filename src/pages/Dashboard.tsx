import { HALLS } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { Users, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { students, allocations } = useStore();
  const navigate = useNavigate();

  const getHallStats = (hallId: string) => {
    const hall = HALLS.find((h) => h.id === hallId)!;
    const hallAllocs = allocations.filter((a) => a.hall_name === hallId && a.active);
    const activeStudents = hallAllocs.filter((a) => {
      const s = students.find((st) => st.id === a.student_id);
      return s && s.status !== "inactive";
    });
    const expired = activeStudents.filter((a) => {
      const s = students.find((st) => st.id === a.student_id);
      return s?.status === "expired" || new Date(a.end_date) < new Date();
    });
    const occupied = activeStudents.length - expired.length;
    const available = hall.desks - activeStudents.length;

    return { total: hall.desks, occupied, expired: expired.length, available };
  };

  const totals = HALLS.reduce(
    (acc, hall) => {
      const stats = getHallStats(hall.id);
      acc.total += stats.total;
      acc.occupied += stats.occupied;
      acc.expired += stats.expired;
      acc.available += stats.available;
      return acc;
    },
    { total: 0, occupied: 0, expired: 0, available: 0 }
  );

  const totalStudents = students.filter((s) => s.status !== "inactive").length;

  const summaryCards = [
    { title: "Total Students", value: totalStudents, icon: Users, color: "text-primary" },
    { title: "Available Desks", value: totals.available, icon: CheckCircle, color: "text-success" },
    { title: "Occupied Desks", value: totals.occupied, icon: Clock, color: "text-muted-foreground" },
    { title: "Expired Seats", value: totals.expired, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">वेद अभ्यासिका — Overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{card.title}</span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Hall Occupancy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HALLS.map((hall) => {
            const stats = getHallStats(hall.id);
            const pct = Math.round(((stats.total - stats.available) / stats.total) * 100);
            return (
              <motion.div
                key={hall.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/hall/${hall.id}`)}
                className="bg-card rounded-lg border p-4 shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{hall.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {stats.total - stats.available} / {stats.total}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-success" /> {stats.available} available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" /> {stats.occupied} occupied
                  </span>
                  {stats.expired > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-destructive" /> {stats.expired} expired
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-available" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-occupied" /> Occupied</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded desk-expired" /> Expired</span>
      </div>
    </div>
  );
}
