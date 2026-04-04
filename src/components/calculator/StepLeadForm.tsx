import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  email: string;
  company: string;
  phone: string;
  existingUrl: string;
  onChange: (field: string, value: string) => void;
}

const StepLeadForm = ({ name, email, company, phone, existingUrl, onChange }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-2">
          Din pris er nu færdigregnet 🎉
        </h2>
        <p className="text-hero-muted text-sm mt-4">
          Indtast dine oplysninger for at se din pris.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-hero-foreground mb-1.5">Navn *</label>
          <Input
            value={name}
            onChange={(e) => onChange("leadName", e.target.value)}
            placeholder="Navn"
            className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hero-foreground mb-1.5">E-mail *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onChange("leadEmail", e.target.value)}
            placeholder="dig@firma.dk"
            className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hero-foreground mb-1.5">Virksomhed</label>
          <Input
            value={company}
            onChange={(e) => onChange("leadCompany", e.target.value)}
            placeholder="Virksomhedsnavn (valgfrit)"
            className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hero-foreground mb-1.5">Telefon *</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onChange("leadPhone", e.target.value)}
            placeholder="+45 ..."
            className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50"
          />
        </div>
        {existingUrl && (
          <div>
            <label className="block text-sm font-medium text-hero-foreground mb-1.5">Eksisterende URL</label>
            <Input
              value={existingUrl}
              readOnly
              className="bg-hero-foreground/[0.03] border-hero-foreground/10 text-hero-muted"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepLeadForm;
