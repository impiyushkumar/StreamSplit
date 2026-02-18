// src/screens/PublicGroupsScreen.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS, SPACING, FONT, RADIUS } from "../utils/theme";
import { AppHeader } from "../components/AppHeader";
import { GroupCard } from "../components/GroupCard";
import { Chip } from "../components/Chip";
import { PrimaryButton } from "../components/PrimaryButton";
import { SearchBar } from "../components/SearchBar";
import { Container } from "../components/Container";
import { useApp } from "../store/AppContext";
import subscriptionsData from "../data/subscriptions.json";
import { Subscription, Group, Duration } from "../models/types";
import { formatINR } from "../utils/money";

type SortKey = "trust" | "price" | "seats";

/**
 * ✅ IMPORTANT FIX:
 * Some seed groups might use old/short ids like "netflix" instead of "sub_netflix".
 * This mapping normalizes them so filtering + search works.
 */
const SUB_ID_ALIASES: Record<string, string> = {
  netflix: "sub_netflix",
  subNetflix: "sub_netflix",
  spotify: "sub_spotify",
  subSpotify: "sub_spotify",
  youtube: "sub_youtube",
  youtube_premium: "sub_youtube",
  subYoutube: "sub_youtube",
  disney: "sub_disney",
  "disney+": "sub_disney",
  disney_plus: "sub_disney",
  subDisney: "sub_disney",
  notion: "sub_notion",
  subNotion: "sub_notion",
  duolingo: "sub_duolingo",
  subDuolingo: "sub_duolingo",
  xbox: "sub_xbox",
  xbox_game_pass: "sub_xbox",
  subXbox: "sub_xbox",
  figma: "sub_figma",
  subFigma: "sub_figma",
};

function normalizeSubId(id: string | undefined | null) {
  const raw = (id || "").trim();
  return SUB_ID_ALIASES[raw] || raw;
}

function normText(s: string) {
  return (s || "").toLowerCase().trim();
}

/**
 * ✅ Search improvement:
 * "netflix group" should still match "Netflix"
 * We ignore generic words like group/groups/plan/plans
 */
const STOP_WORDS = new Set([
  "group",
  "groups",
  "plan",
  "plans",
  "subscription",
  "subscriptions",
  "public",
  "private",
]);

function makeTokens(q: string) {
  return q
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t));
}

const DURATION_FILTERS: { label: string; value: Duration | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
  { label: "Yearly", value: "Yearly" },
];

const SORT_FILTERS: { label: string; value: SortKey; icon: string }[] = [
  { label: "Top Trust", value: "trust", icon: "⭐" },
  { label: "Lowest Price", value: "price", icon: "💸" },
  { label: "Seats Left", value: "seats", icon: "🪑" },
];

export function PublicGroupsScreen({ navigation, route }: any) {
  // ✅ subscriptionId is OPTIONAL now
  const initialSubId: string | undefined = route?.params?.subscriptionId;

  const subs = subscriptionsData as Subscription[];
  const subMap = useMemo(() => new Map(subs.map((s) => [s.id, s])), [subs]);

  const { groups, myGroups, joinGroup } = useApp();

  const [query, setQuery] = useState("");
  const [activeSubId, setActiveSubId] = useState<string | "All">(
    initialSubId ? normalizeSubId(initialSubId) : "All"
  );
  const [durationFilter, setDurationFilter] = useState<Duration | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("trust");

  const [joinedId, setJoinedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<Group | null>(null);

  // ✅ Top subscription chips based on group counts (short & clean)
  const topSubChips = useMemo(() => {
    const counts: Record<string, number> = {};

    groups
      .filter((g) => g.type === "public")
      .forEach((g) => {
        const sid = normalizeSubId(g.subscriptionId);
        if (!sid) return;
        counts[sid] = (counts[sid] || 0) + 1;
      });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => {
        const sub = subMap.get(id);
        return sub ? { id, count, sub } : null;
      })
      .filter(Boolean)
      .slice(0, 10) as { id: string; count: number; sub: Subscription }[];
  }, [groups, subMap]);

  const publicGroups = useMemo(() => {
    const q = normText(query);
    const tokens = makeTokens(q);

    let list = groups.filter((g) => g.type === "public");

    // ✅ Normalize before filtering by subscription
    if (activeSubId !== "All") {
      list = list.filter((g) => normalizeSubId(g.subscriptionId) === activeSubId);
    }

    if (durationFilter !== "All") {
      list = list.filter((g) => g.duration === durationFilter);
    }

    // ✅ Better search: multi-word + ignores "group/groups/plan..."
    if (tokens.length) {
      list = list.filter((g) => {
        const sid = normalizeSubId(g.subscriptionId);
        const subName = subMap.get(sid)?.name || "";
        const admin = g.adminName || "";
        const desc = g.description || "";
        const rawId = g.subscriptionId || "";

        const hay = `${admin} ${desc} ${subName} ${sid} ${rawId}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      });
    }

    // ✅ Sort
    list = [...list].sort((a, b) => {
      if (sortKey === "trust") return b.adminScore - a.adminScore;
      if (sortKey === "price") return a.pricePerSeat - b.pricePerSeat;

      const seatsLeftA = a.seatsTotal - a.seatsFilled;
      const seatsLeftB = b.seatsTotal - b.seatsFilled;
      return seatsLeftB - seatsLeftA;
    });

    return list;
  }, [groups, activeSubId, durationFilter, sortKey, query, subMap]);

  const activeSub = activeSubId !== "All" ? subMap.get(activeSubId) : undefined;
  const title = activeSub ? `${activeSub.name} Groups` : "Public Groups";
  const subtitle = `${publicGroups.length} public group${publicGroups.length !== 1 ? "s" : ""}`;

  const handleJoin = (group: Group) => setShowConfirm(group);

  const confirmJoin = () => {
    if (!showConfirm) return;
    const ok = joinGroup(showConfirm.id);
    if (ok) setJoinedId(showConfirm.id);
    setShowConfirm(null);
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{
          label: "+ Create",
          onPress: () =>
            navigation.navigate("CreateGroup", {
              subscriptionId: activeSubId === "All" ? undefined : activeSubId,
            }),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 16 }}
        stickyHeaderIndices={[0]}
      >
        {/* ✅ Sticky Search + Filters */}
        <View style={styles.stickyBlock}>
          <Container>
            <View style={{ paddingTop: SPACING.md, paddingBottom: SPACING.sm }}>
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search groups by admin / plan..."
              />
            </View>

            {/* Subscription filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: SPACING.sm }}
              contentContainerStyle={{ paddingRight: SPACING.sm }}
            >
              <Chip
                label="All"
                selected={activeSubId === "All"}
                onPress={() => setActiveSubId("All")}
                style={{ marginRight: SPACING.sm }}
              />

              {topSubChips.map(({ id, sub }) => (
                <Chip
                  key={id}
                  icon={sub.logoEmoji}
                  label={sub.name}
                  selected={activeSubId === id}
                  onPress={() => setActiveSubId(id)}
                  style={{ marginRight: SPACING.sm }}
                />
              ))}
            </ScrollView>

            {/* Duration filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: SPACING.sm }}
              contentContainerStyle={{ paddingRight: SPACING.sm }}
            >
              {DURATION_FILTERS.map((f) => (
                <Chip
                  key={f.value}
                  label={f.label}
                  selected={durationFilter === f.value}
                  onPress={() => setDurationFilter(f.value)}
                  style={{ marginRight: SPACING.sm }}
                />
              ))}
            </ScrollView>

            {/* Sort filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: SPACING.sm }}
            >
              {SORT_FILTERS.map((s) => (
                <Chip
                  key={s.value}
                  icon={s.icon}
                  label={s.label}
                  selected={sortKey === s.value}
                  onPress={() => setSortKey(s.value)}
                  style={{ marginRight: SPACING.sm }}
                />
              ))}
            </ScrollView>

            <Text style={styles.helper}>Tap a group to view details, or join directly.</Text>
          </Container>
        </View>

        {/* ✅ Results */}
        <Container>
          <View style={{ paddingTop: SPACING.md }}>
            {publicGroups.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>👥</Text>
                <Text style={styles.emptyTitle}>No groups found</Text>
                <Text style={styles.emptyText}>
                  Try changing filters, or create the first group.
                </Text>
                <PrimaryButton
                  label="Create Group"
                  onPress={() =>
                    navigation.navigate("CreateGroup", {
                      subscriptionId: activeSubId === "All" ? undefined : activeSubId,
                    })
                  }
                  style={{ marginTop: SPACING.md }}
                />
              </View>
            ) : (
              publicGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onPress={() => navigation.navigate("GroupDetail", { groupId: group.id })}
                  onJoin={() => handleJoin(group)}
                  isJoined={myGroups.some((m) => m.id === group.id) || joinedId === group.id}
                />
              ))
            )}
          </View>
        </Container>
      </ScrollView>

      {/* ✅ Confirm Join Modal */}
      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>🤝</Text>
            <Text style={styles.modalTitle}>Join this group?</Text>

            <View style={styles.modalInfo}>
              <Text style={styles.modalLine}>
                Price:{" "}
                <Text style={styles.modalStrong}>
                  {formatINR(showConfirm.pricePerSeat)} / seat
                </Text>
              </Text>
              <Text style={styles.modalLine}>
                Duration:{" "}
                <Text style={styles.modalStrong}>{showConfirm.duration}</Text>
              </Text>
              <Text style={styles.modalLine}>
                Admin trust:{" "}
                <Text style={styles.modalStrong}>{showConfirm.adminScore}%</Text>
              </Text>
            </View>

            <PrimaryButton label="Confirm Join" onPress={confirmJoin} fullWidth />
            <PrimaryButton
              label="Cancel"
              onPress={() => setShowConfirm(null)}
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

  stickyBlock: {
    backgroundColor: COLORS.bg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  helper: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  empty: {
    alignItems: "center",
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { fontSize: FONT.lg, fontWeight: "800", color: COLORS.textPrimary },
  emptyText: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: "center" },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
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

  modalInfo: {
    width: "100%",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 6,
  },
  modalLine: { fontSize: FONT.md, color: COLORS.textSecondary },
  modalStrong: { fontWeight: "900", color: COLORS.textPrimary },
});
