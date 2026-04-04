export interface SEOState {
  // Step 1
  seoExperience: "active" | "little" | "none" | null;
  // Step 2
  primaryGoal: "organic-leads" | "webshop-sales" | "local" | "national" | "international" | null;
  // Step 3
  websiteSize: "1-10" | "10-50" | "50-200" | "200+" | null;
  // Step 4
  competition: "low" | "medium" | "high" | "unknown" | null;
  // Step 5
  keywordResearch: "yes" | "no" | "partial" | null;
  // Step 6
  technicalStatus: string[];
  // Step 7
  needs: string[];
  // Step 8
  contentProduction: "self" | "blog-help" | "seo-texts" | "full-strategy" | null;
  // Step 9
  timeline: "flexible" | "3-6-months" | "asap" | null;

  // Lead
  leadName: string;
  leadEmail: string;
  leadCompany: string;
  leadPhone: string;
  leadDescription: string;
  leadConsent: boolean;
}

export const initialSEOState: SEOState = {
  seoExperience: null,
  primaryGoal: null,
  websiteSize: null,
  competition: null,
  keywordResearch: null,
  technicalStatus: [],
  needs: [],
  contentProduction: null,
  timeline: null,
  leadName: "",
  leadEmail: "",
  leadCompany: "",
  leadPhone: "",
  leadDescription: "",
  leadConsent: false,
};
