import { useState } from "react";
import { fmt, today, DOCTORS, MAX_SLOTS_PER_DOCTOR } from "../data/mockData";
import { Card, StatCard, Badge } from "../components/UIComponents";
import { serviceLabel } from "../utils/helpers";

export default function DoctorDashboard({ appointments, setAppointments, patients, navigate }) {
  const [filterDoc, setFilterDoc] = useState("ALL");
  const [simulating, setSimulating] = useState(false);
  const [simulatedCount, setSimulatedCount] = useState(null);

  const filteredAppts = filterDoc === "ALL" ? appointments : appointments.filter(a => a.doctorId === filterDoc);
  
  const todayStr = fmt(today);
  const todayAppts = filteredAppts.filter(a => a.date === todayStr);
  const upcoming = filteredAppts.filter(a => a.date > todayStr && a.status !== "cancelled");
  const completed = filteredAppts.filter(a => a.status === "completed");

  const updateStatus = (id, status) => setAppointments(prev => prev.map(a => a.id === id ? {...a, status} : a));

  // Capacity Calculation
  const activeDoctorsCount = filterDoc === "ALL" ? DOCTORS.length : 1;
  const totalDailyCapacity = activeDoctorsCount * MAX_SLOTS_PER_DOCTOR;
  const capacityPercent = Math.round((todayAppts.length / totalDailyCapacity) * 100) || 0;

  // Automated Notification Simulator
  const runNotificationSimulator = () => {
    setSimulating(true);
    setSimulatedCount(null);
    setTimeout(() => {
      setSimulating(false);
      setSimulatedCount(upcoming.length || 12); 
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clinic Administration</h1>
          <p className="text-slate-500 text-sm">Intelligent Workforce Overview · {new Date().toLocaleDateString("en-IN")}</p>
        </div>
        <div className="flex gap-2">
          <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white font-medium text-slate-700 outline-none">
            <option value="ALL">All Doctors (Clinic View)</option>
            {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button onClick={() => navigate("schedule")} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-100 transition">Schedules</button>
          <button onClick={() => navigate("reports")} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-100 transition">Reports</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="📅" label="Today's Bookings" value={todayAppts.length} color="blue"/>
          <StatCard icon="🗓️" label="Upcoming" value={upcoming.length} color="violet"/>
          <StatCard icon="👥" label="Total Patients" value={patients.length} color="emerald"/>
          <StatCard icon="✅" label="Completed" value={completed.length} color="amber"/>
        </div>
        <Card className="p-5 flex flex-col justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Daily Capacity Utilization</p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{capacityPercent}%</span>
            <span className="text-sm text-slate-400">{todayAppts.length} / {totalDailyCapacity} slots</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full ${capacityPercent > 80 ? 'bg-red-500' : capacityPercent > 50 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${capacityPercent}%` }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="font-bold text-slate-800 mb-4">Appointment Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pr-4">ID</th><th className="pb-3 pr-4">Patient</th><th className="pb-3 pr-4">Doctor</th>
                    <th className="pb-3 pr-4">Date/Time</th><th className="pb-3 pr-4">Fee</th>
                    <th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppts.slice(0, 8).map(a => (
                    <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 pr-4 text-blue-600 font-medium">{a.id}</td>
                      <td className="py-3 pr-4 font-medium text-slate-800">{a.patientName || a.name}</td>
                      <td className="py-3 pr-4 text-slate-600 text-xs">{DOCTORS.find(d => d.id === a.doctorId)?.name || "—"}</td>
                      <td className="py-3 pr-4 text-slate-600">{a.date.split("-").slice(1).join("/")} · {a.time}</td>
                      <td className="py-3 pr-4 text-slate-600">₹{a.price || 300}</td>
                      <td className="py-3 pr-4"><Badge status={a.status}/></td>
                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">
                          {a.status === "pending" && <button onClick={() => updateStatus(a.id, "confirmed")} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-200">Confirm</button>}
                          {a.status !== "completed" && a.status !== "cancelled" && <button onClick={() => updateStatus(a.id, "completed")} className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-200">Done</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-bold text-slate-800 mb-2">Automated Notifications</h2>
            <p className="text-xs text-slate-500 mb-4">Run batch WhatsApp processing to minimize no-shows.</p>
            {simulatedCount !== null ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium border border-emerald-100 text-center">
                ✅ {simulatedCount} WhatsApp Reminders dispatched successfully for upcoming appointments.
              </div>
            ) : (
              <button 
                onClick={runNotificationSimulator} 
                disabled={simulating}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {simulating ? "🔄 Processing Batch API..." : "🚀 Send Tomorrow's Reminders"}
              </button>
            )}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Recent Dispatches</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-600">Today, 08:00 AM</span><span className="text-emerald-600 font-medium">18 Sent</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Yesterday, 08:00 AM</span><span className="text-emerald-600 font-medium">14 Sent</span></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}