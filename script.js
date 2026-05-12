(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const overlay = document.getElementById('contact-overlay');
  const panel = document.getElementById('contact-panel');
  const triggers = document.querySelectorAll('.contact-trigger');
  const close = document.querySelector('.contact-close');
  const form = document.getElementById('contact-form');
  let lastFocus = null;

  const openContact = () => {
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

  triggers.forEach((button) => button.addEventListener('click', openContact));
  if (close) close.addEventListener('click', closeContact);
  if (overlay) overlay.addEventListener('click', closeContact);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel && panel.classList.contains('is-open')) closeContact();
  });

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
    window.addEventListener('pointermove', (event) => {
      tx = (event.clientX / window.innerWidth - 0.5) * 18;
      ty = (event.clientY / window.innerHeight - 0.5) * 18;
    }, { passive: true });

    const parallax = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      document.documentElement.style.setProperty('--px', `${cx}px`);
      document.documentElement.style.setProperty('--py', `${cy}px`);
      requestAnimationFrame(parallax);
    };
    parallax();
  }

  const heroSymbol = document.querySelector('.hero-symbol');
  const orbitAtoms = [
    { el: document.querySelector('.atom-a'), rx: 0.44, ry: 0.18, tilt: -18, duration: 9500, phase: 0.04, min: 0.62, max: 1.08, opacityMin: 0.44, opacityMax: 0.98 },
    { el: document.querySelector('.atom-b'), rx: 0.41, ry: 0.18, tilt: 28, duration: 12500, phase: 0.56, min: 0.56, max: 0.96, opacityMin: 0.36, opacityMax: 0.86 },
    { el: document.querySelector('.atom-c'), rx: 0.34, ry: 0.215, tilt: 72, duration: 15000, phase: 0.22, min: 0.50, max: 0.82, opacityMin: 0.20, opacityMax: 0.58 }
  ];

  const setAtom = (atom, time) => {
    if (!atom.el || !heroSymbol) return;
    const rect = heroSymbol.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const t = ((time / atom.duration) + atom.phase) * Math.PI * 2;
    const x = Math.cos(t) * rect.width * atom.rx;
    const y = Math.sin(t) * rect.height * atom.ry;
    const tilt = atom.tilt * Math.PI / 180;
    const xr = x * Math.cos(tilt) - y * Math.sin(tilt);
    const yr = x * Math.sin(tilt) + y * Math.cos(tilt);
    const front = (Math.sin(t) + 1) / 2;
    const scale = atom.min + front * (atom.max - atom.min);
    const opacity = atom.opacityMin + front * (atom.opacityMax - atom.opacityMin);
    atom.el.style.transform = `translate3d(${cx + xr}px, ${cy + yr}px, 0) translate(-50%, -50%) scale(${scale})`;
    atom.el.style.opacity = opacity.toFixed(3);
    atom.el.style.zIndex = front > 0.50 ? '6' : '2';
  };

  const animateAtoms = (time) => {
    if (!prefersReduced) {
      orbitAtoms.forEach((atom) => setAtom(atom, time));
      requestAnimationFrame(animateAtoms);
    }
  };
  if (!prefersReduced) requestAnimationFrame(animateAtoms);

  const canvas = document.getElementById('space');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(22, Math.max(8, Math.floor(width / 82)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.05 + 0.35,
      vx: (Math.random() - 0.5) * 0.065,
      vy: (Math.random() - 0.5) * 0.065,
      a: Math.random() * 0.10 + 0.035
    }));
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -12) p.x = width + 12;
      if (p.x > width + 12) p.x = -12;
      if (p.y < -12) p.y = height + 12;
      if (p.y > height + 12) p.y = -12;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
      grad.addColorStop(0, `rgba(20,102,255,${p.a})`);
      grad.addColorStop(1, 'rgba(20,102,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 112) {
          ctx.strokeStyle = `rgba(20,102,255,${(1 - dist / 112) * 0.015})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    ctx.restore();
    if (!prefersReduced) requestAnimationFrame(draw);
  }

  resize();
  if (!prefersReduced) draw();
  window.addEventListener('resize', resize, { passive: true });
})();
