// src/utils/theme.ts
export const COLORS = {
  // ✅ Premium Soft Dark (not pure black)
  bg: "#0B0D12", // app background
  surface: "#111827", // primary card surface
  surface2: "#0F172A", // optional deeper surface

  // ✅ Brand accent (neon violet/blue used sparingly)
  accent: "#7C5CFF",
  accentLight: "rgba(124,92,255,0.18)",
  accentDark: "#5B3FFF",

  // ✅ Borders in dark mode must be subtle + visible
  border: "rgba(255,255,255,0.08)",

  // ✅ Text for dark mode
  textPrimary: "#F3F4FF",
  textSecondary: "rgba(243,244,255,0.72)",
  textMuted: "rgba(243,244,255,0.50)",

  // Status
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",

  // ✅ Optional tag backgrounds (soft, dark-friendly)
  tag: {
    ott: "rgba(239,68,68,0.12)", // red tint
    music: "rgba(34,197,94,0.12)", // green tint
    tools: "rgba(124,92,255,0.12)", // violet tint
    learning: "rgba(245,158,11,0.12)", // amber tint
    gaming: "rgba(14,165,233,0.12)", // sky tint
    productivity: "rgba(168,85,247,0.12)", // purple tint
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FONT = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  xxxl: 36,
};

export const SHADOW = {
  // ✅ Dark-mode friendly shadows (deeper + softer)
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
};
