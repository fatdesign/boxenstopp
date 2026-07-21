import React, { useState, useEffect } from 'react';
import { Reveal } from './Reveal';
import { getImageForCategory } from '../utils/categoryImage';

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  isVegetarian?: boolean;
  isPopular?: boolean;
  isSoldOut?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const MenuSection: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Try loading from Cloudflare Worker D1 Database
        const res = await fetch('https://boxenstopp.f-klavun.workers.dev');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.warn('Worker fetch failed, falling back to local menu.json', err);
        // Fallback to local static file
        fetch('menu.json')
          .then(res => res.json())
          .then(data => {
            setCategories(data.categories || []);
            if (data.categories && data.categories.length > 0) {
              setActiveCategory(data.categories[0].id);
            }
            setLoading(false);
          })
          .catch(fallbackErr => {
            console.error('Failed to load local menu.json fallback', fallbackErr);
            setLoading(false);
          });
      }
    };
    loadMenu();
  }, []);

  if (loading) {
    return <div className="py-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Lade Speisekarte...</div>;
  }

  if (categories.length === 0) {
    return <div className="py-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Keine Daten gefunden.</div>;
  }

  const currentCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <section id="menu" className="py-24 bg-lotteria-bg relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-lotteria-red rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-lotteria-yellow rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 relative z-10">
        
        {/* Title Header */}
        <Reveal className="text-center mb-16">
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase text-lotteria-red tracking-tighter mb-4">
            Dein neuer Lieblingsburger startet do!
          </h2>
          <p className="font-medium text-base sm:text-lg text-lotteria-red/70 tracking-widest uppercase">
            Jeder Biss a Stückerl Freid.
          </p>
        </Reveal>

        {/* Categories Navigation (Pill-Style) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-6 sm:px-10 py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-sm
                ${activeCategory === cat.id 
                  ? 'bg-lotteria-yellow text-lotteria-red shadow-xl scale-105 ring-4 ring-lotteria-yellow/40' 
                  : 'bg-white text-lotteria-red border-2 border-lotteria-yellow/30 hover:border-lotteria-yellow hover:scale-105 hover:bg-white/90'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Full-Width Responsive Card Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */}
        {currentCategoryData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {currentCategoryData.items.map((item, idx) => (
              <Reveal
                key={idx}
                delay={Math.min(idx, 7) * 70}
                className={`bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-lotteria-yellow/20 hover:border-lotteria-yellow relative flex flex-col justify-between overflow-hidden group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
              >
                <div>
                  {/* Item Image Framing */}
                  <div className="w-full h-48 sm:h-52 bg-lotteria-bg/60 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-lotteria-yellow/20 rounded-full scale-75 group-hover:scale-125 transition-transform duration-500 blur-xl"></div>
                    <img 
                      src={getImageForCategory(activeCategory)} 
                      alt={item.name}
                      className="w-36 h-36 object-cover rounded-full shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 border-4 border-white"
                    />
                    
                    {/* Price Tag Floating Top-Right */}
                    <div className="absolute top-3 right-3 bg-lotteria-yellow text-lotteria-red font-display font-black text-lg px-4 py-1.5 rounded-full shadow-lg z-20 border border-white">
                      € {item.price}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-lotteria-red uppercase leading-tight mb-2 group-hover:text-lotteria-red/90 transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-sm font-medium text-lotteria-red/70 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-lotteria-bg">
                  {item.isPopular && (
                    <span className="px-3 py-1 bg-lotteria-red text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      ★ Beliebt
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      🌱 Veggie
                    </span>
                  )}
                  {item.isSoldOut && (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      Ausverkauft
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};