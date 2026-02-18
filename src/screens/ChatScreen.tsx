// src/screens/ChatScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../utils/theme';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../store/AppContext';
import subscriptionsData from '../data/subscriptions.json';
import { Subscription } from '../models/types';

function ChatListScreen({ navigation }: any) {
  const { myGroups } = useApp();
  const subs = subscriptionsData as Subscription[];

  if (myGroups.length === 0) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Chat" subtitle="Group messages" />
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptyText}>Join or create a group to start chatting with members.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Chat" subtitle={`${myGroups.length} active groups`} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {myGroups.map(group => {
          const sub = subs.find(s => s.id === group.subscriptionId)!;
          return (
            <TouchableOpacity
              key={group.id}
              style={[styles.chatRow, SHADOW.sm]}
              onPress={() => navigation.navigate('GroupChat', { groupId: group.id })}
              activeOpacity={0.88}
            >
              <View style={[styles.chatAvatar, { backgroundColor: sub.logoColor + '20' }]}>
                <Text style={styles.chatEmoji}>{sub.logoEmoji}</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{sub.name} Group</Text>
                <Text style={styles.chatAdmin}>{group.adminName}</Text>
              </View>
              <View style={styles.chatMeta}>
                <View style={[styles.durationBadge]}>
                  <Text style={styles.durationText}>{group.duration}</Text>
                </View>
                <Text style={styles.chatArrow}>→</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function GroupChatScreen({ navigation, route }: any) {
  const { groupId } = route.params;
  const { groups, messages, sendMessage } = useApp();
  const group = groups.find(g => g.id === groupId)!;
  const sub = (subscriptionsData as Subscription[]).find(s => s.id === group?.subscriptionId);
  const chatMessages = messages[groupId] || [];
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(groupId, trimmed);
    setText('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.screen}>
      <AppHeader
        title={`${sub?.logoEmoji || '👥'} ${sub?.name || 'Group'} Chat`}
        subtitle={`${group?.seatsFilled || 0} members`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>👋</Text>
              <Text style={styles.emptyText}>Say hello to your group!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.messageBubbleWrap, item.isMe && styles.messageBubbleWrapMe]}>
              {!item.isMe && <Text style={styles.messageSender}>{item.senderName}</Text>}
              <View style={[styles.messageBubble, item.isMe && styles.messageBubbleMe]}>
                <Text style={[styles.messageText, item.isMe && styles.messageTextMe]}>{item.text}</Text>
              </View>
              <Text style={[styles.messageTime, item.isMe && { textAlign: 'right' }]}>{formatTime(item.timestamp)}</Text>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.chatInput}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]} disabled={!text.trim()}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Export both — navigation decides which renders
export { ChatListScreen, GroupChatScreen };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  chatAvatar: { width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  chatEmoji: { fontSize: 24 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary },
  chatAdmin: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  chatMeta: { alignItems: 'flex-end', gap: SPACING.xs },
  durationBadge: { backgroundColor: COLORS.accentLight, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  durationText: { fontSize: FONT.xs, fontWeight: '700', color: COLORS.accent },
  chatArrow: { color: COLORS.textMuted, fontSize: FONT.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxl, gap: SPACING.md },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary },
  emptyText: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.xl },
  messageList: { padding: SPACING.lg, gap: SPACING.md, flexGrow: 1 },
  messageBubbleWrap: { gap: 4, maxWidth: '80%', alignSelf: 'flex-start' },
  messageBubbleWrapMe: { alignSelf: 'flex-end' },
  messageSender: { fontSize: FONT.xs, color: COLORS.textMuted, marginLeft: SPACING.sm },
  messageBubble: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageBubbleMe: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: 4,
  },
  messageText: { fontSize: FONT.md, color: COLORS.textPrimary, lineHeight: 20 },
  messageTextMe: { color: '#fff' },
  messageTime: { fontSize: FONT.xs, color: COLORS.textMuted, marginLeft: SPACING.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT.md,
    color: COLORS.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
  sendBtnText: { color: '#fff', fontSize: FONT.lg, fontWeight: '800' },
});
