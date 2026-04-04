export interface PaidAdsState {
  // Step 1
  currentAdsStatus: "active" | "underperforming" | "none" | null;
  // Step 2
  primaryGoal: "leads" | "ecommerce" | "brand" | "retargeting" | "unsure" | null;
  // Step 3
  monthlyBudget: "under-7500" | "7500-20000" | "20000-75000" | "75000+" | "undecided" | null;
  // Step 4
  platforms: string[];
  // Step 5
  creativeStatus: "all-ready" | "images-only" | "video-only" | "nothing" | null;
  // Step 6
  trackingStatus: "full" | "partial" | "none" | "unsure" | null;
  // Step 7
  setupType: "simple" | "funnel" | "advanced" | null;
  // Step 8
  reportingFrequency: "monthly" | "biweekly" | "weekly" | "dashboard" | null;
  // Step 9
  collaborationType: "one-time" | "3-months" | "ongoing" | "unsure" | null;

  // Lead
  leadName: string;
  leadEmail: string;
  leadCompany: string;
  leadPhone: string;
  leadDescription: string;
  leadConsent: boolean;
}

export const initialPaidAdsState: PaidAdsState = {
  currentAdsStatus: null,
  primaryGoal: null,
  monthlyBudget: null,
  platforms: [],
  creativeStatus: null,
  trackingStatus: null,
  setupType: null,
  reportingFrequency: null,
  collaborationType: null,
  leadName: "",
  leadEmail: "",
  leadCompany: "",
  leadPhone: "",
  leadDescription: "",
  leadConsent: false,
};
