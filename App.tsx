import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "./src/features/favorites/FavoritesContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <FavoritesProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </FavoritesProvider>
  );
}
