interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

const OPTIONS = [
  { id: "seo-analysis", label: "SEO-analyse (engangs)", description: "En komplet gennemgang af jeres nuværende SEO-status." },
  { id: "on-page", label: "On-page optimering", description: "Optimering af indhold, titler, meta-tags m.m." },
  { id: "technical-seo", label: "Teknisk SEO", description: "Hastighed, crawlability, schema markup m.m." },
  { id: "linkbuilding", label: "Linkbuilding", description: "Opbygning af eksterne links til jeres site." },
  { id: "ongoing", label: "Løbende SEO-samarbejde", description: "Fast månedligt samarbejde med løbende optimering." },
];

const SEOStep7 = ({ selected, onToggle }: Props) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Hvad har I brug for?</h2>
      <p className="text-hero-muted">Vælg de ydelser I er interesserede i (du kan vælge flere).</p>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {OPTIONS.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button key={opt.id} onClick={() => onToggle(opt.id)} className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isSelected ? "border-hero-foreground bg-hero-foreground/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"}`}>
            <h3 className="text-base font-semibold text-hero-foreground">{opt.label}</h3>
            <p className="text-sm text-hero-muted">{opt.description}</p>
            {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-hero-foreground flex items-center justify-center"><svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
          </button>
        );
      })}
    </div>
  </div>
);

export default SEOStep7;
