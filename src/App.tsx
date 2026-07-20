import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HorizontalScrollSection } from './components/HorizontalScrollSection';
import { MenuSection } from './components/MenuSection';
import { DailySpecials } from './components/DailySpecials';
import { InfoSection } from './components/InfoSection';
import { MarqueeSection } from './components/MarqueeSection';
import { Footer } from './components/Footer';

const Home = () => (
  <>
    <Hero />
    <MenuSection />
    <HorizontalScrollSection />
    <DailySpecials />
    <InfoSection />
  </>
);

import { FullMenuPage } from './components/FullMenuPage';

const MenuPage = () => (
  <div>
    <FullMenuPage />
  </div>
);

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-paper text-ink font-body selection:bg-race selection:text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/speisekarte" element={<MenuPage />} />
          </Routes>
        </main>
        <MarqueeSection />
        <Footer />
      </div>
    </Router>
  );
}

export default App;