import React from 'react';
import { Tag } from 'lucide-react';

export const DailySpecials: React.FC = () => {
  return (
    <section id="tagesangebot" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Subtle Food Background Texture (25% Opacity) */}
      <div 
        className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-multiply pointer-events-none z-0" 
        style={{ backgroundImage: "url('images/hero_food_bg.png')" }}
      ></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink uppercase tracking-tight mb-4">Heute im <span className="text-race">Boxenstopp</span></h2>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">Täglich wechselnde Angebote direkt vor Ort. Schnell vorbeikommen, zugreifen und sparen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 speed-cut border-t-4 border-t-amber-500 border border-gray-100 shadow-md group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-amber-600"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Mittagsmenü</h3></div>
            <p className="text-gray-600 mb-6 font-medium">Hauptspeise + Beilage + Getränk.</p>
            <div className="font-mono text-xl text-gray-900 font-bold bg-gray-100 border border-gray-200 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
          <div className="bg-white p-8 speed-cut border-t-4 border-t-race border border-gray-100 shadow-md group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-race"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Snack-Deal</h3></div>
            <p className="text-gray-600 mb-6 font-medium">Heißer Snack + Pommes + Getränk.</p>
            <div className="font-mono text-xl text-gray-900 font-bold bg-gray-100 border border-gray-200 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
          <div className="bg-white p-8 speed-cut border-t-4 border-t-green-500 border border-gray-100 shadow-md group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-green-600"><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">Frische des Tages</h3></div>
            <p className="text-gray-600 mb-6 font-medium">Tagesaktuelle Special-Burger oder Salate.</p>
            <div className="font-mono text-xl text-gray-900 font-bold bg-gray-100 border border-gray-200 inline-block px-4 py-2 rounded-md">siehe Aushang</div>
          </div>
        </div>
        <div className="mt-16 rounded-2xl overflow-hidden shadow-xl speed-cut relative h-80 group">
          <div className="absolute inset-0 bg-ink/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
          <img src="images/schnitzel.png" alt="Knuspriges Schnitzel mit Pommes" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>
  );
};