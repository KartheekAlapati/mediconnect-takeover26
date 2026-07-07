import { useState, useEffect } from "react";
import { SERVICES, TIME_SLOTS, fmt, today, DOCTORS } from "../data/mockData";
import { genId, serviceLabel } from "../utils/helpers";
import { Card, Badge } from "../components/UIComponents";

export default function BookPage({ appointments, setAppointments, navigate }) {
  const [form, setForm] = useState({ name: "", phone: "", age: "", date: "", time: "", service: "", doctorId: "", notes: "" });
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Dynamic Pricing Logic
  useEffect(() => {
    if (!form.doctorId || !form.date) {
      setCalculatedPrice(0);
      return;
    }
    const doctor = DOCTORS.find(d => d.id === form.doctorId);
    let basePrice = doctor ? doctor.fee : 300;
    
    const selectedDate = new Date(form.date);
    const dayOfWeek = selectedDate.getDay();
    
    // Weekend Premium
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      basePrice += 50; 
    }
    
    // Peak Evening Hours Premium (+15%)
    if (form.time && form.time.includes("PM") && parseInt(form.time.split(":")[0]) >= 5 && parseInt(form.time.split(":")[0]) !== 12) {
      basePrice = Math.round(basePrice * 1.15);
    }
    
    setCalculatedPrice(basePrice);
  }, [form.doctorId, form.date, form.time]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone";
    if (!form.age || form.age < 1 || form.age > 120) e.age = "Enter valid age";
    if (!form.date) e.date = "Select a date";
    if (!form.time) e.time = "Select a time";
    if (!form.service) e.service = "Select a service";
    if (!form.doctorId) e.doctorId = "Select a doctor";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const appt = { id: genId("APT"), ...form, price: calculatedPrice, status: "pending" };
    setAppointments(prev => [...prev, appt]);
    setSuccess(appt);
  };

  if (success) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-emerald-700 mb-2">Appointment Request Submitted!</h2>
      <p className="text-slate-500 mb-6">We'll confirm your appointment shortly via phone or WhatsApp.</p>
      <Card className="p-6 mb-6 text-left space-y-2">
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Appointment ID</span><span className="font-bold text-blue-600">{success.id}</span></div>
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Patient</span><span className="font-medium">{success.name}</span></div>
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Doctor</span><span className="font-medium">{DOCTORS.find(d => d.id === success.doctorId)?.name}</span></div>
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Date & Time</span><span className="font-medium">{success.date} · {success.time}</span></div>
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Estimated Fee</span><span className="font-medium text-emerald-600">₹{success.price}</span></div>
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Status</span><Badge status="pending"/></div>
      </Card>
      <div className="flex gap-3 justify-center">
        <button onClick={() => { setSuccess(null); setForm({ name:"",phone:"",age:"",date:"",time:"",service:"",doctorId:"",notes:"" }); }} className="text-blue-600 font-medium hover:underline">Book Another</button>
        <button onClick={() => navigate("patient")} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition">View My Appointments</button>
      </div>
    </div>
  );

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const err = (k) => errors[k] ? <p className="text-red-500 text-xs mt-1">{errors[k]}</p> : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Book an Appointment</h1>
      <p className="text-slate-500 mb-8">Select your specialist and preferred time. Pricing updates dynamically based on demand.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name *</label>
                <input className={inp} placeholder="e.g. Ravi Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                {err("name")}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number *</label>
                <input className={inp} placeholder="10-digit mobile" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                {err("phone")}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Age *</label>
                <input className={inp} type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                {err("age")}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Service *</label>
                <select className={inp} value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                  <option value="">Select service</option>
                  {SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                {err("service")}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 mb-1 block">Select Specialist (Workforce) *</label>
                <select className={inp} value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})}>
                  <option value="">Select a Doctor</option>
                  {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.spec}</option>)}
                </select>
                {err("doctorId")}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Date *</label>
                <input className={inp} type="date" min={fmt(today)} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                {err("date")}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Time Slot *</label>
                <select className={inp} value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
                  <option value="">Select slot</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {err("time")}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Additional Notes</label>
              <textarea className={inp + " h-24 resize-none"} placeholder="Symptoms, concerns, or special requests…" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card className="p-6 bg-slate-800 text-white">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><span>🏷️</span> Dynamic Pricing</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Base Consultation:</span>
                <span>{form.doctorId ? `₹${DOCTORS.find(d => d.id === form.doctorId)?.fee}` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Weekend Surcharge:</span>
                <span>{(form.date && (new Date(form.date).getDay() === 0 || new Date(form.date).getDay() === 6)) ? "+ ₹50" : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Peak Evening Surge:</span>
                <span>{(form.time && form.time.includes("PM") && parseInt(form.time.split(":")[0]) >= 5 && parseInt(form.time.split(":")[0]) !== 12) ? "+ 15%" : "—"}</span>
              </div>
              <div className="border-t border-slate-600 pt-3 mt-3 flex justify-between font-bold text-white text-lg">
                <span>Total Est. Fee:</span>
                <span className="text-emerald-400">₹{calculatedPrice || 0}</span>
              </div>
            </div>
            <button onClick={submit} className="w-full bg-blue-600 text-white py-3 mt-6 rounded-xl font-semibold hover:bg-blue-500 transition text-sm">
              Confirm & Book
            </button>
          </Card>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-xs text-blue-800">
            <strong>Capacity Optimization Logic:</strong> Prices surge automatically during peak demand hours (evenings & weekends) to intelligently distribute workforce load across available times.
          </div>
        </div>
      </div>
    </div>
  );
}