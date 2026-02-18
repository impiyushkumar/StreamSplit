// src/screens/ExploreScreen.tsx
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { COLORS, SPACING, FONT } from "../utils/theme";
import { SearchBar } from "../components/SearchBar";
import { Chip } from "../components/Chip";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { AppHeader } from "../components/AppHeader";
import { Container } from "../components/Container";
import subscriptionsData from "../data/subscriptions.json";
import { Subscription, Category } from "../models/types";

const CATEGORIES: { label: string; value: Category | "All"; icon: string }[] = [
  { label: "All", value: "All", icon: "🌐" },
  { label: "OTT", value: "OTT", icon: "🎬" },
  { label: "Music", value: "Music", icon: "🎵" },
  { label: "Tools", value: "Tools", icon: "🔧" },
  { label: "Learning", value: "Learning", icon: "📚" },
  { label: "Gaming", value: "Gaming", icon: "🎮" },
  { label: "Productivity", value: "Productivity", icon: "⚡" },
];

export function ExploreScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (subscriptionsData as Subscription[]).filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(q);
      const matchesCat = activeCategory === "All" || s.category === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCategory]);

  return (
    <View style={styles.screen}>
      {/* ✅ Dark theme needs light-content */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <AppHeader title="Explore" subtitle="Find subscriptions to split" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky search + filter */}
        <View style={styles.stickyBlock}>
          <Container>
            <View style={styles.searchWrap}>
              <SearchBar value={query} onChangeText={setQuery} />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.catsScroll}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: SPACING.sm }}
            >
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.value}
                  icon={cat.icon}
                  label={cat.label}
                  selected={activeCategory === cat.value}
                  onPress={() => setActiveCategory(cat.value)}
                  style={{ marginRight: SPACING.sm }}
                />
              ))}
            </ScrollView>
          </Container>
        </View>

        {/* Results */}
        <Container>
          <View style={styles.results}>
            <Text style={styles.resultsCount}>
              {filtered.length} subscription{filtered.length !== 1 ? "s" : ""}
            </Text>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No results for "{query}"</Text>
              </View>
            ) : (
              filtered.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onPress={() =>
                    navigation.navigate("SubscriptionDetail", {
                      subscriptionId: sub.id,
                    })
                  }
                />
              ))
            )}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  stickyBlock: {
    backgroundColor: COLORS.bg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchWrap: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  catsScroll: {
    paddingBottom: SPACING.sm,
  },
  results: {
    paddingTop: SPACING.md,
  },
  resultsCount: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: FONT.md,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
