import {
  HOURLY_RATE,
  EXISTING_WEBSITE_HOURS,
  WEBSITE_SIZE_HOURS,
  WEBSHOP_SIZE_HOURS,
  WEBSITE_FEATURES,
  WEBSHOP_FEATURES,
  SPECIAL_FEATURES_HOURS,
  STANDARD_INTERVAL,
  SPECIAL_INTERVAL,
  VISUAL_IDENTITY_HOURS,
  CONTENT_HOURS,
  HOSTING_HOURS,
  COMPLEXITY_THRESHOLD_HOURS,
  MONTHLY_HOSTING_FEE,
  OWN_HOSTING_SURCHARGE,
} from "./calculator-config";
import type { CalculatorState } from "./calculator-types";
import { getPricingType } from "./calculator-types";

export function calculateTotalHours(state: CalculatorState): number {
  let hours = 0;
  const isEfficient = state.processType === "efficient";
  const idx = isEfficient ? 0 : 1;
  const pricingType = getPricingType(state.solutionType);

  // Existing website
  if (state.hasExistingWebsite) {
    hours += EXISTING_WEBSITE_HOURS;
  }

  // Size
  if (state.size) {
    const sizeMap = pricingType === "website" ? WEBSITE_SIZE_HOURS : WEBSHOP_SIZE_HOURS;
    const entry = sizeMap[state.size];
    if (entry) hours += entry[idx];
  }

  // Additional features
  const featuresMap = pricingType === "website" ? WEBSITE_FEATURES : WEBSHOP_FEATURES;
  for (const feat of state.additionalFeatures) {
    const entry = featuresMap[feat];
    if (entry) hours += entry.hours[idx];
  }

  // Special features
  if (state.hasSpecialFeatures) {
    hours += SPECIAL_FEATURES_HOURS;
  }

  // Visual identity (balanced and collaborative only)
  if (!isEfficient && state.visualIdentityLevel) {
    hours += VISUAL_IDENTITY_HOURS[state.visualIdentityLevel] ?? 0;
  }

  // Content creation
  if (state.contentStatus) {
    const entry = CONTENT_HOURS[state.contentStatus];
    if (entry) hours += entry[idx];
  }

  // Hosting & domain
  if (state.hostingStatus) {
    if (state.hostingStatus === "yes-both") {
      hours += HOSTING_HOURS["yes-both"];
    } else if (state.hostingStatus === "domain-only" && state.wantsHostingSetup) {
      hours += HOSTING_HOURS["domain-only"];
    } else if (state.hostingStatus === "no" && state.wantsHostingSetup) {
      hours += HOSTING_HOURS["no"];
    } else if (state.hostingStatus === "not-sure") {
      hours += HOSTING_HOURS["not-sure"];
    }
  }

  return hours;
}

export function requiresManualReview(state: CalculatorState): boolean {
  const hours = calculateTotalHours(state);
  const pricingType = getPricingType(state.solutionType);
  if (hours > COMPLEXITY_THRESHOLD_HOURS) return true;

  // Webshop + 100+ products + special features
  if (
    pricingType === "webshop" &&
    state.size === "100+" &&
    state.hasSpecialFeatures
  ) {
    return true;
  }

  // More than 2 major additional features
  if (state.additionalFeatures.length > 2) return true;

  // Integrations combined with special features
  if (
    state.additionalFeatures.includes("integration") &&
    state.hasSpecialFeatures
  ) {
    return true;
  }

  return false;
}

export function calculatePriceRange(state: CalculatorState): {
  low: number;
  high: number;
} {
  // "Ved ikke" => fixed range since we don't know the solution type
  if (state.solutionType === "ved-ikke") {
    return { low: 2000, high: 99000 };
  }

  // Landing page: base ~3000-5000, scales up with extras
  if (state.solutionType === "landing-page") {
    let baseLow = 3000;
    let baseHigh = 5000;

    // Special features add significant cost
    if (state.hasSpecialFeatures) {
      baseLow += 5000;
      baseHigh += 15000;
    }

    // Additional features (booking, integration) add cost
    const featureCount = state.additionalFeatures.length;
    if (featureCount > 0) {
      baseLow += featureCount * 3000;
      baseHigh += featureCount * 8000;
    }

    // Content creation adds a bit
    if (state.contentStatus === "needs-content") {
      baseLow += 2000;
      baseHigh += 4000;
    }

    // No visual identity adds cost
    if (state.visualIdentityLevel === "no-identity") {
      baseLow += 3000;
      baseHigh += 5000;
    } else if (state.visualIdentityLevel === "logo-only") {
      baseLow += 1500;
      baseHigh += 3000;
    }

    // Round to nearest 100
    baseLow = Math.round(baseLow / 100) * 100;
    baseHigh = Math.round(baseHigh / 100) * 100;

    return { low: baseLow, high: baseHigh };
  }

  const hours = calculateTotalHours(state);
  const totalPrice = hours * HOURLY_RATE;
  const interval = state.hasSpecialFeatures ? SPECIAL_INTERVAL : STANDARD_INTERVAL;

  // Surcharge when client keeps own hosting
  const surcharge = state.hostingStatus === "yes-both" ? OWN_HOSTING_SURCHARGE : 0;

  const low = Math.round((totalPrice * (1 - interval) + surcharge) / 100) * 100;
  const high = Math.round((totalPrice * (1 + interval) + surcharge) / 100) * 100;

  return { low, high };
}

export function showHostingFee(state: CalculatorState): boolean {
  if (state.hostingStatus === "domain-only" && state.wantsHostingSetup) return true;
  if (state.hostingStatus === "no" && state.wantsHostingSetup) return true;
  if (state.hostingStatus === "not-sure") return true;
  return false;
}

export function getMonthlyHostingFee(): number {
  return MONTHLY_HOSTING_FEE;
}

export function formatDKK(amount: number): string {
  return amount.toLocaleString("da-DK");
}
