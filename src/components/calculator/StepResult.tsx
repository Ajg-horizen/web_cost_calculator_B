import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatePriceRange, showHostingFee, formatDKK } from "@/lib/calculator-logic";
import { WEBSITE_SIZE_LABELS, WEBSHOP_SIZE_LABELS } from "@/lib/calculator-config";
import { getPricingType } from "@/lib/calculator-types";
import ChoiceSummary, { type SummaryItem } from "@/components/calculator/ChoiceSummary";
import UrgencyOffer from "@/components/calculator/UrgencyOffer";
import type { CalculatorState } from "@/lib/calculator-types";

interface Props {
  state: CalculatorState;
  discountCode?: string;
}

const CTAButtons = () => (
  <div className="flex flex-col items-center gap-4 mt-8">
    <p className="text-hero-muted text-sm font-medium">
      Lyder det spændende? Lad os tage en uforpligtende snak.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button
        asChild
        className="w-full sm:w-auto bg-hero-foreground text-background px-8 py-6 rounded-xl font-semibold text-lg hover:bg-hero-foreground/90 active:scale-[0.98] transition-all duration-200"
      >
        <a href="tel:+4542203842">
          <Phone className="w-5 h-5 mr-2" />
          +45 42 20 38 42
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="w-full sm:w-auto border-hero-foreground/20 text-hero-foreground px-8 py-6 rounded-xl font-semibold text-lg hover:bg-hero-foreground/5 active:scale-[0.98] transition-all duration-200"
      >
        <a href="mailto:hello@horizen.dk">
          <Mail className="w-5 h-5 mr-2" />
          hello@horizen.dk
        </a>
      </Button>
    </div>
  </div>
);

const PROCESS_LABELS: Record<string, string> = {
  efficient: "Effektiv",
  balanced: "Balanceret",
  collaborative: "Kollaborativ",
};

const SOLUTION_LABELS: Record<string, string> = {
  website: "Virksomhedshjemmeside",
  webshop: "Webshop",
  "landing-page": "Landing page",
  "ved-ikke": "Ved ikke endnu",
};

const CONTENT_LABELS: Record<string, string> = {
  "has-content": "Leverer selv",
  "needs-content": "Har brug for indhold",
};

const HOSTING_LABELS: Record<string, string> = {
  "yes-both": "Har hosting & domæne",
  "domain-only": "Har kun domæne",
  "no": "Har intet",
  "not-sure": "Ikke sikker",
};

const VISUAL_IDENTITY_LABELS: Record<string, string> = {
  "logo-guidelines": "Logo + guidelines",
  "logo-only": "Kun logo",
  "no-identity": "Intet endnu",
};

function buildWebSummary(state: CalculatorState): SummaryItem[] {
  const pricingType = getPricingType(state.solutionType);
  let sizeLabel: string;
  if (state.usedBudgetShortcut && pricingType === "website") {
    sizeLabel = "One pager";
  } else {
    sizeLabel = pricingType === "webshop"
      ? WEBSHOP_SIZE_LABELS[state.size ?? ""] ?? state.size
      : WEBSITE_SIZE_LABELS[state.size ?? ""] ?? state.size;
  }

  const items: SummaryItem[] = [
    { label: "Type", value: SOLUTION_LABELS[state.solutionType ?? ""] ?? "-" },
    { label: "Eksisterende hjemmeside", value: state.hasExistingWebsite ? "Ja" : "Nej" },
    { label: "Procestype", value: PROCESS_LABELS[state.processType ?? ""] ?? "-" },
    { label: "Størrelse", value: sizeLabel ?? "-" },
    { label: "Tilvalg", value: state.additionalFeatures.length > 0 ? `${state.additionalFeatures.length} valgt` : "Ingen" },
    { label: "Specialfunktioner", value: state.hasSpecialFeatures ? "Ja" : "Nej" },
  ];

  if (state.processType === "efficient") {
    items.push({ label: "Logo & farver", value: state.hasLogoAndColors ? "Har allerede" : "Mangler" });
  } else {
    items.push({ label: "Visuel identitet", value: VISUAL_IDENTITY_LABELS[state.visualIdentityLevel ?? ""] ?? "-" });
  }

  items.push(
    { label: "Indhold", value: CONTENT_LABELS[state.contentStatus ?? ""] ?? "-" },
    { label: "Hosting & domæne", value: HOSTING_LABELS[state.hostingStatus ?? ""] ?? "-" },
  );

  return items;
}

const StepResult = ({ state, discountCode }: Props) => {
  const isVedIkke = state.solutionType === "ved-ikke";
  const { low, high } = calculatePriceRange(state);
  const hasHosting = showHostingFee(state);
  const summaryItems = isVedIkke ? [] : buildWebSummary(state);
  const pricingType = getPricingType(state.solutionType);
  const monthlyPrice = pricingType === "webshop" ? 599 : 399;
  const isSubscriptionModel = pricingType === "website" && (state.usedBudgetShortcut || high <= 13300);
  const isBudgetShortcut = isSubscriptionModel;

  return (
    <div className="w-full max-w-2xl mx-auto text-center">

      {isVedIkke ? (
        <>
          <div className="p-8 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
            <p className="text-4xl sm:text-5xl font-bold text-hero-foreground mb-2">
              {formatDKK(low)} – {formatDKK(high)} DKK
            </p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Estimeret investering</p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Engangsbeløb</p>
          </div>

           <UrgencyOffer discountCode={discountCode} />

          <div className="p-6 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
            <p className="text-sm text-hero-muted leading-relaxed">
              Da du har valgt "Ved ikke", anbefaler vi et indledende møde, så vi sammen kan afklare dine mål og behov – og finde den rette løsning til dig.
            </p>
          </div>
        </>
      ) : isBudgetShortcut ? (
        <>
          <div className="p-8 rounded-2xl border-2 border-step-complete/30 bg-step-complete/5 mb-6">
            <p className="text-4xl sm:text-5xl font-bold text-step-complete mb-2">
              {formatDKK(2000)} DKK
            </p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Estimeret investering</p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Engangspris</p>
          </div>

          <div className="p-6 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
            <h3 className="text-lg font-semibold text-hero-foreground mb-1">
              Hosting & drift
            </h3>
            <p className="text-hero-muted text-sm mb-3">Vi står for hosting og drift af din løsning</p>
            <p className="text-2xl font-bold text-hero-foreground">
              {formatDKK(399)} DKK <span className="text-base font-normal text-hero-muted">/ md.</span>
            </p>
            <div className="mt-4 pt-4 border-t border-hero-foreground/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center">
              <span className="inline-flex items-center gap-1.5 text-sm text-hero-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-step-complete" />
                Betales årligt
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-hero-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-step-complete" />
                Ingen bindingsperiode
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-8 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] mb-6">
            <p className="text-4xl sm:text-5xl font-bold text-hero-foreground mb-2">
              {formatDKK(low)} – {formatDKK(high)} DKK
            </p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Estimeret investering</p>
            <p className="text-sm text-hero-muted mt-1 font-medium">Engangsbeløb</p>
            
            <p className="text-sm text-hero-muted mt-3 leading-relaxed">
              Dette overslag er baseret på dine valgte kriterier og er kun vejledende.
              Eventuelle tilpasninger udover det aftalte omfang faktureres separat.
            </p>
          </div>

          <UrgencyOffer discountCode={discountCode} />

          {hasHosting && (
            <div className="p-6 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
              <h3 className="text-lg font-semibold text-hero-foreground mb-1">
                Hosting & drift
              </h3>
              <p className="text-2xl font-bold text-hero-foreground">
                {formatDKK(monthlyPrice)} DKK <span className="text-base font-normal text-hero-muted">/ md.</span>
              </p>
              <div className="mt-4 pt-4 border-t border-hero-foreground/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center">
                <span className="inline-flex items-center gap-1.5 text-sm text-hero-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-step-complete" />
                  Betales årligt
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-hero-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-step-complete" />
                  Ingen bindingsperiode
                </span>
              </div>
            </div>
          )}
        </>
      )}

      <ChoiceSummary items={summaryItems} />

      <CTAButtons />
    </div>
  );
};

export default StepResult;
