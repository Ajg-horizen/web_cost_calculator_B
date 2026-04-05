import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Layout, Paintbrush, ShoppingCart, Check, Gift, Palette, MessageSquare, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  calculateTotal, calculateWebshopTotal, formatDKK,
  BASE_PRICE, TEMPLATE_PRICE, MONTHLY_HOSTING_FEE, HOSTING_YEARLY,
  WEBSHOP_BASE_PRICE, WEBSHOP_HOSTING_MONTHLY, WEBSHOP_HOSTING_YEARLY,
  DISCOUNT_THRESHOLD, WEBSHOP_DISCOUNT_THRESHOLD, BASE_DISCOUNT, TOTAL_MAX_DISCOUNT,
  ADDONS, WEBSHOP_ADDONS, INCLUDED_FEATURES, WEBSHOP_INCLUDED_FEATURES,
} from "@/lib/calculator-config";
import { type InstantState, initialInstantState } from "@/lib/calculator-types";
import horizenLogo from "@/assets/horizen-logo.png";
// Preview images — erstat med rigtige billeder når de er klar
import previewTemplate1 from "@/assets/preview-template-01.avif";
import previewTemplate2 from "@/assets/preview-template-02.avif";
import previewTemplate3 from "@/assets/preview-template-03.avif";
import previewCustom1 from "@/assets/preview-custom-01.webp";
import previewCustom2 from "@/assets/preview-custom-02.webp";
import previewCustom3 from "@/assets/preview-custom-03.webp";
import previewWebshop1 from "@/assets/preview-webshop-01.webp";
import previewWebshop2 from "@/assets/preview-webshop-02.webp";
import previewWebshop3 from "@/assets/preview-webshop-03.webp";
import AddonSelector from "@/components/calculator/AddonSelector";
import PriceSummary from "@/components/calculator/PriceSummary";
import IncludedFeatures from "@/components/calculator/IncludedFeatures";
import InstantLeadForm from "@/components/calculator/InstantLeadForm";

type Track = "template" | "custom" | "webshop" | null;

const Priser = () => {
  const [track, setTrack] = useState<Track>("custom");
  const [state, setState] = useState<InstantState>(initialInstantState);
  const [templateColor, setTemplateColor] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ slides: string[]; label: string; badgeColor: string } | null>(null);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);

  // Reset addons when switching tracks
  const switchTrack = (t: Track) => {
    setTrack(t);
    setState((prev) => ({ ...prev, selectedAddons: [], extraPages: 0, extraRevisions: 0, extraProducts: 0 }));
  };

  // Price calculations
  const rawCustomTotal = calculateTotal(state.selectedAddons, state.extraPages, state.extraRevisions);
  const rawWebshopTotal = calculateWebshopTotal(state.selectedAddons, state.extraRevisions);
  const rawTotal = track === "webshop" ? rawWebshopTotal : rawCustomTotal;
  const activeThreshold = track === "webshop" ? WEBSHOP_DISCOUNT_THRESHOLD : DISCOUNT_THRESHOLD;
  const hasDiscount = (track === "custom" || track === "webshop") && rawTotal >= activeThreshold;
  const discountedTotal = hasDiscount ? Math.round(rawTotal * (1 - BASE_DISCOUNT / 100)) : rawTotal;
  const urgencyTotal = hasDiscount ? Math.round(rawTotal * (1 - TOTAL_MAX_DISCOUNT / 100)) : rawTotal;
  const total = track === "template" ? TEMPLATE_PRICE : discountedTotal;

  const hostingMonthly = track === "webshop" ? WEBSHOP_HOSTING_MONTHLY : MONTHLY_HOSTING_FEE;
  const hostingYearly = track === "webshop" ? WEBSHOP_HOSTING_YEARLY : HOSTING_YEARLY;
  const currentAddons = track === "webshop" ? WEBSHOP_ADDONS : ADDONS;
  const currentFeatures = track === "webshop" ? WEBSHOP_INCLUDED_FEATURES : INCLUDED_FEATURES;
  const basePrice = track === "webshop" ? WEBSHOP_BASE_PRICE : BASE_PRICE;
  const baseLabel = track === "webshop" ? "Webshop" : "Landing page";

  // Quantities map for generic AddonSelector
  const quantities = useMemo(() => ({
    "extra-page": state.extraPages,
    "extra-revision": state.extraRevisions,
    "extra-products": state.extraProducts,
  }), [state.extraPages, state.extraRevisions, state.extraProducts]);

  const handleQuantityChange = (id: string, count: number) => {
    if (id === "extra-page") setState((p) => ({ ...p, extraPages: count }));
    else if (id === "extra-revision") setState((p) => ({ ...p, extraRevisions: count }));
    else if (id === "extra-products") setState((p) => ({ ...p, extraProducts: count }));
  };

  const update = (field: keyof InstantState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAddon = (id: string) => {
    setState((prev) => {
      const isSelected = prev.selectedAddons.includes(id);
      let newAddons = isSelected
        ? prev.selectedAddons.filter((a) => a !== id)
        : [...prev.selectedAddons, id];

      // Product tiers are mutually exclusive
      if (!isSelected && (id === "products-100" || id === "products-200")) {
        const other = id === "products-100" ? "products-200" : "products-100";
        newAddons = newAddons.filter((a) => a !== other);
      }

      return { ...prev, selectedAddons: newAddons };
    });
  };

  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const addonSource = currentAddons;
      const selectedAddonDetails = addonSource.filter((a) => {
        if (a.type === "quantity") return (quantities[a.id as keyof typeof quantities] ?? 0) > 0;
        return state.selectedAddons.includes(a.id);
      }).map((a) => {
        const qty = quantities[a.id as keyof typeof quantities] ?? 0;
        if (a.type === "quantity") return { name: a.label, quantity: qty, price: a.price * qty };
        return { name: a.label, quantity: 1, price: a.price };
      });

      const solutionType = track === "template" ? "template-landing-page"
        : track === "webshop" ? "custom-webshop"
        : "custom-landing-page";

      const { error } = await supabase.functions.invoke("send-lead", {
        body: {
          state: {
            ...state,
            solutionType,
            track,
            totalPrice: total,
            rawPrice: rawTotal,
            discountApplied: hasDiscount ? `${BASE_DISCOUNT}%` : "none",
            urgencyPrice: hasDiscount ? urgencyTotal : undefined,
            selectedAddons: selectedAddonDetails,
            templateColor: track === "template" ? templateColor : undefined,
            templateMessage: track === "template" ? templateMessage : undefined,
            hostingYearly: track === "template" ? 0 : hostingYearly,
            hostingMonthly,
            freeHostingFirstYear: track === "template",
          },
          priceRange: { low: total, high: total },
          isManualReview: false,
          service: "web",
        },
      });
      if (error) throw error;

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "instant_order_submitted",
        service: track === "template" ? "web-template" : track === "webshop" ? "web-webshop" : "web-custom",
        price: total,
      });

      setIsSubmitted(true);
      toast({ title: "Tak for din bestilling!", description: "Vi kontakter dig inden for 24 timer." });
    } catch (err) {
      console.error("Failed to send lead:", err);
      toast({ title: "Kunne ikke sende bestillingen", description: "Prøv igen senere.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <nav className="w-full px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
          <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
            <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
          </a>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-lg animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-step-complete/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-step-complete" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-hero-foreground mb-3">Tak for din bestilling!</h1>
            <p className="text-hero-muted text-lg mb-6">
              Vi har modtaget din bestilling og kontakter dig inden for 24 timer.
            </p>
            <p className="text-hero-foreground text-2xl font-bold mb-2">{formatDKK(total)} kr.</p>
            <p className="text-hero-muted text-sm">
              {track === "template"
                ? "Inkl. gratis hosting det første år"
                : `+ Hosting: ${formatDKK(hostingYearly)} kr./år (${formatDKK(hostingMonthly)} kr./md.) · Ingen binding`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="w-full px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
            <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
          </a>
          <Link to="/" className="text-hero-muted hover:text-hero-foreground text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Tilbage
          </Link>
        </div>
      </nav>

      <div className="px-4 sm:px-8 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Track selector */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-hero-foreground mb-3">Vælg din løsning</h1>
            <p className="text-hero-muted text-lg mb-6">Template, virksomhedsside eller webshop — du bestemmer.</p>
            <a href="https://dk.trustpilot.com/review/horizen.dk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-hero-foreground hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <svg key={i} className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <svg className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 24 24" style={{ clipPath: "inset(0 40% 0 0)" }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">4.2</span>
              <span className="text-sm text-hero-muted">på</span>
              <span className="text-sm font-semibold text-hero-foreground">Trustpilot</span>
            </a>
          </div>

          {/* Desktop: 3-column grid / Mobile: accordion cards */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-12">
            {[
              { id: "template" as Track, icon: <Layout className="w-5 h-5" />, label: "Template", price: `${formatDKK(TEMPLATE_PRICE)} kr.`, desc: "Vælg en skabelon, send os dit indhold — vi klarer resten.", badge: <><Gift className="w-4 h-4 text-step-complete" /><span className="text-step-complete text-sm font-bold">1 år gratis hosting</span></>, badgeBg: "bg-step-complete/20", borderActive: "border-step-complete/50 bg-step-complete/5", iconActive: "bg-step-complete/20 text-step-complete", priceColor: "text-step-complete", checkBg: "bg-step-complete", previewColor: "text-step-complete", extra: null, slides: [previewTemplate1, previewTemplate2, previewTemplate3], previewLabel: "Template", previewBadge: "bg-step-complete" },
              { id: "custom" as Track, icon: <Paintbrush className="w-5 h-5" />, label: "Virksomhedsside", price: `Fra ${formatDKK(BASE_PRICE)} kr.`, desc: "Professionel virksomhedsside med tilvalg efter behov.", badge: <span className="text-purple-400 text-sm font-bold">{BASE_DISCOUNT}% rabat over {formatDKK(DISCOUNT_THRESHOLD)} kr.</span>, badgeBg: "bg-purple-500/20", borderActive: "border-purple-500/50 bg-purple-500/5", iconActive: "bg-purple-500/20 text-purple-400", priceColor: "text-purple-400", checkBg: "bg-purple-500", previewColor: "text-purple-400", extra: <p className="text-hero-muted text-xs mt-2">Hosting: {formatDKK(MONTHLY_HOSTING_FEE)} kr./md.</p>, slides: [previewCustom1, previewCustom2, previewCustom3], previewLabel: "Virksomhedsside", previewBadge: "bg-purple-500" },
              { id: "webshop" as Track, icon: <ShoppingCart className="w-5 h-5" />, label: "Webshop", price: `Fra ${formatDKK(WEBSHOP_BASE_PRICE)} kr.`, desc: "Komplet webshop med produkter, betaling og fragt.", badge: <span className="text-indigo-400 text-sm font-bold">{BASE_DISCOUNT}% rabat over {formatDKK(WEBSHOP_DISCOUNT_THRESHOLD)} kr.</span>, badgeBg: "bg-indigo-500/20", borderActive: "border-indigo-500/50 bg-indigo-500/5", iconActive: "bg-indigo-500/20 text-indigo-400", priceColor: "text-indigo-400", checkBg: "bg-indigo-500", previewColor: "text-indigo-400", extra: <p className="text-hero-muted text-xs mt-2">Hosting: {formatDKK(WEBSHOP_HOSTING_MONTHLY)} kr./md.</p>, slides: [previewWebshop1, previewWebshop2, previewWebshop3], previewLabel: "Webshop", previewBadge: "bg-indigo-500" },
            ].map((t) => (
              <button key={t.id} onClick={() => switchTrack(t.id)} className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden ${track === t.id ? t.borderActive : "border-hero-foreground/10 bg-hero-foreground/[0.03] hover:border-hero-foreground/20"}`}>
                <div className={`absolute top-0 left-0 right-0 ${t.badgeBg} px-4 py-2 flex items-center justify-center gap-2`}>{t.badge}</div>
                <div className="mt-8 flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${track === t.id ? t.iconActive : "bg-hero-foreground/10 text-hero-muted"}`}>{t.icon}</div>
                  <div><h3 className="font-bold text-hero-foreground text-lg">{t.label}</h3><p className={`${t.priceColor} text-xl font-bold`}>{t.price}</p></div>
                  {track === t.id && <div className={`ml-auto w-6 h-6 rounded-full ${t.checkBg} flex items-center justify-center`}><Check className="w-4 h-4 text-white" /></div>}
                </div>
                <p className="text-hero-muted text-sm">{t.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  {t.extra}
                  <span onClick={(e) => { e.stopPropagation(); setPreviewSlideIndex(0); setPreviewImage({ slides: t.slides, label: t.previewLabel, badgeColor: t.previewBadge }); }} className={`inline-flex items-center gap-1.5 ${t.previewColor} text-xs font-medium hover:underline cursor-pointer`}><Eye className="w-3.5 h-3.5" />Se eksempel</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile: accordion-style cards */}
          <div className="lg:hidden space-y-3 mb-8">
            {/* Template accordion */}
            <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${track === "template" ? "border-step-complete/50 bg-step-complete/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03]"}`}>
              <button onClick={() => switchTrack(track === "template" ? null : "template")} className="w-full p-4 text-left flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${track === "template" ? "bg-step-complete/20 text-step-complete" : "bg-hero-foreground/10 text-hero-muted"}`}><Layout className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-hero-foreground">Template</h3>
                  <p className="text-step-complete font-bold">{formatDKK(TEMPLATE_PRICE)} kr.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-step-complete text-xs font-medium">1 år gratis hosting</span>
                  <ChevronRight className={`w-5 h-5 text-hero-muted transition-transform duration-200 ${track === "template" ? "rotate-90" : ""}`} />
                </div>
              </button>
              {track === "template" && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                  <p className="text-hero-muted text-sm">Vælg en skabelon, send os dit indhold — vi klarer resten.</p>
                  <span onClick={() => { setPreviewSlideIndex(0); setPreviewImage({ slides: [previewTemplate1, previewTemplate2, previewTemplate3], label: "Template", badgeColor: "bg-step-complete" }); }} className="inline-flex items-center gap-1.5 text-step-complete text-xs font-medium cursor-pointer"><Eye className="w-3.5 h-3.5" />Se eksempel</span>
                  <div className="p-4 rounded-xl border border-step-complete/20 bg-step-complete/5">
                    <div className="flex justify-between mb-1"><span className="text-hero-foreground text-sm">Template landing page</span><span className="text-step-complete font-bold">{formatDKK(TEMPLATE_PRICE)} kr.</span></div>
                    <div className="flex items-center gap-2 text-step-complete text-xs mt-2"><Gift className="w-3.5 h-3.5" />Gratis hosting det første år</div>
                  </div>
                  <button onClick={scrollToForm} className="w-full gradient-primary text-primary-foreground py-3 font-semibold rounded-xl">Bestil nu →</button>
                </div>
              )}
            </div>

            {/* Virksomhedsside accordion */}
            <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${track === "custom" ? "border-purple-500/50 bg-purple-500/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03]"}`}>
              <button onClick={() => switchTrack(track === "custom" ? null : "custom")} className="w-full p-4 text-left flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${track === "custom" ? "bg-purple-500/20 text-purple-400" : "bg-hero-foreground/10 text-hero-muted"}`}><Paintbrush className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-hero-foreground">Virksomhedsside</h3>
                  <p className="text-purple-400 font-bold">Fra {formatDKK(BASE_PRICE)} kr.</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-hero-muted transition-transform duration-200 shrink-0 ${track === "custom" ? "rotate-90" : ""}`} />
              </button>
              {track === "custom" && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                  <p className="text-hero-muted text-sm">{BASE_DISCOUNT}% rabat på udvikling over {formatDKK(DISCOUNT_THRESHOLD)} kr.</p>
                  <span onClick={() => { setPreviewSlideIndex(0); setPreviewImage({ slides: [previewCustom1, previewCustom2, previewCustom3], label: "Virksomhedsside", badgeColor: "bg-purple-500" }); }} className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-medium cursor-pointer"><Eye className="w-3.5 h-3.5" />Se eksempel</span>
                  <AddonSelector addons={currentAddons} selectedAddons={state.selectedAddons} quantities={quantities} onToggleAddon={toggleAddon} onQuantityChange={handleQuantityChange} />
                  <IncludedFeatures features={currentFeatures} />
                  <PriceSummary baseLabel={baseLabel} basePrice={basePrice} addons={currentAddons} total={total} rawTotal={rawTotal} urgencyTotal={urgencyTotal} hasDiscount={hasDiscount} selectedAddons={state.selectedAddons} quantities={quantities} onOrderClick={scrollToForm} showFreeHosting={false} hostingMonthly={hostingMonthly} hostingYearly={hostingYearly} />
                  <InstantLeadForm state={state} onChange={update} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
              )}
            </div>

            {/* Webshop accordion */}
            <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${track === "webshop" ? "border-indigo-500/50 bg-indigo-500/5" : "border-hero-foreground/10 bg-hero-foreground/[0.03]"}`}>
              <button onClick={() => switchTrack(track === "webshop" ? null : "webshop")} className="w-full p-4 text-left flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${track === "webshop" ? "bg-indigo-500/20 text-indigo-400" : "bg-hero-foreground/10 text-hero-muted"}`}><ShoppingCart className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-hero-foreground">Webshop</h3>
                  <p className="text-indigo-400 font-bold">Fra {formatDKK(WEBSHOP_BASE_PRICE)} kr.</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-hero-muted transition-transform duration-200 shrink-0 ${track === "webshop" ? "rotate-90" : ""}`} />
              </button>
              {track === "webshop" && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                  <p className="text-hero-muted text-sm">{BASE_DISCOUNT}% rabat på udvikling over {formatDKK(WEBSHOP_DISCOUNT_THRESHOLD)} kr.</p>
                  <span onClick={() => { setPreviewSlideIndex(0); setPreviewImage({ slides: [previewWebshop1, previewWebshop2, previewWebshop3], label: "Webshop", badgeColor: "bg-indigo-500" }); }} className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-medium cursor-pointer"><Eye className="w-3.5 h-3.5" />Se eksempel</span>
                  <AddonSelector addons={currentAddons} selectedAddons={state.selectedAddons} quantities={quantities} onToggleAddon={toggleAddon} onQuantityChange={handleQuantityChange} />
                  <IncludedFeatures features={currentFeatures} />
                  <PriceSummary baseLabel={baseLabel} basePrice={basePrice} addons={currentAddons} total={total} rawTotal={rawTotal} urgencyTotal={urgencyTotal} hasDiscount={hasDiscount} selectedAddons={state.selectedAddons} quantities={quantities} onOrderClick={scrollToForm} showFreeHosting={false} hostingMonthly={hostingMonthly} hostingYearly={hostingYearly} />
                  <InstantLeadForm state={state} onChange={update} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
              )}
            </div>
          </div>

          {/* Preview popup */}
          {previewImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              onClick={() => setPreviewImage(null)}
            >
              {/* Previous arrow (only if multiple slides) */}
              {previewImage.slides.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewSlideIndex((i) => (i - 1 + previewImage.slides.length) % previewImage.slides.length); }}
                  className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              <div
                className="relative max-w-3xl w-full mx-16 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`${previewImage.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {previewImage.label}
                  </span>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Image */}
                <div className="p-6 pt-14">
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={previewImage.slides[previewSlideIndex]}
                      alt={`${previewImage.label} ${previewSlideIndex + 1}`}
                      className="w-full object-cover object-top max-h-[75vh]"
                    />
                  </div>
                </div>

                {/* Dots (only if multiple slides) */}
                {previewImage.slides.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pb-5">
                    {previewImage.slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewSlideIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === previewSlideIndex ? "bg-white w-4" : "bg-white/30"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Next arrow (only if multiple slides) */}
              {previewImage.slides.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewSlideIndex((i) => (i + 1) % previewImage.slides.length); }}
                  className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          )}

          {/* Template track (desktop only) */}
          {track === "template" && (
            <div className="hidden lg:block animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
                    <h3 className="text-lg font-bold text-hero-foreground mb-4">Det får du</h3>
                    <ul className="space-y-3">
                      {["1 professionel landing page", "Responsivt design (mobil + tablet)", "Dit indhold og billeder indsat", "Farver tilpasset dit brand", "SSL-certifikat (https)", "Gratis hosting i 12 måneder"].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-hero-foreground">
                          <span className="w-5 h-5 rounded-full bg-step-complete/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-step-complete" /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
                    <h3 className="text-lg font-bold text-hero-foreground mb-2 flex items-center gap-2"><Palette className="w-5 h-5 text-hero-muted" />Farveønsker</h3>
                    <p className="text-hero-muted text-sm mb-3">Hvilke farver skal din side have? (valgfrit)</p>
                    <input type="text" placeholder="F.eks. blå og hvid, mørk med guld..." value={templateColor} onChange={(e) => setTemplateColor(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors" />
                  </div>
                  <div className="p-6 rounded-2xl border-2 border-hero-foreground/10 bg-hero-foreground/[0.03]">
                    <h3 className="text-lg font-bold text-hero-foreground mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-hero-muted" />Besked til os</h3>
                    <p className="text-hero-muted text-sm mb-3">Fortæl os om din virksomhed og hvad siden skal indeholde (valgfrit)</p>
                    <textarea placeholder="F.eks. vi er et malerfirma i København..." value={templateMessage} onChange={(e) => setTemplateMessage(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-hero-foreground/5 border-2 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-muted/50 focus:border-primary/50 focus:outline-none transition-colors resize-none" />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-8 space-y-6">
                    <div className="p-6 rounded-2xl border-2 border-step-complete/30 bg-step-complete/5">
                      <h3 className="text-lg font-bold text-hero-foreground mb-4">Din pris</h3>
                      <div className="flex justify-between text-hero-foreground mb-1"><span>Template landing page</span><span className="font-medium">{formatDKK(TEMPLATE_PRICE)} kr.</span></div>
                      <div className="border-t border-hero-foreground/10 pt-2 mt-2">
                        <div className="flex justify-between"><span className="text-lg font-bold text-hero-foreground">Total</span><span className="text-2xl font-bold text-step-complete">{formatDKK(TEMPLATE_PRICE)} kr.</span></div>
                        <p className="text-hero-muted text-xs mt-1">Engangspris</p>
                      </div>
                      <div className="mt-4 p-3 rounded-xl bg-step-complete/10 border border-step-complete/20">
                        <div className="flex items-center gap-2 text-step-complete text-sm font-medium"><Gift className="w-4 h-4" />Gratis hosting det første år</div>
                        <p className="text-hero-muted text-xs mt-1">Derefter {formatDKK(MONTHLY_HOSTING_FEE)} kr./md. · Ingen binding</p>
                      </div>
                      <button onClick={scrollToForm} className="w-full mt-4 gradient-primary text-primary-foreground py-4 text-lg font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Bestil nu →</button>
                    </div>
                    <InstantLeadForm state={state} onChange={update} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom / Webshop track (desktop only) */}
          {(track === "custom" || track === "webshop") && (
            <div className="hidden lg:block animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                  <AddonSelector
                    addons={currentAddons}
                    selectedAddons={state.selectedAddons}
                    quantities={quantities}
                    onToggleAddon={toggleAddon}
                    onQuantityChange={handleQuantityChange}
                  />
                  <IncludedFeatures features={currentFeatures} />
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">
                  <div className="lg:sticky lg:top-8 space-y-6">
                    <PriceSummary
                      baseLabel={baseLabel}
                      basePrice={basePrice}
                      addons={currentAddons}
                      total={total}
                      rawTotal={rawTotal}
                      urgencyTotal={urgencyTotal}
                      hasDiscount={hasDiscount}
                      selectedAddons={state.selectedAddons}
                      quantities={quantities}
                      onOrderClick={scrollToForm}
                      showFreeHosting={false}
                      hostingMonthly={hostingMonthly}
                      hostingYearly={hostingYearly}
                    />
                    <InstantLeadForm state={state} onChange={update} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky price bar */}
      {(track === "custom" || track === "webshop") && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-hero-foreground/20 bg-[hsl(222,47%,10%)] px-4 py-3">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <p className="text-hero-muted text-xs">
                {hasDiscount ? "Med 30% rabat" : "Total"}
              </p>
              <p className="text-hero-foreground text-xl font-bold">
                {formatDKK(total)} kr.
              </p>
            </div>
            <button
              onClick={scrollToForm}
              className="gradient-primary text-primary-foreground px-6 py-3 font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 active:scale-[0.98]"
            >
              Bestil nu →
            </button>
          </div>
        </div>
      )}

      {track === "template" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-hero-foreground/20 bg-[hsl(222,47%,10%)] px-4 py-3">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <p className="text-hero-muted text-xs">Template</p>
              <p className="text-step-complete text-xl font-bold">{formatDKK(TEMPLATE_PRICE)} kr.</p>
            </div>
            <button
              onClick={scrollToForm}
              className="gradient-primary text-primary-foreground px-6 py-3 font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 active:scale-[0.98]"
            >
              Bestil nu →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Priser;
