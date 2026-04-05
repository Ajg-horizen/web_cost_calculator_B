import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import PortfolioShowcase from "@/components/calculator/PortfolioShowcase";
import horizenLogo from "@/assets/horizen-logo.png";
import ludvigImg from "@/assets/ludvig.webp";
import logoArenaRanders from "@/assets/logo-arenaderanders.svg";
import logoKiefit from "@/assets/logo-kiefit.svg";
import logoKomunikado from "@/assets/logo-komunikado.svg";
import logoNordic from "@/assets/logo-nordic.svg";
import logoWereMe from "@/assets/logo-wereme.svg";
import logoAAEL from "@/assets/logo-aael.svg";
import logoBettrPlans from "@/assets/logo-bettrplans.svg";
import logoNeverAnother from "@/assets/logo-neveranother.svg";
import { formatDKK, TEMPLATE_PRICE } from "@/lib/calculator-config";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "calculator_intro_view" });
  }, []);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="flex flex-col">
        {/* Hero */}
        <div className="h-[100svh] flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <CanvasRevealEffect
              animationSpeed={32.5}
              colors={[[255, 255, 255]]}
              dotSize={3}
              showGradient={true}
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-black/40" />

          <nav className="relative z-10 w-full px-4 sm:px-8 py-4 border-b border-hero-foreground/10">
            <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
              <img src={horizenLogo} alt="Horizen" className="h-6 sm:h-7" />
            </a>
          </nav>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-hero-foreground/20 mb-3 sm:mb-4 animate-fade-in-up">
              <img src={ludvigImg} alt="Ludvig - Sælger hos Horizen" className="w-full h-full object-cover object-top" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 sm:mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              Fra <span style={{ color: "hsl(152 60% 45%)" }}>{formatDKK(TEMPLATE_PRICE)} kr.</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight text-hero-foreground mb-3 sm:mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Hvad koster en hjemmeside
              <br />
              <span className="text-gradient">til din virksomhed?</span>
            </h1>

            <p
              className="text-base sm:text-lg text-hero-foreground/80 max-w-2xl mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Få et prisoverslag på under 2 minutter.
            </p>

            <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "0.3s" }}>
              <button
                onClick={() => navigate("/priser")}
                className="gradient-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl glow-primary hover:glow-primary-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                Vælg din løsning
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 text-hero-muted text-xs mt-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-step-complete" />
                  Fast pris · Ingen overraskelser
                </span>
              </div>
            </div>

            <div className="mt-8 sm:mt-16 w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex flex-col items-center gap-3 mb-6">
                <a href="https://dk.trustpilot.com/review/horizen.dk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-hero-foreground hover:opacity-80 transition-opacity">
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
                <p className="text-hero-muted text-xs">Hjælper små og store virksomheder med nye hjemmesider</p>
              </div>

              <div
                className="relative overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
                }}
              >
                <div className="flex items-center gap-12 animate-marquee">
                  {[logoArenaRanders, logoKiefit, logoKomunikado, logoNordic, logoWereMe, logoAAEL, logoBettrPlans, logoNeverAnother,
                    logoArenaRanders, logoKiefit, logoKomunikado, logoNordic, logoWereMe, logoAAEL, logoBettrPlans, logoNeverAnother].map((logo, i) => (
                    <img key={i} src={logo} alt="Client logo" className="h-6 w-auto shrink-0 opacity-70" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pb-4 sm:pb-8 pt-4 sm:pt-8 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <span className="text-hero-muted text-xs tracking-wide uppercase">Se vores cases</span>
              <div className="animate-bounce">
                <ChevronDown className="w-5 h-5 text-hero-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-black">
          <PortfolioShowcase />
        </div>
      </div>
    </div>
  );
};

export default Index;
