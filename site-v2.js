/* public-path-owner-v1 */
const PRAMIO_SITE_BASE = location.hostname.endsWith('github.io') ? '/pramio-landing/' : '/';
const PRAMIO_SITE_URL = (path='') => PRAMIO_SITE_BASE + String(path).replace(/^\//,'');
/* global-contact-v4 */
(() => {
  const ensureContactPanel = () => {
    if (!document.getElementById('contact-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'contact-overlay';
      overlay.id = 'contact-overlay';
      overlay.hidden = true;
      document.body.append(overlay);
    }
    let panel = document.getElementById('contact-panel');
    if (panel) return panel;
    panel = document.createElement('aside');
    panel.className = 'contact-panel';
    panel.id = 'contact-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','contact-title');
    panel.hidden = true;
    panel.innerHTML = '<button class="contact-close" type="button" aria-label="Закрыть форму">×</button><p class="eyebrow contact-eyebrow"><span></span> связь с PRAMIO</p><h2 id="contact-title">Обсудить задачу</h2><p class="contact-intro">Расскажите о задаче своими словами — мы уточним вводные и ответим на указанный e-mail.</p><form class="contact-form" id="contact-form" data-recipient="hello@pramio.ru" data-endpoint="__SEND_ENDPOINT__"><div class="service-field"><label for="contact-service">Что вас интересует</label><select id="contact-service" name="service" required><option value="">Выберите направление</option><option>Лендинг или небольшой сайт</option><option>Telegram-бот</option><option>Бот или решение для MAX</option><option>AI-ассистент или автоматизация</option><option>Интерактивный сервис или поддержка</option><option>АдминКИТ</option><option>Другая задача</option></select></div><label><span>E-mail для ответа</span><input class="ym-disable-keys" name="email" type="email" autocomplete="email" placeholder="name@example.com" required maxlength="160"></label><label><span>Коротко о задаче</span><textarea class="ym-disable-keys" name="message" rows="5" placeholder="Что нужно сделать и какой результат вы ожидаете" required maxlength="3000"></textarea></label><label class="privacy-consent"><input name="consent" type="checkbox" value="1" required><span>Я соглашаюсь на обработку указанных данных в соответствии с <a href="__PRIVACY_URL__" target="_blank">Политикой обработки персональных данных</a>.</span></label><label class="form-trap" aria-hidden="true"><span>Сайт</span><input name="website" type="text" tabindex="-1" autocomplete="off"></label><input name="started_at" type="hidden" value=""><input name="form_token" type="hidden" value=""><button class="btn primary contact-submit" type="submit">Отправить запрос</button><p class="form-note" role="status" aria-live="polite">Форма защищена от автоматических отправок. Для оценки достаточно короткого описания задачи.</p></form>';
    panel.innerHTML = panel.innerHTML.replace('__SEND_ENDPOINT__', PRAMIO_SITE_URL('send.php')).replace('__PRIVACY_URL__', PRAMIO_SITE_URL('privacy/'));
    document.body.append(panel);
    window.setTimeout(() => {
      if (document.querySelector('script[data-pramio-form-handler]')) return;
      const handler = document.createElement('script');
      handler.src = PRAMIO_SITE_URL('form-handler.js?v=36');
      handler.dataset.pramioFormHandler = '1';
      document.body.append(handler);
    }, 0);
    return panel;
  };
  ensureContactPanel();
  const normalizeContactService = (value) => {
    const aliases = {
      'Бот MAX для заявок':'Бот или решение для MAX',
      'Бот MAX для бизнеса':'Бот или решение для MAX',
      'Кнопки и диплинки MAX':'Бот или решение для MAX',
      'Автоматизация канала MAX':'Бот или решение для MAX',
      'Бот для канала MAX':'Бот или решение для MAX',
      'Модерация комментариев MAX':'Бот или решение для MAX',
      'Интеграция MAX с CRM':'Бот или решение для MAX',
      'Лид-магнит в MAX':'Бот или решение для MAX',
      'Mini App для MAX':'Бот или решение для MAX'
    };
    return aliases[value] || value;
  };
  const contactLinks = document.querySelectorAll('a[href*="#contact"]');
  contactLinks.forEach((link) => {
    let url;
    try { url = new URL(link.href, window.location.origin); } catch (_) { return; }
    if (url.origin !== window.location.origin || url.hash !== '#contact') return;
    const requestedService = url.searchParams.get('service');
    link.classList.add('contact-trigger');
    link.setAttribute('aria-haspopup','dialog');
    link.setAttribute('aria-controls','contact-panel');
    link.addEventListener('click', (event) => {
      /* The contact panel exists on every public page. Open it in place instead of
         navigating service/article visitors through the home page first. */
      /* script.js is the single owner of opening .contact-trigger dialogs.
         This local listener only preserves in-place navigation and service preselection. */
      event.preventDefault();
      if (!requestedService) return;
      const select = document.querySelector('#contact-form [name="service"]');
      if (!select) return;
      const normalizedService = normalizeContactService(requestedService);
      const option = Array.from(select.options).find((item) => item.text === normalizedService || item.value === normalizedService);
      if (option) {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles:true }));
      }
    });
  });
  document.querySelectorAll('.site-nav a[href="/#contact"],.mobile-nav a[href="/#contact"]').forEach((link) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = (link.className ? link.className + ' ' : '') + 'contact-trigger';
    button.setAttribute('aria-haspopup','dialog');
    button.setAttribute('aria-controls','contact-panel');
    button.textContent = link.textContent;
    link.replaceWith(button);
  });
  if (!document.querySelector('.pramio-contact-fab')) {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'pramio-contact-fab contact-trigger';
    fab.setAttribute('aria-haspopup','dialog');
    fab.setAttribute('aria-controls','contact-panel');
    fab.setAttribute('aria-label','Связаться с PRAMIO — открыть форму');
    fab.textContent = 'Задать вопрос';
    document.body.append(fab);
  }
})();

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
      fetch(PRAMIO_SITE_URL('send.php?form_token=1'), {
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
      const normalizedService = normalizeContactService(requestedService);
      const option = Array.from(serviceSelect.options).find((item) => item.text === normalizedService || item.value === normalizedService);
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

      const syncPicker = () => {
        const selectedIndex = serviceSelect.selectedIndex;
        const selected = options[selectedIndex] || options[0];
        current.textContent = selected.text;
        activeIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
        menu.querySelectorAll('[role="option"]').forEach((item, index) => {
          item.setAttribute('aria-selected', String(selectedIndex > 0 && index === activeIndex));
        });
        if (selectedIndex > 0) picker.classList.remove('is-invalid');
      };

      serviceSelect.addEventListener('change', syncPicker);

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

  const motionTargets = [document.querySelector('.product-v2')].filter(Boolean);

  if ('IntersectionObserver' in window && motionTargets.length) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
    }, { rootMargin: '80px 0px' });
    motionTargets.forEach((target) => motionObserver.observe(target));
  }
  /* consent-manager-v1 */
  const PRAMIO_CONSENT_KEY = 'pramio_cookie_consent_v1';
  const METRIKA_ID = 111572606;
  let metrikaLoaded = false;

  const loadMetrika = () => {
    if (metrikaLoaded || document.querySelector('script[data-pramio-metrika]')) return;
    metrikaLoaded = true;
    window.ym = window.ym || function(){ (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = 1 * new Date();
    const script = document.createElement('script');
    script.async = true;
    script.dataset.pramioMetrika = '1';
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID;
    script.onload = () => {
      window.ym(METRIKA_ID,'init',{
        ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',
        referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true
      });
    };
    document.head.append(script);
  };

  const readConsent = () => {
    try { return JSON.parse(localStorage.getItem(PRAMIO_CONSENT_KEY) || 'null'); } catch (_) { return null; }
  };
  const saveConsent = (analytics) => {
    const value = { necessary:true, analytics:Boolean(analytics), updatedAt:new Date().toISOString() };
    try { localStorage.setItem(PRAMIO_CONSENT_KEY, JSON.stringify(value)); } catch (_) {}
    if (value.analytics) loadMetrika();
    return value;
  };

  const ensureCookieUi = () => {
    let panel = document.querySelector('.cookie-consent');
    if (panel) return panel;
    panel = document.createElement('aside');
    panel.className = 'cookie-consent';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','false');
    panel.setAttribute('aria-labelledby','cookie-title');
    panel.hidden = true;
    panel.innerHTML = '<div class="cookie-consent__head"><div class="cookie-consent__icon" aria-hidden="true">◌</div><div><h2 id="cookie-title">Мы используем cookie</h2><p>Необходимые данные нужны для работы сайта. Аналитические cookie Яндекс Метрики включаются только с вашего согласия. Подробнее — в <a href="__COOKIE_PRIVACY__">политике обработки данных</a>.</p></div></div><div class="cookie-consent__actions"><button class="cookie-accept" type="button">Принять все</button><button class="cookie-settings" type="button">Настройки</button></div><div class="cookie-preferences" hidden><div class="cookie-pref-row"><span>Необходимые<small>Работа интерфейса и сохранение выбора</small></span><label class="cookie-switch is-fixed" aria-label="Необходимые cookie всегда включены"><input type="checkbox" checked disabled><i></i></label></div><div class="cookie-pref-row"><span>Аналитика<small>Яндекс Метрика и Вебвизор</small></span><label class="cookie-switch"><input class="cookie-analytics-toggle" type="checkbox"><i></i></label></div><div class="cookie-consent__actions"><button class="cookie-accept cookie-save" type="button">Сохранить выбор</button><button class="cookie-settings cookie-essential" type="button">Только необходимые</button></div></div>';
    panel.innerHTML = panel.innerHTML.replace('__COOKIE_PRIVACY__', PRAMIO_SITE_URL('privacy/'));
    document.body.append(panel);

    const preferences = panel.querySelector('.cookie-preferences');
    const analyticsToggle = panel.querySelector('.cookie-analytics-toggle');
    panel.querySelector('.cookie-accept:not(.cookie-save)').addEventListener('click', () => {
      saveConsent(true); panel.hidden = true;
    });
    panel.querySelector('.cookie-settings:not(.cookie-essential)').addEventListener('click', () => {
      preferences.hidden = !preferences.hidden;
    });
    panel.querySelector('.cookie-save').addEventListener('click', () => {
      saveConsent(analyticsToggle.checked); panel.hidden = true;
    });
    panel.querySelector('.cookie-essential').addEventListener('click', () => {
      saveConsent(false); panel.hidden = true;
    });
    return panel;
  };

  const openCookieSettings = () => {
    const panel = ensureCookieUi();
    const current = readConsent();
    const toggle = panel.querySelector('.cookie-analytics-toggle');
    if (toggle) toggle.checked = Boolean(current && current.analytics);
    const preferences = panel.querySelector('.cookie-preferences');
    if (preferences) preferences.hidden = false;
    panel.hidden = false;
  };

  const consent = readConsent();
  if (consent && consent.analytics) loadMetrika();
  const cookiePanel = ensureCookieUi();
  if (!consent) cookiePanel.hidden = false;

  document.querySelectorAll('.site-footer').forEach((footer) => {
    const summary = footer.querySelector(':scope > p');
    if (summary && !footer.querySelector('.footer-summary-link')) {
      const link = document.createElement('a');
      link.className = 'footer-summary-link';
      link.href = PRAMIO_SITE_URL('services/');
      link.textContent = summary.textContent;
      link.setAttribute('aria-label', 'Перейти ко всем услугам PRAMIO');
      summary.replaceWith(link);
    }
  });

  document.querySelectorAll('.site-footer nav').forEach((nav) => {
    if (nav.querySelector('.cookie-settings-link')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cookie-settings-link';
    btn.textContent = 'Настройки cookie';
    btn.addEventListener('click', openCookieSettings);
    nav.append(btn);
  });

})();


/* Whole-card navigation + footer-aware FAB — 2026-09-20 */
(() => {
  const cards = document.querySelectorAll('.service-card--link,.feature-card--link,.link-card');
  cards.forEach((card) => {
    const link = card.querySelector('a[href]');
    if (!link || card.dataset.wholeCard === '1') return;
    card.dataset.wholeCard = '1';
    card.setAttribute('role','link');
    card.tabIndex = card.hasAttribute('tabindex') ? card.tabIndex : 0;
    const go = () => { window.location.href = link.href; };
    card.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.target.closest('button,input,select,textarea,label')) return;
      go();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target !== card) return;
      event.preventDefault();
      go();
    });
  });

  const footer = document.querySelector('.site-footer');
  if (footer && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      document.body.classList.toggle('footer-in-view', entries.some((entry) => entry.isIntersecting));
    }, { rootMargin:'0px 0px 40px 0px', threshold:.04 });
    footerObserver.observe(footer);
  }
})();


/* Keep the floating contact CTA clear of conversion/navigation zones — 2026-09-21 */
(() => {
  if (!('IntersectionObserver' in window)) return;
  const zones = [...document.querySelectorAll('.final-cta,.contact-panel,.site-footer')];
  if (!zones.length) return;
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    document.body.classList.toggle('fab-safe-zone', visible.size > 0);
  }, { rootMargin:'0px 0px 72px 0px', threshold:.02 });
  zones.forEach((zone) => observer.observe(zone));
})();


/* mobile-surface-v55: one owner for viewport backdrop and expanded navigation */
(() => {
  if (!document.querySelector('.site-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.className = 'site-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.prepend(backdrop);
  }
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (header && nav && toggle) {
    const sync = () => {
      const open = toggle.getAttribute('aria-expanded') === 'true' && !nav.hidden;
      document.documentElement.classList.toggle('mobile-menu-open', open);
      header.classList.toggle('is-menu-open', open);
    };
    toggle.addEventListener('click', () => requestAnimationFrame(sync));
    nav.querySelectorAll('a,button').forEach(el => el.addEventListener('click', () => requestAnimationFrame(sync)));
    window.addEventListener('resize', () => requestAnimationFrame(sync), {passive:true});
    sync();
  }
})();


/* Signal Rivers — approved production ambient, same behavior class as preview 11 */
(() => {
  if (document.querySelector('.pramio-signal-rivers')) return;
  const canvas=document.createElement('canvas');
  canvas.className='pramio-signal-rivers';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx) return;
  let W=0,H=0,D=1,px=0,py=0,tx=0,ty=0,raf=0;
  const B=[52,120,205],C=[36,169,203],O=[242,138,50];
  const rgba=(q,a)=>'rgba('+q.join(',')+','+a+')';
  const resize=()=>{W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0);};
  const path=(seed,t,amp,col,a,lw)=>{
    ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw;ctx.beginPath();
    for(let xx=-40;xx<W+40;xx+=7){const yy=H*(seed+.08*Math.sin(xx/W*6.28+seed*9+t)+amp*Math.sin(xx/W*12.5-t*.7+seed*13));if(xx<0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}
    ctx.stroke();
  };
  const dot=(x,y,r,col,a)=>{ctx.fillStyle=rgba(col,a);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();};
  const draw=(ms)=>{
    const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f9fcff');g.addColorStop(.52,'#eaf4ff');g.addColorStop(1,'#fff8f3');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    px+=(tx-px)*.055;py+=(ty-py)*.055;ctx.save();ctx.translate(px,py);
    const t=ms*.00038;
    for(let i=0;i<9;i++){
      const seed=.08+i*.105,sp=t*(.35+i*.025),col=i===6?O:(i%3===0?C:B);
      path(seed,sp,.045,col,i===6?.28:.29,.75);
      if(i%2===0){const a=(t*.11+i*.173)%1,xx=W*a,yy=H*(seed+.08*Math.sin(xx/W*6.28+seed*9+sp)+.045*Math.sin(xx/W*12.5-sp*.7+seed*13));const pulse=1+.22*Math.sin(t*3+i);dot(xx,yy,(i===6?5.4:4.1)*pulse,col,i===6?.55:.42);}
    }
    ctx.restore();raf=requestAnimationFrame(draw);
  };
  addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',e=>{tx=(e.clientX/Math.max(W,1)-.5)*32;ty=(e.clientY/Math.max(H,1)-.5)*24;},{passive:true});
  if(window.DeviceOrientationEvent)addEventListener('deviceorientation',e=>{if(e.gamma!=null){tx=Math.max(-30,Math.min(30,e.gamma*.72));ty=Math.max(-22,Math.min(22,(e.beta||0)*.28));}},{passive:true});
  resize();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(0);cancelAnimationFrame(raf);}else raf=requestAnimationFrame(draw);
})();
