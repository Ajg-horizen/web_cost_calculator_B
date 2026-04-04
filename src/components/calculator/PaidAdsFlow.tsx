import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import StepIndicator from "@/components/calculator/StepIndicator";
import StepLeadForm from "@/components/calculator/StepLeadForm";
import PaidAdsStep1 from "@/components/calculator/paid-ads/PaidAdsStep1";
import PaidAdsStep2 from "@/components/calculator/paid-ads/PaidAdsStep2";
import PaidAdsStep3 from "@/components/calculator/paid-ads/PaidAdsStep3";
import PaidAdsStep4 from "@/components/calculator/paid-ads/PaidAdsStep4";
import PaidAdsStep5 from "@/components/calculator/paid-ads/PaidAdsStep5";
import PaidAdsStep6 from "@/components/calculator/paid-ads/PaidAdsStep6";
import PaidAdsStep7 from "@/components/calculator/paid-ads/PaidAdsStep7";
import PaidAdsStep8 from "@/components/calculator/paid-ads/PaidAdsStep8";
import PaidAdsStep9 from "@/components/calculator/paid-ads/PaidAdsStep9";
import PaidAdsResult from "@/components/calculator/paid-ads/PaidAdsResult";
import { type PaidAdsState, initialPaidAdsState } from "@/lib/paid-ads-types";
import { calculatePaidAdsPriceRange, requiresPaidAdsManualReview } from "@/lib/paid-ads-logic";

const STEP_LABELS = [
  "Annoncer",
  "Mål",
  "Budget",
  "Platforme",
  "Kreativt",
  "Tracking",
  "Setup",
  "Rapport",
  "Samarbejde",
  "Kontakt",
];

const TOTAL_STEPS = 11;

interface Props {
  onBack: () => void;
}

const PaidAdsFlow = ({ onBack }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<PaidAdsState>(initialPaidAdsState);
  const update = <K extends keyof PaidAdsState>(key: K, value: PaidAdsState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Track calculator_start on mount
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "calculator_start",
      calculator_type: "paid_ads",
      step_number: 1,
    });
  }, []);

  // Track calculator_step on step changes
  useEffect(() => {
    if (currentStep > 1) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "calculator_step",
        calculator_type: "paid_ads",
        step_number: currentStep,
      });
    }
  }, [currentStep]);

  const togglePlatform = (id: string) => {
    setState((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id) ? prev.platforms.filter((p) => p !== id) : [...prev.platforms, id],
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return state.currentAdsStatus !== null;
      case 2: return state.primaryGoal !== null;
      case 3: return state.monthlyBudget !== null;
      case 4: return state.platforms.length > 0;
      case 5: return state.creativeStatus !== null;
      case 6: return state.trackingStatus !== null;
      case 7: return state.setupType !== null;
      case 8: return state.reportingFrequency !== null;
      case 9: return state.collaborationType !== null;
      case 10:
        return state.leadName.trim() !== "" && state.leadEmail.trim() !== "" && state.leadPhone.trim() !== "" && state.leadDescription.trim() !== "" && state.leadConsent;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 10) {
      try {
        const priceRange = calculatePaidAdsPriceRange(state);
        const isManual = requiresPaidAdsManualReview(state);
        const { error } = await supabase.functions.invoke("send-lead", {
          body: { state, priceRange, isManualReview: isManual, service: "paid-ads", discountCode: undefined },
        });
        if (error) throw error;
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "price_calculation_completed",
          service: "paid-ads",
          setup_low: priceRange.setupLow,
          setup_high: priceRange.setupHigh,
          monthly_low: priceRange.monthlyLow,
          monthly_high: priceRange.monthlyHigh,
        });
      } catch (err) {
        console.error("Failed to send lead:", err);
        toast({ title: "Kunne ikke sende forespørgslen", description: "Prøv igen senere.", variant: "destructive" });
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-8 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={STEP_LABELS} onStepClick={(step) => setCurrentStep(step)} />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div key={currentStep} className="animate-step-in w-full flex items-center justify-center">
          {currentStep === 1 && <PaidAdsStep1 selected={state.currentAdsStatus} onSelect={(v) => update("currentAdsStatus", v)} />}
          {currentStep === 2 && <PaidAdsStep2 selected={state.primaryGoal} onSelect={(v) => update("primaryGoal", v as PaidAdsState["primaryGoal"])} />}
          {currentStep === 3 && <PaidAdsStep3 selected={state.monthlyBudget} onSelect={(v) => update("monthlyBudget", v as PaidAdsState["monthlyBudget"])} />}
          {currentStep === 4 && <PaidAdsStep4 selected={state.platforms} onToggle={togglePlatform} />}
          {currentStep === 5 && <PaidAdsStep5 selected={state.creativeStatus} onSelect={(v) => update("creativeStatus", v as PaidAdsState["creativeStatus"])} />}
          {currentStep === 6 && <PaidAdsStep6 selected={state.trackingStatus} onSelect={(v) => update("trackingStatus", v as PaidAdsState["trackingStatus"])} />}
          {currentStep === 7 && <PaidAdsStep7 selected={state.setupType} onSelect={(v) => update("setupType", v as PaidAdsState["setupType"])} />}
          {currentStep === 8 && <PaidAdsStep8 selected={state.reportingFrequency} onSelect={(v) => update("reportingFrequency", v as PaidAdsState["reportingFrequency"])} />}
          {currentStep === 9 && <PaidAdsStep9 selected={state.collaborationType} onSelect={(v) => update("collaborationType", v as PaidAdsState["collaborationType"])} />}
          {currentStep === 10 && (
            <StepLeadForm
              name={state.leadName}
              email={state.leadEmail}
              company={state.leadCompany}
              phone={state.leadPhone}
              existingUrl=""
              onChange={(field, value) => update(field as keyof PaidAdsState, value as any)}
            />
          )}
          {currentStep === 11 && <PaidAdsResult state={state} />}
        </div>
      </main>

      {!isLastStep && (
        <footer className="px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                if (currentStep === 1) onBack();
                else setCurrentStep((s) => s - 1);
              }}
              className="text-hero-muted hover:text-hero-foreground hover:bg-hero-foreground/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-hero-foreground text-background px-6 py-5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-hero-foreground/90 active:scale-[0.98] transition-all duration-200"
            >
              {currentStep === 10 ? "Se overslag" : "Fortsæt"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </footer>
      )}

      {isLastStep && (
        <footer className="px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <Button variant="ghost" onClick={onBack} className="text-hero-muted hover:text-hero-foreground hover:bg-hero-foreground/5">
              Start forfra
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PaidAdsFlow;
