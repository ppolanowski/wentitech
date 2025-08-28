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
   const popupRef = useRef<HTMLDivElement | null>(null);

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
     } catch (_err) {
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
       if (pos) {
         const clientX = pos.x - (window.scrollX || 0);
         const clientY = pos.y - (window.scrollY || 0);
         setPopupPos({ x: clientX, y: clientY });
       }
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

   useEffect(() => {
     if (!popupRef.current || !popupPos) return;
     const el = popupRef.current;
     el.style.left = popupPos.x + 'px';
     el.style.top = popupPos.y + 'px';
   }, [popupPos]);

   return (
     <section id="contact" className="contact">
       <div className="container">
         <div className="contact__grid">
           {/* Left: info flip card */}
           <div className={`contact__info ${errorFlip ? 'contact__info--flipped' : ''}`}>
             <div className="contact__info__face contact__info__face--front">
               <div className="company-footer">
                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('WENTITECH Sp. z o. o.', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">Nazwa:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P" target="_blank" rel="noopener noreferrer">WENTITECH Sp. z o. o.</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('ul. Abrahama 46B/8, Gdynia', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">Adres:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://www.google.com/maps/place/Abrahama+46B,+81-395+Gdynia" target="_blank" rel="noopener noreferrer">ul. Abrahama 46B/8, Gdynia</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('81-395', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">Kod pocztowy:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://www.google.com/maps/place/Abrahama+46B,+81-395+Gdynia" target="_blank" rel="noopener noreferrer">81-395</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('+48 601 514 423', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">Telefon:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="tel:+48601514423">+48 601 514 423</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('5862400243', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">NIP:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P" target="_blank" rel="noopener noreferrer">5862400243</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('527207919', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">REGON:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://wyszukiwarka-krs.ms.gov.pl/dane-szczegolowe-podmiotu;numerKRS=Gbeau4az5az%2FQiL5FH5wYw%3D%3D;typ=P" target="_blank" rel="noopener noreferrer">527207919</a>
                     </span>
                   </div>
                 </div>

                <div
                  className="company-footer__button"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    const pos = { x: (e as React.MouseEvent).pageX ?? (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).pageY ?? (e as React.MouseEvent).clientY };
                    copyToClipboard('09:00 - 17:00', pos);
                  }}
                >
                   <div className="company-footer__row">
                     <span className="company-footer__label">Godziny otwarcia:</span>
                     <span className="company-footer__value">
                       <a className="company-footer__link" href="https://www.google.com/maps/place/Abrahama+46B,+81-395+Gdynia" target="_blank" rel="noopener noreferrer">09:00 - 17:00</a>
                     </span>
                   </div>
                 </div>
               </div>
             </div>

             <div className="contact__info__face contact__info__face--back">
               <div className="company-footer company-footer--back">
                 <strong>Wystąpił błąd</strong>
                 <p className="contact__error-text">
                   <span>Sprawdź proszę dane w formularzu</span>
                   <br />
                   <span className="contact__oraz">oraz spróbuj ponownie.</span>
                 </p>
               </div>
             </div>
           </div>

           {/* Right: form */}
           <div className="contact__form">
             <form className={`form ${isLoading ? 'form--loading' : ''}`} onSubmit={handleSubmit}>
               <div aria-live="polite" aria-atomic="true" className="visually-hidden">
                 {copiedText ? `Skopiowano: ${copiedText}` : ''}
               </div>
               {copiedText && (() => {
                 if (typeof document !== 'undefined' && document.body) {
                   return createPortal(
                     <div
                       ref={popupRef}
                       className={`copy-popup ${popupFading ? 'copy-popup--fade' : ''}`}
                       role="status"
                       aria-live="polite"
                     >
                       Skopiowano: {copiedText}
                     </div>,
                     document.body
                   );
                 }
                 return null;
               })()}

               <div className="form-group form-group--single">
                 <label htmlFor="name" className="form-label sr-only">Imię *</label>
                 <input id="name" name="name" className={`form-control ${fieldErrors.name ? 'has-error' : ''}`} placeholder="Imię *" value={formData.name} onChange={handleInputChange} />
                 {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
               </div>
               <div className="form-group form-group--single">
                 <label htmlFor="email" className="form-label sr-only">Email *</label>
                 <input id="email" name="email" type="email" className={`form-control ${fieldErrors.email ? 'has-error' : ''}`} placeholder="Email *" value={formData.email} onChange={handleInputChange} />
                 {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
               </div>
               <div className="form-group form-group--single">
                 <label htmlFor="phone" className="form-label sr-only">Telefon</label>
                 <input id="phone" name="phone" type="tel" className="form-control" placeholder="Telefon" value={formData.phone} onChange={handleInputChange} />
               </div>
               <div className="form-group">
                 <label htmlFor="message" className="form-label sr-only">Wiadomość *</label>
                 <textarea id="message" name="message" className={`form-control ${fieldErrors.message ? 'has-error' : ''}`} rows={3} placeholder="Wiadomość *" value={formData.message} onChange={handleInputChange} />
                 {fieldErrors.message && <div className="field-error">{fieldErrors.message}</div>}
               </div>
               <button type="submit" className="md-filled-button contact__submit full-width-center" disabled={isLoading}>
                 {isLoading ? (<><span>Wysyłanie...</span><i className="fas fa-spinner fa-spin" /></>) : (<><span>Wyślij wiadomość</span><i className="fas fa-paper-plane" /></>)}
               </button>
             </form>
           </div>
         </div>
       </div>
     </section>
   );
 }
