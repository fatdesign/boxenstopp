import React, { useState, useEffect } from 'react';

const GET_IMAGE_FOR_CATEGORY = (catId: string) => {
  switch (catId) {
    case 'burger':
      return '/images/burger.png';
    case 'beilagen':
      return '/images/fries.png';
    case 'getraenke':
      return '/images/drinks.png';
    case 'warme-snacks':
    default:
      return '/images/schnitzel.png';
  }
};

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

export const FullMenuPage: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu.json', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Lade Speisekarte...</div>;
  }

  if (categories.length === 0) {
    return <div className="min-h-screen pt-32 pb-24 bg-lotteria-bg flex items-center justify-center font-display text-2xl text-lotteria-red">Keine Speisen gefunden.</div>;
  }

  return (
    <div className="bg-lotteria-bg min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[30%] bg-lotteria-red rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-lotteria-yellow rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-20 border-b-2 border-lotteria-red/10 pb-12">
          <h1 className="font-display font-black text-5xl sm:text-7xl uppercase text-lotteria-red tracking-tighter mb-4">
            Die Speisekarte
          </h1>
          <p className="font-medium text-lg text-lotteria-red/70 tracking-widest uppercase">
            Original Boxenstopp Geschmack
          </p>
        </div>

        {/* Sequential Categories */}
        <div className="space-y-24">
          {categories.map((category) => (
            <div key={category.id} className="scroll-mt-32" id={`cat-${category.id}`}>
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-display font-black text-4xl text-lotteria-red uppercase tracking-tight whitespace-nowrap">
                  {category.name}
                </h2>
                <div className="flex-grow h-1 bg-lotteria-red/10 rounded-full"></div>
              </div>

              {/* Items Grid (Classic 2-Column Menu Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-lotteria-yellow/30 hover:border-lotteria-yellow relative flex gap-6 items-center group ${item.isSoldOut ? 'opacity-50 grayscale' : ''}`}
                  >
                    {/* Item Image Left Side */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-lotteria-bg/60 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-lotteria-yellow/20 rounded-full scale-50 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
                      <img 
                        src={GET_IMAGE_FOR_CATEGORY(category.id)} 
                        alt={item.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full shadow-md relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 border-2 border-white"
                      />
                    </div>

                    {/* Details Right Side */}
                    <div className="flex-grow py-2">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="font-display font-black text-xl sm:text-2xl text-lotteria-red uppercase leading-tight group-hover:text-lotteria-red/90 transition-colors">
                          {item.name}
                        </h3>
                        <span className="bg-lotteria-yellow text-lotteria-red font-display font-black text-lg px-3 py-1 rounded-full shadow-sm flex-shrink-0">
                          € {item.price}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-lotteria-red/70 mb-3">
                        {item.description}
                      </p>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2">
                        {item.isPopular && (
                          <span className="px-2.5 py-1 bg-lotteria-red text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm">
                            ★ Beliebt
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="px-2.5 py-1 bg-green-600 text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm">
                            🌱 Veggie
                          </span>
                        )}
                        {item.isSoldOut && (
                          <span className="px-2.5 py-1 bg-gray-500 text-white text-[0.65rem] font-bold uppercase rounded-full tracking-wider shadow-sm">
                            Ausverkauft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
