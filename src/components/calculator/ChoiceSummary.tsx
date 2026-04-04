import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface SummaryItem {
  label: string;
  value: string;
}

interface Props {
  items: SummaryItem[];
  title?: string;
  note?: string;
}

const ChoiceSummary = ({ items, title = "Se dine valg", note }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03] overflow-hidden text-left">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <span className="text-sm font-semibold text-hero-foreground">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-hero-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 space-y-2 border-t border-hero-foreground/10 pt-4">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-hero-muted">{item.label}</span>
              <span className="text-hero-foreground font-medium">{item.value}</span>
            </div>
          ))}
          {note && (
            <p className="text-xs text-hero-muted mt-3 pt-3 border-t border-hero-foreground/10 leading-relaxed">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChoiceSummary;
