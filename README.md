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
- `EXPO_PUBLIC_MOCK_TOTAL_EVENTS`: mock dataset size (default: `3000000`, generated on-demand)

See `.env.example`.

### Build notes

- **iOS / App Store**: this codebase avoids web-only hacks and uses native navigation + AsyncStorage.
- **Web / Vercel**: Expo web works via `npm run export:web` and Vercel static hosting.

### Screens

- `Explore`: browse by category + search, pull-to-refresh, skeleton loading
- `Event details`: image + time/location + description + save/unsave
- `Favorites`: saved list backed by AsyncStorage

### API layer

- Ticketmaster (when configured): `src/api/ticketmaster.ts`
- Mock fallback (no keys needed): `src/api/mockData.ts`
- Provider switch + mapping: `src/api/eventsApi.ts`

### Deploy to Vercel (Expo web)

This repo includes a `vercel.json` that exports the site into `dist/`.

- **Build Command**: `npm run export:web`
- **Output Directory**: `dist`

If you need runtime variables on Vercel, set `EXPO_PUBLIC_*` env vars in the Vercel project settings.

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

