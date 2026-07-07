import { useState } from "react";
import { Card } from "../components/UIComponents";

export default function DoctorLogin({ onLogin }) {
  const [u, setU] = useState(""); 
  const [p, setP] = useState(""); 
  const [err, setErr] = useState("");
  
  const login = () => {
    if (u === "doctor" && p === "mediconnect123") onLogin();
    else setErr("Invalid credentials. Demo: doctor / mediconnect123");
  };

  const autoFillDemo = () => {
    setU("doctor");
    setP("mediconnect123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 cursor-pointer" onDoubleClick={autoFillDemo}>🩺</div>
          <h2 className="text-xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-slate-400 text-sm mt-1">MediConnect Clinic Portal</p>
        </div>
        <div className="space-y-4">
          <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
          <input type="password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Password" value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <button onClick={login} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Sign In</button>
          <p className="text-xs text-slate-400 text-center">Use double-click on stethoscope for demo fill</p>
        </div>
      </Card>
    </div>
  );
}