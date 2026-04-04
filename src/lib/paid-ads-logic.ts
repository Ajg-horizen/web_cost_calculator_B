import type { PaidAdsState } from "./paid-ads-types";

// Setup hours
const SETUP_BASE: Record<string, number> = {
  simple: 8,
  funnel: 16,
  advanced: 28,
};

const PLATFORM_HOURS: Record<string, number> = {
  meta: 4,
  google: 5,
  linkedin: 4,
  tiktok: 4,
  multi: 8,
};

const CREATIVE_HOURS: Record<string, number> = {
  "all-ready": 0,
  "images-only": 4,
  "video-only": 4,
  nothing: 10,
};

const TRACKING_HOURS: Record<string, number> = {
  full: 0,
  partial: 4,
  none: 8,
  unsure: 6,
};

const MONTHLY_MANAGEMENT: Record<string, number> = {
  "one-time": 0,
  "3-months": 12,
  ongoing: 16,
  unsure: 12,
};

// Monthly management price range based on ad budget
const BUDGET_MONTHLY_RANGE: Record<string, { low: number; high: number }> = {
  "under-7500": { low: 2000, high: 5000 },
  "7500-20000": { low: 5000, high: 12000 },
  "20000-75000": { low: 12000, high: 20000 },
  "75000+": { low: 20000, high: 40000 },
  undecided: { low: 0, high: 0 },
};

const HOURLY_RATE_LOW = 550;
const HOURLY_RATE_HIGH = 950;
const STANDARD_INTERVAL = 0.15;
const SPECIAL_INTERVAL = 0.20;

export function requiresPaidAdsManualReview(state: PaidAdsState): boolean {
  // High budget + advanced setup
  if (state.monthlyBudget === "75000+" && state.setupType === "advanced") return true;
  // Multiple platforms + no creatives + no tracking
  if (state.platforms.includes("multi") && state.creativeStatus === "nothing" && (state.trackingStatus === "none" || state.trackingStatus === "unsure")) return true;
  // Advanced automation + no tracking
  if (state.setupType === "advanced" && state.trackingStatus === "none") return true;
  // High budget + funnel + ongoing
  if (state.monthlyBudget === "75000+" && state.setupType === "funnel" && state.collaborationType === "ongoing") return true;

  const hours = calculatePaidAdsSetupHours(state);
  if (hours > 40) return true;

  return false;
}

export function calculatePaidAdsSetupHours(state: PaidAdsState): number {
  let hours = 0;

  if (state.setupType) hours += SETUP_BASE[state.setupType] ?? 0;

  for (const p of state.platforms) {
    hours += PLATFORM_HOURS[p] ?? 0;
  }

  if (state.creativeStatus) hours += CREATIVE_HOURS[state.creativeStatus] ?? 0;
  if (state.trackingStatus) hours += TRACKING_HOURS[state.trackingStatus] ?? 0;

  // Existing underperforming ads add audit hours
  if (state.currentAdsStatus === "underperforming") hours += 4;

  return hours;
}

export function calculatePaidAdsPriceRange(state: PaidAdsState): { setupLow: number; setupHigh: number; monthlyLow: number; monthlyHigh: number } {
  const setupHours = calculatePaidAdsSetupHours(state);
  const hourlyRate = state.monthlyBudget === "under-7500" || state.monthlyBudget === "undecided" ? HOURLY_RATE_LOW : HOURLY_RATE_HIGH;
  const setupPrice = setupHours * hourlyRate;
  const isComplex = state.setupType === "advanced" || state.creativeStatus === "nothing";
  const interval = isComplex ? SPECIAL_INTERVAL : STANDARD_INTERVAL;

  const setupLow = Math.round(setupPrice * (1 - interval) / 100) * 100;
  const setupHigh = Math.round(setupPrice * (1 + interval) / 100) * 100;

  // Monthly management based on ad budget
  const budgetRange = BUDGET_MONTHLY_RANGE[state.monthlyBudget ?? "undecided"] ?? { low: 0, high: 0 };
  const isOneTime = state.collaborationType === "one-time";
  const platformCount = Math.max(state.platforms.length, 1);
  const monthlyLow = isOneTime ? 0 : budgetRange.low * platformCount;
  const monthlyHigh = isOneTime ? 0 : budgetRange.high * platformCount;

  return { setupLow, setupHigh, monthlyLow, monthlyHigh };
}

export function formatDKK(amount: number): string {
  return amount.toLocaleString("da-DK");
}
