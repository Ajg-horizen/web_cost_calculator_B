import { useState } from "react";
import { Zap, AlertTriangle } from "lucide-react";

interface Props {
  onBudget: () => void;
  onContinue: () => void;
}

const StepBudgetShortcut = ({ onBudget, onContinue }: Props) => {
  const [showWarning, setShowWarning] = useState(false);

  if (showWarning) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-3">Bemærk venligst</h2>
          <p className="text-hero-muted leading-relaxed max-w-lg mx-auto">
            Den billigste løsning er velegnet til nystartede virksomheder med lav aktivitet og begrænset behov for
            fleksibilitet og tilpasning.
          </p>
          <p className="text-hero-foreground font-medium mt-4 leading-relaxed max-w-lg mx-auto">
            Ved omsætning over 1 mio. kr. årligt anbefales denne løsning ikke, da den ikke er dimensioneret til større
            belastning og kan hæmme jeres vækst.
          </p>
        </div>

        <div className="p-5 rounded-xl border-2 border-amber-500/20 bg-amber-500/5 mb-8">
          <p className="text-sm text-hero-muted leading-relaxed text-center">
            Er du sikker på, at du vil fortsætte med den billigste løsning?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onContinue}
            className="group relative p-5 rounded-xl border-2 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
          >
            <h3 className="text-base font-semibold text-hero-foreground">Nej, jeg vil tilpasse</h3>
            <p className="text-sm text-hero-muted mt-1">Gå videre og vælg selv</p>
          </button>

          <button
            onClick={onBudget}
            className="group relative p-5 rounded-xl border-2 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-hero-foreground bg-hero-foreground/5 hover:bg-hero-foreground/10"
          >
            <h3 className="text-base font-semibold text-hero-foreground">Ja, jeg er sikker</h3>
            <p className="text-sm text-hero-muted mt-1">Fortsæt med den billigste løsning</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Vil du have den billigste løsning?</h2>
        <p className="text-hero-muted">
          Vi kan udfylde resten automatisk med de mest prisvenlige valg – eller du kan tilpasse selv.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setShowWarning(true)}
          className="group relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-hero-foreground mb-1">Ja, giv mig den billigste pris</h3>
              <p className="text-sm text-hero-muted leading-relaxed">
                Vi vælger automatisk de mest prisvenlige muligheder for dig. Du springer direkte til kontaktformularen.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onContinue}
          className="group relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-hero-foreground mb-1">Nej, jeg vil tilpasse selv</h3>
              <p className="text-sm text-hero-muted leading-relaxed">
                Gå videre trin for trin og vælg præcis hvad du har brug for.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StepBudgetShortcut;
