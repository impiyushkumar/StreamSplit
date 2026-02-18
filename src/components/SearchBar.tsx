// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, FONT, SPACING } from '../utils/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search subscriptions...' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: FONT.md,
    color: COLORS.textPrimary,
    padding: 0,
  },
});
