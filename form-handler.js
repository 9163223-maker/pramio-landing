(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.noValidate = true;
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

  const errorId = (field) => 'contact-' + field.name + '-error';
  const clearInvalid = (field) => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    field.setCustomValidity('');
    const error = form.querySelector('#' + errorId(field));
    if (error) error.remove();
    if (field.name === 'consent') field.closest('.privacy-consent')?.classList.remove('is-invalid');
  };

  const showInvalid = (field) => {
    const message = invalidMessage(field);
    const id = errorId(field);
    field.setAttribute('aria-invalid','true');
    field.setAttribute('aria-describedby', id);
    let error = form.querySelector('#' + id);
    if (!error) {
      error = document.createElement('span');
      error.id = id;
      error.className = 'form-field-error';
      error.setAttribute('role','alert');
      const wrapper = field.closest('label');
      if (wrapper) wrapper.insertAdjacentElement('afterend', error);
      else field.insertAdjacentElement('afterend', error);
    }
    error.textContent = message;
    if (field.name === 'consent') field.closest('.privacy-consent')?.classList.add('is-invalid');
    return message;
  };

  const requiredFields = [...form.querySelectorAll('input[required],textarea[required]')];
  requiredFields.forEach((field) => {
    field.addEventListener('input', () => clearInvalid(field));
    field.addEventListener('change', () => clearInvalid(field));
    field.addEventListener('blur', () => {
      if (!field.validity.valid && (field.value || field.name === 'consent')) showInvalid(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    let firstInvalid = null;
    requiredFields.forEach((field) => {
      if (!field.validity.valid) {
        showInvalid(field);
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearInvalid(field);
      }
    });
    if (firstInvalid) {
      setStatus('Проверьте отмеченные поля формы.');
      firstInvalid.focus({ preventScroll:true });
      firstInvalid.scrollIntoView({ block:'nearest', behavior:'smooth' });
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
      requiredFields.forEach(clearInvalid);
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
