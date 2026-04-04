import { getPricingType, type SolutionType } from "@/lib/calculator-types";

interface Props {
  hostingStatus: string | null;
  wantsHostingSetup: boolean | null;
  solutionType: SolutionType | null;
  onHostingStatus: (val: string) => void;
  onWantsHostingSetup: (val: boolean) => void;
}

const HOSTING_OPTIONS = [
  { id: "yes-both", label: "Ja, begge dele", description: "Jeg har hosting og domæne" },
  { id: "domain-only", label: "Kun domæne", description: "Jeg har et domæne men ingen hosting" },
  { id: "no", label: "Nej", description: "Jeg mangler både hosting og domæne" },
  { id: "not-sure", label: "Ikke sikker", description: "Jeg vil gerne have hjælp til at finde ud af det" },
];

const StepHosting = ({ hostingStatus, wantsHostingSetup, solutionType, onHostingStatus, onWantsHostingSetup }: Props) => {
  const showHostingOffer = hostingStatus === "domain-only" || hostingStatus === "no";
  const monthlyPrice = getPricingType(solutionType) === "webshop" ? 599 : 399;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du allerede hosting og domæne?
        </h2>
        <p className="text-hero-muted">Vi kan hjælpe med at sætte det op for dig.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {HOSTING_OPTIONS.map((opt) => {
          const isSelected = hostingStatus === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onHostingStatus(opt.id)}
              className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <h3 className="text-base font-semibold text-hero-foreground mb-1">{opt.label}</h3>
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

      {showHostingOffer && (
        <div className="animate-fade-in-up p-5 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
          <p className="text-hero-foreground font-medium mb-3">
            {hostingStatus === "domain-only"
              ? "Vil du have os til at sætte hosting op for dig?"
              : "Vil du have os til at sætte hosting og domæne op for dig?"}
          </p>
          <p className="text-sm text-hero-muted mb-4">{monthlyPrice} DKK/md. for hosting & drift</p>
          <div className="flex gap-3">
            {[
              { value: true, label: "Ja tak" },
              { value: false, label: "Nej tak" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => onWantsHostingSetup(opt.value)}
                className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  wantsHostingSetup === opt.value
                    ? "border-hero-foreground bg-hero-foreground text-background"
                    : "border-hero-foreground/20 text-hero-foreground hover:border-hero-foreground/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepHosting;
