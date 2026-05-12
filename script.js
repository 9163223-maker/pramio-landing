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
  const scrollCue = document.querySelector('[data-scroll-cue]');
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

  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const target = document.getElementById('adminkit');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const sphere = document.querySelector('.glass-sphere');
  const orbitAtoms = [
    { el: document.querySelector('.atom-a'), line: document.querySelector('.orbit-a'), duration: 9000, phase: 0.08, min: 0.86, max: 1.08, opacityMin: 0.55, opacityMax: 1 },
    { el: document.querySelector('.atom-b'), line: document.querySelector('.orbit-b'), duration: 11800, phase: 0.44, min: 0.78, max: 1, opacityMin: 0.42, opacityMax: 0.88 },
    { el: document.querySelector('.atom-c'), line: document.querySelector('.orbit-c'), duration: 14000, phase: 0.72, min: 0.68, max: 0.9, opacityMin: 0.24, opacityMax: 0.56 }
  ];

  const getOrbitGeometry = (line) => {
    const computed = window.getComputedStyle(line);
    const width = parseFloat(computed.width) || 0;
    const height = parseFloat(computed.height) || 0;
    const rotateRaw = computed.getPropertyValue('--orbit-rotate') || '0deg';
    const tilt = parseFloat(rotateRaw) * Math.PI / 180;
    return { rx: width / 2, ry: height / 2, tilt };
  };

  const setAtom = (atom, time) => {
    if (!atom.el || !atom.line || !heroSymbol || !sphere) return;

    const hostRect = heroSymbol.getBoundingClientRect();
    const sphereRect = sphere.getBoundingClientRect();
    const centerX = sphereRect.left - hostRect.left + sphereRect.width / 2;
    const centerY = sphereRect.top - hostRect.top + sphereRect.height / 2;
    const orbit = getOrbitGeometry(atom.line);
    const t = ((time / atom.duration) + atom.phase) * Math.PI * 2;

    const x = Math.cos(t) * orbit.rx;
    const y = Math.sin(t) * orbit.ry;
    const xr = x * Math.cos(orbit.tilt) - y * Math.sin(orbit.tilt);
    const yr = x * Math.sin(orbit.tilt) + y * Math.cos(orbit.tilt);
    const front = (Math.sin(t) + 1) / 2;
    const scale = atom.min + front * (atom.max - atom.min);
    const opacity = atom.opacityMin + front * (atom.opacityMax - atom.opacityMin);

    atom.el.style.transform = `translate3d(${centerX + xr}px, ${centerY + yr}px, 0) translate(-50%, -50%) scale(${scale})`;
    atom.el.style.opacity = opacity.toFixed(3);
    atom.el.style.zIndex = front > 0.5 ? '6' : '3';
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
