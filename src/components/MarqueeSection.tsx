import React from 'react';

export const MarqueeSection: React.FC = () => {
  // We duplicate the text multiple times to ensure a smooth infinite scroll
  // The animation translates -50%, so the content needs to be exactly duplicated once (or just have enough items so -50% is a seamless loop)
  const textItems = Array(8).fill("FAVORITES IN HERE FEEL THE TASTE OF JOY!");

  return (
    <div className="bg-lotteria-bg py-6 border-b border-gray-200 overflow-hidden relative flex">
      {/* 
        The animate-marquee class applies a linear transform from 0 to -50%.
        By having a wide enough container with duplicated content, 
        shifting it by 50% left creates a perfect seamless loop. 
      */}
      <div className="flex whitespace-nowrap animate-marquee items-center w-max">
        {/* First Set */}
        <div className="flex items-center">
          {textItems.map((text, i) => (
            <React.Fragment key={`set1-${i}`}>
              <span className="font-display font-black text-4xl md:text-5xl text-lotteria-red uppercase tracking-tighter px-8">
                {text}
              </span>
              <span className="w-3 h-3 bg-lotteria-yellow rounded-full inline-block"></span>
            </React.Fragment>
          ))}
        </div>
        {/* Second Set (Exact Duplicate for Seamless Loop) */}
        <div className="flex items-center">
          {textItems.map((text, i) => (
            <React.Fragment key={`set2-${i}`}>
              <span className="font-display font-black text-4xl md:text-5xl text-lotteria-red uppercase tracking-tighter px-8">
                {text}
              </span>
              <span className="w-3 h-3 bg-lotteria-yellow rounded-full inline-block"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
