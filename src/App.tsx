import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { Services } from './sections/Services';
import { Portfolio } from './sections/Portfolio';
import { Experience } from './sections/Experience';
import { Stack } from './sections/Stack';
import { Blog } from './sections/Blog';
import { Contact } from './sections/Contact';
import { Admin } from './pages/Admin';
import { NotificationProvider } from './contexts/NotificationContext';

function PortfolioApp() {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Navigation />
      <main>
        <Home />
        <About />
        <Services />
        <Portfolio />
        <Experience />
        <Stack />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioApp />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
