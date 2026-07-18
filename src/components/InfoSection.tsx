import React from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { DINER_INFO } from '../config/dinerConfig';

export const InfoSection: React.FC = () => {
  const days = [
    { key: 'monday', label: 'Montag' }, { key: 'tuesday', label: 'Dienstag' }, { key: 'wednesday', label: 'Mittwoch' },
    { key: 'thursday', label: 'Donnerstag' }, { key: 'friday', label: 'Freitag' }, { key: 'saturday', label: 'Samstag' }, { key: 'sunday', label: 'Sonntag' },
  ];
  const currentDayIndex = new Date().getDay();
  const currentDayKey = currentDayIndex === 0 ? 'sunday' : days[currentDayIndex - 1].key;

  return (
    <section id="standort" className="py-24 bg-ink relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-6 text-white"><MapPin size={32} className="text-race" /><h2 className="font-display font-black text-4xl uppercase tracking-tight">Standort</h2></div>
            <p className="text-white/70 text-lg mb-8">Direkt im Handelszentrum Bergheim – gut erreichbar beim Einkauf oder für den kurzen Boxenstopp zwischendurch.</p>
            <div className="glassmorphic-card p-6 speed-cut mb-8 border-l-4 border-l-race"><h3 className="font-bold text-white text-xl mb-2">{DINER_INFO.name}</h3><p className="text-white/60 mb-1">{DINER_INFO.address.street}</p><p className="text-white/60">{DINER_INFO.address.zip} {DINER_INFO.address.city}</p></div>
            <a href="https://www.google.com/maps/search/?api=1&query=Handelszentrum+Bergheim+Salzburg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-ink hover:bg-race hover:text-white px-8 py-4 font-display font-bold text-sm uppercase tracking-wide transition-all speed-cut"><Navigation size={18} /> In Maps öffnen</a>
          </div>
          <div id="zeiten" className="lg:pl-12 lg:border-l border-white/10">
            <div className="flex items-center gap-3 mb-6 text-white"><Clock size={32} className="text-amber" /><h2 className="font-display font-black text-4xl uppercase tracking-tight">Boxengasse geöffnet</h2></div>
            <div className="glassmorphic-card p-8 speed-cut mb-8">
              <ul className="space-y-4">
                {days.map((day) => {
                  const hours = (DINER_INFO.openingHours as any)[day.key];
                  const isToday = day.key === currentDayKey;
                  return (
                    <li key={day.key} className={`flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0 ${isToday ? 'text-white font-bold' : 'text-white/60'}`}>
                      <span className="flex items-center gap-2">{isToday && <span className="w-1.5 h-1.5 rounded-full bg-race inline-block"></span>}{day.label}</span>
                      <span className="font-mono">{hours ? `${hours.open} - ${hours.close} Uhr` : 'Geschlossen'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl speed-cut relative h-64 group">
              <div className="absolute inset-0 bg-ink/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img src="/images/location-diner.jpg" alt="Standort & Außenansicht" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};