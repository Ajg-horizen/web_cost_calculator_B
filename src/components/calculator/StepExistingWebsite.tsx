import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  hasExisting: boolean | null;
  url: string;
  onSelect: (val: boolean) => void;
  onUrlChange: (val: string) => void;
}

const StepExistingWebsite = ({ hasExisting, url, onSelect, onUrlChange }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du allerede en hjemmeside?
        </h2>
        <p className="text-hero-muted">Det hjælper os med at forstå omfanget af dit projekt.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { value: true, label: "Ja" },
          { value: false, label: "Nej" },
        ].map((opt) => {
          const isSelected = hasExisting === opt.value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onSelect(opt.value)}
              className={`group relative p-6 rounded-xl border-2 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <h3 className="text-lg font-semibold text-hero-foreground">{opt.label}</h3>
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

      {hasExisting === true && (
        <div className="animate-fade-in-up">
          <label className="block text-sm text-hero-muted mb-2">
            Hjemmesidens URL (valgfrit)
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-muted" />
            <Input
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://eksempel.dk"
              className="pl-10 bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepExistingWebsite;
