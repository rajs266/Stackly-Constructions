(() => {
  'use strict';

  const loader = document.getElementById('loader');
  const start  = performance.now();
  window.addEventListener('load', () => {
    const delay = Math.max(700 - (performance.now() - start), 0);
    setTimeout(() => loader.classList.add('hide'), delay);
  });


  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navWrap  = document.querySelector('.nav-wrap');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    navLinks.classList.add('open');
    menuBtn.textContent = '✕';
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navWrap.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });

  const navVideo   = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');
  if (navVideo) {
    navVideo.addEventListener('loadeddata', () => {
      navVideo.classList.add('active');
      navOverlay.classList.add('active');
    });
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const backdrop       = document.getElementById('loginBackdrop');
  const openLoginBtn   = document.getElementById('openLoginBtn');
  const modalClose     = document.getElementById('modalClose');
  const loginForm      = document.getElementById('loginForm');
  const loginEmailEl   = document.getElementById('loginEmail');
  const loginPassEl    = document.getElementById('loginPassword');
  const emailErr       = document.getElementById('emailErr');
  const passErr        = document.getElementById('passErr');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');


  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      loginEmailEl.focus();
    });
  }


  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    clearErrors();
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);


  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });


  const isValidEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPass  = val => val.length >= 6;

  const showErr = (input, errEl, msg) => {
    input.classList.add('input-error');
    errEl.textContent = msg;
    errEl.classList.add('show');
  };

  const clearErr = (input, errEl) => {
    input.classList.remove('input-error');
    errEl.classList.remove('show');
  };

  const clearErrors = () => {
    clearErr(loginEmailEl, emailErr);
    clearErr(loginPassEl,  passErr);
    loginForm.reset();
  };

  loginEmailEl.addEventListener('input', () => {
    if (isValidEmail(loginEmailEl.value)) clearErr(loginEmailEl, emailErr);
  });
  loginPassEl.addEventListener('input', () => {
    if (isValidPass(loginPassEl.value)) clearErr(loginPassEl, passErr);
  });

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = loginEmailEl.value;
      const pass  = loginPassEl.value;
      let   valid = true;

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

      loginSubmitBtn.textContent = 'Signing in…';
      loginSubmitBtn.disabled    = true;

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
      const btn  = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Submitted ✓';
      btn.disabled    = true;
      setTimeout(() => {
        contactForm.reset();
        btn.disabled    = false;
        btn.textContent = orig;
      }, 1500);
    });
  }

})();