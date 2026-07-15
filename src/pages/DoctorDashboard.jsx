import { useState } from "react";
import { fmt, today, DOCTORS, MAX_SLOTS_PER_DOCTOR, addDays } from "../data/mockData";
import { Card, StatCard, Badge } from "../components/UIComponents";
import { supabase } from "../utils/supabase";

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

  const [dateFilter, setDateFilter] = useState("today");
  const todayStr = fmt(today);
  const prev7Str = addDays(-7);
  const next7Str = addDays(7);

  const displayAppts = filteredAppts.filter((a) => {
    if (dateFilter === "today") return a.date === todayStr;
    if (dateFilter === "prev7") return a.date >= prev7Str && a.date < todayStr;
    if (dateFilter === "next7") return a.date > todayStr && a.date <= next7Str;
    return true;
  });

  const todayAppts = filteredAppts.filter(
    (a) => a.date === todayStr && a.status !== "cancelled"
  );

  const upcoming = filteredAppts.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled"
  );

  const completed = filteredAppts.filter((a) => a.status === "completed");

const totalPatients = new Set(
  filteredAppts.map(
    (a) => a.patientName || a.name
  )
).size;

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) {
      console.error("Update error:", error);
      alert("Failed to update status.");
      return;
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  const activeAppointments = displayAppts.filter((a) => a.status !== "cancelled");

  const daysInFilter = dateFilter === "today" ? 1 : 7;
  const totalDailyCapacity = MAX_SLOTS_PER_DOCTOR * daysInFilter;

  const capacityPercent = Math.min(
    100,
    Math.round((activeAppointments.length / totalDailyCapacity) * 100)
  );

  const runNotificationSimulator = async () => {
    setSimulating(true);
    setSimulatedCount(null);

    const tomorrowStr = addDays(1);
    const tomorrowAppts = appointments.filter(
      (a) => a.date === tomorrowStr && a.status !== "cancelled"
    );

    const reminders = tomorrowAppts.map((a) => ({
      appointment_id: a.id,
      patient_name: a.patientName || a.name,
      phone: a.phone,
      status: "prepared",
    }));

    if (reminders.length > 0) {
      await supabase.from("reminders").insert(reminders);
    }

    setSimulating(false);
    setSimulatedCount(reminders.length);
  };

  const [aiBrief, setAiBrief] = useState(null);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [briefError, setBriefError] = useState(null);
  
  // Store metrics for UI display
  const [briefMetrics, setBriefMetrics] = useState(null);

  const generateAIBrief = async () => {
    setGeneratingBrief(true);
    setBriefError(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing Gemini API Key");

      // Compute metrics
      const allTodayAppts = filteredAppts.filter(a => a.date === todayStr);
      const totalAppointments = todayAppts.length;
      const cancellationCount = allTodayAppts.filter(a => a.status === "cancelled").length;
      const waitlistCount = allTodayAppts.filter(a => a.status === "waitlist").length;
      
      const hourCounts = {};
      todayAppts.forEach(a => {
        if (!a.time) return;
        const hour = a.time.split(":")[0] + " " + a.time.split(" ")[1];
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      let peakHour = "N/A";
      let maxCount = 0;
      for (const [h, count] of Object.entries(hourCounts)) {
        if (count > maxCount) {
          maxCount = count;
          peakHour = h;
        }
      }

      const todayActive = allTodayAppts.filter(a => a.status !== "cancelled" && a.status !== "waitlist").length;
      const utilizationPercentage = Math.round((todayActive / MAX_SLOTS_PER_DOCTOR) * 100) + "%";

      // Save to state for UI
      setBriefMetrics({
        total: totalAppointments,
        peak: peakHour,
        waitlist: waitlistCount,
        util: utilizationPercentage
      });

      const prompt = `You are an AI assistant for a doctor. Create a short daily brief for ${doctorName}.
Today is ${todayStr}.

Metrics:
- Total active appointments today: ${totalAppointments}
- Peak hour: ${peakHour}
- Cancellations today: ${cancellationCount}
- Patients currently on waitlist: ${waitlistCount}
- Daily utilization: ${utilizationPercentage}

Based on these metrics, provide a concise summary and one practical recommendation.
Keep the response under 120 words. Be professional and directly address the doctor. No markdown formatting.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Failed to generate brief");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate brief.";
      setAiBrief(text);
    } catch (err) {
      console.error(err);
      setBriefError(err.message);
    } finally {
      setGeneratingBrief(false);
    }
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

  const hour = new Date().getHours();
  let greeting = "Good Night";
  let emoji = "🌙";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    emoji = "☀️";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    emoji = "🌤️";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
    emoji = "🌆";
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Doctor Dashboard
        </h1>

        <p className="text-slate-500 text-sm">
          {greeting}, {doctorName} {emoji}
        </p>
        <p className="text-xs text-blue-600 font-medium mt-1">
  Clinic Operations & Capacity Dashboard Active
</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="📅"
            label="Today's Consultations"
            value={todayAppts.length}
            color="blue"
          />

          <StatCard
            icon="🗓️"
            label="Upcoming Visits"
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
            label="Consultations Completed"
            value={completed.length}
            color="amber"
          />
        </div>

        <Card className="p-5 flex flex-col justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            Daily Clinic Capacity
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

            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-slate-800">
                {dateFilter === "today"
                  ? `Today's Appointments (${new Date(todayStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`
                  : dateFilter === "prev7"
                  ? `Appointments (${new Date(prev7Str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(todayStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`
                  : `Appointments (${new Date(todayStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(next7Str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`}
              </h2>

              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setDateFilter("prev7")}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${
                    dateFilter === "prev7"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Prev 7 Days
                </button>
                <button
                  onClick={() => setDateFilter("today")}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${
                    dateFilter === "today"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setDateFilter("next7")}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${
                    dateFilter === "next7"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Next 7 Days
                </button>
              </div>
            </div>

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
                  {displayAppts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-500 text-sm">
                        No appointments scheduled for this date.
                      </td>
                    </tr>
                  ) : (
                    displayAppts.map((a) => (
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

                      <td className="py-3 pr-4 text-slate-600 font-medium">
                        {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} <br/>
                        <span className="text-xs font-normal text-slate-500">{a.time}</span>
                      </td>

                      <td className="py-3 pr-4">
  <div className="flex items-center gap-2 flex-wrap">
    <Badge status={a.status} />

    {a.status === "requested" && (
      <span className="px-2 py-1 text-[10px] bg-red-100 text-red-600 rounded-full font-medium">
        Pending Confirmation
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
                  )))}
                </tbody>

              </table>
            </div>

          </Card>
        </div>

        <div className="space-y-6">

          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
            <h2 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span>✨</span> AI Daily Brief
            </h2>
            <p className="text-xs text-blue-700 mb-4">
              Get an intelligent summary of your schedule, peak hours, and actionable recommendations.
            </p>

            {aiBrief && briefMetrics ? (
              <div className="space-y-4">
                {/* Visual Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Appts</p>
                    <p className="text-lg font-black text-blue-900">{briefMetrics.total}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Utilization</p>
                    <p className="text-lg font-black text-emerald-600">{briefMetrics.util}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Waitlist</p>
                    <p className="text-lg font-black text-orange-600">{briefMetrics.waitlist}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Peak Hour</p>
                    <p className="text-sm mt-1 font-black text-violet-700">{briefMetrics.peak}</p>
                  </div>
                </div>

                {/* AI Text */}
                <div className="bg-white p-4 rounded-xl border border-blue-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm">
                  <span className="block text-xs font-bold text-blue-900 mb-2 uppercase tracking-wider">AI Insight & Recommendation</span>
                  {aiBrief}
                </div>
              </div>
            ) : generatingBrief ? (
              <div className="bg-white p-4 rounded-xl border border-blue-100 flex items-center justify-center gap-2 h-24">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <button
                onClick={generateAIBrief}
                disabled={generatingBrief}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Generate AI Daily Brief
              </button>
            )}

            {briefError && (
              <p className="text-red-500 text-xs mt-2 text-center">{briefError}</p>
            )}
          </Card>

          <Card className="p-6">

            <h2 className="font-bold text-slate-800 mb-2">
              Patient Reminders
            </h2>

            <p className="text-xs text-slate-500 mb-4">
              Prepare automated WhatsApp reminders for tomorrow's patients.
            </p>

            {simulatedCount !== null ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium border border-emerald-100 text-center">
                {simulatedCount} reminders prepared for tomorrow's appointments.
              </div>
            ) : (
              <button
                onClick={runNotificationSimulator}
                disabled={simulating}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                {simulating
                  ? "🔄 Processing..."
                  : "🚀 Queue Tomorrow's Reminders"}
              </button>
            )}

          </Card>

        </div>

      </div>
    </div>
  );
}