import React from "react";
import { View, Text } from "react-native";
import { Container } from "../components/Container";
import { COLORS, SPACING, FONT } from "../utils/theme";

export function CartScreen() {
  return (
    <Container>
      <View style={{ paddingTop: SPACING.lg }}>
        <Text style={{ fontSize: FONT.xl, fontWeight: "800", color: COLORS.textPrimary }}>Cart</Text>
        <Text style={{ marginTop: SPACING.sm, color: COLORS.textSecondary }}>Coming soon.</Text>
      </View>
    </Container>
  );
}
