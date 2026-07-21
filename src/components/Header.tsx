import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { getCurrentStatus } from '../utils/timeUtils';
import type { OpenStatus } from '../utils/timeUtils';
import { DINER_INFO } from '../config/dinerConfig';
import { cn } from '../utils/cn';
import { scrollToId } from '../utils/scrollToId';
import { useSiteSettings } from '../context/SiteSettingsContext';

const SECTION_IDS = ['menu', 'tagesangebot', 'standort', 'zeiten'];

export const Header: React.FC = () => {
  const { openingHours } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState<OpenStatus>(() => getCurrentStatus(openingHours));
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setStatus(getCurrentStatus(openingHours));
    const timer = setInterval(() => setStatus(getCurrentStatus(openingHours)), 60000);
    return () => clearInterval(timer);
  }, [openingHours]);

  useEffect(() => {
    const handleSpy = () => {
      const scrollY = window.scrollY + 130;
      let current = '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleSpy, { passive: true });
    handleSpy();
    return () => window.removeEventListener('scroll', handleSpy);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Speisekarte', to: '/speisekarte' },
    { name: 'Tagesangebot', to: '/#tagesangebot' },
    { name: 'Standort', to: '/#standort' },
    { name: 'Öffnungszeiten', to: '/#zeiten' },
  ];

  const isLinkActive = (to: string) => {
    if (to === '/speisekarte') return location.pathname.startsWith('/speisekarte');
    const hash = to.split('#')[1];
    return location.pathname === '/' && hash === activeSection;
  };

  const handleAnchorClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    const id = to.split('#')[1];
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToId(id), 150);
    } else {
      scrollToId(id);
    }
  };

  return (
    <header className={cn("fixed top-0 w-full z-50 transition-all duration-300 border-b", isScrolled ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-md py-2" : "bg-white border-gray-100 shadow-sm py-2.5 md:py-3.5")}>
      <div className="max-w-[1400px] mx-auto pl-2 sm:pl-3 md:pl-4 pr-4 sm:pr-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="images/boxenstopp_logo.png" alt="Boxenstopp Logo" className="h-16 md:h-18 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2" />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-8 mx-auto">
          {navLinks.map(link => {
            const active = isLinkActive(link.to);
            const linkClass = cn(
              "relative text-[15px] md:text-base font-bold uppercase tracking-wide transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-race after:transition-all after:duration-300",
              active ? "text-race after:w-full" : "text-gray-700 hover:text-race after:w-0 hover:after:w-full"
            );
            return link.to.startsWith('/') && !link.to.startsWith('/#') ? (
              <Link key={link.name} to={link.to} className={linkClass}>{link.name}</Link>
            ) : (
              <a key={link.name} href={link.to} onClick={(e) => handleAnchorClick(e, link.to)} className={linkClass}>{link.name}</a>
            );
          })}
        </nav>

        {/* Right: Bestellen Button & Status Badge at Far Right */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <a href={`tel:${DINER_INFO.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 bg-race hover:bg-race-700 active:scale-95 text-white px-5 py-2.5 rounded-md font-bold text-[15px] md:text-base transition-all speed-cut shadow-md shadow-race/20">
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-[slide-up_0.3s_ease-out_forwards]">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(link => {
              const active = isLinkActive(link.to);
              const mobileClass = cn(
                "text-lg font-bold uppercase py-2 border-b border-gray-100 transition-colors",
                active ? "text-race" : "text-gray-700 hover:text-race"
              );
              return link.to.startsWith('/') && !link.to.startsWith('/#') ? (
                <Link key={link.name} to={link.to} className={mobileClass} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>
              ) : (
                <a key={link.name} href={link.to} className={mobileClass} onClick={(e) => handleAnchorClick(e, link.to)}>{link.name}</a>
              );
            })}
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