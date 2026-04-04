// Central configuration – all pricing logic lives here
// INTERNAL: hourly rate must never be exposed in frontend UI

export const HOURLY_RATE = 550; // DKK
export const MONTHLY_HOSTING_FEE = 399; // DKK

// Hours for existing website migration
export const EXISTING_WEBSITE_HOURS = 5;

// Size hours: [efficient, collaborative]
export const WEBSITE_SIZE_HOURS: Record<string, [number, number]> = {
  "1-5": [8, 20],
  "5-10": [13, 29],
  "10+": [18, 39],
};

export const WEBSHOP_SIZE_HOURS: Record<string, [number, number]> = {
  "up-to-20": [35, 60],
  "20-100": [50, 80],
  "100+": [70, 110],
};

// Additional features hours: [efficient, collaborative]
export const WEBSITE_FEATURES: Record<string, { label: string; hours: [number, number] }> = {
  booking: { label: "Bookingsystem", hours: [6, 8] },
  integration: { label: "Integration", hours: [6, 8] },
};

export const WEBSHOP_FEATURES: Record<string, { label: string; hours: [number, number] }> = {
  payment: { label: "Betalingsgateway opsætning", hours: [5, 6] },
  shipping: { label: "Fragt opsætning", hours: [4, 6] },
  integration: { label: "Integration", hours: [8, 10] },
};

// Special features
export const SPECIAL_FEATURES_HOURS = 8;
export const STANDARD_INTERVAL = 0.15; // ±15%
export const SPECIAL_INTERVAL = 0.20; // ±20%

// Visual identity hours (collaborative only)
export const VISUAL_IDENTITY_HOURS: Record<string, number> = {
  "logo-guidelines": 0,
  "logo-only": 6,
  "no-identity": 12,
};

// Content creation hours: [efficient, collaborative]
export const CONTENT_HOURS: Record<string, [number, number]> = {
  "has-content": [0, 0],
  "needs-content": [8, 12],
};

// Hosting & domain hours
export const HOSTING_HOURS: Record<string, number> = {
  "yes-both": 2,
  "domain-only": 2,
  "no": 3,
  "not-sure": 3,
};

// Surcharge when client has own hosting (coordination + lost hosting revenue)
export const OWN_HOSTING_SURCHARGE = 3000; // DKK flat

// Complexity thresholds for manual review
export const COMPLEXITY_THRESHOLD_HOURS = 100;

export const WEBSITE_SIZE_LABELS: Record<string, string> = {
  "1-5": "1–5 sider",
  "5-10": "5–10 sider",
  "10+": "10+ sider",
};

export const WEBSHOP_SIZE_LABELS: Record<string, string> = {
  "up-to-20": "Op til 20 produkter",
  "20-100": "20–100 produkter",
  "100+": "100+ produkter",
};
