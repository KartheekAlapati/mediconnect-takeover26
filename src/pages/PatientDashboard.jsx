import { useState } from "react";
import { Card, Badge, Modal } from "../components/UIComponents";
import { TIME_SLOTS, fmt, today } from "../data/mockData";
import { serviceLabel } from "../utils/helpers";

import { supabase } from "../utils/supabase";

export default function PatientDashboard({ appointments, setAppointments }) {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [reschedule, setReschedule] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const myAppts = searched ? appointments.filter(a => a.phone === phone) : [];

  const cancel = async (id) => {
    try {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? {...a, status: "cancelled"} : a));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment. Please check your connection.");
    }
  };
  
  const doReschedule = async () => {
    if (!newDate || !newTime) return;
    try {
      const { error } = await supabase.from("appointments").update({ date: newDate, time: newTime, status: "pending" }).eq("id", reschedule);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === reschedule ? {...a, date: newDate, time: newTime, status: "pending"} : a));
      setReschedule(null); setNewDate(""); setNewTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule appointment. Please check your connection.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">My Appointments</h1>
      <p className="text-slate-600 mb-8">Enter your registered phone number to view your appointments.</p>
      <Card className="p-5 flex gap-3 mb-8">
        <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="10-digit mobile number" placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value)} />
        <button disabled={!phone.trim()} onClick={() => setSearched(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm">Find</button>
      </Card>
      {searched && myAppts.length === 0 && <p className="text-slate-400 text-center py-10">No appointments found for this number.</p>}
      {myAppts.map(a => (
        <Card key={a.id} className="p-5 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-slate-800">{a.id}</p>
              <p className="text-sm text-slate-500">{serviceLabel(a.service)}</p>
            </div>
            <Badge status={a.status} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-4">
            <span>📅 {a.date}</span><span>🕐 {a.time}</span>
            <span>👤 {a.name || a.patientName}</span><span>📞 {a.phone}</span>
          </div>
          {a.notes && <p className="text-xs text-slate-400 mb-3 italic">"{a.notes}"</p>}
          {a.status !== "cancelled" && a.status !== "completed" && (
            <div className="flex gap-3">
              <button onClick={() => { setReschedule(a.id); setNewDate(a.date); setNewTime(a.time); }} className="text-blue-600 text-sm font-medium hover:underline">Reschedule</button>
              <button onClick={() => cancel(a.id)} className="text-red-500 text-sm font-medium hover:underline">Cancel</button>
            </div>
          )}
        </Card>
      ))}
      <Modal open={!!reschedule} onClose={() => setReschedule(null)} title="Reschedule Appointment">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">New Date</label>
            <input type="date" min={fmt(today)} value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">New Time</label>
            <select value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={doReschedule} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition text-sm">Confirm Reschedule</button>
        </div>
      </Modal>
    </div>
  );
}