import { useEffect, useState, useCallback } from "react";
import { PrismFluxLoader } from "@/components/ui/prism-flux-loader";

interface Props {
  onComplete: () => void;
}

const StepLoadingPrice = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / 50;
      });
    }, 100);

    const timer = setTimeout(stableOnComplete, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [stableOnComplete]);

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex flex-col items-center gap-8">
        <PrismFluxLoader size={40} speed={4} />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-hero-foreground mb-2">
            Udregner din pris...
          </h2>
          <p className="text-hero-muted text-sm">
            Vi sammensætter det bedste tilbud til dig
          </p>
        </div>
        <div className="w-full bg-hero-foreground/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-hero-foreground rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepLoadingPrice;
