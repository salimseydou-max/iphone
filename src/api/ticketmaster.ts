import type { Event, EventCategory } from "../types/event";
import { ticketmasterApiKey } from "./config";

type TicketmasterImage = { url: string; width?: number; height?: number };

type TicketmasterEvent = {
  id: string;
  name: string;
  url?: string;
  images?: TicketmasterImage[];
  dates?: {
    start?: { dateTime?: string; localDate?: string; localTime?: string };
  };
  info?: string;
  pleaseNote?: string;
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: { name?: string };
      address?: { line1?: string };
    }>;
  };
};

type TicketmasterSearchResponse = {
  _embedded?: { events?: TicketmasterEvent[] };
};

function pickBestImage(images?: TicketmasterImage[]): string | undefined {
  if (!images?.length) return undefined;
  // Prefer a "wide-ish" image around ~1200-1600px if possible.
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url;
}

function toISO(dates?: TicketmasterEvent["dates"]): string {
  const dt = dates?.start?.dateTime;
  if (dt) return dt;
  // Fallback to localDate/localTime if dateTime isn't present.
  const localDate = dates?.start?.localDate;
  const localTime = dates?.start?.localTime ?? "19:00:00";
  if (localDate) return new Date(`${localDate}T${localTime}`).toISOString();
  return new Date().toISOString();
}

function mapCategory(input: unknown): EventCategory {
  const s = String(input ?? "").toLowerCase();
  if (s.includes("music")) return "music";
  if (s.includes("sports") || s.includes("fitness")) return "fitness";
  if (s.includes("arts") || s.includes("theatre")) return "art";
  if (s.includes("miscellaneous") || s.includes("food")) return "food";
  // Ticketmaster doesn't have "tech"; we map conferences/other to tech when asked via classificationName.
  return "tech";
}

function mapEvent(e: TicketmasterEvent, forcedCategory?: EventCategory): Event {
  const venue = e._embedded?.venues?.[0];
  const segment = e.classifications?.[0]?.segment?.name;
  return {
    id: e.id,
    title: e.name,
    description: e.info ?? e.pleaseNote,
    startsAtISO: toISO(e.dates),
    venueName: venue?.name,
    city: venue?.city?.name,
    address: venue?.address?.line1,
    imageUrl: pickBestImage(e.images),
    category: forcedCategory ?? mapCategory(segment),
    url: e.url,
  };
}

export async function ticketmasterListEvents(params: {
  keyword?: string;
  category?: EventCategory;
  city?: string;
  page?: number; // 0-based
  pageSize?: number;
}): Promise<Event[]> {
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", ticketmasterApiKey);
  url.searchParams.set("size", String(params.pageSize ?? 30));
  if (typeof params.page === "number") {
    url.searchParams.set("page", String(params.page));
  }

  if (params.keyword) url.searchParams.set("keyword", params.keyword);
  if (params.city) url.searchParams.set("city", params.city);

  // Ticketmaster categories are provider-specific; for our UX, we use broad mapping:
  // - music => segmentName=Music
  // - art => segmentName=Arts & Theatre
  // - fitness => segmentName=Sports (closest)
  // - food/tech => leave open (keyword filters can narrow)
  if (params.category === "music") url.searchParams.set("segmentName", "Music");
  if (params.category === "art")
    url.searchParams.set("segmentName", "Arts & Theatre");
  if (params.category === "fitness")
    url.searchParams.set("segmentName", "Sports");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Ticketmaster error (${res.status})`);
  }
  const json = (await res.json()) as TicketmasterSearchResponse;
  const items = json._embedded?.events ?? [];
  return items.map((e) => mapEvent(e, params.category));
}

export async function ticketmasterGetEvent(id: string): Promise<Event> {
  const url = new URL(`https://app.ticketmaster.com/discovery/v2/events/${id}`);
  url.searchParams.set("apikey", ticketmasterApiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Ticketmaster error (${res.status})`);
  }
  const json = (await res.json()) as TicketmasterEvent;
  return mapEvent(json);
}

