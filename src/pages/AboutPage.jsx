import { DOCTOR, DOCTORS } from "../data/mockData";
import { Card } from "../components/UIComponents";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="text-center mb-12">
        <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-7xl shadow-lg mb-6">
          🏥
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          About MediConnect Clinic
        </h1>

        <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {DOCTOR.about}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            🎯 Our Mission
          </h2>

          <p className="text-slate-600 leading-relaxed">
            To provide affordable, accessible and high-quality healthcare
            services through experienced doctors and modern digital healthcare
            solutions.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            🚀 Our Vision
          </h2>

          <p className="text-slate-600 leading-relaxed">
            To become a trusted healthcare destination where patients receive
            timely, compassionate and technology-enabled medical care.
          </p>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          👨‍⚕️ Our Medical Team
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {DOCTORS.map((doctor) => (
            <Card key={doctor.id} className="p-6 text-center">
              <div className="text-5xl mb-4">🩺</div>

              <h3 className="font-bold text-slate-800 text-lg">
                {doctor.name}
              </h3>

              <p className="text-sm text-blue-600 mt-2">
                {doctor.spec}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          ["🕐", "Clinic Timings", DOCTOR.timings],
          ["📞", "Phone", DOCTOR.phone],
          ["📧", "Email", DOCTOR.email],
        ].map(([icon, label, val]) => (
          <Card key={label} className="p-5 text-center">
            <div className="text-2xl mb-2">{icon}</div>

            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              {label}
            </p>

            <p className="text-sm font-medium text-slate-700">
              {val}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}