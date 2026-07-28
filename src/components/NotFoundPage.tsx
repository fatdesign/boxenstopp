import React from 'react';
import { Link } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { Reveal } from './Reveal';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-lotteria-red min-h-[80vh] flex items-center justify-center relative overflow-hidden pt-24">
      <div className="checkered-flag absolute inset-x-0 top-0 h-3 md:h-4" aria-hidden="true" />
      <div className="checkered-flag absolute inset-x-0 bottom-0 h-3 md:h-4" aria-hidden="true" />

      <Reveal className="text-center px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-4 border-lotteria-yellow">
            <Flag size={36} className="text-lotteria-yellow" />
          </div>
        </div>
        <h1 className="font-display font-black text-7xl sm:text-9xl text-lotteria-yellow uppercase tracking-tighter leading-none mb-4">
          404
        </h1>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mb-4">
          Diese Box gibt's nicht
        </h2>
        <p className="text-white/80 font-medium text-base sm:text-lg mb-10 max-w-md mx-auto">
          Falsche Boxengasse erwischt. Diese Seite existiert nicht (mehr) – zurück an die Box geht's hier lang.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-white text-lotteria-red px-8 py-4 rounded-full font-display font-bold text-base sm:text-lg uppercase tracking-wide hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          Zurück zur Box
        </Link>
      </Reveal>
    </div>
  );
};
