import { Check } from "lucide-react";

interface IncludedFeaturesProps {
  features: string[];
}

const IncludedFeatures = ({ features }: IncludedFeaturesProps) => {
  return (
    <div className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
      <h3 className="text-lg font-bold text-hero-foreground mb-4">
        Inkluderet i basispakken
      </h3>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-hero-foreground">
            <span className="w-5 h-5 rounded-full bg-step-complete/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-step-complete" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncludedFeatures;
