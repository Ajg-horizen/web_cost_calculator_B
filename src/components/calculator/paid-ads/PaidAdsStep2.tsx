import { Target, ShoppingBag, Eye, RefreshCw, HelpCircle } from "lucide-react";

interface Props {
  selected: string | null;
  onSelect: (val: string) => void;
}

const OPTIONS = [
  { id: "leads", icon: Target, title: "Leads", description: "Generer henvendelser, tilmeldinger eller forespørgsler." },
  { id: "ecommerce", icon: ShoppingBag, title: "Webshop-salg", description: "Driv salg direkte i jeres webshop." },
  { id: "brand", icon: Eye, title: "Brand awareness", description: "Øg kendskabet til jeres brand." },
  { id: "retargeting", icon: RefreshCw, title: "Retargeting", description: "Genfang besøgende der allerede kender jer." },
  { id: "unsure", icon: HelpCircle, title: "Ikke sikker", description: "Vi hjælper jer med at finde den rette strategi." },
];

const PaidAdsStep2 = ({ selected, onSelect }: Props) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Hvad er jeres primære mål?</h2>
      <p className="text-hero-muted">Vælg det mål der er vigtigst for jer.</p>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        const Icon = opt.icon;
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)} className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isSelected ? "border-hero-foreground bg-hero-foreground/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? "bg-hero-foreground text-background" : "bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground"}`}><Icon className="w-5 h-5" /></div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-hero-foreground">{opt.title}</h3>
                <p className="text-sm text-hero-muted">{opt.description}</p>
              </div>
            </div>
            {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-hero-foreground flex items-center justify-center"><svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
          </button>
        );
      })}
    </div>
  </div>
);

export default PaidAdsStep2;
