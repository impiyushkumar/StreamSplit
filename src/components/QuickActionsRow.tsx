import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";

const ACTIONS = [
  { key: "groups", label: "Public Groups", icon: "👥" },
  { key: "create", label: "Create Group", icon: "➕" },
  { key: "gift", label: "Gift Cards", icon: "🎁" },
  { key: "minutes", label: "Minutes", icon: "⚡" },
];

export function QuickActionsRow({
  onPress,
}: {
  onPress: (key: string) => void;
}) {
  return (
    <View style={styles.row}>
      {ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.key}
          activeOpacity={0.85}
          style={[styles.card, SHADOW.sm]}
          onPress={() => onPress(a.key)}
        >
          <Text style={styles.icon}>{a.icon}</Text>
          <Text style={styles.label}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  card: {
    flexGrow: 1,
    flexBasis: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
