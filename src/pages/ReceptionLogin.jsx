import { useState } from "react";
import { Card } from "../components/UIComponents";

export default function ReceptionLogin({ onLogin, navigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    if (
      username === "reception" &&
      password === "reception123"
    ) {
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👩‍💼</div>

          <h2 className="text-xl font-bold text-slate-800">
            Reception Login
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            MediConnect Reception Portal
          </p>
        </div>

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
            onKeyDown={(e) => e.key === "Enter" && login()}
          />

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("admin")}
            className="w-full border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
          >
            Back
          </button>
        </div>
      </Card>
    </div>
  );
}