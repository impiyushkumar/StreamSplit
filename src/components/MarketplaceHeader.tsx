import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";
import { SearchBar } from "./SearchBar";

export function MarketplaceHeader({
  title = "StreamSplit",
  query,
  onChangeQuery,
  onPressCart,
}: {
  title?: string;
  query: string;
  onChangeQuery: (t: string) => void;
  onPressCart: () => void;
}) {
  return (
    <View style={[styles.wrap, SHADOW.sm]}>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <View style={styles.logoDot} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <TouchableOpacity onPress={onPressCart} activeOpacity={0.8} style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <SearchBar value={query} onChangeText={onChangeQuery} placeholder="Search plans, groups, gift cards…" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  title: {
    fontSize: FONT.lg,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  cartBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
  },
  cartIcon: { fontSize: 16 },
});
