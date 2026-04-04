import { Textarea } from "@/components/ui/textarea";

interface Props {
  hasSpecial: boolean | null;
  description: string;
  onSelect: (val: boolean) => void;
  onDescriptionChange: (val: string) => void;
}

const StepSpecialFeatures = ({ hasSpecial, description, onSelect, onDescriptionChange }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du brug for specialfunktionalitet?
        </h2>
        <p className="text-hero-muted">Udover standardfunktioner — f.eks. tilpassede integrationer, avanceret logik osv.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { value: false, label: "Nej" },
          { value: true, label: "Ja" },
        ].map((opt) => {
          const isSelected = hasSpecial === opt.value;
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

      {hasSpecial === true && (
        <div className="animate-fade-in-up">
          <label className="block text-sm text-hero-muted mb-2">
            Beskriv specialfunktionaliteten (maks. 1.000 tegn)
          </label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, 1000))}
            placeholder="Beskriv dine krav..."
            maxLength={1000}
            rows={4}
            className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
          />
          <p className="text-xs text-hero-muted mt-1 text-right">{description.length}/1.000</p>
        </div>
      )}
    </div>
  );
};

export default StepSpecialFeatures;
