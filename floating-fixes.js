(() => {
  const cue = document.querySelector('[data-scroll-cue]');
  const target = document.getElementById('adminkit');
  const footer = document.querySelector('.footer');

  const revealFooter = (delay = 720) => {
    if (!footer || footer.classList.contains('footer-arrive')) return;
    window.setTimeout(() => {
      footer.classList.add('footer-arrive');
    }, delay);
  };

  if (cue && target) {
    cue.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      target.classList.add('soft-arrive');
      target.classList.remove('is-visible');
      if (footer) footer.classList.remove('footer-arrive');

      requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const top = Math.max(0, window.scrollY + rect.top - ((window.innerHeight - rect.height) / 2));

        window.scrollTo({ top, behavior: 'smooth' });

        setTimeout(() => {
          target.classList.add('is-visible');
          target.classList.remove('soft-arrive');
          revealFooter(520);
        }, 420);
      });
    }, true);
  }

  if (target && footer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
          revealFooter(620);
        }
      });
    }, { threshold: [0.42, 0.58] });

    observer.observe(target);
  }
})();
