(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.noValidate = true;
  const status = form.querySelector('.form-note');
  const endpoint = form.dataset.endpoint || '/send.php';

  const setStatus = (text, state = '') => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-sending', state === 'sending');
    status.classList.toggle('is-success', state === 'success');
    status.classList.toggle('is-error', state === 'error');
  };

  const showSuccess = () => {
    form.classList.add('is-success');
    const fields = [...form.children].filter((node) => node !== status);
    fields.forEach((node) => { node.hidden = true; });
    if (status) {
      status.hidden = false;
      status.innerHTML = '<span class="contact-success-mark" aria-hidden="true">✓</span><strong>Готово</strong><span>Заявка отправлена. Ответим на указанный вами e-mail.</span><button type="button" class="contact-success-reset">Отправить ещё</button>';
      status.classList.remove('is-sending','is-error');
      status.classList.add('is-success');
      status.focus?.({ preventScroll:true });
    }
  };

  const restoreForm = () => {
    form.classList.remove('is-success');
    [...form.children].forEach((node) => { node.hidden = false; });
    form.reset();
    if (status) {
      status.classList.remove('is-success','is-sending','is-error');
      status.textContent = 'Для оценки достаточно короткого описания задачи.';
    }
  };

  form.addEventListener('click', (event) => {
    if (!event.target.closest('.contact-success-reset')) return;
    restoreForm();
    form.querySelector('.service-picker__trigger, input[name="email"]')?.focus({ preventScroll:true });
  });

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
    setStatus('Отправляем заявку…', 'sending');

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
      showSuccess();
    } catch (error) {
      setStatus('Не удалось отправить форму. Напишите нам на hello@pramio.ru.', 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  }, true);
})();
