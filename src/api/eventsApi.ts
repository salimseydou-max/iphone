import type { Event, EventCategory } from "../types/event";
import { isTicketmasterEnabled } from "./config";
import { mockEvents } from "./mockData";
import { ticketmasterGetEvent, ticketmasterListEvents } from "./ticketmaster";

export async function listEvents(params: {
  keyword?: string;
  category?: EventCategory;
  city?: string;
}): Promise<Event[]> {
  if (isTicketmasterEnabled) {
    return await ticketmasterListEvents(params);
  }

  // Mock fallback: filter in-memory to keep UX identical when no API key is configured.
  const keyword = params.keyword?.trim().toLowerCase() ?? "";
  const city = params.city?.trim().toLowerCase() ?? "";

  return mockEvents.filter((e) => {
    if (params.category && e.category !== params.category) return false;
    if (city && !(e.city ?? "").toLowerCase().includes(city)) return false;
    if (!keyword) return true;
    const hay = `${e.title} ${e.description ?? ""} ${e.venueName ?? ""}`.toLowerCase();
    return hay.includes(keyword);
  });
}

export async function getEventById(id: string): Promise<Event | null> {
  if (isTicketmasterEnabled) {
    return await ticketmasterGetEvent(id);
  }
  return mockEvents.find((e) => e.id === id) ?? null;
}

