import React, { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { getCurrentStatus } from '../utils/timeUtils';
import type { OpenStatus } from '../utils/timeUtils';
import { DINER_INFO } from '../config/dinerConfig';
import { cn } from './Startlights';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState<OpenStatus>(getCurrentStatus());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setStatus(getCurrentStatus()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: 'Speisekarte', href: '#speisekarte' }, { name: 'Tagesangebot', href: '#tagesangebot' },
    { name: 'Standort', href: '#standort' }, { name: 'Öffnungszeiten', href: '#zeiten' },
  ];

  return (
    <header className={cn("fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent", isScrolled ? "bg-asphalt/90 backdrop-blur-md border-white/10 shadow-lg py-3" : "bg-transparent py-5")}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#" className="font-display font-black text-2xl tracking-tighter text-white uppercase leading-none">Boxenstopp<span className="block text-[0.65rem] text-race tracking-widest mt-0.5">im Handelszentrum</span></a>
          <div className="hidden md:flex items-center gap-2 bg-ink/50 rounded-full px-3 py-1 border border-white/5">
            <span className={cn("w-2 h-2 rounded-full animate-pulse", status.status === 'open' ? 'bg-green-500' : status.status === 'closing-soon' ? 'bg-amber' : 'bg-red-500')} />
            <span className="text-xs font-mono text-white/70">{status.message}</span>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => <a key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">{link.name}</a>)}
          <a href={`tel:${DINER_INFO.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 bg-race hover:bg-race-700 text-white px-5 py-2 rounded-md font-bold text-sm transition-all speed-cut shadow-lg shadow-race/20"><Phone size={16} /> Bestellen</a>
        </nav>
        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-asphalt border-b border-white/10 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(link => <a key={link.name} href={link.href} className="text-lg font-medium text-white/80 hover:text-white py-2 border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</a>)}
            <div className="flex items-center gap-2 py-2">
               <span className={cn("w-3 h-3 rounded-full", status.status === 'open' ? 'bg-green-500' : status.status === 'closing-soon' ? 'bg-amber' : 'bg-red-500')} />
              <span className="text-sm font-mono text-white/90">{status.message}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};