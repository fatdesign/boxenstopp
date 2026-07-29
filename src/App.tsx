import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HorizontalScrollSection } from './components/HorizontalScrollSection';
import { MenuSection } from './components/MenuSection';
import { DailySpecials } from './components/DailySpecials';
import { InfoSection } from './components/InfoSection';
import { MarqueeSection } from './components/MarqueeSection';
import { Footer } from './components/Footer';
import { MobileOrderBar } from './components/MobileOrderBar';
import { CheckeredDivider } from './components/CheckeredDivider';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { OrderProvider } from './context/OrderContext';
import { CartButton } from './components/CartButton';
import { OrderModal } from './components/OrderModal';

const Home = () => (
  <>
    <Hero />
    <CheckeredDivider />
    <MenuSection />
    <HorizontalScrollSection />
    <CheckeredDivider />
    <DailySpecials />
    <InfoSection />
  </>
);

import { FullMenuPage } from './components/FullMenuPage';
import { ImpressumPage } from './components/ImpressumPage';
import { DatenschutzPage } from './components/DatenschutzPage';
import { NotFoundPage } from './components/NotFoundPage';
import { LoadingScreen } from './components/LoadingScreen';

const MenuPage = () => (
  <div>
    <FullMenuPage />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/speisekarte" element={<MenuPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenisInstance } from './utils/lenis';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
  return (
    <SiteSettingsProvider>
      <OrderProvider>
        <Router>
          <LoadingScreen />
          <div className="min-h-screen bg-paper text-ink font-body selection:bg-race selection:text-white">
            <Header />
            <main className="pb-16 lg:pb-0">
              <AnimatedRoutes />
            </main>
            <MarqueeSection />
            <Footer />
            <MobileOrderBar />
            <CartButton />
            <OrderModal />
          </div>
        </Router>
      </OrderProvider>
    </SiteSettingsProvider>
  );
}

export default App;