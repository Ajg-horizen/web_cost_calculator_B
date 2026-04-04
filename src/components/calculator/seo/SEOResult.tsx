import { Phone, Mail } from "lucide-react";
import { calculateSEOPriceRange, formatDKK } from "@/lib/seo-logic";
import ChoiceSummary, { type SummaryItem } from "@/components/calculator/ChoiceSummary";
import type { SEOState } from "@/lib/seo-types";

interface Props {
  state: SEOState;
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

const EXP_LABELS: Record<string, string> = {
  active: "Arbejder aktivt med SEO",
  little: "Lidt erfaring",
  none: "Ingen erfaring",
};
const GOAL_LABELS: Record<string, string> = {
  "organic-leads": "Organiske leads",
  "webshop-sales": "Webshop-salg",
  local: "Lokal synlighed",
  national: "National synlighed",
  international: "International synlighed",
};
const SIZE_LABELS: Record<string, string> = {
  "1-10": "1–10 sider",
  "10-50": "10–50 sider",
  "50-200": "50–200 sider",
  "200+": "200+ sider",
};
const COMP_LABELS: Record<string, string> = {
  low: "Lav",
  medium: "Medium",
  high: "Høj",
  unknown: "Ved ikke",
};
const KW_LABELS: Record<string, string> = {
  yes: "Ja",
  no: "Nej",
  partial: "Delvist",
};
const CONTENT_LABELS: Record<string, string> = {
  self: "Selv",
  "blog-help": "Blog-hjælp",
  "seo-texts": "SEO-tekster",
  "full-strategy": "Fuld strategi",
};
const TIMELINE_LABELS: Record<string, string> = {
  flexible: "Fleksibel",
  "3-6-months": "3–6 måneder",
  asap: "Hurtigst muligt",
};

function buildSEOSummary(state: SEOState): SummaryItem[] {
  return [
    { label: "SEO-erfaring", value: EXP_LABELS[state.seoExperience ?? ""] ?? "-" },
    { label: "Primært mål", value: GOAL_LABELS[state.primaryGoal ?? ""] ?? "-" },
    { label: "Hjemmesidestørrelse", value: SIZE_LABELS[state.websiteSize ?? ""] ?? "-" },
    { label: "Konkurrence", value: COMP_LABELS[state.competition ?? ""] ?? "-" },
    { label: "Søgeordsanalyse", value: KW_LABELS[state.keywordResearch ?? ""] ?? "-" },
    { label: "Teknisk status", value: state.technicalStatus.length > 0 ? `${state.technicalStatus.length} valgt` : "Ingen" },
    { label: "Behov", value: state.needs.length > 0 ? `${state.needs.length} valgt` : "Ingen" },
    { label: "Indholdsproduktion", value: CONTENT_LABELS[state.contentProduction ?? ""] ?? "-" },
    { label: "Tidshorisont", value: TIMELINE_LABELS[state.timeline ?? ""] ?? "-" },
  ];
}

const SEOResult = ({ state }: Props) => {
  const { low, high } = calculateSEOPriceRange(state);

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="p-8 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
        <p className="text-4xl sm:text-5xl font-bold text-hero-foreground mb-2">{formatDKK(low)} – {formatDKK(high)} DKK</p>
        <p className="text-sm text-hero-muted mt-1 font-medium">Estimeret månedlig investering</p>
        <p className="text-sm text-hero-muted mt-1">pr. måned</p>
        <p className="text-sm text-hero-muted mt-4 leading-relaxed">Dette overslag er baseret på dine valgte kriterier og er kun vejledende.</p>
      </div>

      <ChoiceSummary items={buildSEOSummary(state)} />

      <CTAButtons />
    </div>
  );
};

export default SEOResult;
