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

  const getSecondScreenTop = () => {
    if (!target) return window.scrollY;
    const rect = target.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top;
    const isMobile = window.matchMedia('(max-width: 780px)').matches;

    if (!isMobile || !footer) {
      return Math.max(0, targetTop - ((window.innerHeight - rect.height) / 2));
    }

    const footerRect = footer.getBoundingClientRect();
    const footerHeight = footerRect.height || 0;
    const gap = Math.min(18, Math.max(10, window.innerHeight * 0.018));
    const safeBottom = Math.max(26, (window.visualViewport ? window.visualViewport.height : window.innerHeight) * 0.035);
    const available = (window.visualViewport ? window.visualViewport.height : window.innerHeight) - safeBottom;
    const combinedHeight = rect.height + gap + footerHeight;
    const desiredTopInViewport = Math.max(12, (available - combinedHeight) / 2);

    return Math.max(0, targetTop - desiredTopInViewport);
  };

  if (cue && target) {
    cue.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      target.classList.add('soft-arrive');
      target.classList.remove('is-visible');
      if (footer) footer.classList.remove('footer-arrive');

      requestAnimationFrame(() => {
        window.scrollTo({ top: getSecondScreenTop(), behavior: 'smooth' });

        setTimeout(() => {
          target.classList.add('is-visible');
          target.classList.remove('soft-arrive');
          revealFooter(440);
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
