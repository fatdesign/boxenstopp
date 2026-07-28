import React from 'react';
import { Reveal } from './Reveal';

export const DatenschutzPage: React.FC = () => {
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
            Datenschutz
          </h1>
          <p className="font-medium text-base sm:text-lg text-lotteria-red/70 tracking-widest uppercase">
            Datenschutzerklärung gemäß DSGVO
          </p>
        </Reveal>

        <Reveal delay={100} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-lotteria-yellow/30 space-y-8">
          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Verantwortlicher
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <address className="not-italic text-ink/80 leading-relaxed mt-2">
              Metin Sari<br />
              Handelszentrum 4<br />
              5101 Bergheim bei Salzburg<br />
              Telefon: <a href="tel:+436604871477" className="text-lotteria-red hover:underline">+43 660 4871477</a>
            </address>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Allgemeines
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Diese Website verwendet <strong>keine Cookies</strong>, kein Analyse- oder Tracking-Tool und
              kein Kontaktformular. Es werden keine Nutzerprofile erstellt und keine Daten an
              Werbenetzwerke weitergegeben. Personenbezogene Daten fallen nur in dem Umfang an, wie es
              für den technischen Betrieb der Website unvermeidbar ist (siehe unten).
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Hosting
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Diese Website wird über <strong>GitHub Pages</strong> (GitHub Inc., USA) bereitgestellt.
              Beim Aufruf der Seite verarbeitet der Hosting-Anbieter automatisch technische Daten wie
              IP-Adresse, Browsertyp, aufgerufene Seite und Zugriffszeitpunkt in sogenannten
              Server-Logfiles. Diese Daten sind für den technischen Betrieb und die Sicherheit der
              Website erforderlich (Art. 6 Abs. 1 lit. f DSGVO) und werden nicht mit anderen
              Datenquellen zusammengeführt.
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Speisekarte &amp; Tagesangebote
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Die Inhalte der Speisekarte werden dynamisch über einen <strong>Cloudflare Worker</strong>{' '}
              (Cloudflare, Inc., USA) geladen. Auch dabei wird technisch bedingt die IP-Adresse des
              aufrufenden Geräts an Cloudflare übermittelt. Es werden keine weiteren personenbezogenen
              Daten übertragen oder gespeichert – die abgerufenen Inhalte betreffen ausschließlich
              Speisen, Preise und Öffnungszeiten.
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Schriftarten
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Alle auf dieser Website verwendeten Schriftarten sind <strong>lokal eingebunden</strong>{' '}
              und werden nicht von externen Servern (z. B. Google Fonts) nachgeladen. Beim Besuch dieser
              Website werden dadurch keine Daten an Drittanbieter zu diesem Zweck übertragen.
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Ihre Rechte
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten,
              deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Ebenso haben Sie ein
              Recht auf Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
              sowie Widerspruch gegen die Verarbeitung. Bei Fragen zum Datenschutz können Sie sich
              jederzeit unter den oben genannten Kontaktdaten an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="font-display font-black text-xl text-lotteria-red uppercase tracking-tight mb-3">
              Beschwerderecht
            </h2>
            <p className="text-ink/80 leading-relaxed">
              Sie haben das Recht, sich bei der österreichischen Datenschutzbehörde zu beschweren, wenn
              Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt:{' '}
              <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-lotteria-red hover:underline">
                www.dsb.gv.at
              </a>
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
};
