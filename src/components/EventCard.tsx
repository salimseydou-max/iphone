import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Event } from "../types/event";
import { useTheme } from "../theme/useTheme";
import { formatEventDateTime } from "../utils/date";
import { Ionicons } from "@expo/vector-icons";

export function EventCard(props: {
  event: Event;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {props.event.imageUrl ? (
        <Image source={{ uri: props.event.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.border }]} />
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {props.event.title}
        </Text>
        <Text style={[styles.meta, { color: colors.secondaryText }]} numberOfLines={1}>
          {formatEventDateTime(props.event.startsAtISO)}
        </Text>
        <Text style={[styles.meta, { color: colors.secondaryText }]} numberOfLines={1}>
          {(props.event.venueName ?? "Venue")} • {(props.event.city ?? "Nearby")}
        </Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          props.onToggleFavorite();
        }}
        hitSlop={12}
        style={styles.favButton}
        accessibilityRole="button"
        accessibilityLabel={props.isFavorite ? "Remove from favorites" : "Save to favorites"}
      >
        <Ionicons
          name={props.isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={props.isFavorite ? colors.danger : colors.secondaryText}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 14,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  meta: {
    fontSize: 13,
    fontWeight: "500",
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    padding: 6,
  },
});

