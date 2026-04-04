import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import horizenLogo from "@/assets/horizen-logo.png";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { calculatePriceRange } from "@/lib/calculator-logic";
import { toast } from "@/hooks/use-toast";
import { getPricingType } from "@/lib/calculator-types";
import CalculatorHero from "@/components/calculator/CalculatorHero";
import StepIndicator from "@/components/calculator/StepIndicator";
import StepBudgetShortcut from "@/components/calculator/StepBudgetShortcut";
import StepExistingWebsite from "@/components/calculator/StepExistingWebsite";
import StepSolutionType from "@/components/calculator/StepSolutionType";
import StepProcessType from "@/components/calculator/StepProcessType";
import StepSize from "@/components/calculator/StepSize";
import StepAdditionalFeatures from "@/components/calculator/StepAdditionalFeatures";
import StepSpecialFeatures from "@/components/calculator/StepSpecialFeatures";
import StepVisualIdentity from "@/components/calculator/StepVisualIdentity";
import StepContent from "@/components/calculator/StepContent";
import StepHosting from "@/components/calculator/StepHosting";
import StepLeadForm from "@/components/calculator/StepLeadForm";
import StepLoadingPrice from "@/components/calculator/StepLoadingPrice";
import StepResult from "@/components/calculator/StepResult";
import { type CalculatorState, initialCalculatorState } from "@/lib/calculator-types";
import { generateDiscountCode } from "@/components/calculator/UrgencyOffer";

const TOTAL_STEPS = 11;

const Index = () => {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showBudgetShortcut, setShowBudgetShortcut] = useState(false);
  const [showPriceLoading, setShowPriceLoading] = useState(false);
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);
  const [discountCode] = useState(() => generateDiscountCode());
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); };
  }, []);

  const update = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const selectAndAdvance = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K], advanceFn: () => void) => {
    update(key, value);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(advanceFn, 400);
  };

  // Track calculator_start when flow begins
  useEffect(() => {
    if (started && currentStep === 1) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "calculator_start",
        calculator_type: "website",
        step_number: 1,
      });
    }
  }, [started]);

  // Track calculator_step on step changes
  useEffect(() => {
    if (started && currentStep > 1) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "calculator_step",
        calculator_type: "website",
        step_number: currentStep,
      });
    }
  }, [currentStep, started]);

  const toggleFeature = (id: string) => {
    setState((prev) => ({
      ...prev,
      additionalFeatures: prev.additionalFeatures.includes(id)
        ? prev.additionalFeatures.filter((f) => f !== id)
        : [...prev.additionalFeatures, id],
    }));
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentStep(1);
    setShowBudgetShortcut(false);
    setShowPriceLoading(false);
    setState(initialCalculatorState);
  };

  const handleBudgetShortcut = () => {
    const pricingType = getPricingType(state.solutionType);
    const cheapestSize = pricingType === "webshop" ? "up-to-20" : "1-5";
    setState((prev) => ({
      ...prev,
      processType: "efficient",
      size: cheapestSize,
      additionalFeatures: [],
      hasSpecialFeatures: false,
      specialFeaturesDescription: "",
      hasLogoAndColors: true,
      visualIdentityLevel: null,
      contentStatus: "has-content",
      hostingStatus: "no",
      wantsHostingSetup: true,
      usedBudgetShortcut: true,
    }));
    setShowBudgetShortcut(false);
    setShowPriceLoading(true);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return state.solutionType !== null;
      case 2: return state.hasExistingWebsite !== null;
      case 3: return state.processType !== null;
      case 4: return state.solutionType === "landing-page" ? true : state.size !== null;
      case 5: return true;
      case 6: return state.hasSpecialFeatures !== null;
      case 7:
        if (state.processType === "efficient") return state.hasLogoAndColors !== null;
        return state.visualIdentityLevel !== null;
      case 8: return state.contentStatus !== null;
      case 9:
        if (state.hostingStatus === null) return false;
        if ((state.hostingStatus === "domain-only" || state.hostingStatus === "no") && state.wantsHostingSetup === null) return false;
        return true;
      case 10:
        return state.leadName.trim() !== "" && state.leadEmail.trim() !== "" && state.leadPhone.trim() !== "";
      default: return false;
    }
  };

  const handleNext = async () => {
    // After step 1 (solution type), show budget shortcut
    if (currentStep === 1) {
      // Go to step 2 (existing website) first, then budget shortcut after step 2... 
      // Actually the old flow was: step 2 (solution type) -> budget shortcut. 
      // Now step 1 is solution type, so we go to step 2 first.
      setCurrentStep(2);
      return;
    }
    // After step 2 (existing website), show budget shortcut
    if (currentStep === 2) {
      setShowBudgetShortcut(true);
      return;
    }
    // After step 9 (hosting), show price loading
    if (currentStep === 9) {
      setShowPriceLoading(true);
      return;
    }
    if (currentStep === 10) {
      try {
        const rawPriceRange = calculatePriceRange(state);
        const pricingType = getPricingType(state.solutionType);
        const isSubscriptionModel = pricingType === "website" && (state.usedBudgetShortcut || rawPriceRange.high <= 13300);
        const priceRange = isSubscriptionModel
          ? { low: 2000, high: 2000 }
          : rawPriceRange;
        const monthlyPrice = isSubscriptionModel ? (state.solutionType === "webshop" ? 599 : 399) : undefined;
        const showDiscount = !isSubscriptionModel;
        const { error } = await supabase.functions.invoke("send-lead", {
          body: { state, priceRange, isManualReview: false, service: "web", discountCode: showDiscount ? discountCode : undefined, monthlyPrice },
        });
        if (error) throw error;
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "price_calculation_completed",
          service: "web",
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

  // Hero screen
  if (!started) {
    return (
      <div className="min-h-screen gradient-hero">
        <CalculatorHero onStart={() => setStarted(true)} />
      </div>
    );
  }

  // Budget shortcut interstitial
  if (showBudgetShortcut) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <header className="w-full">
          <nav className="px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
            <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
              <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
            </a>
          </nav>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="animate-step-in w-full flex items-center justify-center">
            <StepBudgetShortcut
              onBudget={handleBudgetShortcut}
              onContinue={() => {
                setState((prev) => ({ ...prev, consideredBudgetShortcut: true }));
                setShowBudgetShortcut(false);
                setCurrentStep(3);
              }}
            />
          </div>
        </main>
        <footer className="px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setShowBudgetShortcut(false);
                setCurrentStep(2);
              }}
              className="text-hero-muted hover:text-hero-foreground hover:bg-hero-foreground/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage
            </Button>
          </div>
        </footer>
      </div>
    );
  }

  // Price loading interstitial
  if (showPriceLoading) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <header className="w-full">
          <nav className="px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
            <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
              <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
            </a>
          </nav>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="animate-step-in w-full flex items-center justify-center">
            <StepLoadingPrice onComplete={() => {
              setShowPriceLoading(false);
              setCurrentStep(10);
            }} />
          </div>
        </main>
      </div>
    );
  }

  // Web flow
  const isResultStep = currentStep === 11;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="min-h-screen flex flex-col">
        <header className="w-full">
          <nav className="px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
            <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
              <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
            </a>
          </nav>
          <div className="px-4 sm:px-8 pt-4 pb-2">
            <div className="max-w-4xl mx-auto">
              <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} onStepClick={(step) => setCurrentStep(step)} />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div key={currentStep} className="animate-step-in w-full flex items-center justify-center">
            {currentStep === 1 && (
              <StepSolutionType selected={state.solutionType} onSelect={(val) => {
                selectAndAdvance("solutionType", val, () => setCurrentStep(2));
              }} />
            )}
            {currentStep === 2 && (
              <StepExistingWebsite
                hasExisting={state.hasExistingWebsite}
                url={state.existingUrl}
                onSelect={(val) => {
                  update("hasExistingWebsite", val);
                  if (val === false) {
                    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
                    autoAdvanceTimer.current = setTimeout(() => setShowBudgetShortcut(true), 400);
                  }
                }}
                onUrlChange={(val) => update("existingUrl", val)}
              />
            )}
            {currentStep === 3 && (
              <StepProcessType selected={state.processType} onSelect={(val) => {
                const nextStep = state.solutionType === "landing-page" ? 5 : 4;
                selectAndAdvance("processType", val, () => setCurrentStep(nextStep));
              }} />
            )}
            {currentStep === 4 && state.solutionType && state.solutionType !== "landing-page" && (
              <StepSize solutionType={state.solutionType} selected={state.size} onSelect={(val) => selectAndAdvance("size", val, () => setCurrentStep(5))} />
            )}
            {currentStep === 5 && state.solutionType && (
              <StepAdditionalFeatures solutionType={state.solutionType} selected={state.additionalFeatures} onToggle={toggleFeature} />
            )}
            {currentStep === 6 && (
              <StepSpecialFeatures
                hasSpecial={state.hasSpecialFeatures}
                description={state.specialFeaturesDescription}
                onSelect={(val) => {
                  update("hasSpecialFeatures", val);
                  if (val === false) {
                    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
                    autoAdvanceTimer.current = setTimeout(() => setCurrentStep(7), 400);
                  }
                }}
                onDescriptionChange={(val) => update("specialFeaturesDescription", val)}
              />
            )}
            {currentStep === 7 && state.processType && (
              <StepVisualIdentity
                processType={state.processType}
                hasLogoAndColors={state.hasLogoAndColors}
                onHasLogoAndColors={(val) => selectAndAdvance("hasLogoAndColors", val, () => setCurrentStep(8))}
                visualIdentityLevel={state.visualIdentityLevel}
                onVisualIdentityLevel={(val) => selectAndAdvance("visualIdentityLevel", val, () => setCurrentStep(8))}
              />
            )}
            {currentStep === 8 && (
              <StepContent selected={state.contentStatus} onSelect={(val) => selectAndAdvance("contentStatus", val, () => setCurrentStep(9))} />
            )}
            {currentStep === 9 && (
              <StepHosting
                hostingStatus={state.hostingStatus}
                wantsHostingSetup={state.wantsHostingSetup}
                solutionType={state.solutionType}
                onHostingStatus={(val) => update("hostingStatus", val)}
                onWantsHostingSetup={(val) => update("wantsHostingSetup", val)}
              />
            )}
            {currentStep === 10 && (
            <StepLeadForm
                name={state.leadName}
                email={state.leadEmail}
                company={state.leadCompany}
                phone={state.leadPhone}
                existingUrl={state.existingUrl}
                onChange={(field, value) => update(field as keyof CalculatorState, value as any)}
              />
            )}
            {currentStep === 11 && <StepResult state={state} discountCode={discountCode} />}
          </div>
        </main>

        {!isResultStep && (
          <footer className="px-4 sm:px-8 py-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentStep === 1) {
                    handleReset();
                  } else if (currentStep === 5 && state.solutionType === "landing-page") {
                    setCurrentStep(3);
                  } else {
                    setCurrentStep((s) => s - 1);
                  }
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
                {currentStep === 10 ? "Se min pris" : currentStep === 9 ? "Beregn min pris" : "Fortsæt"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;
