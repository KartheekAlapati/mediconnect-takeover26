import { DOCTOR, SERVICES, TESTIMONIALS } from "../data/mockData";
import { Card, StarRating } from "../components/UIComponents";

export default function HomePage({ navigate }) {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}/>
        <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4 tracking-wide uppercase">MediConnect Multi-Speciality Clinic</div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">{DOCTOR.name}</h1>
            <p className="text-blue-100 text-lg mb-1">{DOCTOR.qualifications}</p>
            <p className="text-blue-200 text-sm mb-6">{DOCTOR.experience} Years of Experience · Reg. No. {DOCTOR.regNo}</p>
            <p className="text-blue-100 max-w-md mb-8 leading-relaxed">{DOCTOR.tagline}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button onClick={() => navigate("book")} className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow z-10 relative">Book Appointment</button>
              <a href={`https://wa.me/${DOCTOR.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-600 transition shadow flex items-center gap-2 z-10 relative">
                <span>💬</span> WhatsApp Us
              </a>
            </div>
          </div>
<div className="hidden lg:block shrink-0 z-10">
  <img
  src="/doctors-team.png"
  alt="Doctor"
  className="w-full h-72 object-cover rounded-xl mb-4"
/>
</div>    </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent"/>
      </section>

      <section className="bg-white border-b border-slate-100">
  <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    {[
      ["3", "Specialist Doctors"],
      ["12,000+", "Patients Served"],
      ["6", "Healthcare Services"],
      ["15+", "Years of Excellence"],
    ].map(([v, l]) => (
      <div key={l}>
        <p className="text-2xl font-bold text-blue-600">{v}</p>
        <p className="text-xs text-slate-500">{l}</p>
      </div>
    ))}
  </div>
</section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Our Services</h2>
        <p className="text-slate-500 mb-8">Comprehensive healthcare for every need</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICES.map(s => (
            <Card key={s.id} className="p-5 hover:shadow-md transition cursor-pointer" onClick={() => navigate("services")}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1">{s.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">What Patients Say</h2>
          <p className="text-slate-500 mb-8">Real experiences from our community</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="p-5">
                <StarRating n={t.rating} />
                <p className="text-slate-600 mt-2 mb-4 italic leading-relaxed">"{t.text}"</p>
                <p className="text-sm font-semibold text-slate-800">— {t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-600 text-white py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">🚨 Medical Emergency?</p>
            <p className="text-red-100 text-sm">Call us immediately or dial 108 for ambulance</p>
          </div>
          <a href={`tel:${DOCTOR.phone}`} className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition shrink-0">{DOCTOR.phone}</a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">🤖</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">MediAssist – AI Health Helper</h3>
              <p className="text-blue-100 mb-4">Ask about clinic timings, services, appointments and more.</p>
              <button onClick={() => navigate("ai")} className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition">Chat with MediAssist</button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}