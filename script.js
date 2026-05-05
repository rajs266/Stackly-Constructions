(() => {
  const loader = document.getElementById('loader');
  const start = performance.now();
  window.addEventListener('load', () => {
    const delay = Math.max(700 - (performance.now() - start), 0);
    setTimeout(() => loader.classList.add('hide'), delay);
  });

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navWrap = document.querySelector('.nav-wrap');

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    
    if (isOpen) {
      navLinks.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      navLinks.style.display = '';
      document.body.style.overflow = '';
    }
  };

  menuBtn.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navLinks.style.display = '';
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navWrap.contains(e.target)) {
      navLinks.classList.remove('open');
      navLinks.style.display = '';
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  const navVideo = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');
  if (navVideo) {
    const enableVideo = () => {
      navVideo.classList.add('active');
      navOverlay.classList.add('active');
    };
    navVideo.addEventListener('loadeddata', enableVideo);
    navVideo.addEventListener('error', () => {
      navVideo.classList.remove('active');
      navOverlay.classList.remove('active');
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const text = btn.textContent;
      btn.textContent = 'Submitted';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = text;
      }, 1500);
    });
  }
})();