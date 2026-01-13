import type { Event, EventCategory } from "../types/event";
import { isTicketmasterEnabled } from "./config";
import { ticketmasterGetEvent, ticketmasterListEvents } from "./ticketmaster";
import { mockListEvents } from "./mockProvider";

export async function listEventsPage(params: {
  keyword?: string;
  category?: EventCategory;
  city?: string;
  page: number; // 0-based
  pageSize: number;
}): Promise<{ events: Event[]; hasMore: boolean }> {
  if (isTicketmasterEnabled) {
    const events = await ticketmasterListEvents(params);
    // Ticketmaster pagination is finite; if we got less than requested, assume no more.
    return { events, hasMore: events.length === params.pageSize };
  }

  return mockListEvents({
    keyword: params.keyword,
    category: params.category,
    city: params.city,
    page: params.page,
    pageSize: params.pageSize,
  });
}

// Back-compat helper: return the first page only.
export async function listEvents(params: {
  keyword?: string;
  category?: EventCategory;
  city?: string;
  page?: number; // 0-based
  pageSize?: number;
}): Promise<Event[]> {
  const { events } = await listEventsPage({
    keyword: params.keyword,
    category: params.category,
    city: params.city,
    page: params.page ?? 0,
    pageSize: params.pageSize ?? 30,
  });
  return events;
}

export async function getEventById(id: string): Promise<Event | null> {
  if (isTicketmasterEnabled) {
    return await ticketmasterGetEvent(id);
  }
  // Lightweight mock resolution: parse `mock-<index>` and regenerate.
  const m = /^mock-(\d+)$/.exec(id);
  if (!m) return null;
  const idx = Number(m[1]);
  const { events } = mockListEvents({
    page: idx,
    pageSize: 1,
    keyword: undefined,
    category: undefined,
    city: undefined,
  });
  return events[0] ?? null;
}

