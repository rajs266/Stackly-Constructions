(() => {
  'use strict';

  /* ========== LOADER ========== */
  const loader = document.getElementById('loader');
  if (loader) {
    const t0 = performance.now();
    window.addEventListener('load', () => {
      const wait = Math.max(600 - (performance.now() - t0), 0);
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => loader.style.display = 'none', 400);
      }, wait);
    });
  }

  /* ========== MOBILE MENU ========== */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navWrap = document.querySelector('.nav-wrap');

  const closeMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (menuBtn) {
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    if (!navLinks) return;
    navLinks.classList.add('open');
    if (menuBtn) {
      menuBtn.textContent = '×';
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      navLinks && navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('click', e => {
    if (navLinks && navLinks.classList.contains('open') && navWrap && !navWrap.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });

  /* ========== NAV VIDEO ========== */
  const navVideo = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');
  if (navVideo) {
    navVideo.addEventListener('loadeddata', () => {
      navVideo.classList.add('active');
      if (navOverlay) navOverlay.classList.add('active');
    });
    navVideo.addEventListener('error', () => {
      navVideo.style.display = 'none';
    });
  }

  /* ========== ACTIVE NAV LINK ========== */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const file = href.split('/').pop();
    const isHome = (currentFile === '' || currentFile === 'index.html') && (file === 'index.html' || file === '');
    const isExact = file === currentFile && currentFile !== '' && currentFile !== 'index.html';
    link.classList.toggle('active', isHome || isExact);
  });

  /* ========== SCROLL REVEAL (data-reveal) ========== */
  const initScrollReveal = () => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const heroShell = document.querySelector('.hero-shell');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => {
      if (heroShell && heroShell.contains(el)) {
        const delay = parseInt(el.dataset.delay || 0) * 100;
        setTimeout(() => el.classList.add('is-visible'), 200 + delay);
      } else {
        observer.observe(el);
      }
    });
  };

  /* ========== SCROLL REVEAL (data-sr) ========== */
  const initDataSr = () => {
    const els = document.querySelectorAll('[data-sr]');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  };

  /* ========== ANIMATED COUNTERS ========== */
  const initCounters = () => {
    const counters = document.querySelectorAll('.animated-counter[data-target]');
    if (!counters.length) return;
    let started = false;
    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '+';
      const duration = 1800;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (progress === 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(c => animate(c));
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(counters[0]);
  };

  /* ========== SCROLL PROGRESS & BACK TO TOP ========== */
  const initScrollProgress = () => {
    const bar = document.getElementById('scrollProgress');
    const topBtn = document.getElementById('backToTop');
    if (!bar && !topBtn) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      if (topBtn) topBtn.classList.toggle('show', scrollTop > 400);
    }, { passive: true });
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ========== LOGIN MODAL ========== */
  const initLoginModal = () => {
    const backdrop = document.getElementById('loginBackdrop');
    const openLoginBtn = document.getElementById('openLoginBtn');
    const modalClose = document.getElementById('modalClose');
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPass = document.getElementById('loginPassword');
    const emailErr = document.getElementById('emailErr');
    const passErr = document.getElementById('passErr');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');

    if (!backdrop) return;

    const closeModal = () => {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (loginEmail) loginEmail.classList.remove('input-error');
      if (loginPass) loginPass.classList.remove('input-error');
      if (emailErr) emailErr.classList.remove('show');
      if (passErr) passErr.classList.remove('show');
      if (loginForm) loginForm.reset();
    };

    if (openLoginBtn) {
      openLoginBtn.addEventListener('click', e => {
        e.preventDefault();
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (loginEmail) setTimeout(() => loginEmail.focus(), 100);
      });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });

    backdrop.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', () => {
    closeModal();
  });
});

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
    });

    const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const isValidPass = v => v.length >= 6;

    if (loginEmail) {
      loginEmail.addEventListener('input', () => {
        if (isValidEmail(loginEmail.value)) {
          loginEmail.classList.remove('input-error');
          if (emailErr) emailErr.classList.remove('show');
        }
      });
    }

    if (loginPass) {
      loginPass.addEventListener('input', () => {
        if (isValidPass(loginPass.value)) {
          loginPass.classList.remove('input-error');
          if (passErr) passErr.classList.remove('show');
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        const emailVal = loginEmail ? loginEmail.value : '';
        const passVal = loginPass ? loginPass.value : '';

        if (!isValidEmail(emailVal)) {
          if (loginEmail) loginEmail.classList.add('input-error');
          if (emailErr) emailErr.classList.add('show');
          valid = false;
        } else {
          if (loginEmail) loginEmail.classList.remove('input-error');
          if (emailErr) emailErr.classList.remove('show');
        }

        if (!isValidPass(passVal)) {
          if (loginPass) loginPass.classList.add('input-error');
          if (passErr) passErr.classList.add('show');
          valid = false;
        } else {
          if (loginPass) loginPass.classList.remove('input-error');
          if (passErr) passErr.classList.remove('show');
        }

        if (!valid) return;

        if (loginSubmitBtn) {
          loginSubmitBtn.textContent = 'Signing in...';
          loginSubmitBtn.disabled = true;
        }
        setTimeout(() => { window.location.href = '404.html'; }, 800);
      });
    }
  };

  /* ========== PAGE LOGIN FORM (login.html) ========== */
  const initPageLogin = () => {
    const form = document.getElementById('pageLoginForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('pageLoginEmail');
      const pass = document.getElementById('pageLoginPassword');
      const btn = document.getElementById('pageLoginSubmitBtn');
      const emailErr = document.getElementById('pageEmailErr');
      const passErr = document.getElementById('pagePassErr');
      let valid = true;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        if (email) email.classList.add('input-error');
        if (emailErr) emailErr.classList.add('show');
        valid = false;
      } else {
        if (email) email.classList.remove('input-error');
        if (emailErr) emailErr.classList.remove('show');
      }

      if (!pass || pass.value.length < 6) {
        if (pass) pass.classList.add('input-error');
        if (passErr) passErr.classList.add('show');
        valid = false;
      } else {
        if (pass) pass.classList.remove('input-error');
        if (passErr) passErr.classList.remove('show');
      }

      if (valid && btn) {
        btn.textContent = 'Signing in...';
        btn.disabled = true;
        setTimeout(() => { window.location.href = '404.html'; }, 800);
      }
    });
  };

  /* ========== SLIDER ========== */
  class Slider {
    constructor() {
      this.track = document.getElementById('sliderTrack');
      if (!this.track) return;
      this.slides = document.querySelectorAll('.slide');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.dotsContainer = document.getElementById('sliderDots');
      this.currentSlide = 0;
      this.autoPlayInterval = null;
      this.isTransitioning = false;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.init();
    }

    init() {
      this.createDots();
      this.updateSlider();
      this.startAutoPlay();
      this.addEventListeners();
    }

    createDots() {
      if (!this.dotsContainer) return;
      this.slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => this.goToSlide(i));
        this.dotsContainer.appendChild(dot);
      });
      this.dots = document.querySelectorAll('.dot');
    }

    updateSlider() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      this.track.style.transform = 'translateX(-' + (this.currentSlide * 100) + '%)';
      this.slides.forEach((slide, i) => slide.classList.toggle('active', i === this.currentSlide));
      if (this.dots) {
        this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentSlide));
      }
      setTimeout(() => { this.isTransitioning = false; }, 800);
    }

    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.updateSlider();
    }

    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.updateSlider();
    }

    goToSlide(index) {
      this.currentSlide = index;
      this.updateSlider();
      this.resetAutoPlay();
    }

    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoPlay() {
      clearInterval(this.autoPlayInterval);
      this.startAutoPlay();
    }

    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - this.touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.nextSlide() : this.prevSlide();
        this.resetAutoPlay();
      }
    }

    addEventListeners() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => { this.prevSlide(); this.resetAutoPlay(); });
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => { this.nextSlide(); this.resetAutoPlay(); });
      }
      this.track.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: true });
      this.track.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: true });
      this.track.addEventListener('mouseenter', () => clearInterval(this.autoPlayInterval));
      this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  /* ========== FAQ ACCORDION ========== */
  const initFaq = () => {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const wasActive = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
          if (!wasActive) item.classList.add('active');
        });
      }
    });
  };

  /* ========== SMOOTH SCROLL ========== */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 100;
          const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  };

  /* ========== LAZY IMAGES ========== */
  const initLazyImages = () => {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!imgs.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });
    imgs.forEach(img => observer.observe(img));
  };

  /* ========== REVEAL ON LOAD ========== */
  const initRevealOnLoad = () => {
    document.querySelectorAll('.reveal, .section, .featured-card, .service-card, .about-card, .project-card, .contact-card, .section-inner, .hero-grid, .section-shell, .highlight-item, .float-card, .hero-stat').forEach(el => {
      el.classList.add('show');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  };

  /* ========== PROJECT FILTER ========== */
  const initProjectFilter = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    if (!filterBtns.length || !projectCards.length) return;
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  };

  /* ========== CONTACT FORM ========== */
  const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    contactForm.addEventListener('submit', e => {
      if (!contactForm.checkValidity()) return;
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn ? btn.textContent : 'Submit';
      if (btn) {
        btn.textContent = 'Submitted OK';
        btn.disabled = true;
      }
      setTimeout(() => {
        contactForm.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = orig;
        }
        alert('Thank you! We will contact you within 24 hours.');
      }, 1500);
    });
  };

  /* ========== FOOTER POINTER FIX ========== */
  const initFooterFix = () => {
    const footerShell = document.querySelector('.footer-shell');
    if (!footerShell) return;
    document.querySelectorAll('.service-card, .project-card, .about-card, .featured-card').forEach(card => {
      card.addEventListener('mouseenter', () => { footerShell.style.pointerEvents = 'none'; });
      card.addEventListener('mouseleave', () => { footerShell.style.pointerEvents = 'auto'; });
    });
  };

  /* ========== INITIALIZE ALL ========== */
  const runInit = () => {
    initRevealOnLoad();
    initScrollReveal();
    initDataSr();
    initCounters();
    initScrollProgress();
    initLoginModal();
    initPageLogin();
    initFaq();
    initSmoothScroll();
    initLazyImages();
    initProjectFilter();
    initContactForm();
    initFooterFix();
    if (document.getElementById('sliderTrack')) new Slider();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

})();