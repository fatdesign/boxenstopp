import React, { useState } from 'react';
import { MENU } from '../config/dinerConfig';
import { Leaf, Star } from 'lucide-react';
import { cn } from './Startlights';

export const MenuSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(MENU[0].id);
  const activeCategory = MENU.find(c => c.id === activeTab) || MENU[0];

  return (
    <section id="speisekarte" className="py-24 bg-ink relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">Was bei uns <span className="text-race">auf die Hand kommt</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Alle Preise und Gerichte werden laufend ergänzt. Frisch zubereitet, sofort mitnehmbar.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {MENU.map(category => (
            <button key={category.id} onClick={() => setActiveTab(category.id)} className={cn("px-6 py-3 font-display font-bold uppercase tracking-wide text-sm speed-cut transition-all", activeTab === category.id ? "bg-race text-white shadow-[0_4px_15px_rgba(224,30,38,0.4)]" : "bg-asphalt text-white/70 hover:bg-white/10 hover:text-white border border-white/5")}>
              {category.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {activeCategory.items.map(item => (
            <div key={item.id} className="glassmorphic-card p-6 speed-cut group hover:border-race/50 hover:shadow-[0_8px_30px_rgba(224,30,38,0.15)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-race/5 rounded-full blur-2xl group-hover:bg-race/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">{item.name}{item.isPopular && <span className="flex items-center gap-1 bg-amber/10 text-amber text-[0.65rem] px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber/20"><Star size={10} className="fill-amber" /> Beliebt</span>}{item.isVegetarian && <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[0.65rem] px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-500/20"><Leaf size={10} /> Veggie</span>}</h3>
                <span className="font-mono font-bold text-lg text-race whitespace-nowrap ml-4">€ {item.price}</span>
              </div>
              <p className="text-white/60 text-sm relative z-10 pr-12">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};