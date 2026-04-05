import { Clock } from "lucide-react";
import { formatDKK, BASE_DISCOUNT, URGENCY_BONUS, TOTAL_MAX_DISCOUNT } from "@/lib/calculator-config";
import type { Addon } from "@/lib/calculator-types";

interface PriceSummaryProps {
  baseLabel: string;
  basePrice: number;
  addons: Addon[];
  total: number;
  selectedAddons: string[];
  quantities: Record<string, number>;
  onOrderClick: () => void;
  showFreeHosting?: boolean;
  hostingMonthly: number;
  hostingYearly: number;
  rawTotal?: number;
  urgencyTotal?: number;
  hasDiscount?: boolean;
}

const PriceSummary = ({
  baseLabel, basePrice, addons, total, selectedAddons, quantities, onOrderClick,
  showFreeHosting = true, hostingMonthly, hostingYearly, rawTotal, urgencyTotal, hasDiscount = false,
}: PriceSummaryProps) => {
  const activeItems: { label: string; price: number }[] = [];
  for (const addon of addons) {
    const qty = quantities[addon.id] ?? 0;
    if (addon.type === "quantity" && qty > 0) {
      activeItems.push({ label: `${qty}× ${addon.label}`, price: addon.price * qty });
    } else if (addon.type === "checkbox" && selectedAddons.includes(addon.id)) {
      activeItems.push({ label: addon.label, price: addon.price });
    }
  }

  return (
    <div className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
      <h3 className="text-lg font-bold text-hero-foreground mb-4">Din pris</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-hero-foreground">
          <span>{baseLabel}</span>
          <span className="font-medium">{formatDKK(basePrice)} kr.</span>
        </div>

        {activeItems.map((item) => (
          <div key={item.label} className="flex justify-between text-step-complete">
            <span>+ {item.label}</span>
            <span className="font-medium">{formatDKK(item.price)} kr.</span>
          </div>
        ))}

        <div className="border-t border-hero-foreground/10 pt-2 mt-2" />

        {hasDiscount && rawTotal ? (
          <>
            <div className="flex justify-between text-hero-muted">
              <span>Subtotal (udvikling)</span>
              <span className="line-through">{formatDKK(rawTotal)} kr.</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 my-2">
              <p className="text-purple-400 text-sm font-semibold">
                {BASE_DISCOUNT}% rabat på udvikling
              </p>
              <p className="text-hero-muted text-xs mt-1">
                Du sparer {formatDKK(rawTotal - total)} kr. på udviklingen
              </p>
            </div>

            <div className="flex justify-between text-hero-foreground pt-1">
              <span className="text-lg font-bold">Udvikling</span>
              <span className="text-2xl font-bold text-purple-400">{formatDKK(total)} kr.</span>
            </div>
            <p className="text-hero-muted text-xs">Rabatten gælder kun udvikling — ikke hosting</p>

            {urgencyTotal != null && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-3">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  Bestil inden 24 timer — spar ekstra {URGENCY_BONUS}%
                </div>
                <p className="text-hero-muted text-xs mt-1">
                  Udvikling med {TOTAL_MAX_DISCOUNT}% rabat:
                </p>
                <p className="text-amber-400 text-lg font-bold mt-1">
                  {formatDKK(urgencyTotal)} kr.
                  <span className="text-hero-muted text-xs font-normal ml-2">
                    (spar {formatDKK(rawTotal - urgencyTotal)} kr. på udvikling)
                  </span>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between text-hero-foreground pt-1">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold">{formatDKK(total)} kr.</span>
          </div>
        )}

        <p className="text-hero-muted text-xs">Engangspris inkl. opsætning</p>
      </div>

      {showFreeHosting ? (
        <div className="mt-4 p-3 rounded-xl bg-step-complete/10 border border-step-complete/20">
          <p className="text-step-complete text-sm font-medium">
            Gratis hosting det første år
          </p>
          <p className="text-hero-muted text-xs mt-1">
            Derefter {formatDKK(hostingMonthly)} kr./md. · Ingen binding
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-xl bg-hero-foreground/5 border border-hero-foreground/10">
          <p className="text-hero-foreground text-sm font-medium">
            Hosting: {formatDKK(hostingYearly)} kr./år
          </p>
          <p className="text-hero-muted text-xs mt-1">
            ({formatDKK(hostingMonthly)} kr./md.) · 1 års forudbetaling · Ingen binding
          </p>
        </div>
      )}

      <button
        onClick={onOrderClick}
        className="w-full mt-4 gradient-primary text-primary-foreground py-4 text-lg font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Bestil nu →
      </button>
    </div>
  );
};

export default PriceSummary;
