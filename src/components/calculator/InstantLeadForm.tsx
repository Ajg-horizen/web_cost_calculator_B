import { Phone, Mail, User, Building2 } from "lucide-react";
import type { InstantState } from "@/lib/calculator-types";

interface InstantLeadFormProps {
  state: InstantState;
  onChange: (field: keyof InstantState, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const InstantLeadForm = ({ state, onChange, onSubmit, isSubmitting }: InstantLeadFormProps) => {
  const canSubmit =
    state.leadName.trim() !== "" &&
    state.leadEmail.trim() !== "" &&
    state.leadPhone.trim() !== "";

  return (
    <div id="order-form" className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
      <h3 className="text-xl font-bold text-hero-foreground mb-2">
        Bestil din landing page
      </h3>
      <p className="text-hero-muted text-sm mb-6">
        Udfyld dine oplysninger, så kontakter vi dig inden for 24 timer.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-muted" />
          <input
            type="text"
            placeholder="Dit navn *"
            value={state.leadName}
            onChange={(e) => onChange("leadName", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-muted" />
          <input
            type="email"
            placeholder="Din email *"
            value={state.leadEmail}
            onChange={(e) => onChange("leadEmail", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-muted" />
          <input
            type="tel"
            placeholder="Dit telefonnummer *"
            value={state.leadPhone}
            onChange={(e) => onChange("leadPhone", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-muted" />
          <input
            type="text"
            placeholder="Virksomhed (valgfrit)"
            value={state.leadCompany}
            onChange={(e) => onChange("leadCompany", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full gradient-primary text-primary-foreground py-4 text-lg font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Sender..." : "Bestil nu →"}
        </button>

        <p className="text-hero-muted text-xs text-center">
          Vi kontakter dig inden for 24 timer. Ingen binding.
        </p>
      </div>
    </div>
  );
};

export default InstantLeadForm;
