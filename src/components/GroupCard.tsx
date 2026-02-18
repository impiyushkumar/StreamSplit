// src/components/GroupCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Group } from "../models/types";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";
import { PrimaryButton } from "./PrimaryButton";
import { formatINR } from "../utils/money";

interface Props {
  group: Group;
  onPress: () => void;
  onJoin?: () => void;
  isJoined?: boolean;
}

export function GroupCard({ group, onPress, onJoin, isJoined }: Props) {
  const seatsLeft = group.seatsTotal - group.seatsFilled;
  const fillPercent = group.seatsFilled / group.seatsTotal;
  const isFull = seatsLeft === 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.card, SHADOW.sm]}>
      {/* Header row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.admin}>{group.adminName}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.score}>{group.adminScore}% trust</Text>
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{group.duration}</Text>
        </View>
      </View>

      {/* Price */}
      <Text style={styles.price}>
        {formatINR(group.pricePerSeat)} <Text style={styles.priceSub}>/ seat</Text>
      </Text>

      {/* Seats progress */}
      <View style={styles.seatsRow}>
        <Text style={styles.seatsText}>
          {group.seatsFilled}/{group.seatsTotal} seats filled
        </Text>
        <Text style={[styles.seatsLeft, isFull && styles.full]}>
          {isFull ? "Full" : `${seatsLeft} left`}
        </Text>
      </View>

      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${fillPercent * 100}%` as any,
              backgroundColor: isFull ? COLORS.error : COLORS.accent,
            },
          ]}
        />
      </View>

      {/* Join */}
      {onJoin && (
        <View style={styles.actions}>
          <PrimaryButton
            label={isJoined ? "✓ Joined" : isFull ? "Full" : "Join Group"}
            onPress={onJoin}
            variant={isJoined || isFull ? "outline" : "solid"}
            disabled={isFull || isJoined}
          />
          <Text style={styles.viewDetail}>View details →</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md + 4,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  admin: {
    fontSize: FONT.md,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  star: {
    color: "#F59E0B",
    fontSize: FONT.sm,
  },
  score: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  durationBadge: {
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  durationText: {
    fontSize: FONT.xs,
    fontWeight: "800",
    color: COLORS.accent,
  },
  price: {
    fontSize: FONT.xxl,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  priceSub: {
    fontSize: FONT.md,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  seatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seatsText: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  seatsLeft: {
    fontSize: FONT.sm,
    fontWeight: "800",
    color: COLORS.success,
  },
  full: {
    color: COLORS.error,
  },
  progressBg: {
    height: 6,
    backgroundColor: "#EBEBF4",
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
  },
  viewDetail: {
    fontSize: FONT.sm,
    color: COLORS.accent,
    fontWeight: "800",
  },
});
