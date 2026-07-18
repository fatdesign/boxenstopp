import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DailySpecials } from './components/DailySpecials';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-ink text-white font-body selection:bg-race selection:text-white">
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <DailySpecials />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;