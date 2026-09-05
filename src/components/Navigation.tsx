import { useState, useEffect } from 'react';
import PillNav from './ui/PillNav';
import logo from '../assets/logo.svg';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation = () => {
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => {
        const id = item.href.substring(1);
        return document.getElementById(id);
      });
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveHref(navItems[i].href);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PillNav
      logo={logo}
      logoAlt="Portfolio Logo"
      items={navItems}
      activeHref={activeHref}
      baseColor="#000000"
      pillColor="#ffffff"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#000000"
      ease="power2.easeOut"
      initialLoadAnimation={true}
    />
  );
};

