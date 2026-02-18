// src/models/types.ts

export type Category = 'OTT' | 'Music' | 'Tools' | 'Learning' | 'Gaming' | 'Productivity';

export type Duration = 'Monthly' | 'Quarterly' | 'Yearly';

export type GroupType = 'public' | 'private';

export interface PlanOption {
  duration: Duration;
  basePrice: number; // total plan price per period
}

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  logoEmoji: string; // using emoji for portability without image assets
  logoColor: string; // brand background color
  plans: PlanOption[];
  maxSeats: number;
  description: string;
  featured?: boolean;
}

export interface Group {
  id: string;
  subscriptionId: string;
  type: GroupType;
  duration: Duration;
  seatsTotal: number;
  seatsFilled: number;
  pricePerSeat: number;
  description: string;
  rules: string[];
  adminName: string;
  adminScore: number; // 0-100
  createdAt: string;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Transaction {
  id: string;
  type: 'Credit' | 'Debit' | 'Refund Pending';
  amount: number;
  description: string;
  date: string;
}

export interface CreateGroupPayload {
  subscriptionId: string;
  type: GroupType;
  duration: Duration;
  seatsTotal: number;
  pricePerSeat: number;
  description: string;
  rules: string;
}
