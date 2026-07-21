import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Reveal } from './Reveal';
import { getImageForCategory } from '../utils/categoryImage';

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  isVegetarian?: boolean;
  isPopular?: boolean;
  isSoldOut?: boolean;
  isDailySpecial?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface FeaturedSpecial extends MenuItem {
  categoryId: string;
}

const CARD_ACCENTS = [
  { border: 'border-t-amber-500', text: 'text-amber-600' },
  { border: 'border-t-race', text: 'text-race' },
  { border: 'border-t-green-500', text: 'text-green-600' },
];

function extractSpecials(categories: MenuCategory[]): FeaturedSpecial[] {
  return categories.flatMap(cat =>
    cat.items
      .filter(item => item.isDailySpecial && !item.isSoldOut)
      .map(item => ({ ...item, categoryId: cat.id }))
  );
}

export const DailySpecials: React.FC = () => {
  const [specials, setSpecials] = useState<FeaturedSpecial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSpecials = async () => {
      try {
        const res = await fetch('https://boxenstopp.f-klavun.workers.dev');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSpecials(extractSpecials(data.categories || []));
        setLoaded(true);
      } catch (err) {
        console.warn('Worker fetch failed, falling back to local menu.json', err);
        fetch('menu.json')
          .then(res => res.json())
          .then(data => {
            setSpecials(extractSpecials(data.categories || []));
            setLoaded(true);
          })
          .catch(fallbackErr => {
            console.error('Failed to load local menu.json fallback', fallbackErr);
            setLoaded(true);
          });
      }
    };
    loadSpecials();
  }, []);

  return (
    <section id="tagesangebot" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Subtle Food Background Texture (25% Opacity) */}
      <div
        className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-multiply pointer-events-none z-0"
        style={{ backgroundImage: "url('images/hero_food_bg.png')" }}
      ></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink uppercase tracking-tight mb-4">Heute im <span className="text-race">Boxenstopp</span></h2>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">Täglich wechselnde Angebote direkt vor Ort. Schnell vorbeikommen, zugreifen und sparen.</p>
        </Reveal>

        {loaded && specials.length === 0 && (
          <Reveal className="text-center text-gray-500 font-medium py-6">
            Aktuell keine Tagesangebote – schau bald wieder vorbei!
          </Reveal>
        )}

        {specials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specials.map((special, idx) => {
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
              return (
                <Reveal key={idx} delay={idx * 120} className={`bg-white p-8 speed-cut border-t-4 ${accent.border} border border-gray-100 shadow-md group hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}>
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-gray-100 shadow-sm">
                    <img src={getImageForCategory(special.categoryId)} alt={special.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`flex items-center gap-3 mb-4 ${accent.text}`}><Tag size={24} /><h3 className="font-display font-bold text-2xl uppercase">{special.name}</h3></div>
                  <p className="text-gray-600 mb-6 font-medium">{special.description}</p>
                  <div className="font-mono text-xl text-gray-900 font-bold bg-gray-100 border border-gray-200 inline-block px-4 py-2 rounded-md">€ {special.price}</div>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal className="mt-16 rounded-2xl overflow-hidden shadow-xl speed-cut relative h-80 group">
          <div className="absolute inset-0 bg-ink/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
          <img src="images/schnitzel.png" alt="Knuspriges Schnitzel mit Pommes" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
        </Reveal>
      </div>
    </section>
  );
};
