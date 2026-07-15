import { useState } from "react";
import {
  SERVICES,
  TIME_SLOTS,
  MAX_SLOTS_PER_DOCTOR
} from "../data/mockData";
import { genId } from "../utils/helpers";
import { Card, Badge } from "../components/UIComponents";
import { supabase } from "../utils/supabase";

export default function BookPage({
  appointments,
  setAppointments,
  navigate,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    date: "",
    time: "",
    service: "",
    notes: "",
  });

  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit phone number";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (
      !form.age ||
      Number(form.age) < 1 ||
      Number(form.age) > 100
    ) {
      e.age = "Age must be between 1 and 100";
    }

    if (!form.service) {
      e.service = "Select a service";
    }

    if (!form.date) {
      e.date = "Select a date";
    } else {
      const selectedDate = new Date(form.date);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const maxAllowed = new Date();
      maxAllowed.setMonth(maxAllowed.getMonth() + 1);

      if (selectedDate < currentDate) {
        e.date = "Past dates are not allowed";
      }

      if (selectedDate > maxAllowed) {
        e.date = "Booking allowed only within 30 days";
      }
    }

    if (!form.time) {
      e.time = "Select a time slot";
    }

    return e;
  };

  const submit = async () => {
  console.log("SUBMIT CLICKED");

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    console.log(validationErrors);
    setErrors(validationErrors);
    return;
  }

  setErrors({});
    let assignedDoctor = "";

if (
  form.service === "general" ||
  form.service === "child" ||
  form.service === "other"
) {
  assignedDoctor = "D001";
}

else if (
  form.service === "skin" ||
  form.service === "ent"
) {
  assignedDoctor = "D002";
}

else if (
  form.service === "dental"
) {
  assignedDoctor = "D003";
}
const existingBooking = appointments.find(
  (a) =>
    a.doctorId === assignedDoctor &&
    a.date === form.date &&
    a.time === form.time &&
    a.status !== "cancelled"
);

if (existingBooking) {
  alert(
    "Selected slot is already booked. Please choose another time."
  );
  return;
}
const doctorBookings = appointments.filter(
  (a) =>
    a.doctorId === assignedDoctor &&
    a.date === form.date &&
    a.status !== "cancelled"
);

if (doctorBookings.length >= MAX_SLOTS_PER_DOCTOR) {

  const appointment = {
    id: genId("APT"),
    ...form,
    doctorId: assignedDoctor,
    status: "waitlist",
    createdAt: new Date().toISOString(),
  };

  console.log("Payload being inserted:", appointment);
  const { error } = await supabase.from("appointments").insert([appointment]);
  if (error) {
    console.error("Booking error:", JSON.stringify(error, null, 2));
    alert("Failed to book waitlist appointment.");
    return;
  }

  setAppointments((prev) => [...prev, appointment]);

  setSuccess(appointment);

  return;
}

setErrors({});
    const appointment = {
      id: genId("APT"),
      ...form,
      doctorId: assignedDoctor,
      status: "requested",
      createdAt: new Date().toISOString(),
    };

    console.log("Payload being inserted:", appointment);
    const { error } = await supabase.from("appointments").insert([appointment]);
    if (error) {
      console.error("Booking error:", JSON.stringify(error, null, 2));
      alert("Failed to book appointment.");
      return;
    }

    setAppointments((prev) => [...prev, appointment]);

    setSuccess(appointment);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>

        <h2 className="text-2xl font-bold text-emerald-700 mb-2">
          Appointment Request Submitted
        </h2>

        <p className="text-slate-500 mb-6">
          Your appointment has been sent to reception for approval.
        </p>

        <Card className="p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">
              Appointment ID
            </span>

            <span className="font-bold text-blue-600">
              {success.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">
              Patient
            </span>

            <span className="font-medium">
              {success.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">
              Date
            </span>

            <span className="font-medium">
              {success.date}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">
              Time
            </span>

            <span className="font-medium">
              {success.time}
            </span>
          </div>
          <div className="flex justify-between">
  <span className="text-slate-500 text-sm">
    Assigned Doctor
  </span>

  <span className="font-medium">
    {success.doctorId === "D001"
      ? "Dr. Srinivas Rao"
      : success.doctorId === "D002"
      ? "Dr. Priya Sharma"
      : "Dr. Rajesh Kumar"}
  </span>
</div>

          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">
              Status
            </span>

            <Badge status="requested" />
          </div>
        </Card>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setSuccess(null);

              setForm({
                name: "",
                phone: "",
                email: "",
                age: "",
                date: "",
                time: "",
                service: "",
                notes: "",
              });
            }}
            className="text-blue-600 font-medium hover:underline"
          >
            Book Another
          </button>

          <button
            onClick={() => navigate("patient")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            View Appointments
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

  const showError = (key) =>
    errors[key] ? (
      <p className="text-red-500 text-xs mt-1">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Book an Appointment
      </h1>

      <p className="text-slate-600 mb-8">
        Fill in your details and request an appointment.
      </p>

      <Card className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Full Name *
            </label>

            <input
              className={inputClass}
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Enter full name"
            />

            {showError("name")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Phone Number *
            </label>

            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="10 digit mobile number"
            />

            {showError("phone")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Email Address (Optional)
            </label>

            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="patient@example.com"
            />

            {showError("email")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Age *
            </label>

            <input
              type="number"
              className={inputClass}
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value,
                })
              }
              placeholder="Age"
            />

            {showError("age")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Service *
            </label>

            <select
              className={inputClass}
              value={form.service}
              onChange={(e) =>
                setForm({
                  ...form,
                  service: e.target.value,
                })
              }
            >
              <option value="">Select Service</option>

              {SERVICES.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.label}
                </option>
              ))}
            </select>

            {showError("service")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Date *
            </label>

            <input
              type="date"
              min={minDate}
              max={maxDate}
              className={inputClass}
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
            />

            {showError("date")}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Time Slot *
            </label>

            <select
              className={inputClass}
              value={form.time}
              onChange={(e) =>
                setForm({
                  ...form,
                  time: e.target.value,
                })
              }
            >
              <option value="">Select Time Slot</option>

              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            {showError("time")}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Additional Notes
          </label>

          <textarea
            className={`${inputClass} h-24 resize-none`}
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            placeholder="Symptoms, concerns, or special requests..."
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Confirm & Book
        </button>
      </Card>
    </div>
  );
}