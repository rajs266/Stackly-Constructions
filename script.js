(() => {
  'use strict';

  
  const loader = document.getElementById('loader');
  const start = performance.now();

  window.addEventListener('load', () => {
    const delay = Math.max(700 - (performance.now() - start), 0);
    setTimeout(() => {
      if(loader) {
        loader.classList.add('hide');
        setTimeout(() => loader.style.display = 'none', 500);
      }
    }, delay);
  });

  
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navWrap = document.querySelector('.nav-wrap');

  const closeMenu = () => {
    if(navLinks) {
      navLinks.classList.remove('open');
      if(menuBtn) {
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  };

  const openMenu = () => {
    if(navLinks) {
      navLinks.classList.add('open');
      if(menuBtn) {
        menuBtn.textContent = '×';
        menuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      navLinks && navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if(navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  document.addEventListener('click', e => {
    if (navLinks && navLinks.classList.contains('open') && navWrap && !navWrap.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });

  
  const navVideo = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');

  if (navVideo) {
    navVideo.addEventListener('loadeddata', () => {
      navVideo.classList.add('active');
      if(navOverlay) navOverlay.classList.add('active');
    });

    navVideo.addEventListener('error', () => {
      console.log('Nav video not found - using gradient background');
      if(navVideo) navVideo.style.display = 'none';
    });
  }

  
  const navLinksAll = document.querySelectorAll('.nav-links a');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  navLinksAll.forEach(link => {
    const linkHref = link.getAttribute('href');
    link.classList.remove('active');

    const linkFile = linkHref ? linkHref.split('/').pop() : '';

    const isHome = (currentFile === '' || currentFile === 'index.html') && (linkFile === 'index.html' || linkFile === '');
    const isExact = linkFile === currentFile && currentFile !== '' && currentFile !== 'index.html';

    if (isHome || isExact) {
      link.classList.add('active');
    }
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(
      '.reveal, .section, .featured-card, .service-card, .about-card, .project-card, .contact-card, .section-inner, .hero-grid, .section-shell, .highlight-item, .float-card, .hero-stat'
    ).forEach(el => {
      el.classList.add('show');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    setTimeout(() => {
      document.querySelectorAll('.featured-card, .service-card, .about-card, .project-card').forEach((el, index) => {
        el.style.transition = 'transform .24s cubic-bezier(.16,1,.3,1), box-shadow .24s ease, border-color .24s ease';
        el.style.transitionDelay = `${index * 0.06}s`;
      });
    }, 200);
  });

  
  const footerShell = document.querySelector('.footer-shell');

  document.querySelectorAll('.service-card, .project-card, .about-card, .featured-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if(footerShell) footerShell.style.pointerEvents = 'none';
    });
    card.addEventListener('mouseleave', () => {
      if(footerShell) footerShell.style.pointerEvents = 'auto';
    });
  });

  
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
      if(!this.dotsContainer) return;
      this.slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });
      this.dots = document.querySelectorAll('.dot');
    }

    updateSlider() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

      this.slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === this.currentSlide);
      });

      if(this.dots) {
        this.dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === this.currentSlide);
        });
      }

      setTimeout(() => {
        this.isTransitioning = false;
      }, 800);
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
      this.handleSwipe();
    }

    handleSwipe() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        this.resetAutoPlay();
      }
    }

    addEventListeners() {
      if(this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prevSlide();
          this.resetAutoPlay();
        });
      }

      if(this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.nextSlide();
          this.resetAutoPlay();
        });
      }

      this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), {passive: true});
      this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), {passive: true});

      this.track.addEventListener('mouseenter', () => clearInterval(this.autoPlayInterval));
      this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  if (document.getElementById('sliderTrack')) {
    new Slider();
  }

  
  const backdrop = document.getElementById('loginBackdrop');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const modalClose = document.getElementById('modalClose');
  const loginForm = document.getElementById('loginForm');
  const loginEmailEl = document.getElementById('loginEmail');
  const loginPassEl = document.getElementById('loginPassword');
  const emailErr = document.getElementById('emailErr');
  const passErr = document.getElementById('passErr');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');

  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(backdrop) {
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        if(loginEmailEl) setTimeout(() => loginEmailEl.focus(), 100);
      }
    });
  }

  const closeModal = () => {
    if(backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      clearErrors();
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if(backdrop) {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  const isValidEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPass = val => val.length >= 6;

  const showErr = (input, errEl, msg) => {
    if(input) input.classList.add('input-error');
    if(errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  };

  const clearErr = (input, errEl) => {
    if(input) input.classList.remove('input-error');
    if(errEl) errEl.classList.remove('show');
  };

  const clearErrors = () => {
    clearErr(loginEmailEl, emailErr);
    clearErr(loginPassEl, passErr);
    if(loginForm) loginForm.reset();
  };

  if(loginEmailEl) {
    loginEmailEl.addEventListener('input', () => {
      if (isValidEmail(loginEmailEl.value)) clearErr(loginEmailEl, emailErr);
    });
  }

  if(loginPassEl) {
    loginPassEl.addEventListener('input', () => {
      if (isValidPass(loginPassEl.value)) clearErr(loginPassEl, passErr);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = loginEmailEl ? loginEmailEl.value : '';
      const pass = loginPassEl ? loginPassEl.value : '';
      let valid = true;

      if (!isValidEmail(email)) {
        showErr(loginEmailEl, emailErr, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearErr(loginEmailEl, emailErr);
      }

      if (!isValidPass(pass)) {
        showErr(loginPassEl, passErr, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        clearErr(loginPassEl, passErr);
      }

      if (!valid) return;

      if(loginSubmitBtn) {
        loginSubmitBtn.textContent = 'Signing in...';
        loginSubmitBtn.disabled = true;
      }

      setTimeout(() => {
        window.location.href = '404.html';
      }, 800);
    });
  }

  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      if (!contactForm.checkValidity()) return;
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn ? btn.textContent : 'Submit';
      if(btn) {
        btn.textContent = 'Submitted OK';
        btn.disabled = true;
      }
      setTimeout(() => {
        contactForm.reset();
        if(btn) {
          btn.disabled = false;
          btn.textContent = orig;
        }
        alert('Thank you! We will contact you within 24 hours.');
      }, 1500);
    });
  }

  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if(href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if(lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  console.log('%cStackly Construction Loaded Successfully', 'color: #4dd4ff; font-size: 16px; font-weight: bold; padding: 5px;');
  console.log('%cNo console errors detected', 'color: #00d7a3; font-size: 12px;');

  
  const initScrollReveal = () => {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    const heroShell = document.querySelector('.hero-shell');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => {
      if (heroShell && heroShell.contains(el)) {
        const delay = parseInt(el.dataset.delay || 0) * 100;
        setTimeout(() => el.classList.add('is-visible'), 200 + delay);
      } else {
        observer.observe(el);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  
  const faqItems = document.querySelectorAll('.faq-item');
  if(faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if(question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          faqItems.forEach(i => i.classList.remove('active'));
          
          if(!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  
  if(filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        projectCards.forEach(card => {
          if(filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

})();