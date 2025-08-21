'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      
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
  }, []);

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
            <div className="header__logo" onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/assets/logo_black.png"
                alt="Wentitech logo"
                width={64}
                height={64}
                priority
                className="header__logo-img"
              />
            </div>
          </div>

          {/* Center: Menu */}
          <div className="header__flex-center">
            <nav className={`nav nav--center ${isMenuOpen ? 'nav--mobile-open' : ''}`}>
              <ul className="nav__list">
                <li><a href="#home" className="nav__link" onClick={(e) => handleNavClick(e, '#home')}>Strona główna</a></li>
                <li><a href="#services" className="nav__link" onClick={(e) => handleNavClick(e, '#services')}>Usługi</a></li>
                <li><a href="#about" className="nav__link" onClick={(e) => handleNavClick(e, '#about')}>O nas</a></li>
                <li><a href="#contact" className="nav__link" onClick={(e) => handleNavClick(e, '#contact')}>Kontakt</a></li>
              </ul>
            </nav>
          </div>

          {/* Right: Phone and Dark Mode Toggle */}
          <div className="header__flex-right">
            <div className="header__contact">
              <a href="tel:+48601514423" className="md-filled-button header__phone">
                <i className="fas fa-phone"></i>
                <span>+48 601 514 423</span>
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
            onClick={toggleMenu}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
