import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";

type Promo = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  onPress?: () => void;
};

export function PromoCarousel({ promos }: { promos: Promo[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: SPACING.sm }}
    >
      {promos.map((p) => (
        <TouchableOpacity
          key={p.id}
          activeOpacity={0.9}
          onPress={p.onPress}
          style={[styles.card, SHADOW.sm]}
        >
          <Text style={styles.title}>{p.title}</Text>
          <Text style={styles.sub}>{p.subtitle}</Text>
          <View style={styles.ctaPill}>
            <Text style={styles.ctaText}>{p.cta} →</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    marginRight: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT.xl,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: FONT.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  ctaPill: {
    alignSelf: "flex-start",
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaText: {
    color: COLORS.accent,
    fontWeight: "800",
    fontSize: FONT.sm,
  },
});
