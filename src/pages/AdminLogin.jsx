import { useState } from "react";

export default function AdminLogin({ navigate, onReceptionLogin, onDoctorLogin }) {
  const [activeForm, setActiveForm] = useState(null); // 'reception' | 'doctor' | null
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (activeForm === 'reception') {
      if (username === 'reception' && (password === 'demo123' || password === 'reception123')) {
        onReceptionLogin();
      } else {
        setError("Invalid credentials");
      }
    } else if (activeForm === 'doctor') {
      if (username === 'doctor' && password === 'demo123') {
        onDoctorLogin('dr_smith'); // Example doctor ID, consistent with mockData
      } else {
        setError("Invalid credentials");
      }
    }
  };

  const openForm = (type) => {
    setActiveForm(type);
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md text-center">

        <div className="text-5xl mb-4">🔐</div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Admin Login
        </h2>

        <p className="text-sm text-slate-600 mb-8">
          {activeForm === 'reception' ? "Reception Portal Login" : activeForm === 'doctor' ? "Doctor Dashboard Login" : "Select your portal"}
        </p>

        {activeForm === null ? (
          <div className="space-y-4">
            <button
              onClick={() => openForm('reception')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              👩‍💼 Receptionist Login
            </button>

            <button
              onClick={() => openForm('doctor')}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
            >
              🩺 Doctor Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            {error && (
              <p className="text-red-500 text-xs text-left">{error}</p>
            )}

            <button
              onClick={handleLogin}
              className={`w-full text-white py-3 rounded-xl font-semibold transition ${activeForm === 'reception' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveForm(null)}
              className="w-full border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Demo Credentials</p>
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">Reception Portal</p>
            <p>Username: reception</p>
            <p>Password: reception123</p>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={() => navigate("home")}
            className="text-slate-500 font-medium hover:text-blue-600 hover:underline text-sm transition"
          >
            ← Back to Public Website
          </button>
        </div>

      </div>
    </div>
  );
}