import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { EventCard } from "../components/EventCard";
import { useFavorites } from "../features/favorites/FavoritesContext";
import { useTheme } from "../theme/useTheme";
import type { Event } from "../types/event";
import type { RootStackParamList } from "../navigation/types";
import { getEventById } from "../api/eventsApi";

export function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favoriteIdList = useMemo(() => Array.from(favoriteIds), [favoriteIds]);

  const fetchFavorites = useCallback(async () => {
    setError(null);

    if (favoriteIdList.length === 0) {
      setItems([]);
      return;
    }

    // Try the id-based fetch (works for both providers).
    const results = await Promise.all(favoriteIdList.map((id) => getEventById(id)));
    const filtered = results.filter((e): e is Event => Boolean(e));
    setItems(filtered);
  }, [favoriteIdList, favoriteIds]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchFavorites();
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load favorites");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFavorites();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }, [fetchFavorites]);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Saved</Text>

      <FlatList
        data={items}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No favorites yet
              </Text>
              <Text style={[styles.subtle, { color: colors.secondaryText }]}>
                Tap the heart on an event to save it.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate("EventDetails", { id: item.id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  center: {
    paddingTop: 40,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  subtle: {
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});

