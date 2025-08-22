export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__content">
            <h2 className="about__title">O firmie Wentitech</h2>
            <p className="about__description">
              Wentitech Sp. z o.o. to dynamicznie rozwijająca się firma budowlana, specjalizująca się w instalacjach 
              wentylacyjnych, systemach przeciwpożarowych oraz pompach ciepła. Od 2019 roku działamy na rynku trójmiejskim, 
              dostarczając kompleksowe rozwiązania dla klientów indywidualnych i biznesowych.
            </p>
            <p className="about__description">
              Nasza firma wyróżnia się profesjonalnym podejściem do każdego projektu, konkurencyjnymi cenami oraz wysoką 
              jakością wykonywanych usług. Stosujemy nowoczesne technologie i innowacyjne rozwiązania, które zapewniają 
              efektywność energetyczną i długotrwałą niezawodność instalacji.
            </p>
          </div>
          
          <div className="about__features">
            <div className="features-grid">
              <div className="feature-item">
                <i className="fas fa-award"></i>
                <div>
                  <h4>Doświadczenie od 2019</h4>
                  <p>Wieloletnie doświadczenie w branży HVAC</p>
                </div>
              </div>
              
              <div className="feature-item">
                <i className="fas fa-euro-sign"></i>
                <div>
                  <h4>Konkurencyjne ceny</h4>
                  <p>Atrakcyjne warunki bez kompromisów jakościowych</p>
                </div>
              </div>
              
              <div className="feature-item">
                <i className="fas fa-tools"></i>
                <div>
                  <h4>Kompleksowa obsługa</h4>
                  <p>Od projektu po montaż i serwis</p>
                </div>
              </div>
              
              {/* fourth feature removed per request */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
