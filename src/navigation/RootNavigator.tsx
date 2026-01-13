import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { enableScreens } from "react-native-screens";

import type { RootStackParamList, TabsParamList } from "./types";
import { ExploreScreen } from "../screens/ExploreScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { useFavorites } from "../features/favorites/FavoritesContext";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

enableScreens(true);

function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const name = (() => {
            if (route.name === "Explore") return focused ? "compass" : "compass-outline";
            return focused ? "heart" : "heart-outline";
          })();
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Explore" component={ExploreScreen} />
      <Tabs.Screen name="Favorites" component={FavoritesScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const scheme = useColorScheme();
  const { hydrate } = useFavorites();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{ title: "Event" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

