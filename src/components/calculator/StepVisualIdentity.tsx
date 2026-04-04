interface Props {
  processType: "efficient" | "balanced" | "collaborative";
  hasLogoAndColors: boolean | null;
  onHasLogoAndColors: (val: boolean) => void;
  visualIdentityLevel: string | null;
  onVisualIdentityLevel: (val: string) => void;
}

const COLLABORATIVE_OPTIONS = [
  { id: "logo-guidelines", label: "Logo + brandguide", description: "Fuld visuel identitet klar", cost: "" },
  { id: "logo-only", label: "Kun logo", description: "Vi hjælper med at definere brandfarver og typografi", cost: "$" },
  { id: "no-identity", label: "Ingen eksisterende identitet", description: "Vi skaber en komplet visuel identitet", cost: "$$" },
];

const StepVisualIdentity = ({
  processType,
  hasLogoAndColors,
  onHasLogoAndColors,
  visualIdentityLevel,
  onVisualIdentityLevel,
}: Props) => {
  if (processType === "efficient") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
            Har du et eksisterende logo og brandfarver?
          </h2>
          <p className="text-hero-muted">
            Vi bruger vores faste designramme. Yderligere visuelle tilpasninger udover standard faktureres separat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { value: true, label: "Ja" },
            { value: false, label: "Nej" },
          ].map((opt) => {
            const isSelected = hasLogoAndColors === opt.value;
            return (
              <button
                key={String(opt.value)}
                onClick={() => onHasLogoAndColors(opt.value)}
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du en eksisterende visuel identitet?
        </h2>
        <p className="text-hero-muted">Dette afgør omfanget af designarbejdet.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {COLLABORATIVE_OPTIONS.map((opt) => {
          const isSelected = visualIdentityLevel === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onVisualIdentityLevel(opt.id)}
              className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-hero-foreground">{opt.label}</h3>
                {opt.cost && (
                  <span className="text-xs font-semibold text-hero-muted bg-hero-foreground/10 px-2 py-0.5 rounded-full">{opt.cost}</span>
                )}
              </div>
              <p className="text-sm text-hero-muted">{opt.description}</p>
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

export default StepVisualIdentity;
