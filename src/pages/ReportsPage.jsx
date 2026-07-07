import { SERVICES, DOCTORS, MAX_SLOTS_PER_DOCTOR } from "../data/mockData";
import { Card, StatCard } from "../components/UIComponents";

export default function ReportsPage({ appointments }) {
  const byService = SERVICES.map(s => ({ label: s.label, count: appointments.filter(a => a.service === s.id).length })).sort((a, b) => b.count - a.count);
  const maxService = Math.max(...byService.map(s => s.count), 1);
  const weeks = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekData = [12, 18, 14, 22, 19, 25];

  // Workforce Utilization Analytics
  const workforceData = DOCTORS.map(doc => {
    const docAppts = appointments.filter(a => a.doctorId === doc.id).length;
    const maxPossible = MAX_SLOTS_PER_DOCTOR * 7; // Weekly simulation
    return { name: doc.name, utilization: Math.round((docAppts / (maxPossible * 0.3)) * 100) || Math.floor(Math.random() * 40 + 40) }; // Fallback randomizer for demo visual
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Resource & Capacity Analytics</h1>
      <p className="text-slate-500 mb-8">Data-driven insights for workforce optimization</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📊" label="Total Revenue (Est)" value="₹24,500" color="emerald"/>
        <StatCard icon="📅" label="Total Bookings" value={appointments.length} color="blue"/>
        <StatCard icon="🧑‍⚕️" label="Active Workforce" value={DOCTORS.length} color="violet"/>
        <StatCard icon="⚡" label="Platform Utilization" value="68%" color="amber"/>
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
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> <span><strong>No-Show AI:</strong> Identifying high-risk patients on schedule view.</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}