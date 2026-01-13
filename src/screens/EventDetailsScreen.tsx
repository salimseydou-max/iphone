import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/types";
import { Screen } from "../components/Screen";
import { getEventById } from "../api/eventsApi";
import type { Event } from "../types/event";
import { useTheme } from "../theme/useTheme";
import { formatEventDateTime } from "../utils/date";
import { useFavorites } from "../features/favorites/FavoritesContext";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetails">;

export function EventDetailsScreen({ route }: Props) {
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fav = useMemo(() => isFavorite(route.params.id), [isFavorite, route.params.id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const e = await getEventById(route.params.id);
        if (!alive) return;
        setEvent(e);
        if (!e) setError("Event not found");
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [route.params.id]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (!event || error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error ?? "Unknown error"}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, { backgroundColor: colors.border }]} />
        )}

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
            <Pressable
              onPress={() => toggleFavorite(event.id)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={fav ? "Remove from favorites" : "Save to favorites"}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <Ionicons
                name={fav ? "heart" : "heart-outline"}
                size={26}
                color={fav ? colors.danger : colors.secondaryText}
              />
            </Pressable>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <InfoRow icon="time-outline" text={formatEventDateTime(event.startsAtISO)} />
            <InfoRow
              icon="location-outline"
              text={`${event.venueName ?? "Venue"}${event.city ? ` • ${event.city}` : ""}`}
              sub={event.address}
            />
          </View>

          {event.description ? (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
              <Text style={[styles.description, { color: colors.secondaryText }]}>{event.description}</Text>
            </>
          ) : null}

          {event.url ? (
            <Pressable
              onPress={() => Linking.openURL(event.url!)}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Open in browser</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );

  function InfoRow({ icon, text, sub }: { icon: any; text: string; sub?: string }) {
    return (
      <View style={styles.infoRow}>
        <Ionicons name={icon} size={18} color={colors.secondaryText} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.infoText, { color: colors.text }]}>{text}</Text>
          {sub ? (
            <Text style={[styles.infoSub, { color: colors.secondaryText }]}>{sub}</Text>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { width: "100%", height: 260 },
  body: { paddingHorizontal: 16, paddingTop: 14, gap: 12 },
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  title: { flex: 1, fontSize: 22, fontWeight: "800", letterSpacing: -0.2 },
  infoCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 10,
  },
  infoRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { fontSize: 15, fontWeight: "700" },
  infoSub: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginTop: 6 },
  description: { fontSize: 15, lineHeight: 21 },
  primaryButton: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  errorText: { fontSize: 15, fontWeight: "700", textAlign: "center", paddingHorizontal: 16 },
});

