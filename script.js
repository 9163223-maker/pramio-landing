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
  const form = document.getElementById('contact-form');
  const scrollCue = document.querySelector('[data-scroll-cue]');
  let lastFocus = null;

  const openContact = () => {
    const overlay = getOverlay();
    const panel = getPanel();
    if (!overlay || !panel) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      panel.classList.add('is-open');
      document.body.classList.add('contact-open');
      const firstInput = panel.querySelector('input, textarea, button');
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
  };

  const closeContact = () => {
    const overlay = getOverlay();
    const panel = getPanel();
    if (!overlay || !panel) return;
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.classList.remove('contact-open');
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
    if (event.key === 'Escape' && panel && panel.classList.contains('is-open')) closeContact();
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

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const recipient = form.dataset.recipient || 'hello@pramio.ru';
      const subject = data.get('subject') || 'Обращение с сайта PRAMIO';
      const email = data.get('email') || '';
      const message = data.get('message') || '';
      const body = `E-mail для обратной связи: ${email}\n\nСообщение:\n${message}`;
      window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
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
