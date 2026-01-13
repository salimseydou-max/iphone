import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { EventCategory } from "../types/event";
import { useTheme } from "../theme/useTheme";

const categories: Array<{ key: EventCategory; label: string }> = [
  { key: "music", label: "Music" },
  { key: "tech", label: "Tech" },
  { key: "fitness", label: "Fitness" },
  { key: "food", label: "Food" },
  { key: "art", label: "Art" },
];

export function CategoryChips(props: {
  value?: EventCategory;
  onChange: (category?: EventCategory) => void;
}) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Chip
        label="All"
        selected={!props.value}
        onPress={() => props.onChange(undefined)}
      />
      {categories.map((c) => (
        <Chip
          key={c.key}
          label={c.label}
          selected={props.value === c.key}
          onPress={() => props.onChange(c.key)}
        />
      ))}
      <View style={{ width: 4 }} />
    </ScrollView>
  );

  function Chip({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          {
            backgroundColor: selected ? colors.tint : colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text style={[styles.chipText, { color: selected ? "#fff" : colors.text }]}>
          {label}
        </Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

