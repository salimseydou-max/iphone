export function formatEventDateTime(iso: string): string {
  const d = new Date(iso);
  // iOS-like: "Tue, Jan 13 · 7:00 PM"
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

