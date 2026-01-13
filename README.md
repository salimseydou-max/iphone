## Nearby Events (Expo + React Native)

iOS-first Expo app to discover nearby events, search, and save favorites locally.

### Requirements

- Node.js 18+ (recommended)
- `npm` (comes with Node)

### Setup

```bash
npm install
cp .env.example .env
```

### Run locally

```bash
npx expo start
```

- Press `i` for iOS Simulator (macOS only) or scan QR in Expo Go.
- For web (Vercel / local): `npx expo start --web`

### Environment variables

Expo supports runtime env vars via `EXPO_PUBLIC_*`.

- `EXPO_PUBLIC_EVENTS_PROVIDER`: `ticketmaster` | `mock` (default: `mock`)
- `EXPO_PUBLIC_TICKETMASTER_API_KEY`: Ticketmaster Discovery API key

See `.env.example`.

### Build notes

- **iOS / App Store**: this codebase avoids web-only hacks and uses native navigation + AsyncStorage.
- **Web / Vercel**: Expo web works via `npx expo export --platform web` and Vercel static hosting.

### Project structure

```
src/
  api/            # remote providers (Ticketmaster + mock) and mapping
  components/     # reusable UI components
  features/       # domain-focused features (events, favorites)
  navigation/     # navigators and screen types
  theme/          # colors + spacing for iOS-like UI
  utils/          # small helpers (formatting, storage)
```

