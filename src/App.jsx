import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { SAMPLE_APPOINTMENTS, SAMPLE_PATIENTS, DOCTOR } from "./data/mockData";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookPage from "./pages/BookPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import SchedulePage from "./pages/SchedulePage";
import PatientDatabase from "./pages/PatientDatabase";
import ReportsPage from "./pages/ReportsPage";
import AIPage from "./pages/AIPage";

export default function App() {
  const [appointments, setAppointments] = useLocalStorage("mc_appointments", SAMPLE_APPOINTMENTS);
  const [patients] = useLocalStorage("mc_patients", SAMPLE_PATIENTS);
  const [page, setPage] = useState("home");
  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (p) => { setPage(p); setMobileMenuOpen(false); window.scrollTo(0, 0); };

  const patientNav = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "book", label: "Book Appointment" },
    { id: "patient", label: "My Appointments" },
    { id: "contact", label: "Contact" },
    { id: "ai", label: "AI Assistant" },
  ];

  const doctorNav = [
    { id: "docDash", label: "Dashboard" },
    { id: "schedule", label: "Today's Schedule" },
    { id: "db", label: "Patient Database" },
    { id: "reports", label: "Reports" },
  ];

  const isDoctorPage = ["docDash","schedule","db","reports","login"].includes(page);

  const renderPage = () => {
    if (page === "login") return <DoctorLogin onLogin={() => { setDoctorLoggedIn(true); navigate("docDash"); }} />;
    if (isDoctorPage && !doctorLoggedIn) return <DoctorLogin onLogin={() => { setDoctorLoggedIn(true); navigate("docDash"); }} />;
    
    switch (page) {
      case "home": return <HomePage navigate={navigate} />;
      case "about": return <AboutPage />;
      case "services": return <ServicesPage navigate={navigate} />;
      case "book": return <BookPage appointments={appointments} setAppointments={setAppointments} navigate={navigate} />;
      case "patient": return <PatientDashboard appointments={appointments} setAppointments={setAppointments} />;
      case "contact": return <ContactPage />;
      case "ai": return <AIPage />;
      case "docDash": return <DoctorDashboard appointments={appointments} setAppointments={setAppointments} patients={patients} navigate={navigate} />;
      case "schedule": return <SchedulePage appointments={appointments} />;
      case "db": return <PatientDatabase patients={patients} />;
      case "reports": return <ReportsPage appointments={appointments} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  if (page === "login") return renderPage();
  const navItems = isDoctorPage ? doctorNav : patientNav;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 font-bold text-blue-700 text-lg">
            <span className="text-2xl">🩺</span><span className="hidden sm:inline">MediConnect</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => navigate(n.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${page === n.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{n.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isDoctorPage ? (
              <button onClick={() => { setDoctorLoggedIn(false); navigate("home"); }} className="text-xs text-slate-500 hover:text-red-500 transition">Sign Out</button>
            ) : (
              <button onClick={() => navigate("login")} className="text-sm text-blue-600 font-medium hover:underline hidden md:block">Doctor Login</button>
            )}
            <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden p-2 text-slate-600">☰</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => navigate(n.id)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${page === n.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{n.label}</button>
            ))}
            {!isDoctorPage && <button onClick={() => navigate("login")} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-blue-600 font-medium hover:bg-blue-50">Doctor Login</button>}
          </div>
        )}
      </header>
      <main className="flex-1">{renderPage()}</main>
      <footer className="bg-slate-800 text-slate-300 py-10 mt-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">🩺 MediConnect</p>
            <p className="text-sm text-slate-400">{DOCTOR.clinic}</p>
            <p className="text-sm text-slate-400 mt-1">{DOCTOR.address}</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Quick Links</p>
            {["home","book","contact","ai"].map(p => (
              <button key={p} onClick={() => navigate(p)} className="block text-sm text-slate-400 hover:text-white capitalize mb-1 transition">{p === "ai" ? "AI Assistant" : p === "book" ? "Book Appointment" : p.charAt(0).toUpperCase() + p.slice(1)}</button>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Contact</p>
            <p className="text-sm text-slate-400">{DOCTOR.phone}</p>
            <p className="text-sm text-slate-400">{DOCTOR.email}</p>
            <p className="text-sm text-slate-400 mt-1">{DOCTOR.timings}</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-slate-700 text-xs text-slate-500 text-center">
          © 2026 MediConnect. All rights reserved. · TakeOver'26 Hackathon Submission.
        </div>
      </footer>
    </div>
  );
}