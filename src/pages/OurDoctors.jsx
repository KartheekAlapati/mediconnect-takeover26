export default function OurDoctors({ navigate }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
        <button
  onClick={() => navigate("home")}
  className="mb-6 text-blue-600 font-medium hover:text-blue-800"
>
  
← Back to Home
</button>
      <h1 className="text-4xl font-bold text-center mb-3">
        Our Doctors
      </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
      <p className="text-center text-slate-500 mb-10">
        Meet our experienced healthcare specialists
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Dr Srinivas */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
          <img
            src="/doctor1.png"
            alt="Dr Srinivas Rao"
            className="w-full h-72 object-cover rounded-xl mb-4"
          />

          <h2 className="text-xl font-bold">
            Dr. Srinivas Rao
          </h2>

          <p className="text-blue-600 font-medium mb-3">
            Founder & Chief Physician
          </p>
            <p className="text-sm text-slate-500 mb-3">
  15+ Years Experience
</p>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>✓ General Consultation</li>
            <li>✓ Child Care</li>
            <li>✓ Preventive Health</li>
          </ul>
          <button
  onClick={() => navigate("book")}
  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
>

  Consult Now →
</button>
        </div>

        {/* Dr Priya */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
          <img
            src="/doctor2.png"
            alt="Dr Priya Sharma"
            className="w-full h-72 object-cover rounded-xl mb-4"
          />

          <h2 className="text-xl font-bold">
            Dr. Priya Sharma
          </h2>
<p className="text-sm text-slate-500 mb-3">
  10+ Years Experience
</p>
          <p className="text-blue-600 font-medium mb-3">
            Dermatology & ENT Specialist
          </p>

          <ul className="text-sm text-slate-600 space-y-1">
            <li>✓ Skin Care</li>
            <li>✓ ENT Care</li>
          </ul>
          <button
  onClick={() => navigate("book")}
  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
>

  Consult Now →
</button>
        </div>

        {/* Dr Rajesh */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
          <img
            src="/doctor3.png"
            alt="Dr Rajesh Kumar"
            className="w-full h-72 object-cover rounded-xl mb-4"
          />

          <h2 className="text-xl font-bold">
            Dr. Rajesh Kumar
          </h2>
<p className="text-sm text-slate-500 mb-3">
  12+ Years Experience
</p>
          <p className="text-blue-600 font-medium mb-3">
            Dental Specialist
          </p>

          <ul className="text-sm text-slate-600 space-y-1">
            <li>✓ Dental Care</li>
          </ul>
          <button
  onClick={() => navigate("book")}
  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
>

  Consult Now →
</button>
        </div>

      </div>
    </div>
  );
}