import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { getCurrentStatus } from '../utils/timeUtils';
import type { OpenStatus } from '../utils/timeUtils';
import { DINER_INFO } from '../config/dinerConfig';
import { cn } from '../utils/cn';

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
    { name: 'Speisekarte', to: '/speisekarte' }, 
    { name: 'Tagesangebot', to: '/#tagesangebot' },
    { name: 'Standort', to: '/#standort' }, 
    { name: 'Öffnungszeiten', to: '/#zeiten' },
  ];

  return (
    <header className={cn("fixed top-0 w-full z-50 transition-all duration-300 border-b", isScrolled ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-md py-2" : "bg-white border-gray-100 shadow-sm py-2.5 md:py-3.5")}>
      <div className="max-w-[1400px] mx-auto pl-2 sm:pl-3 md:pl-4 pr-4 sm:pr-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img src="images/boxenstopp_logo.png" alt="Boxenstopp Logo" className="h-16 md:h-18 lg:h-20 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-8 mx-auto">
          {navLinks.map(link => (
            link.to.startsWith('/') && !link.to.startsWith('/#') ? (
              <Link key={link.name} to={link.to} className="text-[15px] md:text-base font-bold text-gray-700 hover:text-race transition-colors uppercase tracking-wide">{link.name}</Link>
            ) : (
              <a key={link.name} href={link.to} className="text-[15px] md:text-base font-bold text-gray-700 hover:text-race transition-colors uppercase tracking-wide">{link.name}</a>
            )
          ))}
        </nav>

        {/* Right: Bestellen Button & Status Badge at Far Right */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <a href={`tel:${DINER_INFO.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 bg-race hover:bg-race-700 text-white px-5 py-2.5 rounded-md font-bold text-[15px] md:text-base transition-all speed-cut shadow-md shadow-race/20">
            <Phone size={18} /> Bestellen
          </a>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-1.5 border border-gray-200 shadow-sm">
            <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", status.status === 'open' ? 'bg-green-500' : status.status === 'closing-soon' ? 'bg-amber' : 'bg-red-500')} />
            <span className="text-xs font-mono text-gray-700 font-medium">{status.message}</span>
          </div>
        </div>

        <button className="lg:hidden text-ink" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(link => (
              link.to.startsWith('/') && !link.to.startsWith('/#') ? (
                <Link key={link.name} to={link.to} className="text-lg font-bold text-gray-700 hover:text-race uppercase py-2 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>
              ) : (
                <a key={link.name} href={link.to} className="text-lg font-bold text-gray-700 hover:text-race uppercase py-2 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</a>
              )
            ))}
            <div className="flex items-center gap-2 py-2">
               <span className={cn("w-3 h-3 rounded-full", status.status === 'open' ? 'bg-green-500' : status.status === 'closing-soon' ? 'bg-amber' : 'bg-red-500')} />
              <span className="text-sm font-mono text-gray-700 font-medium">{status.message}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};