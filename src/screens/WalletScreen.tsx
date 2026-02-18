// src/screens/WalletScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../utils/theme';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../store/AppContext';

const MOCK_TRANSACTIONS = [
  { id: 't1', type: 'Debit', amount: -6.50, description: 'Netflix Group · Monthly', date: 'Dec 1, 2024' },
  { id: 't2', type: 'Credit', amount: 48.50, description: 'Wallet Top-up', date: 'Nov 28, 2024' },
  { id: 't3', type: 'Debit', amount: -3.00, description: 'Spotify Group · Monthly', date: 'Nov 20, 2024' },
  { id: 't4', type: 'Refund Pending', amount: 6.50, description: 'Netflix Group · Refund', date: 'Nov 15, 2024' },
  { id: 't5', type: 'Debit', amount: -6.50, description: 'Netflix Group · Monthly', date: 'Nov 1, 2024' },
];

const txColor = (type: string) => {
  if (type === 'Credit') return COLORS.success;
  if (type === 'Refund Pending') return COLORS.warning;
  return COLORS.textPrimary;
};

const txBg = (type: string) => {
  if (type === 'Credit') return '#F0FFF4';
  if (type === 'Refund Pending') return '#FFFBEB';
  return '#FFF0F0';
};

export function WalletScreen() {
  const { walletBalance } = useApp();

  return (
    <View style={styles.screen}>
      <AppHeader title="Wallet" subtitle="Your StreamSplit balance" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}>
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${walletBalance.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>Payments are handled externally for now</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceAction}>
              <Text style={styles.balanceActionEmoji}>➕</Text>
              <Text style={styles.balanceActionLabel}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <Text style={styles.balanceActionEmoji}>📤</Text>
              <Text style={styles.balanceActionLabel}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <Text style={styles.balanceActionEmoji}>📊</Text>
              <Text style={styles.balanceActionLabel}>Statement</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coming soon banner */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonEmoji}>🔒</Text>
          <View>
            <Text style={styles.comingSoonTitle}>Payments Coming Soon</Text>
            <Text style={styles.comingSoonText}>We'll enable real payments in the next phase.</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.txSection}>
          <Text style={styles.txTitle}>Transaction History</Text>
          {MOCK_TRANSACTIONS.map(tx => (
            <View key={tx.id} style={[styles.txRow, SHADOW.sm]}>
              <View style={[styles.txIcon, { backgroundColor: txBg(tx.type) }]}>
                <Text>{tx.type === 'Credit' ? '↓' : tx.type === 'Refund Pending' ? '↺' : '↑'}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc}>{tx.description}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <View style={styles.txAmountWrap}>
                <Text style={[styles.txAmount, { color: txColor(tx.type) }]}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </Text>
                {tx.type === 'Refund Pending' && (
                  <Text style={styles.pendingBadge}>Pending</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  balanceCard: {
    backgroundColor: COLORS.accent,
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  balanceLabel: { fontSize: FONT.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  balanceAmount: { fontSize: 52, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  balanceSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  balanceActions: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.md },
  balanceAction: { alignItems: 'center', gap: SPACING.xs },
  balanceActionEmoji: { fontSize: 24, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.full, width: 48, height: 48, textAlign: 'center', lineHeight: 48 },
  balanceActionLabel: { fontSize: FONT.xs, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  comingSoonEmoji: { fontSize: 24 },
  comingSoonTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary },
  comingSoonText: { fontSize: FONT.sm, color: COLORS.textSecondary },
  txSection: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  txTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  txIcon: { width: 40, height: 40, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary },
  txDate: { fontSize: FONT.sm, color: COLORS.textMuted, marginTop: 2 },
  txAmountWrap: { alignItems: 'flex-end', gap: 2 },
  txAmount: { fontSize: FONT.lg, fontWeight: '800' },
  pendingBadge: { fontSize: FONT.xs, color: COLORS.warning, fontWeight: '600' },
});
