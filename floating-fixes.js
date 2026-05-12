(() => {
  const cue = document.querySelector('[data-scroll-cue]');
  const target = document.getElementById('adminkit');

  if (cue && target) {
    cue.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      target.classList.add('soft-arrive');
      target.classList.remove('is-visible');

      requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const top = Math.max(0, window.scrollY + rect.top - ((window.innerHeight - rect.height) / 2));

        window.scrollTo({ top, behavior: 'smooth' });

        setTimeout(() => {
          target.classList.add('is-visible');
          target.classList.remove('soft-arrive');
        }, 420);
      });
    }, true);
  }
})();
