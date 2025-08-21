'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Dodaj/usuń klasę dark z elementu html
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
      console.log('Dark mode enabled, classes added:', document.documentElement.classList.toString());
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('darkMode', 'false');
      console.log('Light mode enabled, classes added:', document.documentElement.classList.toString());
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const header = document.querySelector('.header');
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      const targetPosition = window.scrollY + element.getBoundingClientRect().top - headerHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Odczytaj stan z DOM ustawiony przez skrypt pre-hydration
    const root = document.documentElement;
    const hasDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
    setIsDarkMode(hasDark);
    // Ensure pages reserve space for the fixed header to avoid content overlap
    try {
      document.documentElement.classList.add('has-fixed-header');
    } catch (err) {
      // noop
    }
  }, []);

  // Close menu on Escape and handle outside clicks
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const onClickOutside = (e: MouseEvent) => {
      if (!isMenuOpen) return;
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isMenuOpen]);

  // Synchronizacja trybu: system + inne karty (tylko gdy brak ręcznego wyboru)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (useDark: boolean) => {
      setIsDarkMode(useDark);
      if (useDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    const systemChange = (e: MediaQueryListEvent) => {
      const manual = localStorage.getItem('darkMode');
      if (manual === null) {
        applyTheme(e.matches);
      }
    };

    const storageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        const val = e.newValue;
        if (val === 'true') applyTheme(true);
        if (val === 'false') applyTheme(false);
      }
    };

    mql.addEventListener('change', systemChange);
    window.addEventListener('storage', storageChange);
    return () => {
      mql.removeEventListener('change', systemChange);
      window.removeEventListener('storage', storageChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header__content flex-header">
          {/* Left: Logo */}
          <div className="header__flex-left">
            <div className="header__logo" style={{ display: 'flex', alignItems: 'center' }}>
              <a href="#home" aria-label="Wentitech - Strona główna" onClick={(e) => { e.preventDefault(); handleLogoClick(); }} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <Image
                  src="/assets/logo_black.png"
                  alt="Wentitech logo"
                  width={48}
                  height={48}
                  priority
                  className="header__logo-img"
                />
              </a>
            </div>
          </div>

          {/* Center: Menu */}
          <div className="header__flex-center">
      <nav ref={navRef} id="main-navigation" role="navigation" aria-label="Główna nawigacja" className={`nav nav--center ${isMenuOpen ? 'nav--mobile-open' : ''}`}>
              <ul className="nav__list">
        <li><a ref={firstLinkRef} title="Strona główna" href="#home" className="nav__link nav__link--truncate" onClick={(e) => handleNavClick(e, '#home')}>Strona główna</a></li>
        <li><a title="Usługi" href="#services" className="nav__link nav__link--truncate" onClick={(e) => handleNavClick(e, '#services')}>Usługi</a></li>
        <li><a title="O nas" href="#about" className="nav__link nav__link--truncate" onClick={(e) => handleNavClick(e, '#about')}>O nas</a></li>
        <li><a title="Kontakt" href="#contact" className="nav__link nav__link--truncate" onClick={(e) => handleNavClick(e, '#contact')}>Kontakt</a></li>
              </ul>
            </nav>
          </div>

          {/* Right: Phone and Dark Mode Toggle */}
          <div className="header__flex-right">
            <div className="header__contact">
              <a href="tel:+48601514423" className="md-filled-button header__phone" aria-label="Zadzwoń +48 601 514 423">
                <i className="fas fa-phone" aria-hidden="true"></i>
                <span className="visually-hidden">+48 601 514 423</span>
              </a>
              <button 
                className="dark-mode-toggle" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
                title={isDarkMode ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </div>
          </div>

          {/* Mobile menu toggle stays outside flex for layout */}
          <button 
            className="mobile-menu-toggle" 
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={toggleMenu}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
