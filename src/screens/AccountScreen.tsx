// src/screens/AccountScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../utils/theme';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../store/AppContext';
import subscriptionsData from '../data/subscriptions.json';
import { Subscription } from '../models/types';

const MOCK_USER = {
  name: 'Jordan Rivera',
  email: 'jordan@email.com',
  memberSince: 'December 2024',
  avatar: 'J',
};

export function AccountScreen({ navigation }: any) {
  const { myGroups } = useApp();
  const subs = subscriptionsData as Subscription[];
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReport = () => {
    setReportSubmitted(true);
    setTimeout(() => { setShowReport(false); setReportSubmitted(false); setReportReason(''); }, 1500);
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Account" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}>
        {/* Profile card */}
        <View style={[styles.profileCard, SHADOW.md]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{MOCK_USER.avatar}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{MOCK_USER.name}</Text>
            <Text style={styles.profileEmail}>{MOCK_USER.email}</Text>
            <Text style={styles.profileMember}>Member since {MOCK_USER.memberSince}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Groups Joined', value: myGroups.length },
            { label: 'Saved (est.)', value: `$${(myGroups.length * 12.5).toFixed(0)}` },
            { label: 'Trust Score', value: '100%' },
          ].map(stat => (
            <View key={stat.label} style={[styles.statCard, SHADOW.sm]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* My Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups</Text>
          {myGroups.length === 0 ? (
            <View style={styles.emptyGroups}>
              <Text style={styles.emptyGroupsText}>You haven't joined any groups yet.</Text>
              <PrimaryButton label="Explore Groups" onPress={() => navigation.navigate('Explore')} variant="outline" style={{ marginTop: SPACING.sm }} />
            </View>
          ) : (
            myGroups.map(group => {
              const sub = subs.find(s => s.id === group.subscriptionId);
              return (
                <TouchableOpacity
                  key={group.id}
                  style={[styles.groupRow, SHADOW.sm]}
                  onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                  activeOpacity={0.88}
                >
                  <Text style={styles.groupEmoji}>{sub?.logoEmoji}</Text>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{sub?.name}</Text>
                    <Text style={styles.groupMeta}>{group.adminName} · {group.duration}</Text>
                  </View>
                  <Text style={styles.groupPrice}>${group.pricePerSeat.toFixed(2)}/mo</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Support & Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={[styles.menuCard, SHADOW.sm]}>
            {[
              { emoji: '❓', label: 'Help Center', onPress: () => {} },
              { emoji: '🚩', label: 'Report a Group', onPress: () => setShowReport(true) },
              { emoji: '📋', label: 'Terms of Service', onPress: () => {} },
              { emoji: '🔒', label: 'Privacy Policy', onPress: () => {} },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, i < arr.length - 1 && styles.menuRowBorder]}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={showReport} transparent animationType="slide" onRequestClose={() => setShowReport(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {reportSubmitted ? (
              <>
                <Text style={styles.modalEmoji}>✅</Text>
                <Text style={styles.modalTitle}>Report Submitted</Text>
                <Text style={styles.modalDesc}>Thanks for helping keep StreamSplit safe.</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalEmoji}>🚩</Text>
                <Text style={styles.modalTitle}>Report a Group</Text>
                <Text style={styles.modalDesc}>Describe the issue with the group:</Text>
                <TextInput
                  value={reportReason}
                  onChangeText={setReportReason}
                  placeholder="What happened?"
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={4}
                  style={styles.reportInput}
                />
                <PrimaryButton label="Submit Report" onPress={handleReport} disabled={!reportReason.trim()} fullWidth />
                <PrimaryButton label="Cancel" onPress={() => setShowReport(false)} variant="ghost" fullWidth style={{ marginTop: SPACING.sm }} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  avatar: { width: 56, height: 56, borderRadius: RADIUS.full, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FONT.xl, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.textPrimary },
  profileEmail: { fontSize: FONT.sm, color: COLORS.textSecondary },
  profileMember: { fontSize: FONT.xs, color: COLORS.textMuted, marginTop: 2 },
  editBtn: { backgroundColor: COLORS.accentLight, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  editBtnText: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.accent },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: 2 },
  statValue: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.accent },
  statLabel: { fontSize: FONT.xs, color: COLORS.textMuted, textAlign: 'center' },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, gap: SPACING.md },
  sectionTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary },
  emptyGroups: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.xl, alignItems: 'center' },
  emptyGroupsText: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center' },
  groupRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  groupEmoji: { fontSize: 28 },
  groupInfo: { flex: 1 },
  groupName: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary },
  groupMeta: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  groupPrice: { fontSize: FONT.md, fontWeight: '800', color: COLORS.textPrimary },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuEmoji: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: FONT.md, color: COLORS.textPrimary, fontWeight: '500' },
  menuArrow: { fontSize: FONT.md, color: COLORS.textMuted },
  signOutBtn: { margin: SPACING.xl, alignItems: 'center' },
  signOutText: { fontSize: FONT.md, color: COLORS.error, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', padding: SPACING.lg },
  modal: { backgroundColor: COLORS.surface, borderRadius: 24, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md },
  modalEmoji: { fontSize: 40 },
  modalTitle: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.textPrimary },
  modalDesc: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center' },
  reportInput: { width: '100%', backgroundColor: COLORS.bg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, fontSize: FONT.md, color: COLORS.textPrimary, textAlignVertical: 'top', minHeight: 100 },
});
