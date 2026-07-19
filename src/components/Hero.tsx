import React from 'react';
import { ChevronRight } from 'lucide-react';
import { DINER_INFO } from '../config/dinerConfig';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-lotteria-red animate-circle-reveal">
      {/* Background Studio Glow & Texture */}
      <div className="absolute inset-0 opacity-25 z-0 bg-cover bg-center mix-blend-multiply" style={{ backgroundImage: "url('/images/hero_food_bg.png')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-lotteria-red/80 via-transparent to-lotteria-red z-0 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center text-center">
        <div className="space-y-6 mb-10 opacity-0 animate-[slide-up_1s_ease-out_0.5s_forwards]">
          <h2 className="font-display font-bold text-2xl md:text-4xl text-white tracking-wide">
            Where Taste Meets Originality
          </h2>
          <h1 className="font-display font-black text-6xl md:text-8xl text-white uppercase leading-[0.9] tracking-tighter drop-shadow-xl">
            The Original Burger,<br/>{DINER_INFO.name}
          </h1>
        </div>
        
        <div className="opacity-0 animate-[slide-up_1s_ease-out_0.8s_forwards]">
          <a href="#speisekarte" className="inline-flex items-center justify-center gap-2 bg-white text-lotteria-red px-10 py-5 rounded-full font-display font-bold text-xl uppercase tracking-wide hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            Explore Menu <ChevronRight size={24} />
          </a>
        </div>
      </div>
      
      {/* Decorative Floating Food Highlights */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white opacity-0 animate-[slide-up_1.2s_ease-out_1s_forwards] rotate-[-10deg]">
        <img src="/images/schnitzel.png" alt="Knuspriges Schnitzel mit Pommes" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-32 -right-10 w-72 h-72 rounded-full overflow-hidden shadow-2xl border-8 border-white opacity-0 animate-[slide-up_1.2s_ease-out_1.2s_forwards] rotate-[15deg]">
        <img src="/images/burger_combo.png" alt="Burger & Fries Combo" className="w-full h-full object-cover" />
      </div>
    </section>
  );
};