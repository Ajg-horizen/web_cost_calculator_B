import { Zap, Users, Handshake } from "lucide-react";

interface Props {
  selected: "efficient" | "balanced" | "collaborative" | null;
  onSelect: (val: "efficient" | "balanced" | "collaborative") => void;
}

const OPTIONS = [
  {
    id: "efficient" as const,
    icon: Zap,
    title: "Effektiv løsning",
    cost: "$",
    description:
      "Jeg har ikke de store holdninger til designet — I får frit spil. Vi bruger vores gennemprøvede struktur til hurtig levering.",
  },
  {
    id: "balanced" as const,
    icon: Handshake,
    title: "Mellemløsning",
    cost: "$$",
    description:
      "Jeg har lidt holdninger til projektet og ønsker at give input undervejs, men stoler på jeres ekspertise.",
  },
  {
    id: "collaborative" as const,
    icon: Users,
    title: "Samarbejdsløsning",
    cost: "$$$",
    description:
      "Vi er en større virksomhed med behov for tæt involvering, projektstyring på højt niveau og løbende kontrol over processen.",
  },
];

const StepProcessType = ({ selected, onSelect }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Hvordan vil du gerne have processen skal forløbe?
        </h2>
        <p className="text-hero-muted">Dette bestemmer graden af samarbejde og fleksibilitet.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? "bg-hero-foreground text-background" : "bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-hero-foreground">{opt.title}</h3>
                    <span className="text-xs font-semibold text-hero-muted bg-hero-foreground/10 px-2 py-0.5 rounded-full">{opt.cost}</span>
                  </div>
                  <p className="text-sm text-hero-muted leading-relaxed">{opt.description}</p>
                </div>
              </div>
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

export default StepProcessType;
