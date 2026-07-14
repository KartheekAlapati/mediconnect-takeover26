import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are MediBot, the AI Healthcare Assistant for MediConnect Clinic.

CLINIC INFORMATION:
Name: MediConnect Clinic
Tagline: Compassionate care, modern medicine.
About: We provide affordable, accessible and technology-enabled healthcare. Our team specializes in General Medicine, Child Care, Preventive Health, Skin Care, ENT Services and Dental Care.
Timings: Monday - Saturday, 9:00 AM - 1:00 PM and 5:00 PM - 9:00 PM
Phone: +91 6302674608
Email: info@mediconnect.in
Address: 42, Jubilee Hills Rd No. 36, Hyderabad, Telangana 500033

DOCTORS:
1. Dr. Srinivas Rao - General Medicine, Child Care, Preventive Health (Fee: ₹300)
2. Dr. Priya Sharma - Skin Care, ENT Specialist (Fee: ₹400)
3. Dr. Rajesh Kumar - Dental Care (Fee: ₹350)

SERVICES:
General Consultation, Child Care, Dental Care, Skin Care, ENT Care, Preventive Health

RULES:
- You may assist with Doctors, Services, Timings, Contact Info, Location, and Booking Guidance.
- You MUST NOT diagnose diseases, prescribe medicines, recommend treatments, or give emergency advice.
- If asked for diagnosis or medicine, respond exactly: "I cannot provide medical diagnoses or prescribe medications. Please consult one of our qualified doctors for professional medical advice."

ANTI-HALLUCINATION RULES:
- You MUST NEVER invent doctor names, appointments, schedules, availability, contact info, or services.
- You do not have real-time access to the live booking calendar.
- If asked about appointment availability (e.g., "Book tomorrow 11am"), respond exactly: "I cannot currently access real-time appointment availability. Please use the Book Appointment page for scheduling."

RESPONSE STYLE (CRITICAL):
- EXTREME BREVITY: Answer ONLY the user's specific question.
- MAXIMUM 2 SENTENCES per response.
- DO NOT append clinic timings, address, phone numbers, or promotional text unless explicitly asked.
- DO NOT append conversational filler like "We look forward to assisting you" or "Is there anything else I can help with?".
- Friendly, professional, and direct.`;

export default function MediBot({ navigate, showBot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "👋 Welcome to MediConnect!\n\nI'm MediBot, your AI Healthcare Assistant 🩺\n\nHow can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Gemini API Key");
      }

      // Limit conversation history to last 5 messages (must start with user)
      let recentHistory = messages.slice(1).slice(-5);
      if (recentHistory.length > 0 && recentHistory[0].role !== "user") {
        recentHistory = recentHistory.slice(1);
      }

      const historyContents = recentHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
      
      historyContents.push({ role: "user", parts: [{ text: text.trim() }] });

      const payload = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: historyContents,
      };
      
      console.log("Gemini Request Payload:", JSON.stringify(payload, null, 2));

      const startTime = performance.now();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`Total Request Duration: ${duration} seconds`);
      console.log("Gemini API Response:", data);
      
      if (!response.ok) {
        console.error("Exact Gemini Error:", data.error?.message);
        throw new Error(data?.error?.message || "API request failed");
      }

      const botText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't understand that.";

      setMessages((prev) => [
        ...prev,
        { role: "model", text: botText, time: new Date() },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ Sorry, I encountered an error connecting to the AI. Please try again later.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const clearChat = () => {
    if(window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        {
          role: "model",
          text: "👋 Welcome to MediConnect!\n\nI'm MediBot, your AI Healthcare Assistant 🩺\n\nHow can I help you today?",
          time: new Date(),
        },
      ]);
    }
  };

  if (!showBot) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 font-sans">
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-[360px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
                🤖
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide">MediBot</p>
                <p className="text-[10px] text-blue-100 font-medium">
                  AI Healthcare Assistant
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/20 transition text-sm"
                title="Clear Chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/20 transition text-lg leading-none"
                title="Minimize"
              >
                ×
              </button>
            </div>
          </div>

          {/* Quick Actions Navigation */}
          <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar items-center">
            <button onClick={() => { navigate("book"); setIsOpen(false); }} className="shrink-0 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border border-blue-200">
              📅 Book Appointment
            </button>
            <button onClick={() => { navigate("doctors"); setIsOpen(false); }} className="shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap">
              👨‍⚕️ View Doctors
            </button>
            <button onClick={() => { navigate("services"); setIsOpen(false); }} className="shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap">
              🏥 Services
            </button>
            <button onClick={() => { navigate("contact"); setIsOpen(false); }} className="shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap">
              📞 Contact
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  m.role === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                  {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col self-start items-start max-w-[85%]">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-[42px]">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (only if just 1 message) */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 pb-2 bg-slate-50 flex flex-wrap gap-2">
              {["What services do you offer?", "Who are your doctors?", "What are clinic timings?", "What are consultation fees?", "How do I book an appointment?"].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="bg-white border border-blue-100 text-blue-700 text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition shadow-sm font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MediBot anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl shadow-2xl hover:scale-105 hover:shadow-blue-500/50 transition-all flex items-center justify-center border-2 border-white/20"
          style={{
            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 8px 10px -6px rgba(37, 99, 235, 0.1)"
          }}
        >
          {isOpen ? <span className="text-white text-xl">×</span> : <span>🤖</span>}
        </button>
        {!isOpen && (
          <button
            onClick={() => showBot === undefined ? null : null /* Just a dummy to keep layout consistent if needed */}
            className="absolute -top-1 -right-1 flex h-3 w-3"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
          </button>
        )}
      </div>
    </div>
  );
}
