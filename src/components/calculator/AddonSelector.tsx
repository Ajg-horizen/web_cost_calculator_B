import { Plus, Minus, Check } from "lucide-react";
import { formatDKK } from "@/lib/calculator-config";
import type { Addon } from "@/lib/calculator-types";

interface AddonSelectorProps {
  addons: Addon[];
  selectedAddons: string[];
  quantities: Record<string, number>;
  onToggleAddon: (id: string) => void;
  onQuantityChange: (id: string, count: number) => void;
}

const AddonSelector = ({
  addons,
  selectedAddons,
  quantities,
  onToggleAddon,
  onQuantityChange,
}: AddonSelectorProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl sm:text-2xl font-bold text-hero-foreground mb-2">
        Tilpas din løsning
      </h2>
      <p className="text-hero-muted text-sm mb-6">
        Vælg de funktioner du har brug for — prisen opdateres med det samme.
      </p>

      {addons.map((addon) => {
        const isQuantity = addon.type === "quantity";
        const quantity = quantities[addon.id] ?? 0;
        const isActive = isQuantity ? quantity > 0 : selectedAddons.includes(addon.id);

        return (
          <div
            key={addon.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              isActive
                ? "border-step-complete/40 bg-step-complete/5"
                : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-hero-foreground">{addon.label}</span>
                  <span className="text-step-complete text-sm font-medium">
                    +{formatDKK(addon.price)} kr.
                    {isQuantity && "/stk."}
                  </span>
                </div>
                <p className="text-hero-muted text-sm mt-0.5">{addon.description}</p>
              </div>

              {isQuantity ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onQuantityChange(addon.id, Math.max(0, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-hero-foreground/10 text-hero-foreground flex items-center justify-center hover:bg-hero-foreground/20 transition-colors disabled:opacity-30"
                    disabled={quantity === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-hero-foreground tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onQuantityChange(addon.id, Math.min(addon.maxQuantity ?? 10, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-hero-foreground/10 text-hero-foreground flex items-center justify-center hover:bg-hero-foreground/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onToggleAddon(addon.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-step-complete text-white"
                      : "bg-hero-foreground/10 text-hero-muted hover:bg-hero-foreground/20"
                  }`}
                >
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddonSelector;
