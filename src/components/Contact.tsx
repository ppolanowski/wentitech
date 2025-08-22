'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [popupFading, setPopupFading] = useState(false);

  const [errorFlip, setErrorFlip] = useState(false);

  const fadeTimeoutRef = useRef<number | null>(null);
  const clearTimeoutRef = useRef<number | null>(null);
  const flipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);
      if (flipTimeoutRef.current) window.clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (value: string) => {
    let phoneValue = value.replace(/\D/g, '');
    if (!phoneValue) return '';
    if (phoneValue.startsWith('48')) {
      phoneValue = '+' + phoneValue.substring(0, 2) + ' ' + phoneValue.substring(2);
    } else if (phoneValue.length === 9) {
      phoneValue = '+48 ' + phoneValue;
    }
    if (phoneValue.startsWith('+48 ') && phoneValue.length > 4) {
      const number = phoneValue.substring(4).replace(/\s/g, '');
      const formatted = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      phoneValue = '+48 ' + formatted;
    }
    return phoneValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else if (name === 'name') {
      // Capitalize the first non-space character as the user types
      const capitalized = value.replace(/(^\s*\S)/, (m) => m.toUpperCase());
      setFormData(prev => ({ ...prev, [name]: capitalized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Imię jest wymagane.';
    if (!formData.email.trim()) errors.email = 'Email jest wymagany.';
    else if (!isValidEmail(formData.email)) errors.email = 'Proszę podać prawidłowy adres email.';
    if (!formData.message.trim()) errors.message = 'Wiadomość jest wymagana.';
    return errors;
  };

  const triggerFlip = () => {
    setErrorFlip(true);
    if (flipTimeoutRef.current) window.clearTimeout(flipTimeoutRef.current);
    // Keep the card flipped for 3 seconds to ensure user notices the error state
    flipTimeoutRef.current = window.setTimeout(() => {
      setErrorFlip(false);
      flipTimeoutRef.current = null;
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
  setMessage({ text: 'Sprawdź proszę dane w formularzu oraz spróbuj ponownie.', type: 'error' });
      triggerFlip();
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      setMessage({ text: 'Wiadomość została wysłana pomyślnie!', type: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      window.setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ text: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.', type: 'error' });
      triggerFlip();
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, pos?: { x: number; y: number }) => {
    try {
      await navigator.clipboard.writeText(text);
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);
      setCopiedText(text);
      if (pos) setPopupPos(pos);
      setPopupFading(false);
      fadeTimeoutRef.current = window.setTimeout(() => setPopupFading(true), 1000);
      clearTimeoutRef.current = window.setTimeout(() => {
        setCopiedText(null);
        setPopupPos(null);
        setPopupFading(false);
        fadeTimeoutRef.current = null;
        clearTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleCopyClick = (e: React.MouseEvent, text?: string) => {
    if ((e.target as HTMLElement).closest('a')) return;
    if (!text) return;
    const pos = { x: e.pageX ?? e.clientX, y: e.pageY ?? e.clientY };
    copyToClipboard(text, pos);
  };

  const handleCopyKey = (e: React.KeyboardEvent, text?: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!text) return;
      copyToClipboard(text);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact__grid">
          <div className={`contact__info ${errorFlip ? 'contact__info--flipped' : ''}`}>
            <div className="contact__info__face contact__info__face--front" aria-hidden={errorFlip}>
              <div className="company-footer">
              <div
                className="company-footer__name"
                role="button"
                tabIndex={0}
                data-value="WENTITECH"
                onClick={(e) => handleCopyClick(e, 'WENTITECH')}
                onKeyDown={(e) => handleCopyKey(e, 'WENTITECH')}
                aria-label="Kopiuj nazwę firmy WENTITECH"
              >
                <a href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P" target="_blank" rel="noopener noreferrer">
                  <strong>WENTITECH</strong>
                </a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="+48 601 514 423"
                onClick={(e) => handleCopyClick(e, '+48 601 514 423')}
                onKeyDown={(e) => handleCopyKey(e, '+48 601 514 423')}
                aria-label="Kopiuj numer telefonu"
              >
                <span className="company-footer__label">Telefon:</span>
                <a href="tel:+48601514423">+48 601 514 423</a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="biuro@wentitech.com"
                onClick={(e) => handleCopyClick(e, 'biuro@wentitech.com')}
                onKeyDown={(e) => handleCopyKey(e, 'biuro@wentitech.com')}
                aria-label="Kopiuj adres email"
              >
                <span className="company-footer__label">Email:</span>
                <a href="mailto:biuro@wentitech.com">biuro@wentitech.com</a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="wentitech.com"
                onClick={(e) => handleCopyClick(e, 'wentitech.com')}
                onKeyDown={(e) => handleCopyKey(e, 'wentitech.com')}
                aria-label="Kopiuj adres strony"
              >
                <span className="company-footer__label">Strona:</span>
                <a href="https://wentitech.com" target="_blank" rel="noopener noreferrer">wentitech.com</a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="5862400243"
                onClick={(e) => handleCopyClick(e, '5862400243')}
                onKeyDown={(e) => handleCopyKey(e, '5862400243')}
                aria-label="Kopiuj numer NIP"
              >
                <span className="company-footer__label">NIP:</span>
                <a
                  className="company-footer__value company-footer__highlight"
                  href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  5862400243
                </a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="527207919"
                onClick={(e) => handleCopyClick(e, '527207919')}
                onKeyDown={(e) => handleCopyKey(e, '527207919')}
                aria-label="Kopiuj numer REGON"
              >
                <span className="company-footer__label">REGON:</span>
                <a
                  className="company-footer__value company-footer__highlight"
                  href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  527207919
                </a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="0001075727"
                onClick={(e) => handleCopyClick(e, '0001075727')}
                onKeyDown={(e) => handleCopyKey(e, '0001075727')}
                aria-label="Kopiuj numer KRS"
              >
                <span className="company-footer__label">KRS:</span>
                <a
                  href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  0001075727
                </a>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value={`ul. Antoniego Abrahama 46B/8\n81-395 Gdynia`}
                onClick={(e) => handleCopyClick(e, 'ul. Antoniego Abrahama 46B/8\n81-395 Gdynia')}
                onKeyDown={(e) => handleCopyKey(e, 'ul. Antoniego Abrahama 46B/8\n81-395 Gdynia')}
                aria-label="Kopiuj adres"
              >
                <span className="company-footer__label">Adres:</span>
                <address className="company-footer__address">
                  <a href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P" target="_blank" rel="noopener noreferrer">
                    ul. Antoniego Abrahama 46B/8<br />
                    81-395 Gdynia
                  </a>
                </address>
              </div>

              <div
                className="company-footer__row"
                role="button"
                tabIndex={0}
                data-value="08:00-17:00"
                onClick={(e) => handleCopyClick(e, '08:00-17:00')}
                onKeyDown={(e) => handleCopyKey(e, '08:00-17:00')}
                aria-label="Kopiuj godziny otwarcia"
              >
                <span className="company-footer__label">Pon-Pt:</span>
                <span className="company-footer__value company-footer__highlight">08:00-17:00</span>
              </div>
              </div>
            </div>

            <div className="contact__info__face contact__info__face--back" aria-hidden={!errorFlip}>
              <div className="company-footer company-footer--back">
                {/* Use a static public path. Move your GIF to `public/gif/monkey.gif` and it will be served at `/gif/monkey.gif` */}
                  <strong>Wystąpił błąd</strong>
                  <p style={{ marginTop: '12px' }}>
                    <span>Sprawdź proszę dane w formularzu</span>
                    <br />
                    <span className="contact__oraz">oraz spróbuj ponownie.</span>
                  </p>
              </div>
            </div>
          </div>

          <div className="contact__form">
            <form className={`form ${isLoading ? 'form--loading' : ''}`} onSubmit={handleSubmit}>
              <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                {copiedText ? `Skopiowano: ${copiedText}` : ''}
              </div>

              {popupPos && copiedText && (() => {
                const popupStyle: React.CSSProperties = {
                  left: popupPos.x + 12,
                  top: popupPos.y + 12,
                  position: 'absolute',
                  zIndex: 800,
                  pointerEvents: 'none',
                  opacity: popupFading ? 0 : 1,
                  transition: popupFading ? 'opacity 1s linear' : 'none'
                };
                if (typeof document !== 'undefined' && document.body) {
                  return createPortal(
                    <div className={`copy-popup ${popupFading ? 'copy-popup--fade' : ''}`} role="status" aria-live="polite" style={popupStyle}>
                      Skopiowano: {copiedText}
                    </div>,
                    document.body
                  );
                }
                return null;
              })()}

              {/* form-level message removed as requested */}

              <div className="form-group form-group--single">
                <label htmlFor="name" className="form-label sr-only">Imię *</label>
                <input id="name" name="name" className="form-control" placeholder="Imię *" value={formData.name} onChange={handleInputChange} style={fieldErrors.name ? { borderColor: 'var(--color-error)' } : {}} />
                {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
              </div>

              <div className="form-group form-group--single">
                <label htmlFor="email" className="form-label sr-only">Email *</label>
                <input id="email" name="email" type="email" className="form-control" placeholder="Email *" value={formData.email} onChange={handleInputChange} style={fieldErrors.email ? { borderColor: 'var(--color-error)' } : {}} />
                {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
              </div>

              <div className="form-group form-group--single">
                <label htmlFor="phone" className="form-label sr-only">Telefon</label>
                <input id="phone" name="phone" type="tel" className="form-control" placeholder="Telefon" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label sr-only">Wiadomość *</label>
                <textarea id="message" name="message" className="form-control" rows={3} placeholder="Wiadomość *" value={formData.message} onChange={handleInputChange} style={fieldErrors.message ? { borderColor: 'var(--color-error)' } : {}} />
                {fieldErrors.message && <div className="field-error">{fieldErrors.message}</div>}
              </div>

              <button type="submit" className="md-filled-button contact__submit" disabled={isLoading} style={{ width: '100%', justifyContent: 'center' }}>
                {isLoading ? (<><span>Wysyłanie...</span><i className="fas fa-spinner fa-spin" /></>) : (<><span>Wyślij wiadomość</span><i className="fas fa-paper-plane" /></>) }
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
