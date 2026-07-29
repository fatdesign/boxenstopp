import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, Clock } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const WORKER_URL = 'https://boxenstopp.f-klavun.workers.dev';

type Status = 'idle' | 'sending' | 'success' | 'error';

const getTimeOffset = (minutes: number) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} Uhr`;
};

const minutesOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const OrderModal: React.FC = () => {
  const { items, updateQty, removeItem, clearCart, totalPrice, isCartOpen, setIsCartOpen } = useOrder();
  const { openingHours } = useSiteSettings();

  // Dynamic hours based on today's opening hours from Admin Dashboard
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const todayHours = openingHours?.[days[now.getDay()]];

  const startHourInt = todayHours?.open ? parseInt(todayHours.open.split(':')[0], 10) : 8;
  const endHourInt = todayHours?.close ? parseInt(todayHours.close.split(':')[0], 10) : 18;

  const hoursOptions = Array.from(
    { length: Math.max(1, endHourInt - startHourInt + 1) },
    (_, i) => String(startHourInt + i).padStart(2, '0')
  );

  const defaultHour = String(
    Math.max(startHourInt, Math.min(endHourInt, now.getHours() < startHourInt ? startHourInt : now.getHours()))
  ).padStart(2, '0');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'pickup' | 'dineIn'>('pickup');
  const [company, setCompany] = useState('');
  const [pickupTime, setPickupTime] = useState('So schnell wie möglich');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [selectedHour, setSelectedHour] = useState(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState('30');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isCustomTime && !hoursOptions.includes(selectedHour)) {
      setSelectedHour(defaultHour);
    }
  }, [openingHours, isCustomTime]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const close = () => {
    setIsCartOpen(false);
    if (status === 'success') {
      setStatus('idle');
      setName('');
      setPhone('');
      setOrderType('pickup');
      setCompany('');
      setPickupTime('So schnell wie möglich');
      setIsCustomTime(false);
      setNote('');
    }
  };

  const handleSelectCustomTime = (h: string, m: string) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setPickupTime(`${h}:${m} Uhr`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !name.trim() || !phone.trim()) return;

    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${WORKER_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          orderType,
          company: company.trim(),
          pickupTime: pickupTime.trim() || 'So schnell wie möglich',
          note: note.trim(),
          items,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Bestellung konnte nicht gesendet werden.');
      }
      setStatus('success');
      clearCart();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen. Bitte ruf uns direkt an.');
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={close}
    >
      <div
        data-lenis-prevent
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-gray-100 z-10">
          <h2 className="font-display font-black text-2xl text-ink uppercase tracking-tight">
            {status === 'success' ? 'Bestellt!' : 'Deine Vorbestellung'}
          </h2>
          <button onClick={close} aria-label="Schließen" className="text-gray-400 hover:text-ink transition-colors">
            <X size={26} />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-6">
              <p className="text-lg font-medium text-ink mb-2">Danke{name ? `, ${name}` : ''}! 🏁</p>
              <p className="text-gray-600">
                Deine Bestellung ist raus – wir melden uns kurz telefonisch, sobald sie fertig ist.
              </p>
              <button
                onClick={close}
                className="mt-6 bg-lotteria-red text-white px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-lotteria-red/90 transition-colors"
              >
                Schließen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Dein Warenkorb ist leer.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-ink truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 font-mono">€ {item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQty(item.name, item.qty - 1)}
                          aria-label={`Menge von ${item.name} verringern`}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-lotteria-red hover:text-lotteria-red transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.name, item.qty + 1)}
                          aria-label={`Menge von ${item.name} erhöhen`}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-lotteria-red hover:text-lotteria-red transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.name)}
                        aria-label={`${item.name} entfernen`}
                        className="text-gray-300 hover:text-race transition-colors flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-ink uppercase text-sm tracking-wide">Gesamt</span>
                    <span className="font-display font-black text-xl text-lotteria-red">€ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Verzehrart Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Verzehrart *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-3 px-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'pickup'
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>🥡</span> Zum Mitnehmen
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('dineIn')}
                      className={`py-3 px-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'dineIn'
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>🍽️</span> Vor Ort essen
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Dein Name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-lotteria-red outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    🏢 Firmenname / Abteilung <span className="text-xs font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    type="text"
                    placeholder="z.B. Porsche Austria, Werkstatt..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-lotteria-red outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Telefonnummer *</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+43 ..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-lotteria-red outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Abholzeit *</label>
                  
                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTime(false);
                        setPickupTime('So schnell wie möglich');
                      }}
                      className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        !isCustomTime && pickupTime === 'So schnell wie möglich'
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>⚡</span> ASAP
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTime(false);
                        setPickupTime(`in 15 Min. (${getTimeOffset(15)})`);
                      }}
                      className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        !isCustomTime && pickupTime.startsWith('in 15 Min')
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>⏱️</span> +15 Min
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTime(false);
                        setPickupTime(`in 30 Min. (${getTimeOffset(30)})`);
                      }}
                      className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        !isCustomTime && pickupTime.startsWith('in 30 Min')
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>⏱️</span> +30 Min
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTime(true);
                        const h = selectedHour || String(new Date().getHours()).padStart(2, '0');
                        const m = selectedMinute || '00';
                        handleSelectCustomTime(h, m);
                      }}
                      className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isCustomTime
                          ? 'border-lotteria-red bg-lotteria-red text-white shadow-md shadow-lotteria-red/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>⏰</span> Wunschzeit
                    </button>
                  </div>

                  {/* Modern Segmented Time Selector */}
                  {isCustomTime && (
                    <div className="bg-lotteria-red/5 border-2 border-lotteria-red/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
                        <Clock size={18} className="text-lotteria-red" />
                        <span>Gewünschte Uhrzeit:</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Hour Dropdown */}
                        <select
                          value={selectedHour}
                          onChange={(e) => handleSelectCustomTime(e.target.value, selectedMinute)}
                          className="bg-white border-2 border-gray-200 rounded-xl px-2.5 py-1.5 text-base font-black text-ink outline-none focus:border-lotteria-red cursor-pointer shadow-sm"
                        >
                          {hoursOptions.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>

                        <span className="font-black text-xl text-lotteria-red">:</span>

                        {/* Minute Dropdown */}
                        <select
                          value={selectedMinute}
                          onChange={(e) => handleSelectCustomTime(selectedHour, e.target.value)}
                          className="bg-white border-2 border-gray-200 rounded-xl px-2.5 py-1.5 text-base font-black text-ink outline-none focus:border-lotteria-red cursor-pointer shadow-sm"
                        >
                          {minutesOptions.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>

                        <span className="font-bold text-sm text-gray-700 ml-0.5">Uhr</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Anmerkung (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="z.B. ohne Zwiebel"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-lotteria-red outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-race text-sm font-medium bg-race/5 border border-race/20 rounded-xl px-4 py-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={items.length === 0 || status === 'sending'}
                className="w-full bg-lotteria-red text-white py-4 rounded-full font-display font-bold uppercase tracking-wide hover:bg-lotteria-red/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Wird gesendet…' : 'Vorbestellung abschicken'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
