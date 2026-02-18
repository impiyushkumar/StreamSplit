// src/components/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING } from '../utils/theme';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
}

export function AppHeader({ title, subtitle, showBack, onBack, rightAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text style={styles.rightLabel}>{rightAction.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backBtn: {
    marginRight: SPACING.xs,
  },
  backIcon: {
    fontSize: FONT.xl,
    color: COLORS.accent,
  },
  title: {
    fontSize: FONT.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rightLabel: {
    fontSize: FONT.md,
    color: COLORS.accent,
    fontWeight: '600',
  },
});
