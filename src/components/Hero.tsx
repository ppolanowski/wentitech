'use client';

export default function Hero() {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const header = document.querySelector('.header');
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      const targetPosition = contactSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero__content">
          <h1 className="md-display-medium hero__title">Profesjonalne instalacje HVAC</h1>
          <p className="md-body-large hero__subtitle">Od 2019 roku dostarczamy kompleksowe rozwiązania w zakresie wentylacji, klimatyzacji, systemów przeciwpożarowych i pomp ciepła</p>
          <a href="#contact" className="md-filled-button hero__cta" onClick={handleCtaClick}>
            <span>Skontaktuj się z nami</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
