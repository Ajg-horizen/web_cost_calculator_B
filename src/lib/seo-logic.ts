import type { SEOState } from "./seo-types";

// Base monthly hours per need
const NEED_HOURS: Record<string, number> = {
  "seo-analysis": 8,
  "on-page": 10,
  "technical-seo": 12,
  "linkbuilding": 14,
  "ongoing": 20,
};

const EXPERIENCE_MULT: Record<string, number> = {
  active: 0.8,
  little: 1,
  none: 1.2,
};

const GOAL_MULT: Record<string, number> = {
  "organic-leads": 1,
  "webshop-sales": 1.1,
  local: 0.9,
  national: 1.1,
  international: 1.4,
};

const SIZE_MULT: Record<string, number> = {
  "1-10": 0.8,
  "10-50": 1,
  "50-200": 1.3,
  "200+": 1.6,
};

const COMPETITION_MULT: Record<string, number> = {
  low: 0.8,
  medium: 1,
  high: 1.3,
  unknown: 1,
};

const KEYWORD_HOURS: Record<string, number> = {
  yes: 0,
  partial: 4,
  no: 8,
};

const TECHNICAL_HOURS: Record<string, number> = {
  sitemap: 0,
  tracking: 0,
  unsure: 4,
  none: 8,
};

const CONTENT_HOURS: Record<string, number> = {
  self: 0,
  "blog-help": 8,
  "seo-texts": 10,
  "full-strategy": 18,
};

const TIMELINE_MULT: Record<string, number> = {
  flexible: 1,
  "3-6-months": 1,
  asap: 1.2,
};

const HOURLY_RATE = 860;
const STANDARD_INTERVAL = 0.15;
const COMPLEX_INTERVAL = 0.20;

export function requiresSEOManualReview(state: SEOState): boolean {
  if (state.websiteSize === "200+") return true;
  if (state.primaryGoal === "international") return true;
  if (state.competition === "high") return true;

  // Linkbuilding + content + technical combo
  const hasLinkbuilding = state.needs.includes("linkbuilding");
  const hasContent = state.contentProduction === "full-strategy" || state.contentProduction === "seo-texts";
  const hasTechnical = state.needs.includes("technical-seo");
  if (hasLinkbuilding && hasContent && hasTechnical) return true;

  return false;
}

export function calculateSEOMonthlyHours(state: SEOState): number {
  let baseHours = 0;

  for (const need of state.needs) {
    baseHours += NEED_HOURS[need] ?? 0;
  }

  if (baseHours === 0) baseHours = 8; // minimum

  const expMult = EXPERIENCE_MULT[state.seoExperience ?? "none"] ?? 1;
  const goalMult = GOAL_MULT[state.primaryGoal ?? "organic-leads"] ?? 1;
  const sizeMult = SIZE_MULT[state.websiteSize ?? "1-10"] ?? 1;
  const compMult = COMPETITION_MULT[state.competition ?? "unknown"] ?? 1;

  baseHours = baseHours * expMult * goalMult * sizeMult * compMult;

  baseHours += KEYWORD_HOURS[state.keywordResearch ?? "no"] ?? 0;

  for (const t of state.technicalStatus) {
    baseHours += TECHNICAL_HOURS[t] ?? 0;
  }

  baseHours += CONTENT_HOURS[state.contentProduction ?? "self"] ?? 0;

  const timelineMult = TIMELINE_MULT[state.timeline ?? "flexible"] ?? 1;
  baseHours = baseHours * timelineMult;

  return Math.round(baseHours);
}

export function calculateSEOPriceRange(state: SEOState): { low: number; high: number } {
  const hours = calculateSEOMonthlyHours(state);
  const totalPrice = hours * HOURLY_RATE;
  const isComplex = state.competition === "high" || state.primaryGoal === "international" || state.needs.length >= 4;
  const interval = isComplex ? COMPLEX_INTERVAL : STANDARD_INTERVAL;

  const low = Math.round(totalPrice * (1 - interval) / 100) * 100;
  const high = Math.round(totalPrice * (1 + interval) / 100) * 100;

  return { low, high };
}

export function formatDKK(amount: number): string {
  return amount.toLocaleString("da-DK");
}
