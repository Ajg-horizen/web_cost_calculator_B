import { Image, Video, ImageOff } from "lucide-react";

interface Props {
  selected: string | null;
  onSelect: (val: string) => void;
}

const OPTIONS = [
  { id: "all-ready", icon: Image, title: "Billeder og video klar", description: "Vi har alt kreativt materiale klar." },
  { id: "images-only", icon: Image, title: "Kun billeder", description: "Vi har billeder, men mangler video." },
  { id: "video-only", icon: Video, title: "Kun video", description: "Vi har video, men mangler billeder." },
  { id: "nothing", icon: ImageOff, title: "Intet klar", description: "Vi har brug for hjælp til alt kreativt materiale." },
];

const PaidAdsStep5 = ({ selected, onSelect }: Props) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Kreative materialer</h2>
      <p className="text-hero-muted">Har I billeder og video klar til annoncering?</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        const Icon = opt.icon;
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)} className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isSelected ? "border-hero-foreground bg-hero-foreground/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${isSelected ? "bg-hero-foreground text-background" : "bg-hero-foreground/10 text-hero-muted group-hover:text-hero-foreground"}`}><Icon className="w-5 h-5" /></div>
            <h3 className="text-base font-semibold text-hero-foreground mb-1">{opt.title}</h3>
            <p className="text-sm text-hero-muted">{opt.description}</p>
            {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-hero-foreground flex items-center justify-center"><svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
          </button>
        );
      })}
    </div>
  </div>
);

export default PaidAdsStep5;
