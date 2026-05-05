(() => {
  /* ── Loader ── */
  const loader = document.getElementById('loader');
  const start  = performance.now();
  window.addEventListener('load', () => {
    const delay = Math.max(700 - (performance.now() - start), 0);
    setTimeout(() => loader.classList.add('hide'), delay);
  });

  /* ── Mobile Menu ── */
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

  const toggleMenu = () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  };

  if (menuBtn) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  /* Nav link click → close menu */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Outside click → close menu */
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navWrap.contains(e.target)) {
      closeMenu();
    }
  });

  /* Resize to desktop → close menu */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });

  /* ── Nav Video ── */
  const navVideo   = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');
  if (navVideo) {
    navVideo.addEventListener('loadeddata', () => {
      navVideo.classList.add('active');
      navOverlay.classList.add('active');
    });
  }

  /* ── Scroll Reveal ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ── Contact Form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) return;
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Submitted ✓';
      btn.disabled    = true;
      setTimeout(() => {
        form.reset();
        btn.disabled    = false;
        btn.textContent = orig;
      }, 1500);
    });
  }
})();