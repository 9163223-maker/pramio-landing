(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('.form-note');
  const endpoint = form.dataset.endpoint || '/send.php';

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const invalidMessage = (field) => {
    if (field.name === 'email') return field.value.trim() ? 'Укажите корректный e-mail.' : 'Укажите e-mail для ответа.';
    if (field.name === 'message') return 'Коротко опишите задачу.';
    if (field.name === 'consent') return 'Подтвердите согласие на обработку данных.';
    return 'Заполните это поле.';
  };
  const clearInvalid = (field) => {
    field.removeAttribute('aria-invalid');
    field.setCustomValidity('');
  };
  form.querySelectorAll('input[required],textarea[required]').forEach((field) => {
    field.addEventListener('input', () => clearInvalid(field));
    field.addEventListener('change', () => clearInvalid(field));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const invalid = [...form.querySelectorAll('input[required],textarea[required]')].find((field) => !field.validity.valid);
    if (invalid) {
      invalid.setAttribute('aria-invalid','true');
      invalid.setCustomValidity(invalidMessage(invalid));
      setStatus(invalidMessage(invalid));
      invalid.focus({ preventScroll:true });
      invalid.reportValidity();
      return;
    }

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
      const startedAt = form.querySelector('[name="started_at"]');
      if (startedAt) startedAt.value = String(Date.now());
      const tokenInput = form.querySelector('[name="form_token"]');
      if (tokenInput) tokenInput.value = result.token || '';
      setStatus('Спасибо! Сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    } catch (error) {
      setStatus('Не удалось отправить форму. Напишите нам на hello@pramio.ru.');
    } finally {
      if (submit) submit.disabled = false;
    }
  }, true);
})();
