import { Phone, Mail } from "lucide-react";
import { calculatePaidAdsPriceRange, formatDKK } from "@/lib/paid-ads-logic";
import ChoiceSummary, { type SummaryItem } from "@/components/calculator/ChoiceSummary";
import type { PaidAdsState } from "@/lib/paid-ads-types";

interface Props {
  state: PaidAdsState;
}

const CTAButtons = () => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
    <a href="tel:+4512345678" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-hero-bg text-hero-foreground font-semibold text-lg border-2 border-hero-foreground/20 transition-transform active:scale-[0.97] hover:scale-[1.02]">
      <Phone className="w-5 h-5" />
      Ring op
    </a>
    <a href="https://horizen.dk/kontakt/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-hero-foreground text-background font-semibold text-lg transition-transform active:scale-[0.97] hover:scale-[1.02]">
      <Mail className="w-5 h-5" />
      Kontakt os
    </a>
  </div>
);

const STATUS_LABELS: Record<string, string> = {
  active: "Kører aktivt",
  underperforming: "Underpræsterer",
  none: "Ingen annoncer endnu",
};
const GOAL_LABELS: Record<string, string> = {
  leads: "Leads / henvendelser",
  ecommerce: "E-commerce salg",
  brand: "Brand awareness",
  retargeting: "Retargeting",
  unsure: "Ikke sikker",
};
const BUDGET_LABELS: Record<string, string> = {
  "under-7500": "Under 7.500 DKK",
  "7500-20000": "7.500–20.000 DKK",
  "20000-75000": "20.000–75.000 DKK",
  "75000+": "75.000+ DKK",
  undecided: "Ikke besluttet",
};
const CREATIVE_LABELS: Record<string, string> = {
  "all-ready": "Alt klar",
  "images-only": "Kun billeder",
  "video-only": "Kun video",
  nothing: "Intet klar",
};
const TRACKING_LABELS: Record<string, string> = {
  full: "Fuld tracking",
  partial: "Delvis",
  none: "Ingen",
  unsure: "Ikke sikker",
};
const SETUP_LABELS: Record<string, string> = {
  simple: "Simpel",
  funnel: "Funnel",
  advanced: "Avanceret",
};
const REPORTING_LABELS: Record<string, string> = {
  monthly: "Månedlig",
  biweekly: "Hver 14. dag",
  weekly: "Ugentlig",
  dashboard: "Live dashboard",
};
const COLLAB_LABELS: Record<string, string> = {
  "one-time": "Engangsopsætning",
  "3-months": "3 måneder",
  ongoing: "Løbende",
  unsure: "Ikke sikker",
};

function buildPaidAdsSummary(state: PaidAdsState): SummaryItem[] {
  return [
    { label: "Nuværende annoncestatus", value: STATUS_LABELS[state.currentAdsStatus ?? ""] ?? "-" },
    { label: "Primært mål", value: GOAL_LABELS[state.primaryGoal ?? ""] ?? "-" },
    { label: "Månedligt budget", value: BUDGET_LABELS[state.monthlyBudget ?? ""] ?? "-" },
    { label: "Platforme", value: state.platforms.length > 0 ? state.platforms.join(", ") : "Ingen valgt" },
    { label: "Kreativt materiale", value: CREATIVE_LABELS[state.creativeStatus ?? ""] ?? "-" },
    { label: "Tracking", value: TRACKING_LABELS[state.trackingStatus ?? ""] ?? "-" },
    { label: "Kampagnetype", value: SETUP_LABELS[state.setupType ?? ""] ?? "-" },
    { label: "Rapportering", value: REPORTING_LABELS[state.reportingFrequency ?? ""] ?? "-" },
    { label: "Samarbejdstype", value: COLLAB_LABELS[state.collaborationType ?? ""] ?? "-" },
  ];
}

const PaidAdsResult = ({ state }: Props) => {
  const { setupLow, setupHigh, monthlyLow, monthlyHigh } = calculatePaidAdsPriceRange(state);

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-step-complete/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-step-complete" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Estimeret investering</h2>
      </div>

      <div className="p-8 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
        <p className="text-sm text-hero-muted mb-1">Setup</p>
        <p className="text-4xl sm:text-5xl font-bold text-hero-foreground mb-2">{formatDKK(setupLow)} – {formatDKK(setupHigh)} DKK</p>
        <p className="text-sm text-hero-muted mt-4 leading-relaxed">Engangsbeløb for opsætning af kampagner, tracking og kreativt materiale.</p>
      </div>

      {monthlyHigh > 0 && (
        <div className="p-6 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
          <h3 className="text-lg font-semibold text-hero-foreground mb-1">Månedlig management</h3>
          <p className="text-2xl font-bold text-hero-foreground">{formatDKK(monthlyLow)} – {formatDKK(monthlyHigh)} DKK <span className="text-base font-normal text-hero-muted">/ md.</span></p>
        </div>
      )}

      <ChoiceSummary items={buildPaidAdsSummary(state)} />

      <CTAButtons />
    </div>
  );
};

export default PaidAdsResult;
