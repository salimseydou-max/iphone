import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "../../utils/storage";

const STORAGE_KEY = "favorites:v1";

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  hydrate: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const hydrate = useCallback(async () => {
    const ids = await loadJSON<string[]>(STORAGE_KEY, []);
    setFavoriteIds(new Set(ids));
  }, []);

  const persist = useCallback(async (next: Set<string>) => {
    await saveJSON(STORAGE_KEY, Array.from(next));
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favoriteIds.has(id);
    },
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        // Fire-and-forget persistence (AsyncStorage is resilient; we avoid blocking UI).
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favoriteIds, isFavorite, toggleFavorite, hydrate }),
    [favoriteIds, hydrate, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

