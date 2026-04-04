interface Props {
  selected: string | null;
  onSelect: (val: string) => void;
}

const OPTIONS = [
  { id: "active", label: "Ja, aktivt", description: "Vi arbejder aktivt med SEO i dag." },
  { id: "little", label: "Ja, lidt", description: "Vi har gjort lidt, men ikke struktureret." },
  { id: "none", label: "Nej, vi starter fra bunden", description: "Vi har ikke arbejdet med SEO før." },
];

const SEOStep1 = ({ selected, onSelect }: Props) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Har I allerede arbejdet med SEO?</h2>
      <p className="text-hero-muted">Fortæl os om jeres nuværende SEO-erfaring.</p>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)} className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isSelected ? "border-hero-foreground bg-hero-foreground/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"}`}>
            <h3 className="text-base font-semibold text-hero-foreground">{opt.label}</h3>
            <p className="text-sm text-hero-muted">{opt.description}</p>
            {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-hero-foreground flex items-center justify-center"><svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
          </button>
        );
      })}
    </div>
  </div>
);

export default SEOStep1;
