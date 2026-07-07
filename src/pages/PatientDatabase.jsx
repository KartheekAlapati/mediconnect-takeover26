import { useState } from "react";
import { Card } from "../components/UIComponents";

export default function PatientDatabase({ patients }) {
  const [search, setSearch] = useState("");
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search));
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Patient Database</h1>
      <p className="text-slate-500 mb-6">Search and manage patient records</p>
      <div className="mb-6">
        <input className="w-full max-w-sm border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
            <th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Age</th><th className="p-4">Visits</th><th className="p-4">Last Visit</th><th className="p-4">Notes</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-4 text-blue-600 font-medium">{p.id}</td>
                <td className="p-4 font-medium text-slate-800">{p.name}</td>
                <td className="p-4 text-slate-500">{p.phone}</td>
                <td className="p-4 text-slate-600">{p.age}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold">{p.visitCount}</span></td>
                <td className="p-4 text-slate-500">{p.lastVisit}</td>
                <td className="p-4 text-slate-400 italic text-xs">{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}