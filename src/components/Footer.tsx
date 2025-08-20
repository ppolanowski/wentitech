'use client';

export default function Footer() {
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
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h4>Wentitech Sp. z o.o.</h4>
            <p>Profesjonalne instalacje wentylacyjne, systemy przeciwpożarowe i pompy ciepła w Gdyni i okolicach.</p>
          </div>
          
          <div className="footer__section">
            <h4>Szybkie linki</h4>
            <ul className="footer__links">
              <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')}>Strona główna</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>O nas</a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Usługi</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Kontakt</a></li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h4>Kontakt</h4>
            <p>
              ul. Antoniego Abrahama 46B/8<br />
              81-395 Gdynia<br />
              Tel: <a href="tel:+48601514423">+48 601 514 423</a>
            </p>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p>&copy; 2025 Wentitech Sp. z o.o. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
