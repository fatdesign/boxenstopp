import React from 'react';
import { Phone, UtensilsCrossed } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DINER_INFO } from '../config/dinerConfig';
import { scrollToId } from '../utils/scrollToId';

export const MobileOrderBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToId('menu'), 150);
    } else {
      scrollToId('menu');
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex">
      <a
        href="#menu"
        onClick={handleMenuClick}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold uppercase text-sm tracking-wide text-ink active:bg-gray-100 transition-colors"
      >
        <UtensilsCrossed size={18} /> Speisekarte
      </a>
      <a
        href={`tel:${DINER_INFO.phone.replace(/\s+/g, '')}`}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-race text-white font-bold uppercase text-sm tracking-wide active:scale-95 transition-transform speed-cut"
      >
        <Phone size={18} /> Bestellen
      </a>
    </div>
  );
};
