export type SolutionType = "website" | "webshop" | "landing-page" | "ved-ikke";

export interface CalculatorState {
  // Step 1 – Solution type
  solutionType: SolutionType | null;

  // Step 2 – Existing website
  hasExistingWebsite: boolean | null;
  existingUrl: string;

  // Step 3 – Process type
  processType: "efficient" | "balanced" | "collaborative" | null;

  // Step 4 – Size
  size: string | null;

  // Step 5 – Additional features
  additionalFeatures: string[];

  // Step 6 – Special features
  hasSpecialFeatures: boolean | null;
  specialFeaturesDescription: string;

  // Step 7 – Visual identity (efficient)
  hasLogoAndColors: boolean | null;

  // Step 7 – Visual identity (balanced/collaborative)
  visualIdentityLevel: string | null;

  // Step 8 – Content
  contentStatus: "has-content" | "needs-content" | null;

  // Step 9 – Hosting
  hostingStatus: string | null;
  wantsHostingSetup: boolean | null;

  // Budget shortcut
  usedBudgetShortcut: boolean;
  consideredBudgetShortcut: boolean;

  // Step 10 – Lead contact info
  leadName: string;
  leadEmail: string;
  leadCompany: string;
  leadPhone: string;
  leadDescription: string;
}

export const initialCalculatorState: CalculatorState = {
  solutionType: null,
  hasExistingWebsite: null,
  existingUrl: "",
  processType: null,
  size: null,
  additionalFeatures: [],
  hasSpecialFeatures: null,
  specialFeaturesDescription: "",
  hasLogoAndColors: null,
  visualIdentityLevel: null,
  contentStatus: null,
  hostingStatus: null,
  wantsHostingSetup: null,
  usedBudgetShortcut: false,
  consideredBudgetShortcut: false,
  leadName: "",
  leadEmail: "",
  leadCompany: "",
  leadPhone: "",
  leadDescription: "",
};

/** Returns the pricing category for a solution type */
export function getPricingType(type: SolutionType | null): "website" | "webshop" {
  return type === "webshop" ? "webshop" : "website";
}
