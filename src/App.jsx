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
import ReceptionLogin from "./pages/ReceptionLogin";

import DoctorDashboard from "./pages/DoctorDashboard";
import SchedulePage from "./pages/SchedulePage";
import PatientDatabase from "./pages/PatientDatabase";
import ReportsPage from "./pages/ReportsPage";

import AIPage from "./pages/AIPage";
import AdminLogin from "./pages/AdminLogin";
import ReceptionPortal from "./pages/ReceptionPortal";
import OurDoctors from "./pages/OurDoctors";
export default function App() {
  const [appointments, setAppointments] = useLocalStorage(
    "mc_appointments",
    SAMPLE_APPOINTMENTS
  );

  const [patients] = useLocalStorage(
    "mc_patients",
    SAMPLE_PATIENTS
  );

  const [page, setPage] = useState("home");

const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);
const [currentDoctorId, setCurrentDoctorId] = useState(null);
const [receptionLoggedIn, setReceptionLoggedIn] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [showBot, setShowBot] = useState(true);
const [expandBot, setExpandBot] = useState(false);
  const navigate = (p) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const logout = () => {
  if (window.confirm("Are you sure you want to logout?")) {

    setDoctorLoggedIn(false);
    setReceptionLoggedIn(false);
    setCurrentDoctorId(null);

    navigate("home");
  }
};

  const patientNav = [
  { id: "home", label: "Home" },
  { id: "doctors", label: "Our Doctors" },
  { id: "services", label: "Services" },
  { id: "book", label: "Book Appointment" },
  { id: "patient", label: "My Appointments" },
  { id: "contact", label: "Contact" },
  
];

  const doctorNav = [
    { id: "docDash", label: "Dashboard" },
    { id: "schedule", label: "Schedule" },
    { id: "db", label: "Patients" },
    { id: "reports", label: "Reports" },
  ];

  const isDoctorPage = [
    "docDash",
    "schedule",
    "db",
    "reports",
    "doctorLogin",
  ].includes(page);

  const isReceptionPage = [
    "reception",
    "receptionLogin",
  ].includes(page);

  const isStaffPage = isDoctorPage || isReceptionPage;

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage navigate={navigate} />;

      case "about":
  return <AboutPage navigate={navigate} />;
      case "doctors":
  return (
    <OurDoctors navigate={navigate} />
  );
      case "services":
        return <ServicesPage navigate={navigate} />;
      
      case "book":
        return (
          <BookPage
            appointments={appointments}
            setAppointments={setAppointments}
            navigate={navigate}
          />
        );

      case "patient":
        return (
          <PatientDashboard
            appointments={appointments}
            setAppointments={setAppointments}
          />
        );

      case "contact":
  return <ContactPage navigate={navigate} />;

      case "ai":
  return <AIPage navigate={navigate} />;

      case "admin":
        return <AdminLogin navigate={navigate} />;

      case "receptionLogin":
        return (
          <ReceptionLogin
            navigate={navigate}
            onLogin={() => {
              setReceptionLoggedIn(true);
              navigate("reception");
            }}
          />
        );

      case "reception":
        if (!receptionLoggedIn) {
          return (
            <ReceptionLogin
              navigate={navigate}
              onLogin={() => {
                setReceptionLoggedIn(true);
                navigate("reception");
              }}
            />
          );
        }

        return (
          <ReceptionPortal
            appointments={appointments}
            setAppointments={setAppointments}
            navigate={navigate}
            logout={logout}
          />
        );

      case "doctorLogin":
  return (
    <DoctorLogin
      onLogin={(doctorId) => {
        setDoctorLoggedIn(true);
        setCurrentDoctorId(doctorId);
        navigate("docDash");
      }}
    />
  );

      case "docDash":
  if (!doctorLoggedIn) {
    return (
      <DoctorLogin
        onLogin={(doctorId) => {
          setDoctorLoggedIn(true);
          setCurrentDoctorId(doctorId);
          navigate("docDash");
        }}
      />
    );
  }

        return (
          <DoctorDashboard
  appointments={appointments}
  setAppointments={setAppointments}
  patients={patients}
  navigate={navigate}
  currentDoctorId={currentDoctorId}
/>
        );

      case "schedule":
        if (!doctorLoggedIn) {
          navigate("doctorLogin");
          return null;
        }

        return <SchedulePage appointments={appointments} />;

      case "db":
        if (!doctorLoggedIn) {
          navigate("doctorLogin");
          return null;
        }

        return <PatientDatabase patients={patients} />;

      case "reports":
        if (!doctorLoggedIn) {
          navigate("doctorLogin");
          return null;
        }

        return <ReportsPage appointments={appointments} />;

      default:
        return <HomePage navigate={navigate} />;
    }
  };

  const navItems = isDoctorPage ? doctorNav : patientNav;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

      {!isStaffPage && (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
  <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

    <button
      onClick={() => navigate("home")}
      className="flex items-center gap-2 font-bold text-blue-700 text-lg"
    >
      <span className="text-2xl">🩺</span>
      <span className="hidden sm:inline">MediConnect26</span>
    </button>

    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((n) => (
        <button
          key={n.id}
          onClick={() => navigate(n.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            page === n.id
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {n.label}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-2">

      <button
        onClick={() => navigate("admin")}
        className="hidden md:block text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Admin Login
      </button>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-2xl text-slate-700"
      >
        ☰
      </button>

    </div>

  </div>

  {mobileMenuOpen && (
    <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2">

      {navItems.map((n) => (
        <button
          key={n.id}
          onClick={() => {
            navigate(n.id);
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
        >
          {n.label}
        </button>
      ))}

      <button
        onClick={() => {
          navigate("admin");
          setMobileMenuOpen(false);
        }}
        className="block w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-600 text-white"
      >
        Admin Login
      </button>

    </div>
  )}
</header>
      )}

      {isStaffPage && (
        <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold">
            {isReceptionPage
              ? "Reception Portal"
              : "Doctor Portal"}
          </h1>

          {(doctorLoggedIn || receptionLoggedIn) && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          )}
        </header>
      )}

      <main className="flex-1">
        {renderPage()}
      </main>
      
{!isStaffPage && showBot && (
  <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">

    {expandBot && (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl w-72">

    <div className="flex items-center justify-between mb-3">

      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>

        <div>
          <p className="font-bold text-slate-800">
            MediBot
          </p>

          <p className="text-[10px] text-slate-500">
            AI Healthcare Assistant
          </p>
        </div>
      </div>

      <button
        onClick={() => setExpandBot(false)}
        className="text-slate-400 hover:text-slate-700 text-lg"
      >
        ×
      </button>

    </div>

    <p className="text-xs text-slate-600 leading-relaxed">
      👋 Welcome to MediConnect!

      <br /><br />

      I'm MediBot, your AI Healthcare Assistant 🩺

      <br /><br />

      I can help you with:

      <br />
      📅 Appointment Booking
      <br />
      👨‍⚕️ Doctors
      <br />
      🏥 Services
      <br />
      💰 Consultation Fees
      <br />
      ⏰ Clinic Timings
    </p>

    <div className="mt-4 flex flex-col gap-2">

      <button
        onClick={() => navigate("book")}
        className="w-full text-left border rounded-xl px-3 py-2 text-xs hover:bg-slate-50"
      >
        📅 Book Appointment
      </button>

      <button
        onClick={() => navigate("doctors")}
        className="w-full text-left border rounded-xl px-3 py-2 text-xs hover:bg-slate-50"
      >
        👨‍⚕️ View Doctors
      </button>

      <button
        onClick={() => navigate("services")}
        className="w-full text-left border rounded-xl px-3 py-2 text-xs hover:bg-slate-50"
      >
        🏥 Our Services
      </button>

      <button
        onClick={() => navigate("contact")}
        className="w-full text-left border rounded-xl px-3 py-2 text-xs hover:bg-slate-50"
      >
        📞 Contact Clinic
      </button>

    </div>

  </div>
)}
      
    

    <div className="relative">

      <button
        onClick={() => setExpandBot(!expandBot)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl shadow-2xl hover:scale-105 transition"
      >
        🤖
      </button>

      <button
        onClick={() => setShowBot(false)}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold shadow"
      >
        ×
      </button>

    </div>

  </div>
)}
      {!isStaffPage && (
        <footer className="bg-slate-800 text-slate-300 py-10 mt-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-white font-bold text-lg mb-2">
                🩺 MediConnect26
              </p>
              <p className="text-sm text-slate-400">{DOCTOR.clinic}</p>
              <p className="text-sm text-slate-400 mt-1">
                {DOCTOR.address}
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-2">
                Quick Links
              </p>

              {["home", "book", "contact", "ai"].map((p) => (
                <button
                  key={p}
                  onClick={() => navigate(p)}
                  className="block text-sm text-slate-400 hover:text-white capitalize mb-1 transition"
                >
                  {p === "ai"
                    ? "AI Assistant"
                    : p === "book"
                    ? "Book Appointment"
                    : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <p className="text-white font-semibold mb-2">
                Contact
              </p>
              <p className="text-sm text-slate-400">{DOCTOR.phone}</p>
              <p className="text-sm text-slate-400">{DOCTOR.email}</p>
              <p className="text-sm text-slate-400 mt-1">
                {DOCTOR.timings}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}