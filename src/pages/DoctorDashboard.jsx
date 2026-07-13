import { useState } from "react";
import { fmt, today, DOCTORS, MAX_SLOTS_PER_DOCTOR } from "../data/mockData";
import { Card, StatCard, Badge } from "../components/UIComponents";

export default function DoctorDashboard({
  appointments,
  setAppointments,
  patients,
  currentDoctorId
}) {
  const [simulating, setSimulating] = useState(false);
  const [simulatedCount, setSimulatedCount] = useState(null);

  const filteredAppts = appointments.filter(
    (a) => a.doctorId === currentDoctorId
  );

  const todayStr = fmt(today);

  const todayAppts = filteredAppts.filter(
  (a) =>
    a.date === todayStr &&
    a.status !== "cancelled"
);

const upcoming = filteredAppts.filter(
  (a) =>
    a.status !== "completed" &&
    a.status !== "cancelled"
);

const completed = filteredAppts.filter(
  (a) => a.status === "completed"
);

const totalPatients = new Set(
  filteredAppts.map(
    (a) => a.patientName || a.name
  )
).size;

  const updateStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  const activeAppointments = filteredAppts.filter(
  (a) =>
    a.status !== "cancelled" &&
    a.status !== "completed"
);

const totalDailyCapacity = MAX_SLOTS_PER_DOCTOR;

const capacityPercent = Math.min(
  100,
  Math.round(
    (activeAppointments.length / totalDailyCapacity) * 100
  )
);

  const runNotificationSimulator = () => {
    setSimulating(true);
    setSimulatedCount(null);

    setTimeout(() => {
      setSimulating(false);
      setSimulatedCount(upcoming.length || 12);
    }, 2000);
  };

  console.log("Doctor ID:", currentDoctorId);
console.log("Appointments:", filteredAppts);
console.log("Today:", todayAppts.length);
console.log("Upcoming:", upcoming.length);
console.log("Completed:", completed.length);

const doctorName =
  DOCTORS.find(
    (d) => d.id === currentDoctorId
  )?.name || "Doctor";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Doctor Dashboard
        </h1>

        <p className="text-slate-500 text-sm">
          Welcome, {doctorName}
        </p>
        <p className="text-xs text-blue-600 font-medium mt-1">
  Workforce Monitoring & Capacity Optimization Active
</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="📅"
            label="Today's Bookings"
            value={todayAppts.length}
            color="blue"
          />

          <StatCard
            icon="🗓️"
            label="Upcoming"
            value={upcoming.length}
            color="violet"
          />

          <StatCard
  icon="👥"
  label="Total Patients"
  value={totalPatients}
  color="emerald"
/>

          <StatCard
            icon="✅"
            label="Completed"
            value={completed.length}
            color="amber"
          />
        </div>

        <Card className="p-5 flex flex-col justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            Daily Capacity Utilization
          </p>

          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">
              {capacityPercent}%
            </span>

            <span className="text-sm text-slate-400">
  {activeAppointments.length} / {totalDailyCapacity} slots
</span>
          </div>

          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                capacityPercent > 80
                  ? "bg-red-500"
                  : capacityPercent > 50
                  ? "bg-amber-400"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${capacityPercent}%`,
              }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <Card className="p-6">

            <h2 className="font-bold text-slate-800 mb-4">
              Appointment Management
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Patient</th>
                    <th className="pb-3 pr-4">Doctor</th>
                    <th className="pb-3 pr-4">Date & Time</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppts.slice(0, 8).map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <td className="py-3 pr-4 text-blue-600 font-medium">
                        {a.id}
                      </td>

                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {a.patientName || a.name}
                      </td>

                      <td className="py-3 pr-4 text-slate-600 text-xs">
                        {DOCTORS.find(
                          (d) => d.id === a.doctorId
                        )?.name || "—"}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">
                        {a.date} · {a.time}
                      </td>

                      <td className="py-3 pr-4">
  <div className="flex items-center gap-2 flex-wrap">
    <Badge status={a.status} />

    {a.status === "requested" && (
      <span className="px-2 py-1 text-[10px] bg-red-100 text-red-600 rounded-full font-medium">
        No-Show Risk
      </span>
    )}
  </div>
</td>

                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">

                          {a.status === "requested" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  a.id,
                                  "confirmed"
                                )
                              }
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-200"
                            >
                              Confirm
                            </button>
                          )}

                          {a.status !== "completed" &&
                            a.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    a.id,
                                    "completed"
                                  )
                                }
                                className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-200"
                              >
                                Done
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </Card>
        </div>

        <div className="space-y-6">

          <Card className="p-6">

            <h2 className="font-bold text-slate-800 mb-2">
              Automated Notifications
            </h2>

            <p className="text-xs text-slate-500 mb-4">
              Run batch WhatsApp processing to minimize no-shows.
            </p>

            {simulatedCount !== null ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium border border-emerald-100 text-center">
                ✅ {simulatedCount} WhatsApp Reminders
                dispatched successfully.
              </div>
            ) : (
              <button
                onClick={runNotificationSimulator}
                disabled={simulating}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                {simulating
                  ? "🔄 Processing..."
                  : "🚀 Send Tomorrow's Reminders"}
              </button>
            )}

          </Card>

        </div>

      </div>
    </div>
  );
}