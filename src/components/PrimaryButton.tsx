// src/components/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { COLORS, RADIUS, FONT, SPACING } from '../utils/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'solid', style, fullWidth = false }: Props) {
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.base,
        isSolid && styles.solid,
        isOutline && styles.outline,
        variant === 'ghost' && styles.ghost,
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? '#fff' : COLORS.accent} size="small" />
      ) : (
        <Text style={[styles.label, !isSolid && styles.labelDark]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  solid: {
    backgroundColor: COLORS.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  ghost: {
    backgroundColor: COLORS.accentLight,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: FONT.md,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.2,
  },
  labelDark: {
    color: COLORS.accent,
  },
});
