import React from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

export function Screen(props: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.base, { backgroundColor: colors.background }, props.style]}>
      {props.children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});

