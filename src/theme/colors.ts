export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  secondaryText: string;
  border: string;
  tint: string;
  danger: string;
  shadow: string;
  placeholder: string;
};

export const lightColors: ThemeColors = {
  background: "#F2F2F7",
  surface: "#FFFFFF",
  text: "#111111",
  secondaryText: "#6B6B6B",
  border: "#E5E5EA",
  tint: "#007AFF",
  danger: "#FF3B30",
  shadow: "rgba(0,0,0,0.15)",
  placeholder: "#C7C7CC",
};

export const darkColors: ThemeColors = {
  background: "#000000",
  surface: "#1C1C1E",
  text: "#FFFFFF",
  secondaryText: "#A1A1AA",
  border: "#2C2C2E",
  tint: "#0A84FF",
  danger: "#FF453A",
  shadow: "rgba(0,0,0,0.6)",
  placeholder: "#3A3A3C",
};

