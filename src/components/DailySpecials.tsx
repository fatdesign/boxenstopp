import React from 'react';
import { Tag } from 'lucide-react';

export const DailySpecials: React.FC = () => {
  return (
    <section id="tagesangebot" className="py-24 bg-asphalt relative speed-stripes">
      <div className="absolute inset-0 bg-ink/40 z-0"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">Heute im <span className="text-amber">Boxenstopp</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Täglich wechselnde Angebote direkt vor Ort. Schnell vorbeikommen, zugreifen und sparen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glassmorphic-card p-8 speed-cut border-t-4 border-t-amber group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4 text-amber"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Mittagsmenü</h3></div>
            <p className="text-white/70 mb-6">Hauptspeise + Beilage + Getränk.</p>
            <div className="font-mono text-xl text-white font-bold bg-white/5 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
          <div className="glassmorphic-card p-8 speed-cut border-t-4 border-t-race group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4 text-race"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Snack-Deal</h3></div>
            <p className="text-white/70 mb-6">Heißer Snack + Pommes + Getränk.</p>
            <div className="font-mono text-xl text-white font-bold bg-white/5 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
          <div className="glassmorphic-card p-8 speed-cut border-t-4 border-t-green-500 group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4 text-green-500"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Frische des Tages</h3></div>
            <p className="text-white/70 mb-6">Tagesaktuelle Special-Burger oder Salate.</p>
            <div className="font-mono text-xl text-white font-bold bg-white/5 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
        </div>
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl speed-cut relative h-80 group">
          <div className="absolute inset-0 bg-ink/30 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
          <img src="/images/food-diner.jpg" alt="Speisen & Theke" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>
  );
};