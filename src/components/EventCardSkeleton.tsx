import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/useTheme";

export function EventCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.image, { backgroundColor: colors.border }]} />
      <View style={styles.content}>
        <View style={[styles.lineLg, { backgroundColor: colors.border }]} />
        <View style={[styles.lineSm, { backgroundColor: colors.border }]} />
        <View style={[styles.lineMd, { backgroundColor: colors.border }]} />
      </View>
    </View>
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
    gap: 8,
  },
  lineLg: {
    height: 14,
    width: "85%",
    borderRadius: 8,
  },
  lineMd: {
    height: 12,
    width: "65%",
    borderRadius: 8,
  },
  lineSm: {
    height: 12,
    width: "45%",
    borderRadius: 8,
  },
});

