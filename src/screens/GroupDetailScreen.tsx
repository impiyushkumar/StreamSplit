// src/screens/GroupDetailScreen.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from "../utils/theme";
import { AppHeader } from "../components/AppHeader";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { formatINR } from "../utils/money";

import subscriptionsData from "../data/subscriptions.json";
import { Subscription, Group } from "../models/types";
import { useApp } from "../store/AppContext";

export function GroupDetailScreen({ navigation, route }: any) {
  const groupId: string | undefined = route?.params?.groupId;

  const { groups, myGroups, joinGroup } = useApp();

  const subs = subscriptionsData as Subscription[];
  const subMap = useMemo(() => new Map(subs.map((s) => [s.id, s])), [subs]);

  const group: Group | undefined = useMemo(
    () => groups.find((g) => g.id === groupId),
    [groups, groupId]
  );

  const subscription = group ? subMap.get(group.subscriptionId) : undefined;

  const [confirmJoin, setConfirmJoin] = useState(false);
  const [joinedNow, setJoinedNow] = useState(false);

  if (!group) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {/* ✅ Dark theme needs light-content */}
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

        <AppHeader title="Group" subtitle="Not found" showBack onBack={() => navigation.goBack()} />
        <Container>
          <View style={{ paddingTop: SPACING.xl }}>
            <Text style={{ fontSize: FONT.lg, fontWeight: "900", color: COLORS.textPrimary }}>
              Group not found
            </Text>
            <Text style={{ marginTop: SPACING.sm, color: COLORS.textSecondary, fontWeight: "600" }}>
              This group may have been removed or the link is invalid.
            </Text>
            <PrimaryButton
              label="Back"
              onPress={() => navigation.goBack()}
              style={{ marginTop: SPACING.lg }}
            />
          </View>
        </Container>
      </View>
    );
  }

  const seatsLeft = group.seatsTotal - group.seatsFilled;
  const fillPercent = Math.max(0, Math.min(1, group.seatsFilled / group.seatsTotal));
  const isFull = seatsLeft <= 0;

  const isJoined = myGroups.some((m) => m.id === group.id) || joinedNow;

  const openChat = () => {
    navigation.navigate("Chat", { screen: "GroupChat", params: { groupId: group.id } });
  };

  const handleJoin = () => setConfirmJoin(true);

  const doJoin = () => {
    const ok = joinGroup(group.id);
    if (ok) setJoinedNow(true);
    setConfirmJoin(false);
  };

  return (
    <View style={styles.screen}>
      {/* ✅ Dark theme needs light-content */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <AppHeader
        title={subscription ? subscription.name : "Group"}
        subtitle="Group details"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{
          label: isJoined ? "Chat" : "Groups",
          onPress: () => (isJoined ? openChat() : navigation.navigate("PublicGroups")),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <Container>
          {/* Top “Hero” card */}
          <View style={[styles.hero, SHADOW.sm]}>
            <View style={styles.heroTopRow}>
              <View style={styles.brandRow}>
                <View
                  style={[
                    styles.logoBox,
                    { backgroundColor: (subscription?.logoColor || COLORS.accent) + "18" },
                  ]}
                >
                  <Text style={styles.logoEmoji}>{subscription?.logoEmoji || "👥"}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>{subscription?.name || "Subscription"}</Text>
                  <Text style={styles.heroSub}>
                    {subscription?.category || "Group"} • {group.duration}
                  </Text>
                </View>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{group.type === "public" ? "PUBLIC" : "PRIVATE"}</Text>
              </View>
            </View>

            {/* Price + Seats */}
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Price per seat</Text>
                <Text style={styles.priceValue}>
                  {formatINR(group.pricePerSeat)} <Text style={styles.priceUnit}>/ seat</Text>
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.priceLabel}>Availability</Text>
                <Text style={[styles.availText, isFull && { color: COLORS.error }]}>
                  {isFull ? "Full" : `${seatsLeft} left`}
                </Text>
              </View>
            </View>

            {/* ✅ dark-mode progress background */}
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${fillPercent * 100}%` as any,
                    backgroundColor: isFull ? COLORS.error : COLORS.accent,
                  },
                ]}
              />
            </View>

            <Text style={styles.seatsLine}>
              {group.seatsFilled}/{group.seatsTotal} seats filled
            </Text>
          </View>

          {/* Admin card */}
          <View style={[styles.card, SHADOW.sm]}>
            <SectionHeader title="Admin" />
            <View style={styles.adminRow}>
              <View style={styles.adminAvatar}>
                <Text style={{ fontSize: 18 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminName}>{group.adminName}</Text>
                <Text style={styles.adminMeta}>
                  ⭐ {group.adminScore}% trust • Verified admin
                </Text>
              </View>
              <View style={styles.trustPill}>
                <Text style={styles.trustPillText}>{group.adminScore}%</Text>
              </View>
            </View>

            <View style={styles.perksRow}>
              {["Instant access", "Transparent pricing", "No hidden fees"].map((t) => (
                <View key={t} style={styles.perk}>
                  <Text style={styles.perkIcon}>✅</Text>
                  <Text style={styles.perkText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Group details */}
          <View style={[styles.card, SHADOW.sm]}>
            <SectionHeader title="Group details" />
            <Text style={styles.detailLine}>
              Duration: <Text style={styles.detailStrong}>{group.duration}</Text>
            </Text>
            <Text style={styles.detailLine}>
              Type: <Text style={styles.detailStrong}>{group.type}</Text>
            </Text>
            <Text style={styles.detailLine}>
              Seats:{" "}
              <Text style={styles.detailStrong}>
                {group.seatsFilled}/{group.seatsTotal}
              </Text>
            </Text>

            {!!group.description && (
              <View style={{ marginTop: SPACING.md }}>
                <Text style={styles.descTitle}>Description</Text>
                <Text style={styles.descText}>{group.description}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={{ marginTop: SPACING.lg }}>
            {isJoined ? (
              <>
                <PrimaryButton label="Open group chat" onPress={openChat} fullWidth />
                <PrimaryButton
                  label="View subscription plan"
                  variant="outline"
                  fullWidth
                  style={{ marginTop: SPACING.sm }}
                  onPress={() =>
                    navigation.navigate("SubscriptionDetail", {
                      subscriptionId: group.subscriptionId,
                    })
                  }
                />
              </>
            ) : (
              <>
                <PrimaryButton
                  label={isFull ? "Group is full" : "Join this group"}
                  onPress={handleJoin}
                  disabled={isFull}
                  fullWidth
                />
                <PrimaryButton
                  label="Browse other groups"
                  variant="outline"
                  fullWidth
                  style={{ marginTop: SPACING.sm }}
                  onPress={() =>
                    navigation.navigate("PublicGroups", { subscriptionId: group.subscriptionId })
                  }
                />
              </>
            )}
          </View>
        </Container>
      </ScrollView>

      {/* Confirm Join Modal */}
      {confirmJoin && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>🤝</Text>
            <Text style={styles.modalTitle}>Confirm join</Text>

            {/* ✅ glassy instead of bg */}
            <View style={styles.modalInfo}>
              <Text style={styles.modalLine}>
                Price:{" "}
                <Text style={styles.modalStrong}>{formatINR(group.pricePerSeat)} / seat</Text>
              </Text>
              <Text style={styles.modalLine}>
                Duration: <Text style={styles.modalStrong}>{group.duration}</Text>
              </Text>
              <Text style={styles.modalLine}>
                Admin trust: <Text style={styles.modalStrong}>{group.adminScore}%</Text>
              </Text>
            </View>

            <PrimaryButton label="Confirm Join" onPress={doJoin} fullWidth />
            <PrimaryButton
              label="Cancel"
              onPress={() => setConfirmJoin(false)}
              variant="ghost"
              fullWidth
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  hero: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  logoEmoji: { fontSize: 24 },

  heroTitle: {
    fontSize: FONT.lg,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  heroSub: {
    marginTop: 2,
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  badge: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: FONT.xs, fontWeight: "900", color: COLORS.accent },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: SPACING.md,
  },
  priceLabel: { fontSize: FONT.xs, color: COLORS.textMuted, fontWeight: "700" },
  priceValue: { fontSize: FONT.xxl, fontWeight: "900", color: COLORS.textPrimary },
  priceUnit: { fontSize: FONT.md, fontWeight: "700", color: COLORS.textSecondary },

  availText: { fontSize: FONT.md, fontWeight: "900", color: COLORS.success },

  // ✅ was #EBEBF4 (too bright)
  progressBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: RADIUS.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressFill: { height: "100%", borderRadius: RADIUS.full },

  seatsLine: { fontSize: FONT.sm, color: COLORS.textSecondary, fontWeight: "600" },

  card: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  adminRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  adminAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  adminName: { fontSize: FONT.md, fontWeight: "900", color: COLORS.textPrimary },
  adminMeta: { marginTop: 2, fontSize: FONT.sm, color: COLORS.textSecondary, fontWeight: "600" },

  trustPill: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  trustPillText: { fontWeight: "900", color: COLORS.accent },

  perksRow: { gap: SPACING.xs },
  perk: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  perkIcon: { fontSize: 14 },
  perkText: { fontSize: FONT.sm, color: COLORS.textSecondary, fontWeight: "600" },

  detailLine: { fontSize: FONT.md, color: COLORS.textSecondary, fontWeight: "600" },
  detailStrong: { fontWeight: "900", color: COLORS.textPrimary },

  descTitle: { fontSize: FONT.sm, fontWeight: "900", color: COLORS.textPrimary },
  descText: { marginTop: 6, fontSize: FONT.md, color: COLORS.textSecondary, lineHeight: 20 },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalEmoji: { fontSize: 40 },
  modalTitle: { fontSize: FONT.xl, fontWeight: "900", color: COLORS.textPrimary },

  // ✅ glassy panel
  modalInfo: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 6,
  },
  modalLine: { fontSize: FONT.md, color: COLORS.textSecondary, fontWeight: "600" },
  modalStrong: { fontWeight: "900", color: COLORS.textPrimary },
});
