(() => {
  const cue = document.querySelector('[data-scroll-cue]');
  const target = document.getElementById('adminkit');
  const footer = document.querySelector('.footer');
  const topCue = document.querySelector('[data-scroll-top]');

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

  const updateTopCue = () => {
    if (!topCue) return;
    if (window.scrollY > Math.max(260, window.innerHeight * 0.58)) {
      topCue.classList.add('is-visible');
      topCue.classList.remove('is-hidden');
    } else {
      topCue.classList.remove('is-visible');
      topCue.classList.add('is-hidden');
    }
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
          updateTopCue();
        }, 420);
      });
    }, true);
  }

  if (topCue) {
    topCue.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(updateTopCue, 360);
    });
    updateTopCue();
    window.addEventListener('scroll', updateTopCue, { passive: true });
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
