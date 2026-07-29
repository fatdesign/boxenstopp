import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Hero: React.FC = () => {
  const { contact } = useSiteSettings();
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-lotteria-red animate-circle-reveal">
      {/* Background Studio Glow & Texture */}
      <div className="absolute inset-0 opacity-25 z-0 bg-cover bg-center mix-blend-multiply" style={{ backgroundImage: "url('images/hero_food_bg.png')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-lotteria-red/80 via-transparent to-lotteria-red z-0 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center text-center">
        <div className="w-full space-y-4 sm:space-y-6 mb-10 opacity-0 animate-[slide-up_1s_ease-out_0.5s_forwards]">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-4xl text-white tracking-wide">
            Wo Gschmack aufs Original trifft
          </h2>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-white uppercase leading-[0.95] sm:leading-[0.9] tracking-tighter drop-shadow-xl break-words">
            {contact.name}
          </h1>
        </div>

        <div className="opacity-0 animate-[slide-up_1s_ease-out_0.8s_forwards]">
          <Link to="/speisekarte" className="inline-flex items-center justify-center gap-2 bg-white text-lotteria-red px-6 sm:px-10 py-4 sm:py-5 rounded-full font-display font-bold text-base sm:text-xl uppercase tracking-wide hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            Speisekarte entdecken <ChevronRight size={24} />
          </Link>
        </div>
      </div>

      {/* Decorative Floating Food Highlights */}
      <div className="absolute -bottom-12 -left-12 w-56 h-56 sm:-bottom-16 sm:-left-16 sm:w-72 sm:h-72 md:-bottom-20 md:-left-20 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white opacity-0 animate-[slide-up_1.2s_ease-out_1s_forwards] rotate-[-10deg]">
        <img src="images/schnitzel.png" alt="Knuspriges Schnitzel mit Pommes" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-20 -right-8 w-40 h-40 sm:top-28 sm:-right-10 sm:w-56 sm:h-56 md:top-32 md:w-72 md:h-72 rounded-full overflow-hidden shadow-2xl border-8 border-white opacity-0 animate-[slide-up_1.2s_ease-out_1.2s_forwards] rotate-[15deg]">
        <img src="images/burger_combo.png" alt="Burger & Fries Combo" className="w-full h-full object-cover" />
      </div>
    </section>
  );
};