export const DOCTORS = [
  {
    id: "D001",
    name: "Dr. Srinivas Rao",
    spec: "General Medicine, Child Care & Preventive Health",
    fee: 300,
  },
  {
    id: "D002",
    name: "Dr. Priya Sharma",
    spec: "Skin Care & ENT Specialist",
    fee: 400,
  },
  {
    id: "D003",
    name: "Dr. Rajesh Kumar",
    spec: "Dental Care Specialist",
    fee: 350,
  },
];

export const DOCTOR = {
  name: "MediConnect Clinic",
  qualifications: "Multi-Speciality Healthcare Center",
  experience: 15,
  certifications: [
    "NABH Standards Compliant",
    "Advanced Digital Appointment System",
    "Multi-Speciality Medical Team"
  ],
  achievements: [
    "12,000+ Patients Served",
    "Trusted Healthcare Provider",
    "Modern Appointment Management"
  ],
  regNo: "MCI-2009-43872",
  clinic: "MediConnect Clinic",
  tagline: "Compassionate care, modern medicine.",
  about:
    "MediConnect Clinic was established with a vision to provide affordable, accessible and technology-enabled healthcare. Our experienced team of doctors specializes in General Medicine, Child Care, Preventive Health, Skin Care, ENT Services and Dental Care. We combine expert medical care with modern digital healthcare solutions to improve patient experience.",
  timings: "Mon – Sat: 9:00 AM – 1:00 PM, 5:00 PM – 9:00 PM",
  phone: "+91 6302674608",
  whatsapp: "916302674608",
  email: "info@mediconnect.in",
  address: "42, Jubilee Hills Rd No. 36, Hyderabad, Telangana 500033",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.590509650472!2d78.396265!3d17.439818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzIzLjMiTiA3OMKwMjQnMDQuMyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
};

export const SERVICES = [
  { id: "general", icon: "🩺", label: "General Consultation", desc: "Comprehensive health check-ups and medical consultations for all age groups." },
  { id: "child", icon: "👶", label: "Child Care", desc: "Paediatric consultations, vaccinations, growth monitoring and developmental assessments." },
  { id: "dental", icon: "🦷", label: "Dental Care", desc: "Dental check-ups, cleaning, fillings, extractions and oral health counselling." },
  { id: "skin", icon: "✨", label: "Skin Care", desc: "Dermatology consultations for acne, eczema, psoriasis and cosmetic skin treatments." },
  { id: "ent", icon: "👂", label: "ENT Care", desc: "Ear, nose and throat consultations, hearing assessments and sinus treatments." },
  { id: "other", icon: "💊", label: "Preventive Health", desc: "Annual health packages, blood work, lifestyle counselling and vaccination drives." },
];

export const TESTIMONIALS = [
  { name: "Meena Reddy", text: "Dr. Rao diagnosed my son's recurring fever within minutes. Excellent doctor with a warm bedside manner.", rating: 5 },
  { name: "Suresh Babu", text: "I've been visiting MediConnect for 3 years. The staff is professional and the doctor is always on time.", rating: 5 },
  { name: "Priya Sharma", text: "My skin condition was treated effectively. Dr. Rao explained everything clearly. Highly recommended!", rating: 5 },
  { name: "Ramesh Nair", text: "Booked online and got confirmed within 30 minutes. Very convenient and the consultation was thorough.", rating: 4 },
];

export const SAMPLE_PATIENTS = [
  { id: "P001", name: "Kartheek", phone: "9876501001", email: "kartheek.demo@gmail.com", age: 34, visitCount: 5, lastVisit: "2025-06-15", notes: "Hypertension – on medication" },
  { id: "P002", name: "Akash", phone: "9876501002", email: "akash.demo@gmail.com", age: 28, visitCount: 3, lastVisit: "2025-06-18", notes: "Routine follow-up" },
  { id: "P003", name: "Venkat", phone: "9876501003", email: "venkat.demo@gmail.com", age: 52, visitCount: 8, lastVisit: "2025-06-10", notes: "Diabetes Type 2" },
  { id: "P004", name: "Charith", phone: "9876501004", age: 7, visitCount: 2, lastVisit: "2025-06-20", notes: "Paediatric – fever & cough" },
  { id: "P005", name: "Avinash", phone: "9876501005", age: 45, visitCount: 4, lastVisit: "2025-06-12", notes: "ENT - chronic sinusitis" },
  { id: "P006", name: "Anitha S", phone: "9876501006", age: 31, visitCount: 1, lastVisit: "2025-06-22", notes: "Skin allergy" },
  { id: "P007", name: "Srinivas R", phone: "9876501007", age: 60, visitCount: 10, lastVisit: "2025-06-08", notes: "Cardiac monitoring" }
];

export const today = new Date();
export const fmt = (d) => d.toISOString().split("T")[0];
export const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

export const SAMPLE_APPOINTMENTS = [
  { id: "APT001", patientName: "Kartheek", phone: "9876501001", email: "kartheek.demo@gmail.com", age: 34, date: fmt(today), time: "09:00 AM", service: "general", status: "confirmed", doctorId: "D001", price: 300, notes: "Follow-up for BP", createdAt: new Date(Date.now() - 100000).toISOString() },
  { id: "APT002", patientName: "Akash", phone: "9876501002", email: "akash.demo@gmail.com", age: 28, date: fmt(today), time: "09:30 AM", service: "skin", status: "waitlist", doctorId: "D001", price: 400, notes: "Routine check", createdAt: new Date(Date.now() - 50000).toISOString() },
  { id: "APT003", patientName: "Venkat", phone: "9876501003", email: "venkat.demo@gmail.com", age: 52, date: fmt(today), time: "10:00 AM", service: "general", status: "requested", doctorId: "D001", price: 300, notes: "Diabetes check", createdAt: new Date().toISOString() },
  { id: "APT004", patientName: "Charith", phone: "9876501004", age: 7, date: fmt(today), time: "11:00 AM", service: "child", status: "requested", doctorId: "D002", price: 350, notes: "Fever 3 days", createdAt: new Date().toISOString() },
  { id: "APT005", patientName: "Avinash", phone: "9876501005", age: 45, date: fmt(today), time: "12:00 PM", service: "ent", status: "arrived", doctorId: "D002", price: 300, notes: "Sinus", createdAt: new Date(Date.now() - 200000).toISOString() },
  { id: "APT006", patientName: "Anitha S", phone: "9876501006", age: 31, date: fmt(today), time: "01:00 PM", service: "skin", status: "cancelled", doctorId: "D003", price: 400, notes: "Rash on arms", createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "APT007", patientName: "Srinivas R", phone: "9876501007", age: 60, date: fmt(today), time: "02:00 PM", service: "general", status: "waitlist", doctorId: "D003", price: 300, notes: "Cardiac review", createdAt: new Date(Date.now() - 40000).toISOString() },
];

export const TIME_SLOTS = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM"];
export const MAX_SLOTS_PER_DOCTOR = 15;

export const AI_RESPONSES = {
  timing: "We are open Monday to Saturday: 9:00 AM – 1:00 PM and 5:00 PM – 9:00 PM. Closed on Sundays.",
  services: "We offer General Consultation, Child Care, Dental Care, Skin Care, ENT Care, and Preventive Health packages.",
  appointment: "You can book an appointment right here on this website! Click 'Book Appointment', fill in your details, choose a date and time, and submit. You'll receive an Appointment ID instantly.",
  location: "We are located at 42, Jubilee Hills Rd No. 36, Hyderabad, Telangana 500033. Easily accessible by metro.",
  fee: "Consultation fees vary by specialist and time. Standard rates range from ₹300-₹400, with a 15% surge for evening slots and ₹50 weekend premium.",
  emergency: "For medical emergencies, please call 108 (Ambulance) or reach us at +91 6302674608.",
  default: "I can help you with clinic timings, available services, how to book an appointment, and our location. What would you like to know?",
};