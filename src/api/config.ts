type EventsProvider = "ticketmaster" | "mock";

export const eventsProvider: EventsProvider =
  (process.env.EXPO_PUBLIC_EVENTS_PROVIDER as EventsProvider | undefined) ??
  "mock";

export const ticketmasterApiKey =
  process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY ?? "";

export const isTicketmasterEnabled =
  eventsProvider === "ticketmaster" && ticketmasterApiKey.length > 0;

// Mock-only: how many synthetic events exist (generated on-demand, not stored).
export const mockTotalEvents = Number(process.env.EXPO_PUBLIC_MOCK_TOTAL_EVENTS ?? "3000000");

