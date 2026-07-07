import { DOCTOR } from "../data/mockData";
import { Card } from "../components/UIComponents";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="shrink-0 text-center">
          <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-8xl mx-auto shadow">🩺</div>
          <p className="mt-4 font-bold text-slate-800 text-lg">{DOCTOR.name}</p>
          <p className="text-slate-500 text-sm">{DOCTOR.qualifications}</p>
          <p className="text-blue-600 text-sm font-medium mt-1">Reg. No. {DOCTOR.regNo}</p>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">About Dr. Srinivas Rao</h1>
          <p className="text-blue-600 font-medium mb-4">{DOCTOR.experience} Years of Clinical Experience</p>
          <p className="text-slate-600 leading-relaxed mb-6">{DOCTOR.about}</p>
          <h3 className="font-semibold text-slate-800 mb-2">Certifications</h3>
          <ul className="space-y-1 mb-6">
            {DOCTOR.certifications.map(c => <li key={c} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-blue-500">✓</span>{c}</li>)}
          </ul>
          <h3 className="font-semibold text-slate-800 mb-2">Achievements</h3>
          <ul className="space-y-1">
            {DOCTOR.achievements.map(a => <li key={a} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-amber-500">🏆</span>{a}</li>)}
          </ul>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[["🕐", "Clinic Timings", DOCTOR.timings], ["📞", "Phone", DOCTOR.phone], ["📧", "Email", DOCTOR.email]].map(([icon, label, val]) => (
          <Card key={label} className="p-5 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-700">{val}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}