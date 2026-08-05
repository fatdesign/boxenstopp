import React, { useState, useEffect } from 'react';
import { Plus, Printer, Star, Leaf } from 'lucide-react';
import { Reveal } from './Reveal';
import { getImageForCategory } from '../utils/categoryImage';
import { MenuRowSkeletonGrid } from './MenuSkeleton';
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

const WEEKDAY_ORDER = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' },
];

export const FullMenuPage: React.FC = () => {
  const { addItem } = useOrder();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Try loading from Cloudflare Worker D1 Database
        const res = await fetch('https://boxenstopp.f-klavun.workers.dev');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(data.categories || []);
        setLoading(false);
      } catch (err) {
        console.warn('Worker fetch failed, falling back to local menu.json', err);
        // Fallback to local static file
        fetch('menu.json')
          .then(res => res.json())
          .then(data => {
            setCategories(data.categories || []);
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
    return <div className="min-h-screen pt-32 pb-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Keine Speisen gefunden.</div>;
  }

  const orderedCategories = [...categories].sort((a, b) => {
    if (a.id === 'wochenmenue') return -1;
    if (b.id === 'wochenmenue') return 1;
    return 0;
  });

  const renderItemCard = (item: MenuItem, idx: number, categoryId: string, showDayBadge: boolean = true) => (
    <div
      key={idx}
      className={`bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-lotteria-yellow/30 hover:border-lotteria-yellow relative flex gap-4 sm:gap-6 items-center group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Item Image Left Side */}
      <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 bg-lotteria-bg/60 rounded-2xl relative overflow-hidden">
        <img
          src={item.image || getImageForCategory(categoryId)}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Details Right Side */}
      <div className="flex-grow min-w-0 py-2">
        <div className="flex justify-between items-start mb-2 gap-2 sm:gap-4">
          <h3 className="font-display font-black text-lg sm:text-2xl text-lotteria-red uppercase leading-tight group-hover:text-lotteria-red/90 transition-colors min-w-0 break-words">
            {item.name}
            {item.allergens && item.allergens.length > 0 && (
              <span className="ml-1.5 text-[0.65rem] font-sans font-bold text-lotteria-red/80 bg-lotteria-yellow/40 border border-lotteria-yellow/60 rounded px-1.5 py-0.5 tracking-wider uppercase inline-block align-middle">
                {item.allergens.join(', ')}
              </span>
            )}
          </h3>
          <span className="bg-lotteria-yellow text-lotteria-red font-display font-black text-base sm:text-lg px-2.5 sm:px-3 py-1 rounded-full shadow-sm flex-shrink-0">
            € {item.price}
          </span>
        </div>

        <p className="text-sm font-medium text-lotteria-red/70 mb-3">
          {item.description}
        </p>

        {/* Status Badges + Add to Cart */}
        <div className="flex flex-wrap items-center gap-2">
          {item.isPopular && (
            <span className="px-2.5 py-1 bg-lotteria-red text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm flex items-center gap-1">
              <Star size={10} className="fill-white" /> Beliebt
            </span>
          )}
          {item.isVegetarian && (
            <span className="px-2.5 py-1 bg-green-600 text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm flex items-center gap-1">
              <Leaf size={10} /> Veggie
            </span>
          )}
          {item.isSoldOut && (
            <span className="px-2.5 py-1 bg-gray-500 text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm">
              Ausverkauft
            </span>
          )}
          {showDayBadge && formatSpecialDays(item.specialDays) && (
            <span className="px-2.5 py-1 bg-amber-800 text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm">
              Nur {formatSpecialDays(item.specialDays)}
            </span>
          )}
          {!item.isSoldOut && (
            <button
              onClick={() => addItem(item.name, item.price)}
              aria-label={`${item.name} vorbestellen`}
              className="ml-auto flex items-center gap-1 bg-lotteria-red text-white text-[0.7rem] font-bold uppercase tracking-wide rounded-full px-3 py-1.5 hover:bg-lotteria-red/90 active:scale-95 transition-all"
            >
              <Plus size={13} /> Vorbestellen
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-lotteria-bg min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[30%] bg-lotteria-red rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-lotteria-yellow rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 relative z-10">

        {/* Page Header */}
        <Reveal className="text-center mb-12 sm:mb-20 border-b-2 border-lotteria-red/10 pb-8 sm:pb-12">
          <h1 className="font-display font-black text-4xl sm:text-7xl uppercase text-lotteria-red tracking-tighter mb-4">
            Die Speisekarte
          </h1>
          <p className="font-medium text-base sm:text-lg text-lotteria-red/70 tracking-widest uppercase mb-6">
            Original Boxenstopp Geschmack
          </p>
          <div className="no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2.5 bg-lotteria-red text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base uppercase tracking-wide hover:bg-lotteria-red/90 active:scale-95 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Printer size={20} /> Speisekarte drucken / PDF
            </button>
          </div>
        </Reveal>

        {/* Sequential Categories */}
        {loading && (
          <div className="space-y-16">
            <MenuRowSkeletonGrid />
            <MenuRowSkeletonGrid />
          </div>
        )}
        <div className="space-y-24">
          {!loading && orderedCategories.map((category, catIdx) => {
            const isWeeklyMenu = category.id === 'wochenmenue';

            if (isWeeklyMenu) {
              const dayGroups = WEEKDAY_ORDER
                .map(day => ({ ...day, items: category.items.filter(item => item.specialDays?.includes(day.key)) }))
                .filter(group => group.items.length > 0);

              if (dayGroups.length === 0) return null;

              return (
                <Reveal key={category.id} delay={Math.min(catIdx, 5) * 80} className="scroll-mt-32" id={`cat-${category.id}`}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <h2 className="font-display font-black text-2xl sm:text-4xl text-lotteria-red uppercase tracking-tight">
                      {category.name}
                    </h2>
                    <div className="flex-grow h-1 bg-lotteria-red/10 rounded-full"></div>
                  </div>

                  {/* Day-by-Day Groups */}
                  <div className="space-y-10 sm:space-y-14">
                    {dayGroups.map(group => (
                      <div key={group.key}>
                        <div className="flex items-center gap-3 mb-5">
                          <span className="font-display font-black text-sm sm:text-base text-white bg-lotteria-red px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                            {group.label}
                          </span>
                          <div className="flex-grow h-0.5 bg-lotteria-red/15 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                          {group.items.map((item, idx) => renderItemCard(item, idx, category.id, false))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              );
            }

            const visibleItems = category.items.filter(item => isAvailableToday(item.specialDays));
            if (visibleItems.length === 0) return null;
            return (
              <Reveal key={category.id} delay={Math.min(catIdx, 5) * 80} className="scroll-mt-32" id={`cat-${category.id}`}>
                {/* Category Header */}
                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <h2 className="font-display font-black text-2xl sm:text-4xl text-lotteria-red uppercase tracking-tight">
                    {category.name}
                  </h2>
                  <div className="flex-grow h-1 bg-lotteria-red/10 rounded-full"></div>
                </div>

                {/* Items Grid (Classic 2-Column Menu Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                  {visibleItems.map((item, idx) => renderItemCard(item, idx, category.id))}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Allergen Legend Footer */}
        <div className="mt-16 pt-8 border-t border-lotteria-yellow/30 text-center">
          <h4 className="font-display font-black text-sm uppercase text-lotteria-red tracking-wider mb-2">
            Allergeninformation (EU-Klassifizierung)
          </h4>
          <p className="text-xs font-medium text-lotteria-red/70 max-w-4xl mx-auto leading-relaxed">
            <strong>A:</strong> Glutenhaltiges Getreide | <strong>B:</strong> Krebstiere | <strong>C:</strong> Ei | <strong>D:</strong> Fisch | <strong>E:</strong> Erdnuss | <strong>F:</strong> Soja | <strong>G:</strong> Milch (Laktose) | <strong>H:</strong> Schalenfrüchte | <strong>L:</strong> Sellerie | <strong>M:</strong> Senf | <strong>N:</strong> Sesam | <strong>O:</strong> Sulfite | <strong>P:</strong> Lupinen | <strong>R:</strong> Weichtiere
          </p>
        </div>

      </div>
    </div>
  );
};
