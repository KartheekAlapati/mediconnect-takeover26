import { useState } from "react";
import { fmt, today, DOCTORS } from "../data/mockData";
import { Card, Badge } from "../components/UIComponents";
import { serviceLabel } from "../utils/helpers";

export default function SchedulePage({ appointments }) {
  const [selectedDoc, setSelectedDoc] = useState("ALL");
  const todayStr = fmt(today);
  
  let todayAppts = appointments.filter(a => a.date === todayStr && a.status !== "cancelled");
  if (selectedDoc !== "ALL") {
    todayAppts = todayAppts.filter(a => a.doctorId === selectedDoc);
  }
  todayAppts.sort((a, b) => a.time.localeCompare(b.time));

  // AI No-Show Risk Prediction (Deterministic Mock)
  const getRiskStatus = (appt) => {
    // Basic logic: New patients (no age/history in strict mock) or specific names have higher risk
    const nameLength = (appt.patientName || appt.name || "").length;
    if (nameLength % 4 === 0) return { label: "High Risk", color: "bg-red-100 text-red-700", icon: "🔴" };
    if (nameLength % 3 === 0) return { label: "Medium Risk", color: "bg-amber-100 text-amber-700", icon: "🟡" };
    return { label: "Low Risk", color: "bg-emerald-100 text-emerald-700", icon: "🟢" };
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Live Schedule Board</h1>
          <p className="text-slate-500">{new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
        </div>
        <select value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-700 outline-none shadow-sm">
          <option value="ALL">All Workforce Members</option>
          {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-blue-600 font-medium">{todayAppts.length} appointments scheduled</p>
        <div className="flex gap-3 text-xs text-slate-500">
          <span>AI Risk Prediction:</span>
          <span>🟢 Low</span>
          <span>🟡 Med</span>
          <span>🔴 High</span>
        </div>
      </div>

      {todayAppts.length === 0 && <Card className="p-10 text-center text-slate-400">No appointments scheduled for this selection today.</Card>}
      
      <div className="space-y-3">
        {todayAppts.map(a => {
          const risk = getRiskStatus(a);
          const doc = DOCTORS.find(d => d.id === a.doctorId);
          return (
            <Card key={a.id} className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="w-24 text-center shrink-0">
                <p className="text-blue-600 font-bold text-lg">{a.time.split(" ")[0]}</p>
                <p className="text-xs text-blue-500 font-medium">{a.time.split(" ")[1]}</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 shrink-0"/>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800 text-lg">{a.patientName || a.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${risk.color}`}>
                    {risk.icon} {risk.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-1">{serviceLabel(a.service)} · {doc?.name || "Unassigned"}</p>
                {a.notes && <p className="text-xs text-slate-400 italic block border-l-2 border-slate-200 pl-2">Note: {a.notes}</p>}
              </div>
              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-2 sm:mt-0">
                <Badge status={a.status}/>
                <p className="text-xs text-slate-500 font-medium">Est. ₹{a.price || 300}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}