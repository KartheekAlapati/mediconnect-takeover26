import { useState } from "react";
import { Card } from "../components/UIComponents";

export default function DoctorLogin({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
  if ((u === "srinivasa" || u === "srinivas") && (p === "srinivasa123" || p === "srinivas123")) {
    onLogin("D001");
  }
  else if (u === "priya" && p === "priya123") {
    onLogin("D002");
  }
  else if (u === "rajesh" && p === "rajesh123") {
    onLogin("D003");
  }
  else {
    setErr("Invalid credentials");
  }
};

  const autoFillDemo = () => {
    setU("srinivasa");
    setP("srinivasa123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div
            className="text-5xl mb-3 cursor-pointer"
            onDoubleClick={autoFillDemo}
          >
            🩺
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Doctor Login
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            MediConnect Doctor Portal
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            aria-label="Username"
            value={u}
            onChange={(e) => setU(e.target.value)}
          />

          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            aria-label="Password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />

          {err && (
            <p className="text-red-500 text-xs">{err}</p>
          )}

          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Demo Credentials</p>
            <div className="text-xs text-slate-500 space-y-3">
              <div>
                <p className="font-semibold text-slate-600 mb-1">Dr. Srinivasa Rao</p>
                <p>Username: srinivasa</p>
                <p>Password: srinivasa123</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600 mb-1">Dr. Priya</p>
                <p>Username: priya</p>
                <p>Password: priya123</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600 mb-1">Dr. Rajesh</p>
                <p>Username: rajesh</p>
                <p>Password: rajesh123</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}