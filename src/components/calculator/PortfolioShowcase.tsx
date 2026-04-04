import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import portfolioNeverAnother from "@/assets/portfolio-neveranother.webp";
import portfolioBettrPlans from "@/assets/portfolio-bettrplans.webp";
import portfolio43Futures from "@/assets/portfolio-43futures.webp";
import portfolioLipsMusic from "@/assets/portfolio-lipsmusic.webp";
import portfolioSpakompagniet from "@/assets/portfolio-spakompagniet.webp";
import portfolioJesperLundgaard from "@/assets/portfolio-jesperlundgaard.webp";
import portfolioSpecialisterne from "@/assets/portfolio-specialisterne.webp";
import portfolioNFT from "@/assets/portfolio-nft.webp";
import portfolioNordic from "@/assets/portfolio-nordic.webp";
import portfolioAAEL from "@/assets/portfolio-aael.webp";
import horizenLogo from "@/assets/horizen-logo.png";

interface PortfolioItem {
  id: number;
  title: string;
  image: string | null;
  height: "tall" | "medium" | "short";
}

const PLACEHOLDER_ITEMS: PortfolioItem[] = [
  { id: 1, title: "Never Another", image: portfolioNeverAnother, height: "tall" },
  { id: 2, title: "BettrPlans", image: portfolioBettrPlans, height: "tall" },
  { id: 3, title: "43futures", image: portfolio43Futures, height: "tall" },
  { id: 4, title: "LipsMusic", image: portfolioLipsMusic, height: "tall" },
  { id: 5, title: "Spakompagniet", image: portfolioSpakompagniet, height: "tall" },
  { id: 6, title: "Jesper Lundgaard", image: portfolioJesperLundgaard, height: "tall" },
  { id: 7, title: "Nordic", image: portfolioNordic, height: "short" },
  { id: 8, title: "AAEL", image: portfolioAAEL, height: "medium" },
  { id: 9, title: "Specialisterne", image: portfolioSpecialisterne, height: "tall" },
  { id: 10, title: "JO:NFT", image: portfolioNFT, height: "tall" },
];

const heightMap = {
  tall: "h-[380px] sm:h-[440px]",
  medium: "h-[280px] sm:h-[340px]",
  short: "h-[220px] sm:h-[260px]",
};

function distributeToColumns(items: PortfolioItem[], colCount: number): PortfolioItem[][] {
  const columns: PortfolioItem[][] = Array.from({ length: colCount }, () => []);
  items.forEach((item, i) => {
    columns[i % colCount].push(item);
  });
  return columns;
}

const PortfolioShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const colCount = isMobile ? 2 : 5;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const columns = container.querySelectorAll<HTMLDivElement>("[data-scroll-col]");
    const speeds = [0.3, -0.2, 0.25, -0.35, 0.15];
    let animationId: number;
    const offsets = Array.from({ length: columns.length }, () => 0);

    const animate = () => {
      columns.forEach((col, i) => {
        offsets[i] += speeds[i % speeds.length];
        if (Math.abs(offsets[i]) > 40) {
          speeds[i % speeds.length] *= -1;
        }
        col.style.transform = `translateY(${offsets[i]}px)`;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [colCount]);

  const columns = distributeToColumns(PLACEHOLDER_ITEMS, colCount);

  return (
    <div className="w-full overflow-hidden mt-8 pb-0">
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)",
        }}
      >
        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 px-3 sm:px-4"
        >
          {columns.map((colItems, colIndex) => (
            <div
              key={`${colCount}-${colIndex}`}
              data-scroll-col
              className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-4 transition-transform duration-1000 ease-out"
            >
              {colItems.map((item) => (
                <div
                   key={item.id}
                   className={`${heightMap[item.height]} w-full rounded-xl sm:rounded-2xl overflow-hidden relative group`}
                 >
                   {item.image ? (
                     <>
                       <img
                         src={item.image}
                         alt={item.title}
                         className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                     </>
                   ) : (
                     <div className="w-full h-full bg-hero-foreground/[0.06] flex items-end p-4">
                       <span className="text-hero-muted/40 text-xs font-medium">
                         {item.title}
                       </span>
                     </div>
                   )}
                 </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Horizen logo at the bottom */}
      <div className="flex justify-center py-16 sm:py-24">
        <a href="https://horizen.dk/" target="_blank" rel="noopener noreferrer">
          <img src={horizenLogo} alt="Horizen" className="h-12 sm:h-16 opacity-80 hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </div>
  );
};

export default PortfolioShowcase;
