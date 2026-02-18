// src/components/SubscriptionCard.tsx
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Subscription } from "../models/types";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";
import { formatINR } from "../utils/money";

interface Props {
  subscription: Subscription;
  onPress: () => void;
  compact?: boolean;
}

export function SubscriptionCard({ subscription, onPress, compact }: Props) {
  const seats = subscription.maxSeats || 1;

  // ✅ lowest "per seat" from available plans
  const lowestPerSeat = Math.min(...subscription.plans.map((p) => p.basePrice / seats));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.card, compact && styles.compact, SHADOW.sm]}
    >
      <View style={[styles.logoBox, { backgroundColor: subscription.logoColor + "18" }]}>
        <Text style={styles.logoEmoji}>{subscription.logoEmoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{subscription.name}</Text>
        <Text style={styles.category}>{subscription.category}</Text>
        {!compact && (
          <Text style={styles.desc} numberOfLines={2}>
            {subscription.description}
          </Text>
        )}
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.fromLabel}>from</Text>
        <Text style={styles.price}>{formatINR(lowestPerSeat)}</Text>
        <Text style={styles.perSeat}>/ seat</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  compact: {
    width: 220,
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 0,
    marginRight: SPACING.sm,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoEmoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FONT.md,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  category: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  fromLabel: {
    fontSize: FONT.xs,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  price: {
    fontSize: FONT.xl,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  perSeat: {
    fontSize: FONT.xs,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
});
