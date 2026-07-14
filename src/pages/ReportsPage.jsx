import { SERVICES, DOCTORS, MAX_SLOTS_PER_DOCTOR } from "../data/mockData";
import { Card, StatCard } from "../components/UIComponents";

export default function ReportsPage({ appointments }) {
  const byService = SERVICES.map(s => ({ label: s.label, count: appointments.filter(a => a.service === s.id).length })).sort((a, b) => b.count - a.count);
  const maxService = Math.max(...byService.map(s => s.count), 1);
  
  const last7Days = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i));
    return d;
  });
  const weeks = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));
  const weekData = last7Days.map(d => {
    const dStr = d.toISOString().split('T')[0];
    return appointments.filter(a => a.date === dStr && a.status !== 'cancelled').length;
  });

  const SERVICE_PRICES = {
    general: 500,
    dental: 800,
    child: 600,
    skin: 900,
    ent: 700,
    other: 500
  };

  // Workforce Utilization Analytics
  const workforceData = DOCTORS.map((doc) => {
  const docAppts = appointments.filter(
    (a) =>
      a.doctorId === doc.id &&
      a.status !== "cancelled"
  ).length;

  return {
    name: doc.name,
    appointments: docAppts,
    utilization: Math.round(
      (docAppts / MAX_SLOTS_PER_DOCTOR) * 100
    ),
  };
});
const confirmed = appointments.filter(
  a => a.status === "confirmed"
).length;

const completed = appointments.filter(
  a => a.status === "completed"
).length;

const waitlist = appointments.filter(
  a => a.status === "waitlist"
).length;

const estimatedRevenue = appointments
  .filter(a => a.status !== "cancelled")
  .reduce(
    (sum, a) => sum + (a.price || SERVICE_PRICES[a.service] || 500),
    0
  );
  const utilization = Math.round(
  (appointments.filter(a => a.status !== "cancelled").length /
    (DOCTORS.length * MAX_SLOTS_PER_DOCTOR)) * 100
);
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Resource & Capacity Analytics</h1>
      <p className="text-slate-600 mb-8">Data-driven insights for workforce optimization</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
  icon="📊"
  label="Revenue"
  value={`₹${estimatedRevenue}`}
/>
<StatCard
  icon="✅"
  label="Completed"
  value={completed}
  color="emerald"
/>

<StatCard
  icon="⏳"
  label="Waitlist"
  value={waitlist}
  color="amber"
/>
        <StatCard icon="📅" label="Total Bookings" value={appointments.length} color="blue"/>
        <StatCard
  icon="✔️"
  label="Confirmed"
  value={confirmed}
  color="violet"
/>

<StatCard
  icon="⚡"
  label="Utilization"
  value={`${utilization}%`}
  color="amber"
/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Workforce Load Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Percentage of total capacity utilized per doctor.</p>
          <div className="space-y-4">
            {workforceData.map(w => (
              <div key={w.name}>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600 font-medium">{w.name}</span><span className="font-bold text-slate-800">{w.utilization}%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full ${w.utilization > 85 ? 'bg-red-500' : w.utilization > 50 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(w.utilization, 100)}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Weekly Appointment Volume</h3>
          <p className="text-xs text-slate-500 mb-4">Identifying peak demand days for workforce allocation.</p>
          <div className="flex items-end gap-2 h-36">
            {weeks.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500 font-bold">{weekData[i]}</span>
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(weekData[i] / 30) * 100}%` }}/>
                <span className="text-xs text-slate-400">{d}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Service Demand</h3>
          <div className="space-y-3">
            {byService.map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{s.label}</span><span className="font-medium text-slate-800">{s.count}</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${(s.count / maxService) * 100}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 text-white">
          <h3 className="font-bold text-white mb-2">Automated Rules Engine</h3>
          <p className="text-sm text-slate-300 mb-4">Current optimization policies active on the platform:</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> <span><strong>Dynamic Pricing:</strong> +15% surge enabled for PM slots.</span></li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> <span><strong>Dynamic Pricing:</strong> +₹50 premium active for weekends.</span></li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> <span><strong>Auto-Notify:</strong> WhatsApp reminders dispatched 24h prior.</span></li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> <span><strong>Pending Confirmation:</strong> Tracking unconfirmed patients on schedule view.</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}