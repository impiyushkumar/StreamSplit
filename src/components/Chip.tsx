// src/components/Chip.tsx
import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { COLORS, SPACING, RADIUS, FONT } from "../utils/theme";

type ChipVariant = "filter" | "trust";

type Props = {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  icon,
  selected = false,
  onPress,
  variant = "filter",
  style,
}: Props) {
  const isTrust = variant === "trust";

  // Base colors (no hardcoded white so it works in Soft Dark)
  const bgColor = selected
    ? COLORS.accent
    : isTrust
    ? `${COLORS.accent}22` // subtle accent tint
    : COLORS.surface;

  const borderColor = selected
    ? `${COLORS.accent}AA`
    : isTrust
    ? `${COLORS.accent}55`
    : COLORS.border;

  const textColor = selected
    ? "#FFFFFF"
    : isTrust
    ? COLORS.textPrimary
    : COLORS.textSecondary;

  const iconColor = textColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        { backgroundColor: bgColor, borderColor },
        style,
      ]}
    >
      {icon ? (
        <View style={styles.iconWrap}>
          <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
        </View>
      ) : null}

      <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: FONT.sm,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
