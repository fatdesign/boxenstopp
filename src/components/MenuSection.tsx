import React, { useState, useEffect } from 'react';
import { Plus, Star, Leaf } from 'lucide-react';
import { Reveal } from './Reveal';
import { getImageForCategory } from '../utils/categoryImage';
import { MenuCardSkeletonGrid } from './MenuSkeleton';
import { useOrder } from '../context/OrderContext';
import { formatSpecialDays, isAvailableToday } from '../utils/weekday';

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  isVegetarian?: boolean;
  isPopular?: boolean;
  isSoldOut?: boolean;
  specialDays?: string[];
  image?: string;
  allergens?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const MenuSection: React.FC = () => {
  const { addItem } = useOrder();
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

  if (!loading && categories.length === 0) {
    return <div className="py-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Keine Daten gefunden.</div>;
  }

  const currentCategoryData = categories.find(c => c.id === activeCategory);
  const visibleItems = currentCategoryData?.items.filter(item => isAvailableToday(item.specialDays)) || [];

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
            Dein neuer Lieblingsburger startet&nbsp;do!
          </h2>
          <p className="font-medium text-base sm:text-lg text-lotteria-red/70 tracking-widest uppercase">
            Jeder Biss a Stückerl Freid.
          </p>
        </Reveal>

        {/* Categories Navigation (Pill-Style) */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-16 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[46px] sm:h-[54px] w-28 sm:w-36 rounded-full bg-white/70" />
            ))}
          </div>
        ) : (
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
        )}

        {/* Full-Width Responsive Card Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */}
        {loading && <MenuCardSkeletonGrid />}
        {!loading && currentCategoryData && visibleItems.length === 0 && (
          <Reveal className="text-center text-lotteria-red/70 font-medium py-12">
            Heute keine Gerichte in dieser Kategorie – schau bald wieder vorbei!
          </Reveal>
        )}
        {!loading && currentCategoryData && visibleItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {visibleItems.map((item, idx) => (
              <Reveal
                key={idx}
                delay={Math.min(idx, 7) * 70}
                className={`bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-lotteria-yellow/20 hover:border-lotteria-yellow relative flex flex-col justify-between overflow-hidden group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
              >
                <div>
                  {/* Item Image Framing */}
                  <div className="w-full h-48 sm:h-52 bg-lotteria-bg/60 rounded-2xl mb-6 relative overflow-hidden">
                    <img
                      src={item.image || getImageForCategory(activeCategory)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Price Tag Floating Top-Right */}
                    <div className="absolute top-3 right-3 bg-lotteria-yellow text-lotteria-red font-display font-black text-lg px-4 py-1.5 rounded-full shadow-lg z-20 border border-white">
                      € {item.price}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-lotteria-red uppercase leading-tight mb-2 group-hover:text-lotteria-red/90 transition-colors break-words">
                    {item.name}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="ml-1.5 text-[0.65rem] font-sans font-bold text-lotteria-red/80 bg-lotteria-yellow/40 border border-lotteria-yellow/60 rounded px-1.5 py-0.5 tracking-wider uppercase inline-block align-middle">
                        {item.allergens.join(', ')}
                      </span>
                    )}
                  </h3>
                  
                  <p className="text-sm font-medium text-lotteria-red/70 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-lotteria-bg">
                  {item.isPopular && (
                    <span className="px-3 py-1 bg-lotteria-red text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm flex items-center gap-1">
                      <Star size={12} className="fill-white" /> Beliebt
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm flex items-center gap-1">
                      <Leaf size={12} /> Veggie
                    </span>
                  )}
                  {item.isSoldOut && (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      Ausverkauft
                    </span>
                  )}
                  {formatSpecialDays(item.specialDays) && (
                    <span className="px-3 py-1 bg-amber-800 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      Nur {formatSpecialDays(item.specialDays)}
                    </span>
                  )}
                </div>

                {!item.isSoldOut && (
                  <button
                    onClick={() => addItem(item.name, item.price)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-lotteria-red text-white py-2.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-lotteria-red/90 active:scale-95 transition-all"
                  >
                    <Plus size={16} /> Vorbestellen
                  </button>
                )}
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};