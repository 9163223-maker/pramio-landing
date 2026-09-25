(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactViewport = window.matchMedia('(max-width: 780px)').matches;
  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.setProperty('--delay', el.dataset.delay || 0);
  });

  const reveal = () => {
    const h = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      if (el.getBoundingClientRect().top < h * 0.88) el.classList.add('is-visible');
    });
  };
  reveal();
  window.addEventListener('scroll', reveal, { passive: true });

  const getOverlay = () => document.getElementById('contact-overlay');
  const getPanel = () => document.getElementById('contact-panel');
  const scrollCue = document.querySelector('[data-scroll-cue]');
  let lastFocus = null;
  const inertTargets = () => Array.from(document.body.children).filter((el) => el.id !== 'contact-overlay' && el.id !== 'contact-panel' && el.tagName !== 'SCRIPT');
  const setBackgroundInert = (value) => inertTargets().forEach((el) => { if (value) el.setAttribute('inert',''); else el.removeAttribute('inert'); });

  const openContact = () => {
    const overlay = getOverlay();
    const panel = getPanel();
    if (!overlay || !panel) return;
    lastFocus = document.activeElement;
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (menuToggle && mobileNav) {
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.setAttribute('aria-label','Открыть меню');
      mobileNav.hidden = true;
      document.documentElement.classList.remove('mobile-menu-open');
      document.querySelector('.site-header')?.classList.remove('is-menu-open');
    }
    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      panel.classList.add('is-open');
      document.body.classList.add('contact-open');
      setBackgroundInert(true);
      const preferredFocus = panel.querySelector('.service-picker__trigger, input[name="email"], textarea[name="message"], .contact-close');
      if (preferredFocus) preferredFocus.focus({ preventScroll: true });
    });
  };

  const closeContact = () => {
    const overlay = getOverlay();
    const panel = getPanel();
    if (!overlay || !panel) return;
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.classList.remove('contact-open');
    setBackgroundInert(false);
    setTimeout(() => {
      overlay.hidden = true;
      panel.hidden = true;
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    }, 380);
  };

  window.PRAmioContact = { open: openContact, close: closeContact };
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.contact-trigger');
    if (!trigger) return;
    event.preventDefault();
    openContact();
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('.contact-close') || event.target.id === 'contact-overlay') closeContact();
  });
  window.addEventListener('keydown', (event) => {
    const panel = getPanel();
    if (!panel || !panel.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeContact();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'))
      .filter((item) => !item.hidden && item.getAttribute('aria-hidden') !== 'true');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!panel.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const target = document.getElementById('adminkit');
      if (!target) return;
      target.classList.add('soft-arrive');
      target.classList.remove('is-visible');
      requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const offset = Math.max(86, Math.min(window.innerHeight * 0.13, 132));
        const top = window.scrollY + rect.top - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => {
          target.classList.add('is-visible');
          target.classList.remove('soft-arrive');
        }, 360);
      });
    });

    const updateScrollCue = () => {
      if (window.scrollY > 42) scrollCue.classList.add('is-hidden');
      else scrollCue.classList.remove('is-hidden');
    };
    updateScrollCue();
    window.addEventListener('scroll', updateScrollCue, { passive: true });
  }

  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let parallaxFrame = 0;
    window.addEventListener('pointermove', (event) => {
      tx = (event.clientX / window.innerWidth - 0.5) * 18;
      ty = (event.clientY / window.innerHeight - 0.5) * 18;
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(parallax);
    }, { passive: true });

    const parallax = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      document.documentElement.style.setProperty('--px', `${cx}px`);
      document.documentElement.style.setProperty('--py', `${cy}px`);
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) parallaxFrame = requestAnimationFrame(parallax);
      else parallaxFrame = 0;
    };
  }

})();
