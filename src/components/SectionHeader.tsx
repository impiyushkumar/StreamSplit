// src/components/SectionHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, FONT, SPACING } from "../utils/theme";

export function SectionHeader({
  title,
  actionLabel = "See all",
  onPress,
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
      }}
    >
      <Text style={{ fontSize: FONT.lg, fontWeight: "800", color: COLORS.textPrimary }}>
        {title}
      </Text>

      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text style={{ fontSize: FONT.sm, color: COLORS.accent, fontWeight: "700" }}>
            {actionLabel} →
          </Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
}
