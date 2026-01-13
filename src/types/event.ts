export type EventCategory = "music" | "tech" | "fitness" | "food" | "art";

export type Event = {
  id: string;
  title: string;
  description?: string;
  startsAtISO: string; // ISO string in UTC or local time from provider
  venueName?: string;
  city?: string;
  address?: string;
  imageUrl?: string;
  category: EventCategory;
  url?: string; // provider deep link / website
};

