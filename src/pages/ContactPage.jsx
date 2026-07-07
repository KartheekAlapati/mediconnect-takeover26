import { DOCTOR } from "../data/mockData";
import { Card } from "../components/UIComponents";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Contact Us</h1>
      <p className="text-slate-500 mb-10">We're here to help. Reach us through any of the channels below.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            ["📍", "Address", DOCTOR.address],
            ["📞", "Phone", DOCTOR.phone],
            ["📧", "Email", DOCTOR.email],
            ["🕐", "Timings", DOCTOR.timings],
          ].map(([icon, label, val]) => (
            <Card key={label} className="p-5 flex gap-4">
              <div className="text-2xl">{icon}</div>
              <div><p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p><p className="text-sm text-slate-700 font-medium mt-0.5">{val}</p></div>
            </Card>
          ))}
          <a href={`https://wa.me/${DOCTOR.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-emerald-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition justify-center">
            💬 Chat on WhatsApp
          </a>
          <a href={`tel:${DOCTOR.phone}`} className="flex items-center gap-3 bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-600 transition justify-center">
            🚨 Emergency Call
          </a>
        </div>
        <div>
          <Card className="overflow-hidden h-80 md:h-full">
            <iframe
              src={DOCTOR.mapEmbed}
              width="100%" height="100%" style={{ border: 0, minHeight: 300 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Clinic Location"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}