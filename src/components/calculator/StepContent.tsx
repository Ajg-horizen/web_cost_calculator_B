import { FileText, PenTool } from "lucide-react";

interface Props {
  selected: "has-content" | "needs-content" | null;
  onSelect: (val: "has-content" | "needs-content") => void;
}

const OPTIONS = [
  {
    id: "has-content" as const,
    icon: FileText,
    title: "Jeg har tekst og billeder",
    description: "Du leverer selv det skrevne indhold og billedmateriale til projektet.",
  },
  {
    id: "needs-content" as const,
    icon: PenTool,
    title: "Jeg har brug for hjælp med indhold",
    cost: "$",
    description: "Vi skriver tekster og finder eller producerer billeder til dig.",
  },
];

const StepContent = ({ selected, onSelect }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Har du tekst og billeder klar?
        </h2>
        <p className="text-hero-muted">Dette afgør om indholdsproduktion er inkluderet.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "border-hero-foreground bg-hero-foreground/5"
                  : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                isSelected ? "bg-hero-foreground text-background" : "bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-hero-foreground">{opt.title}</h3>
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

export default StepContent;
