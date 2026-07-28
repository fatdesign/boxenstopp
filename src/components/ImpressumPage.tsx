import React from 'react';
import { Reveal } from './Reveal';

export const ImpressumPage: React.FC = () => {
  return (
    <div className="bg-lotteria-bg min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[30%] bg-lotteria-red rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-lotteria-yellow rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <Reveal className="text-center mb-12 sm:mb-16 border-b-2 border-lotteria-red/10 pb-8 sm:pb-12">
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase text-lotteria-red tracking-tighter mb-4">
            Impressum
          </h1>
          <p className="font-medium text-base sm:text-lg text-lotteria-red/70 tracking-widest uppercase">
            Offenlegung gemäß § 5 ECG
          </p>
        </Reveal>

        <Reveal delay={100} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-lotteria-yellow/30 space-y-8">
          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Diensteanbieter
            </h2>
            <address className="not-italic text-ink/80 leading-relaxed">
              Metin Sari<br />
              Handelszentrum 4<br />
              5101 Bergheim bei Salzburg<br />
              Österreich
            </address>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Kontakt
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Telefon: <a href="tel:+436604871477" className="text-lotteria-red hover:underline">+43 660 4871477</a>
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Unternehmensgegenstand
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Gastronomie / Imbissbetrieb
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Gewerbebehörde
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Bezirkshauptmannschaft Salzburg-Umgebung
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Anwendbare Rechtsvorschriften
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Gewerbeordnung 1994 (GewO), abrufbar unter{' '}
              <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-lotteria-red hover:underline">
                www.ris.bka.gv.at
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Mitgliedschaft
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Mitglied der Wirtschaftskammer Salzburg
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              EU-Streitschlichtung
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, abrufbar unter{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-lotteria-red hover:underline">
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
};
