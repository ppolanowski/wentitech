export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="md-headline-large services__title">Nasze usługi</h2>
        <p className="md-body-large services__subtitle">Kompleksowe rozwiązania w zakresie instalacji technicznych</p>
        <div className="services__grid">
          <div className="service-card md-surface">
            <div className="service-card__icon">
              <i className="fas fa-wind"></i>
            </div>
            <h3 className="md-title-large service-card__title">Instalacje wentylacyjne</h3>
            <p className="md-body-medium service-card__description">
              Projektowanie i montaż systemów wentylacji przemysłowej, mechanicznej i rekuperacji. 
              Zapewniamy odpowiednie rozprowadzenie powietrza w budynkach mieszkalnych, biurowych i przemysłowych.
            </p>
          </div>
          
          <div className="service-card md-surface">
            <div className="service-card__icon">
              <i className="fas fa-fire-extinguisher"></i>
            </div>
            <h3 className="md-title-large service-card__title">Systemy przeciwpożarowe</h3>
            <p className="md-body-medium service-card__description">
              Kompleksowe instalacje przeciwpożarowe - hydrantowe, tryskaczowe, pianowe oraz systemy mgły wodnej. 
              Zapewniamy bezpieczeństwo obiektów zgodnie z obowiązującymi normami.
            </p>
          </div>
          
          <div className="service-card md-surface">
            <div className="service-card__icon">
              <i className="fas fa-thermometer-half"></i>
            </div>
            <h3 className="md-title-large service-card__title">Pompy ciepła</h3>
            <p className="md-body-medium service-card__description">
              Montaż i serwis pomp ciepła powietrze-woda, grunt-woda oraz innych systemów grzewczych 
              wykorzystujących odnawialne źródła energii.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
