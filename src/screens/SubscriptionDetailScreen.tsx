// src/screens/SubscriptionDetailScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from "../utils/theme";
import { AppHeader } from "../components/AppHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { Container } from "../components/Container";
import { Chip } from "../components/Chip";
import { SectionHeader } from "../components/SectionHeader";

import subscriptionsData from "../data/subscriptions.json";
import { Subscription, Duration, Group } from "../models/types";
import { useApp } from "../store/AppContext";
import { formatINR } from "../utils/money";

export function SubscriptionDetailScreen({ navigation, route }: any) {
  const subscriptionId: string | undefined = route?.params?.subscriptionId;

  const sub = (subscriptionsData as Subscription[]).find(
    (s) => s.id === subscriptionId
  );

  const { groups, myGroups, joinGroup } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<Duration>(
    sub?.plans?.[0]?.duration || "Monthly"
  );

  const selectedPlan = useMemo(() => {
    if (!sub) return null;
    return sub.plans.find((p) => p.duration === selectedDuration) || sub.plans[0];
  }, [sub, selectedDuration]);

  const seatPrice = useMemo(() => {
    if (!sub || !selectedPlan) return 0;
    const seats = sub.maxSeats || 1;
    return selectedPlan.basePrice / seats;
  }, [sub, selectedPlan]);

  // ✅ show top public groups for this subscription + selected duration
  const topGroups = useMemo(() => {
    if (!sub) return [];

    const list = groups.filter(
      (g) =>
        g.type === "public" &&
        g.subscriptionId === sub.id &&
        g.duration === selectedDuration
    );

    // If no groups exist for selected duration, fallback to any duration
    const fallback = groups.filter(
      (g) => g.type === "public" && g.subscriptionId === sub.id
    );

    const target = list.length ? list : fallback;

    return [...target]
      .sort((a, b) => {
        // prefer seats available
        const seatsLeftA = a.seatsTotal - a.seatsFilled;
        const seatsLeftB = b.seatsTotal - b.seatsFilled;
        if (seatsLeftA !== seatsLeftB) return seatsLeftB - seatsLeftA;

        // then trust
        if (a.adminScore !== b.adminScore) return b.adminScore - a.adminScore;

        // then lower price
        return a.pricePerSeat - b.pricePerSeat;
      })
      .slice(0, 3);
  }, [groups, sub, selectedDuration]);

  const [confirmGroup, setConfirmGroup] = useState<Group | null>(null);
  const [joinedNow, setJoinedNow] = useState<string | null>(null);

  if (!sub || !selectedPlan) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {/* ✅ dark theme status bar */}
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

        <AppHeader
          title="Subscription"
          subtitle="Not found"
          showBack
          onBack={() => navigation.goBack()}
        />
        <Container>
          <View style={{ paddingTop: SPACING.xl }}>
            <Text
              style={{
                fontSize: FONT.lg,
                fontWeight: "900",
                color: COLORS.textPrimary,
              }}
            >
              Subscription not found
            </Text>
            <Text
              style={{
                marginTop: SPACING.sm,
                color: COLORS.textSecondary,
                fontWeight: "600",
              }}
            >
              This subscription may be missing or the link is invalid.
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

  const openGroups = () =>
    navigation.navigate("PublicGroups", { subscriptionId: sub.id });
  const openCreate = () =>
    navigation.navigate("CreateGroup", { subscriptionId: sub.id });

  const doJoin = () => {
    if (!confirmGroup) return;
    const ok = joinGroup(confirmGroup.id);
    if (ok) setJoinedNow(confirmGroup.id);
    setConfirmGroup(null);
  };

  return (
    <View style={styles.screen}>
      {/* ✅ dark theme status bar */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <AppHeader
        title={sub.name}
        subtitle="Official plan pricing"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{ label: "Groups", onPress: openGroups }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 40 }}
      >
        <Container>
          {/* ✅ Premium “hero” card */}
          <View style={[styles.hero, SHADOW.sm]}>
            <View style={styles.heroTop}>
              <View
                style={[
                  styles.logoBox,
                  { backgroundColor: sub.logoColor + "18" },
                ]}
              >
                <Text style={styles.logoEmoji}>{sub.logoEmoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>{sub.name}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.catPill}>
                    <Text style={styles.catText}>{sub.category}</Text>
                  </View>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>Up to {sub.maxSeats} seats</Text>
                </View>
              </View>
            </View>

            <Text style={styles.heroDesc}>{sub.description}</Text>

            <View style={styles.heroPriceRow}>
              <View>
                <Text style={styles.smallLabel}>From</Text>
                <Text style={styles.bigPrice}>
                  {formatINR(seatPrice)} <Text style={styles.perSeat}>/ seat</Text>
                </Text>
              </View>

              {/* ✅ glassy pill instead of flat bg */}
              <View style={styles.durationPill}>
                <Text style={styles.durationPillText}>{selectedDuration}</Text>
              </View>
            </View>
          </View>

          {/* ✅ Duration selector */}
          <View style={{ marginTop: SPACING.lg }}>
            <SectionHeader title="Choose duration" />
            <View style={styles.durationWrap}>
              {sub.plans.map((p) => {
                const selected = p.duration === selectedDuration;
                return (
                  <TouchableOpacity
                    key={p.duration}
                    activeOpacity={0.9}
                    onPress={() => setSelectedDuration(p.duration)}
                    style={[
                      styles.durationCard,
                      selected && styles.durationSelected,
                      SHADOW.sm,
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationName,
                        selected && styles.durationNameSelected,
                      ]}
                    >
                      {p.duration}
                    </Text>
                    <Text
                      style={[
                        styles.durationPrice,
                        selected && styles.durationPriceSelected,
                      ]}
                    >
                      {formatINR(p.basePrice)}
                    </Text>
                    <Text
                      style={[
                        styles.durationSub,
                        selected && styles.durationSubSelected,
                      ]}
                    >
                      total plan
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ✅ Breakdown */}
          <View style={{ marginTop: SPACING.lg }}>
            <SectionHeader title="Pricing breakdown" />
            <View style={[styles.breakdown, SHADOW.sm]}>
              <Row label="Plan total" value={formatINR(selectedPlan.basePrice)} />
              <Row label="Max seats" value={`${sub.maxSeats}`} />
              <View style={styles.divider} />
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Your share / seat</Text>
                <Text style={styles.highlightValue}>{formatINR(seatPrice)}</Text>
              </View>
            </View>
          </View>

          {/* ✅ How it works */}
          <View style={{ marginTop: SPACING.lg }}>
            <SectionHeader title="How seat sharing works" />
            <View style={[styles.rules, SHADOW.sm]}>
              {[
                `Up to ${sub.maxSeats} people can share this subscription`,
                "Admin manages the subscription, members pay their share",
                "Each member gets their own access (depends on service)",
                "Leave a group anytime (policies vary by admin)",
              ].map((t) => (
                <View key={t} style={styles.ruleRow}>
                  <Text style={styles.ruleIcon}>✅</Text>
                  <Text style={styles.ruleText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ✅ Top groups preview */}
          <View style={{ marginTop: SPACING.lg }}>
            <SectionHeader title="Top public groups" onPress={openGroups} />
            {topGroups.length === 0 ? (
              <View style={[styles.empty, SHADOW.sm]}>
                <Text style={styles.emptyEmoji}>👥</Text>
                <Text style={styles.emptyTitle}>No public groups yet</Text>
                <Text style={styles.emptyText}>Be the first admin for this plan.</Text>
                <PrimaryButton
                  label="Create a group"
                  onPress={openCreate}
                  style={{ marginTop: SPACING.md }}
                />
              </View>
            ) : (
              topGroups.map((g) => {
                const seatsLeft = g.seatsTotal - g.seatsFilled;
                const isFull = seatsLeft <= 0;
                const isJoined =
                  myGroups.some((m) => m.id === g.id) || joinedNow === g.id;

                return (
                  <TouchableOpacity
                    key={g.id}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate("GroupDetail", { groupId: g.id })
                    }
                    style={[styles.groupMini, SHADOW.sm]}
                  >
                    <View style={styles.groupTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.groupAdmin}>{g.adminName}</Text>
                        <Text style={styles.groupMeta}>
                          ⭐ {g.adminScore}% • {g.duration} •{" "}
                          {isFull ? "Full" : `${seatsLeft} left`}
                        </Text>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.groupPrice}>{formatINR(g.pricePerSeat)}</Text>
                        <Text style={styles.groupSeat}>/ seat</Text>
                      </View>
                    </View>

                    <View style={styles.groupActions}>
                      <View style={styles.groupBadges}>
                        <Chip label="Public" selected variant="filter" />
                      </View>

                      <PrimaryButton
                        label={isJoined ? "✓ Joined" : isFull ? "Full" : "Join"}
                        onPress={() => setConfirmGroup(g)}
                        disabled={isFull || isJoined}
                        variant={isJoined || isFull ? "outline" : "solid"}
                        style={{ paddingHorizontal: SPACING.lg }}
                      />
                    </View>

                    <Text style={styles.groupHint}>Tap to view details →</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* ✅ Main CTAs */}
          <View style={{ marginTop: SPACING.xl }}>
            <PrimaryButton
              label="View all public groups"
              onPress={openGroups}
              fullWidth
            />
            <PrimaryButton
              label="Create a group"
              onPress={openCreate}
              variant="outline"
              fullWidth
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </Container>
      </ScrollView>

      {/* ✅ Join confirm modal */}
      {confirmGroup && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>🤝</Text>
            <Text style={styles.modalTitle}>Join this group?</Text>

            {/* ✅ glassy panel instead of bg */}
            <View style={styles.modalInfo}>
              <Text style={styles.modalLine}>
                Price:{" "}
                <Text style={styles.modalStrong}>
                  {formatINR(confirmGroup.pricePerSeat)} / seat
                </Text>
              </Text>
              <Text style={styles.modalLine}>
                Duration:{" "}
                <Text style={styles.modalStrong}>{confirmGroup.duration}</Text>
              </Text>
              <Text style={styles.modalLine}>
                Admin trust:{" "}
                <Text style={styles.modalStrong}>{confirmGroup.adminScore}%</Text>
              </Text>
            </View>

            <PrimaryButton label="Confirm Join" onPress={doJoin} fullWidth />
            <PrimaryButton
              label="Cancel"
              onPress={() => setConfirmGroup(null)}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
  heroTop: { flexDirection: "row", gap: SPACING.md, alignItems: "center" },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoEmoji: { fontSize: 26 },

  heroTitle: { fontSize: FONT.lg, fontWeight: "900", color: COLORS.textPrimary },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: 4,
  },
  catPill: {
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catText: {
    fontSize: FONT.xs,
    fontWeight: "900",
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    opacity: 0.7,
  },
  metaText: { fontSize: FONT.sm, color: COLORS.textSecondary, fontWeight: "600" },

  heroDesc: { fontSize: FONT.md, color: COLORS.textSecondary, lineHeight: 22, fontWeight: "600" },

  heroPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  smallLabel: { fontSize: FONT.xs, color: COLORS.textMuted, fontWeight: "800" },
  bigPrice: { fontSize: FONT.xxl, fontWeight: "900", color: COLORS.textPrimary },
  perSeat: { fontSize: FONT.md, fontWeight: "800", color: COLORS.textSecondary },

  // ✅ was COLORS.bg (flat). Make it glassy
  durationPill: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  durationPillText: { fontWeight: "900", color: COLORS.textPrimary, fontSize: FONT.sm },

  durationWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  durationCard: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 4,
  },
  durationSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentLight },
  durationName: { fontSize: FONT.sm, fontWeight: "900", color: COLORS.textSecondary },
  durationNameSelected: { color: COLORS.accent },
  durationPrice: { fontSize: FONT.xl, fontWeight: "900", color: COLORS.textPrimary },
  durationPriceSelected: { color: COLORS.accent },
  durationSub: { fontSize: FONT.xs, color: COLORS.textMuted, fontWeight: "700" },
  durationSubSelected: { color: COLORS.accent },

  breakdown: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: FONT.md, color: COLORS.textSecondary, fontWeight: "700" },
  rowValue: { fontSize: FONT.md, color: COLORS.textPrimary, fontWeight: "900" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  highlightRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  highlightLabel: { fontSize: FONT.md, fontWeight: "900", color: COLORS.accent },
  highlightValue: { fontSize: FONT.xl, fontWeight: "900", color: COLORS.accent },

  rules: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  ruleRow: { flexDirection: "row", gap: SPACING.sm, alignItems: "flex-start" },
  ruleIcon: { marginTop: 1 },
  ruleText: { flex: 1, fontSize: FONT.md, color: COLORS.textSecondary, lineHeight: 20, fontWeight: "600" },

  groupMini: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  groupTop: { flexDirection: "row", justifyContent: "space-between", gap: SPACING.md },
  groupAdmin: { fontSize: FONT.md, fontWeight: "900", color: COLORS.textPrimary },
  groupMeta: { marginTop: 4, fontSize: FONT.sm, color: COLORS.textSecondary, fontWeight: "700" },
  groupPrice: { fontSize: FONT.lg, fontWeight: "900", color: COLORS.textPrimary },
  groupSeat: { fontSize: FONT.xs, color: COLORS.textMuted, fontWeight: "800", marginTop: 2 },

  groupActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  groupBadges: { flexDirection: "row", gap: SPACING.sm, alignItems: "center" },
  groupHint: { color: COLORS.accent, fontWeight: "800", fontSize: FONT.sm },

  empty: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { marginTop: SPACING.sm, fontSize: FONT.lg, fontWeight: "900", color: COLORS.textPrimary },
  emptyText: { marginTop: 4, fontSize: FONT.md, color: COLORS.textSecondary, fontWeight: "600" },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)", // ✅ more premium
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

  // ✅ was COLORS.bg (flat). Make it glassy
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
