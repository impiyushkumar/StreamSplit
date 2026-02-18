// src/api/api.ts
// Fake API layer — swap these for real HTTP calls later.
import rawSubscriptions from '../data/subscriptions.json';
import rawGroups from '../data/groups.json';
import { Subscription, Group, CreateGroupPayload } from '../models/types';
import { nanoid } from '../utils/nanoid';

// Simulate async network delay
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const api = {
  async getSubscriptions(): Promise<Subscription[]> {
    await delay();
    return rawSubscriptions as Subscription[];
  },

  async getSubscriptionById(id: string): Promise<Subscription | undefined> {
    await delay(150);
    return (rawSubscriptions as Subscription[]).find(s => s.id === id);
  },

  async getGroups(subscriptionId?: string): Promise<Group[]> {
    await delay();
    const groups = rawGroups as Group[];
    return subscriptionId ? groups.filter(g => g.subscriptionId === subscriptionId) : groups;
  },

  async getGroupById(id: string): Promise<Group | undefined> {
    await delay(150);
    return (rawGroups as Group[]).find(g => g.id === id);
  },

  async joinGroup(groupId: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    // Real logic handled in AppContext; this is the API contract
    return { success: true, message: 'Joined successfully' };
  },

  async createGroup(payload: CreateGroupPayload): Promise<Group> {
    await delay(600);
    return {
      id: `grp_${nanoid()}`,
      subscriptionId: payload.subscriptionId,
      type: payload.type,
      duration: payload.duration,
      seatsTotal: payload.seatsTotal,
      seatsFilled: 1,
      pricePerSeat: payload.pricePerSeat,
      description: payload.description,
      rules: payload.rules.split('\n').filter(r => r.trim()),
      adminName: 'You (Admin)',
      adminScore: 100,
      createdAt: new Date().toISOString(),
    };
  },

  async reportGroup(groupId: string, reason: string): Promise<void> {
    await delay(400);
    console.log(`[API] Group ${groupId} reported: ${reason}`);
  },
};
