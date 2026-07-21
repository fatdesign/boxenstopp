import React from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { DINER_INFO } from '../config/dinerConfig';
import { Reveal } from './Reveal';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const InfoSection: React.FC = () => {
  const { openingHours } = useSiteSettings();
  const days = [
    { key: 'monday', label: 'Montag' }, { key: 'tuesday', label: 'Dienstag' }, { key: 'wednesday', label: 'Mittwoch' },
    { key: 'thursday', label: 'Donnerstag' }, { key: 'friday', label: 'Freitag' }, { key: 'saturday', label: 'Samstag' }, { key: 'sunday', label: 'Sonntag' },
  ];
  const currentDayIndex = new Date().getDay();
  const currentDayKey = currentDayIndex === 0 ? 'sunday' : days[currentDayIndex - 1].key;

  return (
    <section id="standort" className="py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-6 text-ink"><MapPin size={32} className="text-race" /><h2 className="font-display font-black text-4xl uppercase tracking-tight">Standort</h2></div>
            <p className="text-gray-600 font-medium text-lg mb-8">Direkt im Handelszentrum Bergheim – gut erreichbar beim Einkauf oder für den kurzen Boxenstopp zwischendurch.</p>
            <div className="bg-gray-50 p-6 speed-cut mb-8 border-l-4 border-l-race border border-gray-200 shadow-sm"><h3 className="font-bold text-ink text-xl mb-2">{DINER_INFO.name}</h3><p className="text-gray-600 font-medium mb-1">{DINER_INFO.address.street}</p><p className="text-gray-600 font-medium">{DINER_INFO.address.zip} {DINER_INFO.address.city}</p></div>
            <a href="https://www.google.com/maps/search/?api=1&query=Handelszentrum+Bergheim+Salzburg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-race text-white hover:bg-race-700 active:scale-95 px-8 py-4 font-display font-bold text-sm uppercase tracking-wide transition-all speed-cut shadow-md shadow-race/20"><Navigation size={18} /> In Maps öffnen</a>
          </Reveal>
          <Reveal delay={150} id="zeiten" className="lg:pl-12 lg:border-l border-gray-200">
            <div className="flex items-center gap-3 mb-6 text-ink"><Clock size={32} className="text-amber-500" /><h2 className="font-display font-black text-4xl uppercase tracking-tight">Öffnungszeiten</h2></div>
            <div className="bg-white p-8 speed-cut mb-8 border border-gray-200 shadow-md">
              <ul className="space-y-4">
                {days.map((day) => {
                  const hours = (openingHours as any)[day.key];
                  const isToday = day.key === currentDayKey;
                  return (
                    <li key={day.key} className={`flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0 ${isToday ? 'text-ink font-bold' : 'text-gray-500 font-medium'}`}>
                      <span className="flex items-center gap-2">{isToday && <span className="w-1.5 h-1.5 rounded-full bg-race inline-block animate-pulse"></span>}{day.label}</span>
                      <span className="font-mono">{hours ? `${hours.open} - ${hours.close} Uhr` : 'Geschlossen'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg speed-cut relative h-64 group">
              <div className="absolute inset-0 bg-ink/5 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img src="images/location-diner.jpg" alt="Standort & Außenansicht" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};