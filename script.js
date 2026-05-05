(() => {
  
  const loader = document.getElementById('loader');
  const start = performance.now();
  window.addEventListener('load', () => {
    const delay = Math.max(900 - (performance.now() - start), 0);
    setTimeout(() => {
      if(loader) loader.classList.add('hide');
    }, delay);
  });

  
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      });
    });

    
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
        menuBtn.textContent = '☰';
      }
    });
  }

  
  const navVideo = document.getElementById('navVideo');
  const navOverlay = document.getElementById('navOverlay');
  if (navVideo) {
    navVideo.addEventListener('loadeddata', () => {
      navVideo.classList.add('active');
      if(navOverlay) navOverlay.classList.add('active');
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

  
  const notfound = document.getElementById('notfound');
  const routeCheck = () => {
    if (notfound) {
      const hash = window.location.hash;
      notfound.classList.toggle('active', hash === '#notfound');
    }
  };
  routeCheck();
  window.addEventListener('hashchange', routeCheck);
})();