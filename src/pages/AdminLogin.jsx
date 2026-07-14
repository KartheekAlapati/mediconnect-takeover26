export default function AdminLogin({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md text-center">

        <div className="text-5xl mb-4">🔐</div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Admin Login
        </h2>

        <p className="text-sm text-slate-600 mb-8">
          Select your portal
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("receptionLogin")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            👩‍💼 Receptionist Login
          </button>

          <button
            onClick={() => navigate("doctorLogin")}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            🩺 Doctor Login
          </button>
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