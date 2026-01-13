import type { Event, EventCategory } from "../types/event";

function inDays(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(19, 0, 0, 0);
  return d.toISOString();
}

const base: Array<Omit<Event, "category"> & { category: EventCategory }> = [
  {
    id: "mock-1",
    title: "Sunset Jazz by the Bay",
    description:
      "A relaxed outdoor jazz set with local artists. Bring a blanket and enjoy the view.",
    startsAtISO: inDays(1),
    venueName: "Harbor Park Stage",
    city: "San Francisco",
    address: "1 Embarcadero, San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80",
    category: "music",
    url: "https://example.com/events/mock-1",
  },
  {
    id: "mock-2",
    title: "iOS Meetup: SwiftUI Patterns",
    description:
      "Lightning talks + networking for iOS developers. Beginners welcome.",
    startsAtISO: inDays(3),
    venueName: "Downtown Co-Working",
    city: "San Francisco",
    address: "Market St, San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    category: "tech",
    url: "https://example.com/events/mock-2",
  },
  {
    id: "mock-3",
    title: "Saturday Morning Run Club",
    description:
      "5K social run. All paces. Post-run coffee optional (recommended).",
    startsAtISO: inDays(2),
    venueName: "Mission Track",
    city: "San Francisco",
    address: "Mission District, San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",
    category: "fitness",
    url: "https://example.com/events/mock-3",
  },
  {
    id: "mock-4",
    title: "Night Market & Street Food",
    description:
      "Local vendors, small bites, and live DJs. Come hungry.",
    startsAtISO: inDays(5),
    venueName: "Civic Center Plaza",
    city: "San Francisco",
    address: "Civic Center, San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1600&q=80",
    category: "food",
    url: "https://example.com/events/mock-4",
  },
  {
    id: "mock-5",
    title: "Modern Art Workshop: Color & Form",
    description:
      "Hands-on workshop exploring composition and color. Materials provided.",
    startsAtISO: inDays(7),
    venueName: "Studio 12",
    city: "San Francisco",
    address: "SoMa, San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
    category: "art",
    url: "https://example.com/events/mock-5",
  },
];

export const mockEvents: Event[] = base;

