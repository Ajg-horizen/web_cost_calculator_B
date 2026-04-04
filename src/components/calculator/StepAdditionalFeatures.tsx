import { WEBSITE_FEATURES, WEBSHOP_FEATURES } from "@/lib/calculator-config";
import { getPricingType, type SolutionType } from "@/lib/calculator-types";

interface Props {
  solutionType: SolutionType;
  selected: string[];
  onToggle: (id: string) => void;
}

const StepAdditionalFeatures = ({ solutionType, selected, onToggle }: Props) => {
  const pricingType = getPricingType(solutionType);
  const features = pricingType === "website" ? WEBSITE_FEATURES : WEBSHOP_FEATURES;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du brug for ekstra funktioner?
        </h2>
        <p className="text-hero-muted">Vælg alle der er relevante, eller spring over hvis ingen er nødvendige.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(features).map(([key, feat]) => {
          const isSelected = selected.includes(key);
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-hero-foreground">{feat.label}</h3>
                  <span className="text-xs font-semibold text-hero-muted bg-hero-foreground/10 px-2 py-0.5 rounded-full">$</span>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "bg-hero-foreground border-hero-foreground" : "border-hero-foreground/30"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => {
            selected.forEach((id) => onToggle(id));
          }}
          className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
            selected.length === 0
              ? "border-hero-foreground bg-hero-foreground/5"
              : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-hero-foreground">Ingen af ovenstående</h3>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              selected.length === 0 ? "bg-hero-foreground border-hero-foreground" : "border-hero-foreground/30"
            }`}>
              {selected.length === 0 && (
                <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StepAdditionalFeatures;
