// src/screens/CreateGroupScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Switch,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../utils/theme';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Chip } from '../components/Chip';
import { useApp } from '../store/AppContext';
import subscriptionsData from '../data/subscriptions.json';
import { Subscription, Duration } from '../models/types';

const DURATIONS: Duration[] = ['Monthly', 'Quarterly', 'Yearly'];

export function CreateGroupScreen({ navigation, route }: any) {
  const { subscriptionId } = route.params || {};
  const { createGroup } = useApp();
  const subs = subscriptionsData as Subscription[];

  const [selectedSubId, setSelectedSubId] = useState<string>(subscriptionId || subs[0].id);
  const [isPublic, setIsPublic] = useState(true);
  const [duration, setDuration] = useState<Duration>('Monthly');
  const [seats, setSeats] = useState('4');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('Pay on time\nNo sharing credentials outside group');
  const [loading, setLoading] = useState(false);

  const selectedSub = subs.find(s => s.id === selectedSubId)!;

  const handleSubmit = async () => {
    if (!pricePerSeat || !description) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const group = createGroup({
      subscriptionId: selectedSubId,
      type: isPublic ? 'public' : 'private',
      duration,
      seatsTotal: parseInt(seats) || 4,
      pricePerSeat: parseFloat(pricePerSeat) || 0,
      description,
      rules,
    });
    setLoading(false);
    navigation.navigate('GroupDetail', { groupId: group.id });
  };

  const isValid = !!pricePerSeat && !!description && parseFloat(pricePerSeat) > 0;

  return (
    <View style={styles.screen}>
      <AppHeader title="Create Group" showBack onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}>

          {/* Subscription picker */}
          <View style={styles.section}>
            <Text style={styles.label}>Subscription</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm }}>
              {subs.map(s => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setSelectedSubId(s.id)}
                  style={[styles.subPill, selectedSubId === s.id && styles.subPillSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.subPillEmoji}>{s.logoEmoji}</Text>
                  <Text style={[styles.subPillLabel, selectedSubId === s.id && styles.subPillLabelSelected]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Public toggle */}
          <View style={[styles.row, SHADOW.sm, styles.card]}>
            <View>
              <Text style={styles.label}>Public Group</Text>
              <Text style={styles.helperText}>Visible to anyone on StreamSplit</Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor="#fff"
            />
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map(d => (
                <Chip
                  key={d}
                  label={d}
                  selected={duration === d}
                  onPress={() => setDuration(d)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>
          </View>

          {/* Seats */}
          <View style={styles.section}>
            <Text style={styles.label}>Total Seats</Text>
            <View style={styles.seatsRow}>
              {['2', '3', '4', '5', '6'].map(n => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setSeats(n)}
                  style={[styles.seatBtn, seats === n && styles.seatBtnSelected]}
                >
                  <Text style={[styles.seatBtnText, seats === n && styles.seatBtnTextSelected]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helperText}>Max {selectedSub.maxSeats} for {selectedSub.name}</Text>
          </View>

          {/* Price per seat */}
          <View style={styles.section}>
            <Text style={styles.label}>Price Per Seat ($)</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                value={pricePerSeat}
                onChangeText={setPricePerSeat}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell people about your group..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />
          </View>

          {/* Rules */}
          <View style={styles.section}>
            <Text style={styles.label}>Rules (one per line)</Text>
            <TextInput
              value={rules}
              onChangeText={setRules}
              placeholder="Add group rules..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
          </View>

          {/* Submit */}
          <PrimaryButton
            label={loading ? '' : 'Create Group'}
            loading={loading}
            onPress={handleSubmit}
            disabled={!isValid}
            fullWidth
          />
          {!isValid && (
            <Text style={styles.validationText}>Please fill in price and description to continue.</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  section: { gap: SPACING.sm },
  label: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  helperText: { fontSize: FONT.sm, color: COLORS.textMuted },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  subPillSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentLight },
  subPillEmoji: { fontSize: 16 },
  subPillLabel: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textSecondary },
  subPillLabelSelected: { color: COLORS.accent },
  durationRow: { flexDirection: 'row', gap: SPACING.sm },
  seatsRow: { flexDirection: 'row', gap: SPACING.sm },
  seatBtn: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  seatBtnSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentLight },
  seatBtnText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textSecondary },
  seatBtnTextSelected: { color: COLORS.accent },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  inputPrefix: { fontSize: FONT.xl, fontWeight: '700', color: COLORS.textMuted },
  input: { flex: 1, fontSize: FONT.xxl, fontWeight: '800', color: COLORS.textPrimary, padding: 0 },
  textarea: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    fontSize: FONT.md,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 90,
  },
  validationText: { fontSize: FONT.sm, color: COLORS.textMuted, textAlign: 'center' },
});
