import React, { createContext, useContext, useEffect, useState } from 'react';
import { DINER_INFO } from '../config/dinerConfig';
import type { OpeningHours } from '../config/dinerConfig';

interface SiteSettingsContextValue {
  openingHours: OpeningHours;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  openingHours: DINER_INFO.openingHours,
  loading: true,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openingHours, setOpeningHours] = useState<OpeningHours>(DINER_INFO.openingHours);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applySettings = (data: { settings?: { openingHours?: OpeningHours } }) => {
      if (data.settings?.openingHours) {
        setOpeningHours(data.settings.openingHours);
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
    <SiteSettingsContext.Provider value={{ openingHours, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
