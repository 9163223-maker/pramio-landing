(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    }, { passive: true });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const startedAt = form.querySelector('[name="started_at"]');
    if (startedAt) startedAt.value = String(Date.now());

    const tokenInput = form.querySelector('[name="form_token"]');
    if (tokenInput) {
      fetch('/send.php?form_token=1', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('token_failed')))
        .then((result) => { if (result.token) tokenInput.value = result.token; })
        .catch(() => { tokenInput.value = ''; });
    }

    const requestedService = new URLSearchParams(window.location.search).get('service');
    const serviceSelect = form.querySelector('[name="service"]');
    if (requestedService && serviceSelect) {
      const option = Array.from(serviceSelect.options).find((item) => item.text === requestedService);
      if (option) serviceSelect.value = option.value;
    }

    if (serviceSelect) {
      const field = serviceSelect.closest('.service-field');
      const label = field && field.querySelector('label');
      const picker = document.createElement('div');
      const trigger = document.createElement('button');
      const current = document.createElement('span');
      const arrow = document.createElement('span');
      const menu = document.createElement('div');
      const options = Array.from(serviceSelect.options);
      const required = serviceSelect.required;
      let activeIndex = serviceSelect.selectedIndex > 0 ? serviceSelect.selectedIndex - 1 : 0;

      picker.className = 'service-picker';
      trigger.type = 'button';
      trigger.className = 'service-picker__trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', 'contact-service-options');
      if (label) trigger.setAttribute('aria-labelledby', `${label.id || 'contact-service-label'} contact-service-current`);
      current.className = 'service-picker__current';
      current.id = 'contact-service-current';
      current.textContent = options[serviceSelect.selectedIndex].text;
      arrow.className = 'service-picker__arrow';
      arrow.setAttribute('aria-hidden', 'true');
      trigger.append(current, arrow);

      menu.className = 'service-picker__menu';
      menu.id = 'contact-service-options';
      menu.setAttribute('role', 'listbox');
      menu.setAttribute('aria-label', label ? label.textContent : 'Что вас интересует');
      menu.hidden = true;

      if (label && !label.id) label.id = 'contact-service-label';

      const closePicker = (restoreFocus = false) => {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        picker.classList.remove('is-open');
        if (restoreFocus) trigger.focus();
      };

      const focusOption = (index) => {
        const items = Array.from(menu.querySelectorAll('[role="option"]'));
        if (!items.length) return;
        activeIndex = Math.min(Math.max(index, 0), items.length - 1);
        items[activeIndex].focus();
      };

      const openPicker = (index = activeIndex) => {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        picker.classList.add('is-open');
        window.requestAnimationFrame(() => focusOption(index));
      };

      const selectOption = (optionIndex) => {
        const option = options[optionIndex + 1];
        if (!option) return;
        serviceSelect.value = option.value;
        current.textContent = option.text;
        menu.querySelectorAll('[role="option"]').forEach((item, index) => {
          item.setAttribute('aria-selected', String(index === optionIndex));
        });
        picker.classList.remove('is-invalid');
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        activeIndex = optionIndex;
        closePicker(true);
      };

      options.slice(1).forEach((option, optionIndex) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'service-picker__option';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(serviceSelect.value === option.value));
        item.tabIndex = -1;
        item.textContent = option.text;
        item.addEventListener('click', () => selectOption(optionIndex));
        item.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); focusOption(optionIndex + 1); }
          if (event.key === 'ArrowUp') { event.preventDefault(); focusOption(optionIndex - 1); }
          if (event.key === 'Home') { event.preventDefault(); focusOption(0); }
          if (event.key === 'End') { event.preventDefault(); focusOption(options.length - 2); }
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectOption(optionIndex); }
          if (event.key === 'Escape' || event.key === 'Tab') closePicker(event.key === 'Escape');
        });
        menu.append(item);
      });

      trigger.addEventListener('click', () => {
        if (menu.hidden) openPicker(); else closePicker();
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPicker(activeIndex);
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          openPicker(options.length - 2);
        }
      });

      document.addEventListener('pointerdown', (event) => {
        if (!picker.contains(event.target)) closePicker();
      });

      form.addEventListener('submit', (event) => {
        if (!required || serviceSelect.value) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        picker.classList.add('is-invalid');
        trigger.focus();
      }, true);

      form.addEventListener('reset', () => {
        window.requestAnimationFrame(() => {
          serviceSelect.value = '';
          current.textContent = options[0].text;
          picker.classList.remove('is-invalid');
          menu.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', 'false'));
        });
      });

      serviceSelect.required = false;
      serviceSelect.tabIndex = -1;
      serviceSelect.setAttribute('aria-hidden', 'true');
      serviceSelect.classList.add('service-picker__native');
      picker.append(trigger, menu);
      serviceSelect.insertAdjacentElement('afterend', picker);
    }
  }

  const openFromHash = () => {
    if (window.location.hash !== '#contact') return;
    const trigger = document.querySelector('.contact-trigger');
    if (trigger) window.setTimeout(() => trigger.click(), 80);
  };

  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  const motionTargets = [
    document.querySelector('.hero-symbol'),
    document.querySelector('.product-v2')
  ].filter(Boolean);

  if ('IntersectionObserver' in window && motionTargets.length) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
    }, { rootMargin: '80px 0px' });
    motionTargets.forEach((target) => motionObserver.observe(target));
  }
})();
