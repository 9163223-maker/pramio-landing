(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    }, { passive: true });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const startedAt = form.querySelector('[name="started_at"]');
    if (startedAt) startedAt.value = String(Date.now());

    const tokenInput = form.querySelector('[name="form_token"]');
    if (tokenInput) {
      fetch('/send.php?form_token=1', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('token_failed')))
        .then((result) => { if (result.token) tokenInput.value = result.token; })
        .catch(() => { tokenInput.value = ''; });
    }

    const requestedService = new URLSearchParams(window.location.search).get('service');
    const serviceSelect = form.querySelector('[name="service"]');
    if (requestedService && serviceSelect) {
      const option = Array.from(serviceSelect.options).find((item) => item.text === requestedService);
      if (option) serviceSelect.value = option.value;
    }
  }

  const openFromHash = () => {
    if (window.location.hash !== '#contact') return;
    const trigger = document.querySelector('.contact-trigger');
    if (trigger) window.setTimeout(() => trigger.click(), 80);
  };

  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  const motionTargets = [
    document.querySelector('.hero-symbol'),
    document.querySelector('.product-v2')
  ].filter(Boolean);

  if ('IntersectionObserver' in window && motionTargets.length) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
    }, { rootMargin: '80px 0px' });
    motionTargets.forEach((target) => motionObserver.observe(target));
  }
})();
