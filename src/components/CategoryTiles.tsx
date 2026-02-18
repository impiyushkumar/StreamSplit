import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";

const TILES = [
  { key: "shared", title: "Shared Subscriptions", sub: "Join groups & save", icon: "👥" },
  { key: "gift", title: "Gift Cards", sub: "Deals across brands", icon: "🎁" },
  { key: "minutes", title: "Minutes", sub: "Instant delivery", icon: "⚡" },
];

export function CategoryTiles({ onPress }: { onPress: (key: string) => void }) {
  return (
    <View style={styles.grid}>
      {TILES.map((t) => (
        <TouchableOpacity
          key={t.key}
          activeOpacity={0.9}
          onPress={() => onPress(t.key)}
          style={[styles.tile, SHADOW.sm]}
        >
          <Text style={styles.icon}>{t.icon}</Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  icon: { fontSize: 18 },
  title: {
    fontSize: FONT.md,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  sub: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
  },
});
