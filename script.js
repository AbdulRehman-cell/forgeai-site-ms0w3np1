/**
 * Diamond Exteriors - Okanagan
 * Main Interactive & Animation Controller (script.js)
 * High-performance, vanilla JavaScript powering premium micro-interactions,
 * responsive navigation, interactive forms, and dynamic viewport animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Toggle & Navigation Backdrop Blur
    // ----------------------------------------------------
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mainHeader = document.querySelector('.main-header');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('nav-menu--open');
            mobileMenuToggle.classList.toggle('is-active');
            
            // Prevent body scroll when menu is active
            document.body.classList.toggle('menu-open', !isExpanded);
        });

        // Close mobile menu on clicking any navigation link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-menu--open');
                mobileMenuToggle.classList.remove('is-active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Dynamic header styling on scroll (sticky frosted glass effect)
    const handleHeaderScroll = () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('main-header--scrolled');
        } else {
            mainHeader.classList.remove('main-header--scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Run immediately on load

    // ----------------------------------------------------
    // 2. Intersection Observer for Scroll-Reveal Animations
    // ----------------------------------------------------
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after reveal if we want animations to run once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Register generic targets
    const elementsToReveal = document.querySelectorAll(
        '.value-card, .service-card, .process-step-card, .sc-why-card, .gold-card, .contact-card, .reveal-on-scroll'
    );
    
    elementsToReveal.forEach((el, index) => {
        // Apply staggering delays purely through dynamic class matching or manual inline styles
        if (!el.classList.contains('revealed')) {
            el.classList.add('reveal-prep');
            // Stagger items based on index if desired in groups
            revealOnScrollObserver.observe(el);
        }
    });

    // ----------------------------------------------------
    // 3. Robust Form Validation & User Feedback
    // ----------------------------------------------------
    const callbackForms = document.querySelectorAll('form, .contact-form, .callback-form');

    callbackForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form inputs
            const nameInput = form.querySelector('input[type="text"], input[name="name"]');
            const emailInput = form.querySelector('input[type="email"], input[name="email"]');
            const phoneInput = form.querySelector('input[type="tel"], input[name="phone"]');
            const submitBtn = form.querySelector('button[type="submit"], .btn-submit');
            
            let isFormValid = true;

            // Simple styling reset
            const resetInputStyles = (input) => {
                if (input) {
                    input.style.borderColor = 'var(--border)';
                    const errMsg = input.parentNode.querySelector('.error-msg-span');
                    if (errMsg) errMsg.remove();
                }
            };

            const setInputError = (input, message) => {
                if (input) {
                    input.style.borderColor = 'var(--accent)';
                    // Prevent duplicate error notes
                    if (!input.parentNode.querySelector('.error-msg-span')) {
                        const errSpan = document.createElement('span');
                        errSpan.className = 'error-msg-span';
                        errSpan.style.color = 'var(--accent)';
                        errSpan.style.fontSize = '0.85rem';
                        errSpan.style.marginTop = '4px';
                        errSpan.style.display = 'block';
                        errSpan.innerText = message;
                        input.parentNode.appendChild(errSpan);
                    }
                    isFormValid = false;
                }
            };

            // Validate fields
            [nameInput, emailInput, phoneInput].forEach(resetInputStyles);

            if (nameInput && nameInput.value.trim().length < 2) {
                setInputError(nameInput, 'Please enter your full name.');
            }

            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    setInputError(emailInput, 'Please enter a valid email address.');
                }
            }

            if (phoneInput) {
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phoneInput.value.trim().replace(/[\s-()]/g, ''))) {
                    setInputError(phoneInput, 'Please enter a valid 10-digit phone number.');
                }
            }

            if (!isFormValid) return;

            // Submit Simulation (Visual state transition)
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.innerHTML = 'Sending Secure Request...';

                setTimeout(() => {
                    // Success State
                    form.reset();
                    submitBtn.style.backgroundColor = '#10B981'; // Emerald Green
                    submitBtn.style.color = '#ffffff';
                    submitBtn.innerHTML = '✓ Callback Request Received!';

                    // Create floating custom success banner
                    const alertBanner = document.createElement('div');
                    alertBanner.className = 'form-success-banner';
                    alertBanner.innerHTML = `
                        <div class="banner-content">
                            <strong>Thank You!</strong>
                            <p>Our Kelowna team has received your details and will call you back within 1 business hour.</p>
                        </div>
                    `;
                    document.body.appendChild(alertBanner);

                    // Fade-out alert and restore button state
                    setTimeout(() => {
                        alertBanner.style.opacity = '0';
                        setTimeout(() => alertBanner.remove(), 400);
                        
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.innerHTML = originalText;
                    }, 5000);

                }, 1400);
            }
        });
    });

    // ----------------------------------------------------
    // 4. Smooth Anchor Scrolling with Header Offset
    // ----------------------------------------------------
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = mainHeader.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 16; // 16px safe breathing room

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----------------------------------------------------
    // 5. Interactive Testimonial Accent Cards Glow Effect
    // ----------------------------------------------------
    const goldCards = document.querySelectorAll('.gold-card');
    goldCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 8px 24px rgba(203, 163, 24, 0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 4px 12px rgba(34,78,148,0.07)';
        });
    });
});
/* Mobile hamburger nav */
(function(){
  function enhance(){
    var navs = document.querySelectorAll('header nav, .site-header nav, .navbar nav, header .nav-links');
    for (var i = 0; i < navs.length; i++) {
      var nav = navs[i];
      var header = nav.closest('header, .site-header, .navbar, .main-header') || nav.parentElement;
      if (!header || header.querySelector('.nav-toggle')) continue;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'nav-toggle'; btn.setAttribute('aria-label', 'Toggle menu');
      btn.innerHTML = '<span></span><span></span><span></span>';
      (function(nav){
        btn.addEventListener('click', function(){ nav.classList.toggle('nav-open'); });
        nav.addEventListener('click', function(e){ if (e.target && e.target.closest && e.target.closest('a')) nav.classList.remove('nav-open'); });
      })(nav);
      // Insert into the nav's own flex row (with the brand) so it sits level with
      // the logo — not appended to the outer <header> where it drops to a new line.
      (nav.parentElement || header).appendChild(btn);
    }
  }
  if (document.readyState !== 'loading') enhance(); else document.addEventListener('DOMContentLoaded', enhance);
  try { new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
})();
