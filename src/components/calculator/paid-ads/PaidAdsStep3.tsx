interface Props {
  selected: string | null;
  onSelect: (val: string) => void;
}

const OPTIONS = [
  { id: "under-7500", label: "Under 7.500 kr.", description: "Lille startbudget for testning." },
  { id: "7500-20000", label: "7.500 – 20.000 kr.", description: "Godt budget til en solid indsats." },
  { id: "20000-75000", label: "20.000 – 75.000 kr.", description: "Større budget med plads til skalering." },
  { id: "75000+", label: "75.000 kr.+", description: "Omfattende annoncering med avanceret setup." },
  { id: "undecided", label: "Ikke fastlagt", description: "Vi hjælper jer med at finde det rette niveau." },
];

const PaidAdsStep3 = ({ selected, onSelect }: Props) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">Månedligt annoncebudget</h2>
      <p className="text-hero-muted">Hvad er jeres forventede budget til annoncering?</p>
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

export default PaidAdsStep3;
