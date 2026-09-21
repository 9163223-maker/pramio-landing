(() => {
  const cue = document.querySelector('[data-scroll-cue]');
  const target = document.getElementById('services') || document.getElementById('adminkit');
  const topCue = document.querySelector('[data-scroll-top]');


  const getSecondScreenTop = () => {
    if (!target) return window.scrollY;
    const rect = target.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top;
    const isMobile = window.matchMedia('(max-width: 780px)').matches;

    return Math.max(0, targetTop - ((window.innerHeight - rect.height) / 2));
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
      requestAnimationFrame(() => {
        window.scrollTo({ top: getSecondScreenTop(), behavior: 'smooth' });

        setTimeout(() => {
          target.classList.add('is-visible');
          target.classList.remove('soft-arrive');
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

})();
