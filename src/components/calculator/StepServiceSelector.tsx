import { Globe, Megaphone, Search } from "lucide-react";

export type ServiceType = "web" | "paid-ads" | "seo";

interface Props {
  selected: ServiceType | null;
  onSelect: (val: ServiceType) => void;
}

const OPTIONS = [
  {
    id: "web" as const,
    icon: Globe,
    title: "Hjemmesideudvikling",
    description: "Hjemmeside, webshop eller landingsside skræddersyet til din virksomhed.",
  },
  {
    id: "paid-ads" as const,
    icon: Megaphone,
    title: "Paid Ads",
    description: "Annoncering på Meta, Google, LinkedIn, TikTok og andre platforme.",
  },
  {
    id: "seo" as const,
    icon: Search,
    title: "SEO",
    description: "Søgemaskineoptimering der øger jeres synlighed og organiske trafik.",
  },
];

const StepServiceSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Hvad har du brug for?
        </h2>
        <p className="text-hero-muted">Vælg den service du er interesseret i.</p>
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
                <div
                  className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-hero-foreground text-background"
                      : "bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-hero-foreground mb-1">{opt.title}</h3>
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

export default StepServiceSelector;
