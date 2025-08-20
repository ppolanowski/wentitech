// Wentitech Website JavaScript - Fixed Version

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contactForm');
    const logo = document.querySelector('.header__logo');

    // Mobile menu functionality
    let mobileMenuOpen = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
        
        if (mobileMenuOpen) {
            nav.style.display = 'block';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'var(--color-surface)';
            nav.style.borderTop = '1px solid var(--color-border)';
            nav.style.padding = 'var(--space-16)';
            nav.style.boxShadow = 'var(--shadow-md)';
            nav.style.zIndex = '1001';
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            nav.style.display = '';
            nav.style.position = '';
            nav.style.top = '';
            nav.style.left = '';
            nav.style.right = '';
            nav.style.background = '';
            nav.style.borderTop = '';
            nav.style.padding = '';
            nav.style.boxShadow = '';
            nav.style.zIndex = '';
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Mobile menu toggle event
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Keyboard support
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    // Logo click handler - scroll to top
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && mobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
        
        // Keyboard support
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Header scroll effect
    function handleHeaderScroll() {
        if (!header) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    }

    // Scroll animations
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact__item');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    }

    // Active navigation link highlighting - FIXED
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const headerHeight = header ? header.offsetHeight : 80;

        // Remove active class from all nav links first
        navLinks.forEach(link => link.classList.remove('nav__link--active'));

        // Check which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (correspondingNavLink && scrollY >= sectionTop && scrollY < sectionBottom) {
                correspondingNavLink.classList.add('nav__link--active');
            }
        });
    }

    // Contact form handling - FIXED
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any existing messages
            clearFormMessages();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const phone = formData.get('phone')?.trim();
            const message = formData.get('message')?.trim();
            
            // Validation
            let hasErrors = false;
            
            if (!name) {
                showFieldError('name', 'Imię jest wymagane.');
                hasErrors = true;
            }
            
            if (!email) {
                showFieldError('email', 'Email jest wymagany.');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Proszę podać prawidłowy adres email.');
                hasErrors = true;
            }
            
            if (!message) {
                showFieldError('message', 'Wiadomość jest wymagana.');
                hasErrors = true;
            }
            
            if (hasErrors) {
                showFormMessage('Proszę poprawić błędy w formularzu.', 'error');
                return;
            }
            
            // Show loading state
            showFormLoading(true);
            
            // Simulate form submission
            setTimeout(() => {
                showFormLoading(false);
                showFormMessage('Dziękujemy za wiadomość! Skontaktujemy się z Państwem wkrótce.', 'success');
                contactForm.reset();
                clearFormMessages();
            }, 2000);
        });
    }

    // Form utility functions - IMPROVED
    function showFormMessage(message, type) {
        clearFormMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.textContent = message;
        
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error styling to field
        field.style.borderColor = 'var(--color-error)';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--space-4)';
        
        field.parentNode.appendChild(errorDiv);
        
        // Remove error on focus
        field.addEventListener('focus', function() {
            this.style.borderColor = '';
            const error = this.parentNode.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        }, { once: true });
    }
    
    function clearFormMessages() {
        const messages = contactForm.querySelectorAll('.form-message, .field-error');
        messages.forEach(msg => msg.remove());
        
        // Reset field styles
        const fields = contactForm.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    function showFormLoading(loading) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        if (loading) {
            contactForm.classList.add('form--loading');
            submitButton.disabled = true;
            submitButton.innerHTML = 'Wysyłanie... <i class="fas fa-spinner fa-spin"></i>';
        } else {
            contactForm.classList.remove('form--loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Wyślij wiadomość';
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.startsWith('48')) {
                    value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
                } else if (value.length === 9) {
                    value = '+48 ' + value;
                }
                
                if (value.startsWith('+48 ') && value.length > 4) {
                    const number = value.substring(4);
                    const formatted = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                    value = '+48 ' + formatted;
                }
            }
            
            e.target.value = value;
        });
    }

    // CTA button smooth scroll - FIXED
    const ctaButton = document.querySelector('.hero__cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    }

    // Resize handler for mobile menu
    function handleResize() {
        if (window.innerWidth > 768 && mobileMenuOpen) {
            nav.style.display = '';
            nav.style.position = '';
            nav.style.top = '';
            nav.style.left = '';
            nav.style.right = '';
            nav.style.background = '';
            nav.style.borderTop = '';
            nav.style.padding = '';
            nav.style.boxShadow = '';
            nav.style.zIndex = '';
            mobileMenuOpen = false;
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Event listeners
    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        animateOnScroll();
        updateActiveNavLink();
    });
    
    window.addEventListener('resize', handleResize);

    // Initialize
    handleHeaderScroll();
    animateOnScroll();
    updateActiveNavLink();

    // Add CSS for active nav link and form styles
    const style = document.createElement('style');
    style.textContent = `
        .nav__link--active {
            color: var(--color-primary) !important;
            position: relative;
        }
        
        .nav__link--active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-primary);
            border-radius: 1px;
        }
        
        .header__logo {
            transition: opacity var(--duration-fast) var(--ease-standard);
        }
        
        .header__logo:hover {
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .nav {
                display: none;
            }
            
            .nav .nav__list {
                flex-direction: column;
                gap: var(--space-16);
            }
            
            .nav__link--active::after {
                display: none;
            }
        }
        
        .fa-spin {
            animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});