// src/utils/money.ts
export function formatINR(amount: number): string {
  const n = Number(amount ?? 0);
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
