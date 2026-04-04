import { Phone, Mail } from "lucide-react";
import ludvigImage from "@/assets/ludvig.webp";

const StepConfirmation = () => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-2 border-hero-foreground/10">
          <img 
            src={ludvigImage} 
            alt="Horizen medarbejder" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-hero-foreground mb-3">
          Tak for din henvendelse
        </h2>
        <p className="text-hero-muted text-lg leading-relaxed">
          Vi vender tilbage hurtigst muligt. Hvis du har nogle spørgsmål, kan du kontakte os direkte.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <a 
          href="tel:+4542280448" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-hero-bg text-hero-foreground font-medium border-2 border-hero-foreground/20 transition-transform active:scale-[0.97] hover:scale-[1.02]"
        >
          <Phone className="w-4 h-4" />
          +45 42 28 04 48
        </a>
        <a 
          href="https://horizen.dk/kontakt/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-hero-foreground/10 text-hero-foreground font-medium transition-transform active:scale-[0.97] hover:scale-[1.02]"
        >
          <Mail className="w-4 h-4" />
          Kontakt os
        </a>
      </div>
    </div>
  );
};

export default StepConfirmation;
