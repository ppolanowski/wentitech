"use client";

import React from 'react';

export default function ScrollDown() {
  const [isAtLastSection, setIsAtLastSection] = React.useState(false);

  React.useEffect(() => {
    const updateState = () => {
      const header = document.querySelector('.header') as HTMLElement | null;
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const scrollTop = window.scrollY || window.pageYOffset;
      const viewPoint = scrollTop + headerH + 1;
      const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];
      if (sections.length === 0) {
        setIsAtLastSection(false);
        return;
      }
      // find the first section whose top is greater than the viewPoint
      const firstAbove = sections.findIndex(s => s.offsetTop > viewPoint);
      let current = -1;
      if (firstAbove === -1) {
        current = sections.length - 1;
      } else if (firstAbove === 0) {
        current = 0;
      } else {
        current = firstAbove - 1;
      }
      setIsAtLastSection(current >= sections.length - 1);
    };

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    return () => {
      window.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];
    if (sections.length === 0) {
      // fallback: go to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const header = document.querySelector('.header') as HTMLElement | null;
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const scrollTop = window.scrollY || window.pageYOffset;
    const viewPoint = scrollTop + headerH + 1;

    const firstAbove = sections.findIndex(s => s.offsetTop > viewPoint);
    let current = -1;
    if (firstAbove === -1) {
      current = sections.length - 1;
    } else if (firstAbove === 0) {
      current = 0;
    } else {
      current = firstAbove - 1;
    }

    const next = sections[current + 1];
    if (next) {
      const targetTop = window.scrollY + next.getBoundingClientRect().top - headerH;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      return;
    }

    // we're on the last section -> scroll smoothly to the top
    const main = document.querySelector('#main');
    if (main) {
      main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // ensure visual state updates in case component persists
    setIsAtLastSection(false);
  };

  return (
    <div className="bottom-gradient-wrapper" aria-hidden="false">
      <div className="bottom-gradient" />
      <button
        className={`bottom-gradient-button ${isAtLastSection ? 'bottom-gradient-button--up' : ''}`}
          aria-label={isAtLastSection ? 'Powrót na górę' : 'Przejdź do następnej sekcji'}
          title={isAtLastSection ? 'Powrót na górę' : 'Przejdź do następnej sekcji'}
        onClick={handleClick}
      >
  <span className="visually-hidden">{isAtLastSection ? 'Powrót na górę' : 'Przejdź w dół'}</span>
        <i className="fas fa-chevron-down" aria-hidden="true"></i>
      </button>
    </div>
  );
}
