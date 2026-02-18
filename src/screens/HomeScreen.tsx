// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
} from "react-native";
import { COLORS, SPACING, RADIUS, FONT } from "../utils/theme";
import { Chip } from "../components/Chip";
import { SubscriptionCard } from "../components/SubscriptionCard";
import subscriptionsData from "../data/subscriptions.json";
import { Subscription } from "../models/types";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";

// ✅ Step 4 components
import { MarketplaceHeader } from "../components/MarketplaceHeader";
import { QuickActionsRow } from "../components/QuickActionsRow";

// ✅ Step 5 components
import { PromoCarousel } from "../components/PromoCarousel";
import { CategoryTiles } from "../components/CategoryTiles";

const TRUST_CHIPS = [
  { icon: "⚡", label: "Instant Access" },
  { icon: "💎", label: "Transparent Pricing" },
  { icon: "🛡️", label: "No Hidden Fees" },
  { icon: "👥", label: "Verified Admins" },
];

const featuredAll = (subscriptionsData as Subscription[]).filter((s) => s.featured);
const allSubs = subscriptionsData as Subscription[];

export function HomeScreen({ navigation }: any) {
  const [query, setQuery] = React.useState("");

  // ✅ Promo data (Step 5.3)
  const promos = [
    {
      id: "p1",
      title: "Save up to 70%",
      subtitle: "Join public groups for OTT, music & tools.",
      cta: "Explore plans",
      onPress: () => navigation.navigate("Explore"),
    },
    {
      id: "p2",
      title: "Gift cards deals",
      subtitle: "Discounts across popular brands.",
      cta: "Browse gift cards",
      onPress: () => navigation.navigate("GiftCards"),
    },
    {
      id: "p3",
      title: "Minutes delivery",
      subtitle: "Instant delivery for essentials (coming soon).",
      cta: "See minutes",
      onPress: () => navigation.navigate("Minutes"),
    },
  ];

  const q = query.trim().toLowerCase();
  const featured = q
    ? featuredAll.filter((s) => s.name.toLowerCase().includes(q))
    : featuredAll;

  const all = q
    ? allSubs.filter((s) => s.name.toLowerCase().includes(q))
    : allSubs;

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}
    >
      {/* ✅ Dark theme needs light-content */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <Container>
        {/* ✅ Marketplace Header (logo + search + cart) */}
        <MarketplaceHeader
          query={query}
          onChangeQuery={setQuery}
          onPressCart={() => navigation.navigate("Cart")}
        />

        {/* ✅ Quick actions */}
        <QuickActionsRow
          onPress={(key) => {
            if (key === "groups") navigation.navigate("PublicGroups");
            if (key === "create") navigation.navigate("CreateGroup");
            if (key === "gift") navigation.navigate("GiftCards");
            if (key === "minutes") navigation.navigate("Minutes");
          }}
        />

        {/* ✅ Promo Carousel */}
        <View style={{ marginTop: SPACING.lg }}>
          <PromoCarousel promos={promos} />
        </View>

        {/* ✅ Category Tiles */}
        <View style={{ marginTop: SPACING.lg }}>
          <CategoryTiles
            onPress={(key) => {
              if (key === "shared") navigation.navigate("Explore");
              if (key === "gift") navigation.navigate("GiftCards");
              if (key === "minutes") navigation.navigate("Minutes");
            }}
          />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🚀 Split subscriptions</Text>
          </View>

          <Text style={styles.heroTitle}>
            Split Subscriptions.{"\n"}Pay Less. Together.
          </Text>

          <Text style={styles.heroSub}>
            Join public groups for Netflix, Spotify, and 100+ apps — or create your own
            and invite your circle.
          </Text>

          {/* Trust chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
          >
            {TRUST_CHIPS.map((chip) => (
              <Chip
                key={chip.label}
                icon={chip.icon}
                label={chip.label}
                variant="trust"
                style={{ marginRight: SPACING.sm }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Plans"
            onPress={() => navigation.navigate("Explore")}
          />

          {featured.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No featured plans match “{query}”.
              </Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={featured}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <SubscriptionCard
                  subscription={item}
                  compact
                  onPress={() =>
                    navigation.navigate("SubscriptionDetail", {
                      subscriptionId: item.id,
                    })
                  }
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: SPACING.sm }}
            />
          )}
        </View>

        {/* Popular */}
        <View style={styles.section}>
          <SectionHeader title="Popular Right Now" />

          {all.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No plans match “{query}”.</Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 0 }}>
              {all.slice(0, 4).map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onPress={() =>
                    navigation.navigate("SubscriptionDetail", {
                      subscriptionId: sub.id,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Explainer banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>How StreamSplit Works</Text>

          <View style={styles.steps}>
            {[
              "Find a subscription plan",
              "Join a public group",
              "Pay your share only",
            ].map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  hero: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroBadgeText: {
    fontSize: FONT.xs,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: FONT.xxxl - 6,
    fontWeight: "900",
    color: COLORS.textPrimary,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  heroSub: {
    fontSize: FONT.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: "600",
  },
  chipsScroll: {
    marginHorizontal: -SPACING.lg,
    paddingLeft: SPACING.lg,
  },

  section: {
    marginTop: SPACING.xl,
  },

  emptyBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    fontWeight: "700",
  },

  banner: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.accentLight, // ✅ premium soft banner on dark
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerTitle: {
    fontSize: FONT.lg,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  steps: {
    gap: SPACING.md,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.08)", // ✅ glassy
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepNumText: {
    color: COLORS.textPrimary,
    fontWeight: "900",
    fontSize: FONT.md,
  },
  stepText: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
    fontWeight: "700",
  },
});
