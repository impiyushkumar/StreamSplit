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

const ALL_SUBSCRIPTIONS = subscriptionsData as Subscription[];

export function ExploreScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return ALL_SUBSCRIPTIONS.filter((subscription) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [subscription.name, subscription.description, subscription.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "All" || subscription.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [activeCategory, normalizedQuery]);

  const resultsLabel = useMemo(() => {
    const resultText = `${filtered.length} subscription${filtered.length !== 1 ? "s" : ""}`;
    if (!normalizedQuery && activeCategory === "All") {
      return `Showing all ${resultText}`;
    }

    const filters = [
      activeCategory !== "All" ? activeCategory : null,
      normalizedQuery ? `matching “${query.trim()}”` : null,
    ].filter(Boolean);

    return `${resultText} ${filters.length ? `for ${filters.join(" • ")}` : ""}`.trim();
  }, [activeCategory, filtered.length, normalizedQuery, query]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <AppHeader title="Explore" subtitle="Find subscriptions to split" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.stickyBlock}>
          <Container>
            <View style={styles.searchWrap}>
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search by app, category, or keyword"
              />
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

        <Container>
          <View style={styles.results}>
            <Text style={styles.resultsCount}>{resultsLabel}</Text>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No subscriptions found</Text>
                <Text style={styles.emptyHint}>
                  Try another keyword or switch to a different category.
                </Text>
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
  emptyHint: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
});
