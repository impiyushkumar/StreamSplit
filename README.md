# StreamSplit 📱

A subscription-sharing app built with React Native + Expo.
Works on **Android** and **Web** from a single codebase.

---

## 🗂 Folder Structure

```
streamsplit/
├── App.tsx                      # Entry point
├── app.json                     # Expo config
├── babel.config.js
├── tsconfig.json
└── src/
    ├── api/
    │   └── api.ts               # Fake API layer (swap for real backend later)
    ├── components/
    │   ├── AppHeader.tsx
    │   ├── Chip.tsx
    │   ├── GroupCard.tsx
    │   ├── PrimaryButton.tsx
    │   ├── SearchBar.tsx
    │   └── SubscriptionCard.tsx
    ├── data/
    │   ├── subscriptions.json   # Mock subscription data
    │   └── groups.json          # Mock groups data
    ├── models/
    │   └── types.ts             # TypeScript interfaces
    ├── navigation/
    │   └── index.tsx            # Bottom tabs + stack navigators
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── ExploreScreen.tsx
    │   ├── SubscriptionDetailScreen.tsx
    │   ├── PublicGroupsScreen.tsx
    │   ├── GroupDetailScreen.tsx
    │   ├── CreateGroupScreen.tsx
    │   ├── ChatScreen.tsx       # ChatListScreen + GroupChatScreen
    │   ├── WalletScreen.tsx
    │   └── AccountScreen.tsx
    ├── store/
    │   └── AppContext.tsx       # Global state (React Context)
    └── utils/
        ├── nanoid.ts            # Tiny ID generator + formatters
        └── theme.ts             # Design tokens (colors, spacing, etc.)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Expo CLI**: `npm install -g expo-cli`
- **Android**: Android Studio + emulator OR physical device with Expo Go app
- **Web**: Any modern browser

### Install

```bash
cd streamsplit
npm install
```

### Run on Web

```bash
npm run web
# Opens http://localhost:8081 in browser
```

### Run on Android

```bash
npm run android
# Needs Android emulator running, OR:
# Install Expo Go on your Android phone and scan the QR code with:
npx expo start
```

---

## 🎯 Feature Status

| Screen | Status |
|---|---|
| Home (hero, featured, CTA) | ✅ Done |
| Explore (search + filter) | ✅ Done |
| Subscription Detail | ✅ Done |
| Public Groups List | ✅ Done |
| Group Detail | ✅ Done |
| Create Group (form) | ✅ Done |
| Chat (list + group chat) | ✅ Done |
| Wallet (placeholder UI) | ✅ Done |
| Account + My Groups | ✅ Done |
| Report Group flow | ✅ Done |

---

## 🏗 Architecture Decisions

- **Navigation**: `@react-navigation` (bottom tabs + native stacks per tab)
- **State**: React Context (`AppProvider`) — no external lib needed for MVP
- **UI**: 100% custom components — no UI kits
- **Fake API**: `src/api/api.ts` — every method returns Promises so you can swap in real `fetch()` calls later
- **Payments**: Not integrated (placeholder UI in Wallet)
- **Auth**: Not integrated (mock user in Account)

---

## 🎨 Design System

Single accent color: `#5B5FEF` (indigo)

Defined in `src/utils/theme.ts`:
- `COLORS` — all colors
- `SPACING` — spacing scale
- `RADIUS` — border radius scale
- `FONT` — font size scale
- `SHADOW` — shadow presets

---

## 🔌 Adding a Real Backend Later

Replace methods in `src/api/api.ts`:

```ts
// Before (mock)
async getSubscriptions() {
  await delay();
  return rawSubscriptions;
}

// After (real)
async getSubscriptions() {
  const res = await fetch('https://api.streamsplit.com/subscriptions', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
```

State mutations in `AppContext.tsx` can similarly be swapped to call the API layer instead of mutating local arrays.
