import React, { createContext, useContext, useEffect, useState } from 'react';
import { DINER_INFO } from '../config/dinerConfig';
import type { OpeningHours, ContactInfo } from '../config/dinerConfig';

interface SiteSettingsContextValue {
  openingHours: OpeningHours;
  contact: ContactInfo;
  loading: boolean;
}

const DEFAULT_CONTACT: ContactInfo = {
  name: DINER_INFO.name,
  slogan: DINER_INFO.slogan,
  phone: DINER_INFO.phone,
  address: DINER_INFO.address,
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  openingHours: DINER_INFO.openingHours,
  contact: DEFAULT_CONTACT,
  loading: true,
});

interface RawSettings {
  openingHours?: OpeningHours;
  name?: string;
  slogan?: string;
  phone?: string;
  address?: { street?: string; city?: string; zip?: string };
}

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openingHours, setOpeningHours] = useState<OpeningHours>(DINER_INFO.openingHours);
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applySettings = (data: { settings?: RawSettings }) => {
      const s = data.settings;
      if (s?.openingHours) setOpeningHours(s.openingHours);
      if (s?.name || s?.slogan || s?.phone || s?.address) {
        setContact(prev => ({
          name: s.name || prev.name,
          slogan: s.slogan || prev.slogan,
          phone: s.phone || prev.phone,
          address: {
            street: s.address?.street || prev.address.street,
            city: s.address?.city || prev.address.city,
            zip: s.address?.zip || prev.address.zip,
          },
        }));
      }
      setLoading(false);
    };

    fetch('https://boxenstopp.f-klavun.workers.dev')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(applySettings)
      .catch(err => {
        console.warn('Worker fetch failed, falling back to local menu.json', err);
        fetch('menu.json')
          .then(res => res.json())
          .then(applySettings)
          .catch(fallbackErr => {
            console.error('Failed to load local menu.json fallback', fallbackErr);
            setLoading(false);
          });
      });
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ openingHours, contact, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
