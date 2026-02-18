// src/components/Container.tsx
import React from "react";
import { View, Platform, useWindowDimensions } from "react-native";
import { SPACING } from "../utils/theme";

export function Container({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Max width only for web; mobile uses full width
  const maxWidth = 1100;

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: SPACING.lg,
        maxWidth: isWeb ? Math.min(maxWidth, width) : undefined,
      }}
    >
      {children}
    </View>
  );
}