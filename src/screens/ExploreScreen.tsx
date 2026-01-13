import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Event, EventCategory } from "../types/event";
import { Screen } from "../components/Screen";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { EventCard } from "../components/EventCard";
import { EventCardSkeleton } from "../components/EventCardSkeleton";
import { listEvents } from "../api/eventsApi";
import { useFavorites } from "../features/favorites/FavoritesContext";
import { useTheme } from "../theme/useTheme";
import type { RootStackParamList } from "../navigation/types";

export function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<EventCategory | undefined>(undefined);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emptyTitle = useMemo(() => {
    if (loading) return "";
    if (error) return "";
    return "No events found";
  }, [error, loading]);

  const fetchData = useCallback(async () => {
    setError(null);
    const data = await listEvents({ keyword, category, city: city.trim() || undefined });
    setEvents(data);
  }, [category, city, keyword]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchData();
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load events");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Nearby</Text>
      <SearchBar value={keyword} onChangeText={setKeyword} placeholder="Search events" />
      <View
        style={[
          styles.cityRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City (optional)"
          placeholderTextColor={colors.placeholder}
          autoCorrect={false}
          autoCapitalize="words"
          style={[styles.cityInput, { color: colors.text }]}
        />
      </View>
      <View style={{ height: 4 }} />
      <CategoryChips value={category} onChange={setCategory} />

      <FlatList
        data={loading ? ([] as Event[]) : events}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          city.trim() ? (
            <Text style={[styles.cityHint, { color: colors.secondaryText }]}>
              Filtering by city: {city.trim()}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 8 }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              <Text style={[styles.subtle, { color: colors.secondaryText }]}>
                Pull to refresh or check your API key in `.env`.
              </Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{emptyTitle}</Text>
              <Text style={[styles.subtle, { color: colors.secondaryText }]}>
                Try another category or keyword.
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
  },
  cityRow: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cityInput: {
    fontSize: 15,
  },
  cityHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
    fontSize: 13,
    fontWeight: "600",
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

