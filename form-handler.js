(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('.form-note');
  const endpoint = form.dataset.endpoint || '/send.php';

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const submit = form.querySelector('[type="submit"]');
    const data = new FormData(form);

    if (submit) submit.disabled = true;
    setStatus('Отправляем сообщение...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.error || 'send_failed');
      form.reset();
      setStatus('Спасибо! Сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    } catch (error) {
      setStatus('Не удалось отправить форму. Напишите нам на hello@pramio.ru.');
    } finally {
      if (submit) submit.disabled = false;
    }
  }, true);
})();
