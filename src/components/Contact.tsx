'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (value: string) => {
    let phoneValue = value.replace(/\D/g, '');
    
    if (phoneValue.length > 0) {
      if (phoneValue.startsWith('48')) {
        phoneValue = '+' + phoneValue.substring(0, 2) + ' ' + phoneValue.substring(2);
      } else if (phoneValue.length === 9) {
        phoneValue = '+48 ' + phoneValue;
      }
      
      if (phoneValue.startsWith('+48 ') && phoneValue.length > 4) {
        const number = phoneValue.substring(4);
        const formatted = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        phoneValue = '+48 ' + formatted;
      }
    }
    
    return phoneValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Imię jest wymagane.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email jest wymagany.';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Proszę podać prawidłowy adres email.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Wiadomość jest wymagana.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage(null);
    setFieldErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage({ text: 'Proszę poprawić błędy w formularzu.', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ 
        text: 'Dziękujemy za wiadomość! Skontaktujemy się z Państwem wkrótce.', 
        type: 'success' 
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error) {
      setMessage({ 
        text: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="md-headline-large contact__title">Skontaktuj się z nami</h2>
        <p className="md-body-large contact__subtitle">Jesteśmy gotowi, aby pomóc w realizacji Twojego projektu</p>
        <div className="contact__grid">
          <div className="contact__info">
            <h3 className="md-title-large">Dane kontaktowe</h3>
            
            <div className="contact__item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <strong>Adres:</strong><br />
                ul. Antoniego Abrahama 46B/8<br />
                81-395 Gdynia
              </div>
            </div>
            
            <div className="contact__item">
              <i className="fas fa-phone"></i>
              <div>
                <strong>Telefon:</strong><br />
                <a href="tel:+48601514423">+48 601 514 423</a>
              </div>
            </div>
            
            <div className="contact__item">
              <i className="fas fa-envelope"></i>
              <div>
                <strong>Email:</strong><br />
                <a href="mailto:biuro@wentitech.com">biuro@wentitech.com</a>
              </div>
            </div>
            
            <div className="contact__item">
              <i className="fas fa-id-card"></i>
              <div>
                <strong>NIP:</strong> 5862400243
              </div>
            </div>
          </div>
          
          <div className="contact__form">
            <h3 className="md-title-large">Napisz do nas</h3>
            <form className={`form ${isLoading ? 'form--loading' : ''}`} onSubmit={handleSubmit}>
              {message && (
                <div className={`form-message form-message--${message.type}`}>
                  {message.text}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Imię *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={fieldErrors.name ? { borderColor: 'var(--color-error)' } : {}}
                />
                {fieldErrors.name && (
                  <div className="field-error" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-4)' }}>
                    {fieldErrors.name}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={fieldErrors.email ? { borderColor: 'var(--color-error)' } : {}}
                />
                {fieldErrors.email && (
                  <div className="field-error" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-4)' }}>
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Telefon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Wiadomość *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-control" 
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  style={fieldErrors.message ? { borderColor: 'var(--color-error)' } : {}}
                />
                {fieldErrors.message && (
                  <div className="field-error" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-4)' }}>
                    {fieldErrors.message}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="md-filled-button contact__submit"
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isLoading ? (
                  <>
                    <span>Wysyłanie...</span>
                    <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    <span>Wyślij wiadomość</span>
                    <i className="fas fa-paper-plane"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
