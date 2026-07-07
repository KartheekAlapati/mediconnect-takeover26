import { SERVICES } from "../data/mockData";
import { Card } from "../components/UIComponents";

export default function ServicesPage({ navigate }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Services</h1>
      <p className="text-slate-500 mb-10">Expert care across six specialities under one roof</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map(s => (
          <Card key={s.id} className="p-6 flex gap-5 items-start hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shrink-0">{s.icon}</div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{s.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">{s.desc}</p>
              <button onClick={() => navigate("book")} className="text-blue-600 text-sm font-medium hover:underline">Book Now →</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}