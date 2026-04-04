import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import StepIndicator from "@/components/calculator/StepIndicator";
import StepLeadForm from "@/components/calculator/StepLeadForm";
import SEOStep1 from "@/components/calculator/seo/SEOStep1";
import SEOStep2 from "@/components/calculator/seo/SEOStep2";
import SEOStep3 from "@/components/calculator/seo/SEOStep3";
import SEOStep4 from "@/components/calculator/seo/SEOStep4";
import SEOStep5 from "@/components/calculator/seo/SEOStep5";
import SEOStep6 from "@/components/calculator/seo/SEOStep6";
import SEOStep7 from "@/components/calculator/seo/SEOStep7";
import SEOStep8 from "@/components/calculator/seo/SEOStep8";
import SEOStep9 from "@/components/calculator/seo/SEOStep9";
import SEOResult from "@/components/calculator/seo/SEOResult";
import { type SEOState, initialSEOState } from "@/lib/seo-types";
import { calculateSEOPriceRange, requiresSEOManualReview } from "@/lib/seo-logic";

const STEP_LABELS = [
  "Erfaring",
  "Mål",
  "Størrelse",
  "Konkurrence",
  "Søgeord",
  "Teknisk",
  "Behov",
  "Indhold",
  "Tidsramme",
  "Kontakt",
];

const TOTAL_STEPS = 11;

interface Props {
  onBack: () => void;
}

const SEOFlow = ({ onBack }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<SEOState>(initialSEOState);
  const update = <K extends keyof SEOState>(key: K, value: SEOState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Track calculator_start on mount
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "calculator_start",
      calculator_type: "seo",
      step_number: 1,
    });
  }, []);

  // Track calculator_step on step changes
  useEffect(() => {
    if (currentStep > 1) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "calculator_step",
        calculator_type: "seo",
        step_number: currentStep,
      });
    }
  }, [currentStep]);

  const toggleArray = (key: "technicalStatus" | "needs", id: string) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return state.seoExperience !== null;
      case 2: return state.primaryGoal !== null;
      case 3: return state.websiteSize !== null;
      case 4: return state.competition !== null;
      case 5: return state.keywordResearch !== null;
      case 6: return state.technicalStatus.length > 0;
      case 7: return state.needs.length > 0;
      case 8: return state.contentProduction !== null;
      case 9: return state.timeline !== null;
      case 10:
        return state.leadName.trim() !== "" && state.leadEmail.trim() !== "" && state.leadPhone.trim() !== "" && state.leadDescription.trim() !== "" && state.leadConsent;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 10) {
      try {
        const priceRange = calculateSEOPriceRange(state);
        const isManual = requiresSEOManualReview(state);
        const { error } = await supabase.functions.invoke("send-lead", {
          body: { state, priceRange, isManualReview: isManual, service: "seo", discountCode: undefined },
        });
        if (error) throw error;
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "price_calculation_completed",
          service: "seo",
          price_low: priceRange.low,
          price_high: priceRange.high,
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
          {currentStep === 1 && <SEOStep1 selected={state.seoExperience} onSelect={(v) => update("seoExperience", v as SEOState["seoExperience"])} />}
          {currentStep === 2 && <SEOStep2 selected={state.primaryGoal} onSelect={(v) => update("primaryGoal", v as SEOState["primaryGoal"])} />}
          {currentStep === 3 && <SEOStep3 selected={state.websiteSize} onSelect={(v) => update("websiteSize", v as SEOState["websiteSize"])} />}
          {currentStep === 4 && <SEOStep4 selected={state.competition} onSelect={(v) => update("competition", v as SEOState["competition"])} />}
          {currentStep === 5 && <SEOStep5 selected={state.keywordResearch} onSelect={(v) => update("keywordResearch", v as SEOState["keywordResearch"])} />}
          {currentStep === 6 && <SEOStep6 selected={state.technicalStatus} onToggle={(id) => toggleArray("technicalStatus", id)} />}
          {currentStep === 7 && <SEOStep7 selected={state.needs} onToggle={(id) => toggleArray("needs", id)} />}
          {currentStep === 8 && <SEOStep8 selected={state.contentProduction} onSelect={(v) => update("contentProduction", v as SEOState["contentProduction"])} />}
          {currentStep === 9 && <SEOStep9 selected={state.timeline} onSelect={(v) => update("timeline", v as SEOState["timeline"])} />}
          {currentStep === 10 && (
            <StepLeadForm
              name={state.leadName}
              email={state.leadEmail}
              company={state.leadCompany}
              phone={state.leadPhone}
              existingUrl=""
              onChange={(field, value) => update(field as keyof SEOState, value as any)}
            />
          )}
          {currentStep === 11 && <SEOResult state={state} />}
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

export default SEOFlow;
