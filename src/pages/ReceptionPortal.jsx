import React from "react";
import { supabase } from "../utils/supabase";
import { DOCTORS, MAX_SLOTS_PER_DOCTOR } from "../data/mockData";
import { sendConfirmationEmail } from "../utils/emailService";
import { sendWhatsAppConfirmation } from "../utils/whatsappService";

export default function ReceptionPortal({
  appointments = [],
  setAppointments,
}) {
  const requested = appointments.filter(
    (app) => app.status === "requested"
  );

  const confirmed = appointments.filter(
    (app) => app.status === "confirmed"
  );

  const arrived = appointments.filter(
    (app) => app.status === "arrived"
  );
  const waitlist = appointments.filter((app) => app.status === "waitlist");
  
  const recentActivity = [...appointments]
    .filter(a => a.status !== "completed")
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    .slice(0, 5)
    .map((app, idx) => {
       let msg = "Action Required";
       let badge = "bg-slate-100 text-slate-600";
       let time = `${idx + 1} min ago`;
       if (idx === 0) time = "Just now";

       if (app.status === "confirmed") { msg = app.email ? "WhatsApp & Email Sent" : "WhatsApp Confirmation Sent"; badge = "bg-emerald-100 text-emerald-700"; }
       else if (app.status === "waitlist") { msg = "Waitlist Promotion Triggered"; badge = "bg-orange-100 text-orange-700"; }
       else if (app.status === "cancelled") { msg = "Appointment Cancelled"; badge = "bg-red-100 text-red-700"; }
       else if (app.status === "arrived") { msg = "Patient Checked-in"; badge = "bg-blue-100 text-blue-700"; }
       
       return { ...app, msg, badge, time };
    });
  const updateStatus = async (id, newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === "arrived") {
      updates.arrivalTime = new Date().toISOString();
    }

    const { error } = await supabase.from("appointments").update(updates).eq("id", id);
    if (error) {
      console.error("Update error:", error);
      alert("Failed to update status.");
      return;
    }

    const updatedApp = appointments.find(a => a.id === id);

    if (newStatus === "confirmed" && updatedApp) {
      const docName = DOCTORS.find(d => d.id === updatedApp.doctorId)?.name || "Doctor";
      
      sendConfirmationEmail(updatedApp, docName).then(emailResult => {
        if (emailResult && !emailResult.success && emailResult.fallbackUrl) {
          setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, emailFallbackUrl: emailResult.fallbackUrl } : app))
          );
        } else if (emailResult && emailResult.success) {
          alert("📧 Confirmation Email Sent");
        }
      });

      sendWhatsAppConfirmation(updatedApp, docName).then(waResult => {
        if (waResult && !waResult.success && waResult.fallbackUrl) {
          setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, waFallbackUrl: waResult.fallbackUrl } : app))
          );
        }
      });
    }

    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    const apptToCancel = appointments.find(a => a.id === id);
    if (!apptToCancel) return;

    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel appointment.");
      return;
    }

    let updatedAppointments = appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app));

    if (apptToCancel.status === "confirmed" || apptToCancel.status === "requested") {
      const waitlisted = updatedAppointments
        .filter(a => a.status === "waitlist" && a.doctorId === apptToCancel.doctorId && a.date === apptToCancel.date)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      if (waitlisted.length > 0) {
        const promoted = waitlisted[0];
        const { error: promoError } = await supabase.from("appointments").update({ status: "requested" }).eq("id", promoted.id);
        if (!promoError) {
          updatedAppointments = updatedAppointments.map((app) => (app.id === promoted.id ? { ...app, status: "requested" } : app));
          alert(`Waitlisted appointment for ${promoted.patientName || promoted.name} has been automatically promoted to Requested.`);
        }
      }
    }

    setAppointments(updatedAppointments);
  };

  const SimpleCard = ({ app, actionButton }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-slate-800">
            {app.patientName || app.name}
          </h4>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {app.date}
            {app.time ? ` • ${app.time}` : ""}
          </p>
        </div>
        <button
          onClick={() => cancelAppointment(app.id)}
          className="text-slate-400 hover:text-red-500 text-lg transition"
          title="Cancel Appointment"
        >
          ❌
        </button>
      </div>

      {(app.symptoms || app.notes) && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100 whitespace-pre-wrap">
          {app.symptoms || app.notes}
        </p>
      )}

      {app.doctorName && (
        <p className="text-xs text-blue-700 font-medium mb-3">
          Assigned: {app.doctorName}
        </p>
      )}

      {(app.waFallbackUrl || app.emailFallbackUrl) && (
        <div className="mb-3 flex gap-2">
          {app.waFallbackUrl && (
            <a 
              href={app.waFallbackUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200 transition inline-block"
            >
              💬 Send WhatsApp
            </a>
          )}
          {app.emailFallbackUrl && (
            <a 
              href={app.emailFallbackUrl}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200 transition inline-block"
            >
              📧 Send Email
            </a>
          )}
        </div>
      )}

      {actionButton && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          {actionButton}
        </div>
      )}
      {/* SECONDARY NOTIFICATION BUTTONS */}
      <div className="flex gap-2 mt-2">
        <button 
           onClick={async () => {
               const docName = DOCTORS.find(d => d.id === app.doctorId)?.name || "Doctor";
               const res = await sendWhatsAppConfirmation(app, docName);
               if (res.success) alert("WhatsApp reminder sent successfully.");
               else alert("Unable to send reminder. Use fallback WhatsApp option.");
           }}
           className="flex-1 bg-emerald-600 text-white text-[11px] py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition shadow-sm flex justify-center items-center gap-1"
        >
           <span>📱</span> WhatsApp
        </button>
        
        {app.email && (
          <button 
             onClick={async () => {
                 const docName = DOCTORS.find(d => d.id === app.doctorId)?.name || "Doctor";
                 const res = await sendConfirmationEmail(app, docName);
                 if (res && res.success) alert("Email notification sent successfully.");
                 else alert("Unable to send email via API. Use fallback Email option.");
             }}
             className="flex-1 bg-blue-600 text-white text-[11px] py-1.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex justify-center items-center gap-1"
          >
             <span>📧</span> Email
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Reception Hub
        </h1>

        <p className="text-sm text-slate-500 font-medium">
          Live Clinic Operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {requested.length}
          </p>
          <p className="text-xs text-slate-500">Requested</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {confirmed.length}
          </p>
          <p className="text-xs text-slate-500">Confirmed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {arrived.length}
          </p>
          <p className="text-xs text-slate-500">Arrived</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex justify-between items-center">
          <span>Workforce Utilization</span>
          <span className="text-xs font-normal text-slate-500">Based on {MAX_SLOTS_PER_DOCTOR} daily slots</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {DOCTORS.map(doc => {
            const count = appointments.filter(a => a.doctorId === doc.id && a.status !== "cancelled").length;
            const pct = Math.min(100, Math.round((count / MAX_SLOTS_PER_DOCTOR) * 100));
            
            let color = "bg-blue-500";
            if (pct >= 80) color = "bg-red-500";
            else if (pct >= 50) color = "bg-amber-400";
            else if (pct > 0) color = "bg-emerald-500";

            return (
              <div key={doc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="font-bold text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{count} Appointments</p>
                  </div>
                  <span className="font-black text-slate-700">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🔔</span> Notification Queue
        </h3>

        <div className="space-y-3">
          {recentActivity.map((app) => (
            <div
              key={app.id}
              className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-xl hover:bg-slate-100 transition"
            >
              <div>
                <p className="font-medium text-sm text-slate-800">
                  {app.msg}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {app.patientName || app.name} • {app.time}
                </p>
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${app.badge}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Kanban */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        
        {/* Requested */}
        <div className="flex flex-col bg-blue-50/50 rounded-2xl p-4 border border-blue-100 shadow-sm">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4 flex justify-between items-center">
            Requested
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
              {requested.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-1">
            {requested.map((app) => (
              <SimpleCard
                key={app.id}
                app={app}
                actionButton={
                  <button
                    onClick={() => updateStatus(app.id, "confirmed")}
                    className="w-full bg-blue-600 text-white text-[11px] py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
                  >
                    Quick Confirm
                  </button>
                }
              />
            ))}
            {requested.length === 0 && <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 text-center py-6">Empty</p>}
          </div>
        </div>

        {/* Waitlist */}
        <div className="flex flex-col bg-orange-50/50 rounded-2xl p-4 border border-orange-200 shadow-sm">
          <h3 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-4 flex justify-between items-center">
            Waitlist
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
              {waitlist.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-1">
            {waitlist.map((app) => (
              <SimpleCard
                key={app.id}
                app={app}
                actionButton={
                  <button
                    onClick={() => updateStatus(app.id, "requested")}
                    className="w-full bg-orange-600 text-white text-[11px] py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-sm"
                  >
                    Promote Manually
                  </button>
                }
              />
            ))}
            {waitlist.length === 0 && <p className="text-[10px] uppercase font-bold tracking-widest text-orange-300 text-center py-6">Empty</p>}
          </div>
        </div>

        {/* Confirmed */}
        <div className="flex flex-col bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 shadow-sm">
          <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4 flex justify-between items-center">
            Confirmed
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
              {confirmed.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-1">
            {confirmed.map((app) => (
              <SimpleCard
                key={app.id}
                app={app}
                actionButton={
                  <button
                    onClick={() => updateStatus(app.id, "arrived")}
                    className="w-full bg-emerald-600 text-white text-[11px] py-2 rounded-lg font-bold hover:bg-emerald-700 transition shadow-sm"
                  >
                    Mark Arrived
                  </button>
                }
              />
            ))}
            {confirmed.length === 0 && <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 text-center py-6">Empty</p>}
          </div>
        </div>

        {/* Arrived */}
        <div className="flex flex-col bg-violet-50/50 rounded-2xl p-4 border border-violet-100 shadow-sm">
          <h3 className="text-xs font-bold text-violet-800 uppercase tracking-widest mb-4 flex justify-between items-center">
            Arrived (Lobby)
            <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">
              {arrived.length}
            </span>
          </h3>
          <div className="overflow-y-auto flex-1 pr-1">
            {arrived.map((app) => (
              <SimpleCard key={app.id} app={app} />
            ))}
            {arrived.length === 0 && <p className="text-[10px] uppercase font-bold tracking-widest text-violet-300 text-center py-6">Empty</p>}
          </div>
        </div>

      </div>
    </div>
  );
}