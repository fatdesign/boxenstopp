import React from 'react';
import { ChevronRight, Navigation } from 'lucide-react';
import { Startlights } from './Startlights';
import { DINER_INFO } from '../config/dinerConfig';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-asphalt speed-stripes">
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/60 to-ink/90 z-0"></div>
      <div className="absolute inset-0 opacity-30 z-0 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="flex flex-col items-start max-w-3xl">
          <div className="mb-8"><Startlights /></div>
          <div className="space-y-4 mb-8">
            <h1 className="font-display font-black text-6xl md:text-8xl text-white uppercase leading-[0.9] tracking-tighter"><span className="block opacity-90">Bereit für</span><span className="block text-race drop-shadow-[0_0_15px_rgba(224,30,38,0.5)]">deinen Stopp</span></h1>
            <p className="font-mono text-xl md:text-2xl text-amber uppercase tracking-widest font-bold">{DINER_INFO.slogan}</p>
          </div>
          <p className="text-white/80 text-lg max-w-xl mb-10 leading-relaxed">Der schnelle Imbiss-Stopp im Handelszentrum Bergheim – für warme Snacks, frische Speisen und die perfekte Pause. Rein, bestellen, weiter.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#speisekarte" className="flex items-center justify-center gap-2 bg-race hover:bg-white hover:text-race text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wide transition-all speed-cut shadow-[0_10px_20px_rgba(224,30,38,0.3)]">Speisekarte ansehen <ChevronRight size={20} /></a>
            <a href="https://www.google.com/maps/search/?api=1&query=Handelszentrum+Bergheim+Salzburg" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wide transition-all speed-cut border border-white/10"><Navigation size={20} /> Route planen</a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-ink to-transparent z-10"></div>
    </section>
  );
};