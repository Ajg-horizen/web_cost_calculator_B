import type { Addon } from "./calculator-types";

// === Shared ===
export const DISCOUNT_THRESHOLD = 15000; // DKK — rabat over dette beløb (custom)
export const WEBSHOP_DISCOUNT_THRESHOLD = 25000; // DKK — rabat over dette beløb (webshop)
export const BASE_DISCOUNT = 30; // % — automatisk rabat over tærskel
export const URGENCY_BONUS = 20; // % — ekstra rabat ved bestilling inden 24 timer
export const TOTAL_MAX_DISCOUNT = 50; // % — samlet max rabat

// === Template ===
export const TEMPLATE_PRICE = 4999; // DKK (psykologisk prissætning)

// === Skræddersyet (custom) ===
export const BASE_PRICE = 5999; // DKK
export const MONTHLY_HOSTING_FEE = 399; // DKK/md
export const HOSTING_YEARLY = MONTHLY_HOSTING_FEE * 12; // 4.788 DKK/år

export const ADDONS: Addon[] = [
  { id: "extra-page", label: "Ekstra underside", description: "5 sider er inkluderet — tilkøb flere her", price: 1000, type: "quantity", maxQuantity: 10 },
  { id: "contact-form", label: "Kontaktformular", description: "Formular med email-notifikation til dig", price: 500, type: "checkbox" },
  { id: "booking", label: "Booking-integration", description: "Calendly eller tidsbooking integreret på siden", price: 2500, type: "checkbox" },
  { id: "gallery", label: "Billedgalleri / portfolio", description: "Responsivt galleri med lightbox-visning", price: 1000, type: "checkbox" },
  { id: "seo", label: "SEO-grundpakke", description: "Meta-tags, sitemap og hastighedsoptimering", price: 1500, type: "checkbox" },
  { id: "analytics", label: "Google Analytics opsætning", description: "GA4 + events setup så du kan følge trafikken", price: 500, type: "checkbox" },
  { id: "cookie-banner", label: "Cookie-banner (GDPR)", description: "Lovpligtig cookie-samtykke løsning", price: 500, type: "checkbox" },
  { id: "extra-revision", label: "Ekstra designrevision", description: "1 revision er inkluderet — tilkøb flere her", price: 1000, type: "quantity", maxQuantity: 5 },
];

export const INCLUDED_FEATURES = [
  "5 sider med responsivt design",
  "Mobil- og tablet-optimeret",
  "1 designrevision",
  "SSL-certifikat (https)",
  "Hurtig loadtid",
];

// === Webshop ===
export const WEBSHOP_BASE_PRICE = 14999; // DKK
export const WEBSHOP_HOSTING_MONTHLY = 599; // DKK/md
export const WEBSHOP_HOSTING_YEARLY = WEBSHOP_HOSTING_MONTHLY * 12; // 7.188 DKK/år

export const WEBSHOP_ADDONS: Addon[] = [
  { id: "products-100", label: "Op til 100 produkter", description: "Opgrader fra 30 til 100 produkter", price: 20000, type: "checkbox" },
  { id: "products-200", label: "200+ produkter", description: "Opgrader til 200+ produkter med avanceret struktur", price: 60000, type: "checkbox" },
  { id: "payment-gateway", label: "Betalingsgateway", description: "Stripe, MobilePay, kortbetaling", price: 3000, type: "checkbox" },
  { id: "shipping", label: "Fragt-integration", description: "GLS, PostNord, DAO automatisk fragtberegning", price: 2500, type: "checkbox" },
  { id: "inventory", label: "Lagerstyring", description: "Automatisk lagerstatus og alerts", price: 2000, type: "checkbox" },
  { id: "discount-codes", label: "Rabatkoder & kampagner", description: "Procentrabat, faste beløb, gratis fragt-tilbud", price: 1500, type: "checkbox" },
  { id: "product-filters", label: "Produktfiltrering", description: "Filtrér efter kategori, pris, størrelse m.m.", price: 1500, type: "checkbox" },
  { id: "newsletter", label: "Nyhedsbrev-integration", description: "Mailchimp eller lignende integration", price: 1000, type: "checkbox" },
  { id: "seo", label: "SEO-grundpakke", description: "Meta-tags, sitemap og hastighedsoptimering", price: 1500, type: "checkbox" },
  { id: "cookie-banner", label: "Cookie-banner (GDPR)", description: "Lovpligtig cookie-samtykke løsning", price: 500, type: "checkbox" },
  { id: "extra-revision", label: "Ekstra designrevision", description: "1 revision er inkluderet — tilkøb flere her", price: 1000, type: "quantity", maxQuantity: 5 },
];

export const WEBSHOP_INCLUDED_FEATURES = [
  "Op til 30 produkter",
  "Responsivt design (mobil + tablet)",
  "1 designrevision",
  "Produktsider med billeder og beskrivelse",
  "Indkøbskurv og checkout-flow",
  "SSL-certifikat (https)",
];

// === Beregningsfunktioner ===

export function formatDKK(amount: number): string {
  return amount.toLocaleString("da-DK");
}

export function calculateTotal(
  selectedAddons: string[],
  extraPages: number,
  extraRevisions: number
): number {
  let total = BASE_PRICE;
  for (const addon of ADDONS) {
    if (addon.id === "extra-page") total += addon.price * extraPages;
    else if (addon.id === "extra-revision") total += addon.price * extraRevisions;
    else if (selectedAddons.includes(addon.id)) total += addon.price;
  }
  return total;
}

export function calculateWebshopTotal(
  selectedAddons: string[],
  extraRevisions: number
): number {
  let total = WEBSHOP_BASE_PRICE;
  for (const addon of WEBSHOP_ADDONS) {
    if (addon.id === "extra-revision") total += addon.price * extraRevisions;
    else if (selectedAddons.includes(addon.id)) total += addon.price;
  }
  return total;
}
