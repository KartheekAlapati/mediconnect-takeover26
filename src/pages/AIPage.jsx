import { useState, useRef, useEffect } from "react";
import { Card } from "../components/UIComponents";
import { getAIResponse } from "../utils/helpers";

export default function AIPage() {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! I'm MediAssist, your virtual health assistant. I can help you with clinic timings, services, appointments, and more. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const botMsg = { role: "bot", text: getAIResponse(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestions = ["What are the clinic timings?", "What services do you offer?", "How do I book an appointment?", "Where is the clinic located?"];

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">MediAssist AI</h1>
      <p className="text-slate-500 mb-6">Your 24/7 virtual health assistant</p>
      <Card className="flex flex-col h-96 overflow-hidden mb-4 bg-white border border-slate-200">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"}`}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>
        <div className="border-t border-slate-100 p-3 flex gap-2 bg-white">
          <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ask me anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium">Send</button>
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(s => <button key={s} onClick={() => { setInput(s); }} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">{s}</button>)}
      </div>
    </div>
  );
}