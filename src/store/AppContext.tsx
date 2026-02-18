// src/store/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Group, Message, CreateGroupPayload, Duration } from '../models/types';
import rawGroups from '../data/groups.json';
import { nanoid } from '../utils/nanoid';

interface AppContextType {
  groups: Group[];
  myGroups: Group[];
  messages: Record<string, Message[]>;
  walletBalance: number;
  joinGroup: (groupId: string) => boolean; // returns false if full
  createGroup: (payload: CreateGroupPayload) => Group;
  sendMessage: (groupId: string, text: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CURRENT_USER = { id: 'me', name: 'You' };

const MOCK_MESSAGES: Record<string, Message[]> = {
  grp_001: [
    { id: 'm1', groupId: 'grp_001', senderId: 'alex', senderName: 'Alex K.', text: 'Welcome everyone! 🎉', timestamp: '2024-12-01T10:05:00Z', isMe: false },
    { id: 'm2', groupId: 'grp_001', senderId: 'sara', senderName: 'Sara M.', text: 'Happy to be here!', timestamp: '2024-12-01T10:07:00Z', isMe: false },
  ],
  grp_003: [
    { id: 'm3', groupId: 'grp_003', senderId: 'jordan', senderName: 'Jordan P.', text: 'Spotify group is live 🎵', timestamp: '2024-10-20T14:05:00Z', isMe: false },
  ],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(rawGroups as Group[]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const joinGroup = (groupId: string): boolean => {
    let success = false;
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId && g.seatsFilled < g.seatsTotal) {
          success = true;
          const updated = { ...g, seatsFilled: g.seatsFilled + 1 };
          setMyGroups(my => my.find(m => m.id === groupId) ? my : [...my, updated]);
          return updated;
        }
        return g;
      })
    );
    return success;
  };

  const createGroup = (payload: CreateGroupPayload): Group => {
    const newGroup: Group = {
      id: `grp_${nanoid()}`,
      subscriptionId: payload.subscriptionId,
      type: payload.type,
      duration: payload.duration as Duration,
      seatsTotal: payload.seatsTotal,
      seatsFilled: 1, // admin counts as 1
      pricePerSeat: payload.pricePerSeat,
      description: payload.description,
      rules: payload.rules.split('\n').filter(r => r.trim()),
      adminName: 'You (Admin)',
      adminScore: 100,
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => [newGroup, ...prev]);
    setMyGroups(prev => [newGroup, ...prev]);
    return newGroup;
  };

  const sendMessage = (groupId: string, text: string) => {
    const msg: Message = {
      id: `msg_${nanoid()}`,
      groupId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text,
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    setMessages(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), msg],
    }));
  };

  return (
    <AppContext.Provider value={{ groups, myGroups, messages, walletBalance: 48.50, joinGroup, createGroup, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
