import { useStore } from "@/lib/store";
import { HALLS } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

export default function Analytics() {
  const { students, allocations } = useStore();

  // Hall occupancy data
  const hallData = HALLS.map((hall) => {
    const active = allocations.filter(
      (a) => a.hall_name === hall.id && a.active
    ).length;
    return { name: hall.name, occupied: active, total: hall.desks, available: hall.desks - active };
  });

  // Revenue data
  const revenueData = HALLS.map((hall) => {
    const active = allocations.filter((a) => a.hall_name === hall.id && a.active).length;
    return { name: hall.name, revenue: active * hall.fee };
  });
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);

  // Monthly mock data
  const monthlyData = [
    { month: "Jan", admissions: 10, students: 120 },
    { month: "Feb", admissions: 15, students: 130 },
    { month: "Mar", admissions: 22, students: 142 },
    { month: "Apr", admissions: 18, students: 150 },
    { month: "May", admissions: 12, students: 155 },
    { month: "Jun", admissions: 8, students: 158 },
  ];

  const purple = "hsl(263, 84%, 58%)";
  const purpleLight = "hsl(263, 84%, 90%)";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: students.filter((s) => s.status !== "inactive").length },
          { label: "Active", value: students.filter((s) => s.status === "active").length },
          { label: "Expired", value: students.filter((s) => s.status === "expired").length },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
        ].map((c) => (
          <div key={c.label} className="bg-card border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-4">Hall Occupancy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="occupied" fill={purple} radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" fill={purpleLight} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-4">Monthly Admissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="admissions" stroke={purple} strokeWidth={2} dot={{ fill: purple }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-4">Revenue by Hall</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Bar dataKey="revenue" fill={purple} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-4">Student Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke={purple} fill={purpleLight} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
