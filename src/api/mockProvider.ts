import type { Event, EventCategory } from "../types/event";
import { mockTotalEvents } from "./config";

const categories: EventCategory[] = ["music", "tech", "fitness", "food", "art"];
const sampleCities = ["San Francisco", "New York", "Austin", "Seattle", "Chicago", "Los Angeles"];
const sampleVenues = ["Civic Hall", "Studio 12", "Riverside Park", "Downtown Co-Working", "Harbor Stage"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

function startsAtISO(i: number): string {
  const d = new Date();
  // Spread events across the next 120 days.
  d.setDate(d.getDate() + (i % 120));
  // Give a "reasonable" start time range (18:00–21:00).
  d.setHours(18 + (i % 4), 0, 0, 0);
  return d.toISOString();
}

function imageUrl(i: number): string {
  // Unsplash with a cache-busting sig parameter for variety.
  // (This is safe for mock/demo; for production, prefer provider images.)
  const seed = (i % 1000) + 1;
  return `https://images.unsplash.com/photo-1521334726092-b509a19597c1?auto=format&fit=crop&w=1600&q=80&sig=${seed}`;
}

export function mockListEvents(params: {
  keyword?: string;
  category?: EventCategory;
  city?: string;
  page: number; // 0-based
  pageSize: number;
}): { events: Event[]; hasMore: boolean } {
  const total = Number.isFinite(mockTotalEvents) && mockTotalEvents > 0 ? mockTotalEvents : 3000000;

  const start = params.page * params.pageSize;
  if (start >= total) return { events: [], hasMore: false };

  const endExclusive = Math.min(total, start + params.pageSize);
  const keyword = params.keyword?.trim();
  const city = params.city?.trim();

  const events: Event[] = [];
  for (let i = start; i < endExclusive; i += 1) {
    const cat = params.category ?? pick(categories, i);
    const resolvedCity = city && city.length > 0 ? city : pick(sampleCities, i);
    const venue = pick(sampleVenues, i);

    events.push({
      id: `mock-${i}`,
      title: keyword && keyword.length > 0 ? `${keyword} • ${cat.toUpperCase()} #${i}` : `${cat.toUpperCase()} Event #${i}`,
      description:
        "Synthetic event generated locally for development. Configure Ticketmaster to use real nearby events.",
      startsAtISO: startsAtISO(i),
      venueName: venue,
      city: resolvedCity,
      address: `${(i % 999) + 1} Market St`,
      imageUrl: imageUrl(i),
      category: cat,
      url: "https://example.com",
    });
  }

  return { events, hasMore: endExclusive < total };
}

