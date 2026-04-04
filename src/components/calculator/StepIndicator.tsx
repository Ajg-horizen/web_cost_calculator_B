import { Check } from "lucide-react";

const DEFAULT_STEP_LABELS = [
  "Eksist. side",
  "Løsning",
  "Proces",
  "Størrelse",
  "Funktioner",
  "Special",
  "Identitet",
  "Indhold",
  "Hosting",
  "Kontakt",
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ currentStep, totalSteps = 11, stepLabels = DEFAULT_STEP_LABELS, onStepClick }: StepIndicatorProps) => {
  const VISIBLE_STEPS = stepLabels.length;
  const displayStep = Math.min(currentStep, VISIBLE_STEPS);
  const showFullSteps = currentStep >= 10;
  const percentage = Math.round((displayStep / VISIBLE_STEPS) * 100);

  const handleStepClick = (stepNum: number) => {
    if (onStepClick && stepNum < displayStep) {
      onStepClick(stepNum);
    }
  };

  // Progress bar mode (steps 1-9)
  if (!showFullSteps) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-hero-foreground">
            {percentage}%
          </span>
          <span className="text-sm text-hero-muted">{stepLabels[displayStep - 1]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-hero-foreground/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-hero-foreground transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Full step indicator mode (step 10+)
  return (
    <div className="w-full">
      {/* Mobile: simple progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-hero-foreground">
            Trin {displayStep} af {VISIBLE_STEPS}
          </span>
          <span className="text-sm text-hero-muted">{stepLabels[displayStep - 1]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-hero-foreground/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-hero-foreground transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="hidden sm:flex items-center relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-hero-foreground/10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-hero-foreground transition-all duration-500 ease-out"
          style={{ width: `${((displayStep - 1) / (VISIBLE_STEPS - 1)) * 100}%` }}
        />

        {Array.from({ length: VISIBLE_STEPS }, (_, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < displayStep;
          const isActive = stepNum === displayStep;
          const isClickable = isComplete && !!onStepClick;

          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2" style={{ width: `${100 / VISIBLE_STEPS}%` }}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => handleStepClick(stepNum)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isComplete
                    ? "bg-step-complete text-primary-foreground"
                    : isActive
                    ? "bg-hero-foreground text-background"
                    : "bg-hero-foreground/10 text-hero-muted"
                } ${isClickable ? "cursor-pointer hover:scale-110 hover:ring-2 hover:ring-hero-foreground/30" : "cursor-default"}`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : stepNum}
              </button>
              <span
                className={`text-[10px] w-full text-center leading-tight transition-colors duration-300 ${
                  isActive ? "text-hero-foreground font-medium" : "text-hero-muted"
                } ${isClickable ? "cursor-pointer" : ""}`}
                onClick={() => handleStepClick(stepNum)}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
