import { useState, useEffect, useMemo } from "react";
import { Clock, Sparkles } from "lucide-react";

export function generateDiscountCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HZ-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getOfferDurationSeconds(): number {
  const day = new Date().getDay();
  if (day === 5) return 3 * 24 * 60 * 60;
  if (day === 6) return 2 * 24 * 60 * 60;
  return 24 * 60 * 60;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => getOfferDurationSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds, expired: timeLeft <= 0 };
}

interface UrgencyOfferProps {
  discountCode?: string;
}

const UrgencyOffer = ({ discountCode: externalCode }: UrgencyOfferProps = {}) => {
  const { hours, minutes, seconds, expired } = useCountdown();
  const discountCode = useMemo(() => externalCode || generateDiscountCode(), [externalCode]);

  if (expired) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="mb-6 p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-600/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        FØRSTEGANGSTILBUD
      </div>
      <div className="flex items-center justify-center gap-2 mb-3 mt-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-hero-foreground">Spar 50% som ny kunde</h3>
        <Sparkles className="w-5 h-5 text-amber-500" />
      </div>
      <p className="text-sm text-hero-muted leading-relaxed mb-4">
        Er det første gang du er kunde hos os? Kontakt os med din rabatkode og få <strong className="text-amber-600">50% rabat</strong> på dit projekt.
      </p>

      <div className="flex items-center justify-center gap-1 mb-4">
        <Clock className="w-4 h-4 text-amber-600 mr-1" />
        <div className="flex items-center gap-1 font-mono text-lg font-bold text-hero-foreground">
          <span className="bg-hero-foreground/10 px-2 py-1 rounded">{pad(hours)}</span>
          <span className="text-hero-muted">:</span>
          <span className="bg-hero-foreground/10 px-2 py-1 rounded">{pad(minutes)}</span>
          <span className="text-hero-muted">:</span>
          <span className="bg-hero-foreground/10 px-2 py-1 rounded">{pad(seconds)}</span>
        </div>
      </div>

      <div className="bg-hero-foreground/[0.06] border border-dashed border-hero-foreground/20 rounded-xl px-4 py-3 inline-block">
        <p className="text-xs text-hero-muted mb-1">Din rabatkode</p>
        <p className="text-xl font-bold tracking-widest text-hero-foreground">{discountCode}</p>
      </div>
    </div>
  );
};

export default UrgencyOffer;
