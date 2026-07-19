import React from 'react';
import { DINER_INFO } from '../config/dinerConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink border-t border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div><h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight mb-2">Boxenstopp</h3><p className="text-gray-400 text-sm max-w-xs">{DINER_INFO.slogan} <br/>Dein schneller Imbiss-Stopp im Handelszentrum Bergheim für warme Snacks, frische Speisen und die perfekte Pause.</p></div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Standort</h4>
            <address className="not-italic text-gray-400 text-sm space-y-1"><p>{DINER_INFO.name}</p><p>{DINER_INFO.address.street}</p><p>{DINER_INFO.address.zip} {DINER_INFO.address.city}</p><p className="pt-2 text-race hover:text-race-700 transition-colors"><a href={`tel:${DINER_INFO.phone.replace(/\\s+/g, '')}`}>{DINER_INFO.phone}</a></p></address>
          </div>
          <div><h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Links & Rechtliches</h4><ul className="space-y-2 text-sm text-gray-400"><li><a href="/admin/index.html" className="hover:text-white transition-colors">Admin Dashboard</a></li><li><a href="#" className="hover:text-white transition-colors">Impressum</a></li><li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li></ul></div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} {DINER_INFO.name}. Alle Rechte vorbehalten.</p>
          <p className="text-gray-500 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-race inline-block"></span> Bergheim bei Salzburg</p>
        </div>
      </div>
    </footer>
  );
};