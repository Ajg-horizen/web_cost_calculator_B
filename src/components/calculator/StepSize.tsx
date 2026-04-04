import { WEBSITE_SIZE_LABELS, WEBSHOP_SIZE_LABELS } from "@/lib/calculator-config";
import { getPricingType, type SolutionType } from "@/lib/calculator-types";

const WEBSITE_SIZE_COST: Record<string, string> = {
  "1-5": "$",
  "5-10": "$$",
  "10+": "$$$",
};

const WEBSHOP_SIZE_COST: Record<string, string> = {
  "up-to-20": "$",
  "20-100": "$$",
  "100+": "$$$",
};

interface Props {
  solutionType: SolutionType;
  selected: string | null;
  onSelect: (val: string) => void;
}

const StepSize = ({ solutionType, selected, onSelect }: Props) => {
  const pricingType = getPricingType(solutionType);
  const labels = pricingType === "website" ? WEBSITE_SIZE_LABELS : WEBSHOP_SIZE_LABELS;
  const title = pricingType === "website" ? "Hvor mange sider har du brug for?" : "Hvor mange produkter vil du have?";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">{title}</h2>
        <p className="text-hero-muted">Vælg det interval der passer bedst til dit projekt.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(labels).map(([key, label]) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`group relative p-6 rounded-xl border-2 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <h3 className="text-lg font-semibold text-hero-foreground">{label}</h3>
              <span className="text-xs font-semibold text-hero-muted bg-hero-foreground/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                {(pricingType === "website" ? WEBSITE_SIZE_COST : WEBSHOP_SIZE_COST)[key]}
              </span>
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-hero-foreground flex items-center justify-center">
                  <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepSize;
