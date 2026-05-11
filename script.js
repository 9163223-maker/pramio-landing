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

  const canvas = document.getElementById('space');
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(54, Math.max(20, Math.floor(width / 34)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      a: Math.random() * 0.32 + 0.10
    }));
  }

  function draw() {
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

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      grad.addColorStop(0, `rgba(20,102,255,${p.a})`);
      grad.addColorStop(1, 'rgba(20,102,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 136) {
          ctx.strokeStyle = `rgba(20,102,255,${(1 - dist / 136) * 0.052})`;
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
