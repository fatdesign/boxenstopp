import React, { useRef, useEffect, useState } from 'react';
import { DINER_INFO } from '../config/dinerConfig';
import { scrollToId } from '../utils/scrollToId';

const SCROLL_ITEMS = [
  { id: 1, type: 'image', src: 'images/schnitzel.png', shape: 'rounded-[100px] rounded-tl-none' },
  { id: 2, type: 'image', src: 'images/burger_combo.png', shape: 'rounded-full' },
  { id: 3, type: 'image', src: 'images/burger.png', shape: 'rounded-[40px]' },
  { id: 4, type: 'image', src: 'images/fries.png', shape: 'rounded-t-full rounded-b-xl' },
  { id: 5, type: 'image', src: 'images/burger.png', shape: 'rounded-br-[80px] rounded-tl-[80px]' } // Placeholder for Pastrami Toast
];

export const HorizontalScrollSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const maxScroll = height - windowHeight;
      const scrolled = -top;
      
      if (scrolled < 0) {
        setScrollProgress(0);
      } else if (scrolled > maxScroll) {
        setScrollProgress(1);
      } else {
        setScrollProgress(scrolled / maxScroll);
      }
    };
    
    const updateDimensions = () => {
      if (scrollTrackRef.current) {
        const trackWidth = scrollTrackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        // Stop before the image reaches the center (leaving a ~180px gap on the right of the window)
        setMaxTranslate(Math.max(0, trackWidth - windowWidth + 180));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateDimensions);
    
    // Initial calls
    handleScroll();
    // small timeout to ensure DOM layout is complete before measuring
    setTimeout(updateDimensions, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-lotteria-red h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        
        <div className="px-4 sm:px-8 md:px-16 mb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-black text-6xl md:text-8xl text-lotteria-yellow uppercase tracking-tighter leading-[0.9]">
              ES KANN<br />NUR<br />SCHMECKN
            </h2>
          </div>
          <div className="text-white max-w-lg space-y-6">
            <p className="font-medium text-lg leading-relaxed">
              {DINER_INFO.name} ist die perfekte Kombination aus Schnelligkeit und meisterhaftem Geschmack – frisch, echt und in höchster Qualität.
            </p>
            <p className="font-medium text-lg leading-relaxed">
              Wir bringen die Leidenschaft für echte Original Burger und knusprige Snacks direkt zu dir im Handelszentrum Bergheim.
            </p>
            <a href="#menu" onClick={(e) => { e.preventDefault(); scrollToId('menu'); }} className="inline-block bg-white text-lotteria-red px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg">
              Unsere Speisen
            </a>
          </div>
        </div>

        <div className="flex w-full mt-8">
          <div 
            ref={scrollTrackRef}
            className="flex gap-8 px-4 sm:px-8 md:px-16 w-max"
            style={{ 
              transform: `translateX(-${scrollProgress * maxTranslate}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {SCROLL_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className={`w-[85vw] sm:w-[520px] h-[400px] flex-shrink-0 bg-white overflow-hidden shadow-2xl ${item.shape}`}
              >
                <img 
                  src={item.src} 
                  alt="Boxenstopp Impression" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
