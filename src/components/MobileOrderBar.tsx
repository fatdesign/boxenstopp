import React from 'react';
import { Phone, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const MobileOrderBar: React.FC = () => {
  const { contact } = useSiteSettings();

  return (
    <div className="no-print lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex">
      <Link
        to="/speisekarte"
        className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold uppercase text-sm tracking-wide text-ink active:bg-gray-100 transition-colors"
      >
        <UtensilsCrossed size={18} /> Speisekarte
      </Link>
      <a
        href={`tel:${contact.phone.replace(/\s+/g, '')}`}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-race text-white font-bold uppercase text-sm tracking-wide active:scale-95 transition-transform speed-cut"
      >
        <Phone size={18} /> Bestellen
      </a>
    </div>
  );
};
