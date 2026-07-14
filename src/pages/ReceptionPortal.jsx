import React from "react";
import { supabase } from "../utils/supabase";

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
  const waitlist = appointments.filter(
    (app) => app.status === "waitlist"
  );
  const notifications = appointments.filter(
    (app) =>
      app.status === "confirmed"
  );
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

    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete appointment.");
      return;
    }
    setAppointments((prev) => prev.filter((app) => app.id !== id));
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
          onClick={() => deleteAppointment(app.id)}
          className="text-slate-400 hover:text-red-500 text-lg transition"
          title="Delete Appointment"
        >
          🗑
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

      {actionButton && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          {actionButton}
        </div>
      )}
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h3 className="font-bold text-slate-800 mb-3">
          Workforce Utilization
        </h3>

        <div className="grid md:grid-cols-3 gap-3 text-sm">

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold">
              Dr. Srinivas Rao
            </p>
            <p>
              {
                appointments.filter(
                  a => a.doctorId === "D001"
                ).length
              } Appointments
            </p>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg">
            <p className="font-semibold">
              Dr. Priya Sharma
            </p>
            <p>
              {
                appointments.filter(
                  a => a.doctorId === "D002"
                ).length
              } Appointments
            </p>
          </div>

          <div className="bg-violet-50 p-3 rounded-lg">
            <p className="font-semibold">
              Dr. Rajesh Kumar
            </p>
            <p>
              {
                appointments.filter(
                  a => a.doctorId === "D003"
                ).length
              } Appointments
            </p>
          </div>

        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h3 className="font-bold text-slate-800 mb-3">
          Notification Queue
        </h3>

        <div className="space-y-2">
          {notifications.slice(0, 5).map((app) => (
            <div
              key={app.id}
              className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">
                  {app.patientName || app.name}
                </p>

                <p className="text-xs text-slate-500">
                  {app.date} • {app.time}
                </p>
              </div>

              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                Reminder Queued
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Kanban */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        {/* Requested */}
        <div className="flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 flex justify-between items-center">
            Requested
            <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
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
                    className="w-full bg-blue-600 text-white text-[11px] py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Quick Confirm
                  </button>
                }
              />
            ))}
            {/* Waitlist */}
            <div className="flex flex-col bg-orange-50 rounded-2xl p-4 border border-orange-200">{waitlist.map((app) => (
              <SimpleCard
                key={app.id}
                app={app}
                actionButton={
                  <button
                    onClick={() =>
                      updateStatus(
                        app.id,
                        "confirmed"
                      )
                    }
                    className="w-full bg-orange-600 text-white text-[11px] py-2 rounded-lg font-bold"
                  >
                    Approve Waitlist
                  </button>
                }
              />
            ))}</div>
            {requested.length === 0 && (
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center py-6">
                No Requests
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {waitlist.length}
          </p>
          <p className="text-xs text-slate-500">Waitlist</p>
        </div>
        {/* Confirmed */}
        <div className="flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 flex justify-between items-center">
            Confirmed
            <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
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
                    className="w-full bg-emerald-600 text-white text-[11px] py-2 rounded-lg font-bold hover:bg-emerald-700 transition"
                  >
                    Mark Arrived
                  </button>
                }
              />
            ))}

            {confirmed.length === 0 && (
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center py-6">
                No Confirmed
              </p>
            )}
          </div>
        </div>

        {/* Arrived */}
        <div className="flex flex-col bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 flex justify-between items-center">
            Arrived (Lobby)
            <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
              {arrived.length}
            </span>
          </h3>

          <div className="overflow-y-auto flex-1 pr-1">
            {arrived.map((app) => (
              <SimpleCard key={app.id} app={app} />
            ))}

            {arrived.length === 0 && (
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center py-6">
                Lobby Empty
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}