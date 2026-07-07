import { AI_RESPONSES, SERVICES } from "../data/mockData";

export function genId(prefix) {
  return prefix + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("time") || m.includes("hour") || m.includes("open") || m.includes("timing")) return AI_RESPONSES.timing;
  if (m.includes("service") || m.includes("treat") || m.includes("speciali")) return AI_RESPONSES.services;
  if (m.includes("book") || m.includes("appoint") || m.includes("schedul")) return AI_RESPONSES.appointment;
  if (m.includes("location") || m.includes("address") || m.includes("where") || m.includes("map")) return AI_RESPONSES.location;
  if (m.includes("fee") || m.includes("cost") || m.includes("price") || m.includes("charge")) return AI_RESPONSES.fee;
  if (m.includes("emergency") || m.includes("urgent")) return AI_RESPONSES.emergency;
  return AI_RESPONSES.default;
}

export const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export const serviceLabel = (id) => SERVICES.find(s => s.id === id)?.label || id;