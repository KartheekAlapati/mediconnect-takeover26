import { STATUS_COLORS } from "../utils/helpers";

export function StarRating({ n }) {
  return <span className="text-yellow-400 text-sm">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export function Badge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export function Card({ children, className = "", onClick }) {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-400 to-amber-500",
    violet: "from-violet-500 to-violet-600",
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-xl shadow`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </Card>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        {children}
      </Card>
    </div>
  );
}