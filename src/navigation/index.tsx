// src/navigation/index.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS, FONT, SPACING, RADIUS } from "../utils/theme";
import { HomeScreen } from "../screens/HomeScreen";
import { ExploreScreen } from "../screens/ExploreScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { AccountScreen } from "../screens/AccountScreen";
import { SubscriptionDetailScreen } from "../screens/SubscriptionDetailScreen";
import { PublicGroupsScreen } from "../screens/PublicGroupsScreen";
import { GroupDetailScreen } from "../screens/GroupDetailScreen";
import { CreateGroupScreen } from "../screens/CreateGroupScreen";
import { ChatListScreen, GroupChatScreen } from "../screens/ChatScreen";

// ✅ NEW placeholder screens (create these files first)
import { CartScreen } from "../screens/CartScreen";
import { GiftCardsScreen } from "../screens/GiftCardsScreen";
import { MinutesScreen } from "../screens/MinutesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: "🏠",
  Explore: "🔍",
  Wallet: "💳",
  Chat: "💬",
  Account: "👤",
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={styles.tabEmoji}>{TAB_ICONS[name]}</Text>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SubscriptionDetail" component={SubscriptionDetailScreen} />
      <Stack.Screen name="PublicGroups" component={PublicGroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />

      {/* ✅ NEW: Subspace-style sections */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="GiftCards" component={GiftCardsScreen} />
      <Stack.Screen name="Minutes" component={MinutesScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen name="SubscriptionDetail" component={SubscriptionDetailScreen} />
      <Stack.Screen name="PublicGroups" component={PublicGroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />

      {/* ✅ NEW: allow same flows from Explore too */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="GiftCards" component={GiftCardsScreen} />
      <Stack.Screen name="Minutes" component={MinutesScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />

      {/* Optional: you can also open these from Account */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="GiftCards" component={GiftCardsScreen} />
      <Stack.Screen name="Minutes" component={MinutesScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Explore" component={ExploreStack} />
        <Tab.Screen name="Wallet" component={WalletScreen} />
        <Tab.Screen name="Chat" component={ChatStack} />
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === "ios" ? 84 : 64,
    paddingTop: SPACING.xs,
    paddingBottom: Platform.OS === "ios" ? SPACING.lg : SPACING.sm,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: FONT.xs,
    fontWeight: "600",
    marginTop: 2,
  },
  tabIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
  },
  tabIconActive: {
    backgroundColor: COLORS.accentLight,
  },
  tabEmoji: {
    fontSize: 18,
  },
});
