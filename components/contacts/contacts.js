(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const messages = JSON.parse(document.getElementById('form-messages').textContent);
  const config = JSON.parse(document.getElementById('contact-modes').textContent);
  const submit = form.querySelector('[type=submit]');
  const submitLabel = submit.querySelector('span');
  const status = document.getElementById('form-status');
  const controls = [...form.querySelectorAll('input:not([type=hidden]), select, textarea')];
  const topic = form.elements.topic;
  const contact = form.elements.contact_details;
  const name = form.elements.name;
  const message = form.elements.message;
  const changeTopic = document.getElementById('change-topic');
  const topicField = document.getElementById('topic-field');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const requested = new URLSearchParams(location.search).get('topic');
  const validTopic = value => Object.hasOwn(config.modes, value);
  if (!form.dataset.draftRestored && validTopic(requested)) topic.value = requested;
  if (!validTopic(topic.value)) topic.value = 'support';
  let pending = false;
  let idleLabel = '';
  const measure = (stage, topic, outcome) => {
    try {
      document.dispatchEvent(new CustomEvent('deviny:contact', {detail: {stage, topic, outcome}}));
    } catch { /* Measurement must never affect support delivery. */ }
  };
  const setError = (field, text) => {
    field.setAttribute('aria-invalid', String(Boolean(text)));
    document.getElementById(`${field.id}-error`).textContent = text;
  };
  const setContactMode = () => {
    const method = form.elements.reply_method.value;
    contact.type = method === 'Email' ? 'email' : 'text';
    contact.inputMode = method === 'Email' ? 'email' : method === 'WhatsApp' ? 'tel' : 'text';
    contact.autocomplete = method === 'Email' ? 'email' : method === 'WhatsApp' ? 'tel' : 'off';
  };
  function applyMode({animate = false, clearStatus = true} = {}) {
    const mode = config.modes[topic.value];
    form.dataset.topic = topic.value;
    document.title = mode.title;
    const title = document.getElementById('contact-title');
    title.querySelector('span').textContent = mode.heading[0];
    title.querySelector('em').textContent = mode.heading[1];
    document.getElementById('contact-intro').textContent = mode.text;
    document.getElementById('contact-form-title').textContent = mode.formTitle;
    document.getElementById('name-label').textContent = config.name;
    document.getElementById('message-label').textContent = config.message;
    name.required = message.required = true;
    message.setAttribute('minlength', '10');
    message.rows = 5;
    message.placeholder = mode.messagePlaceholder;
    form.elements.subject.value = mode.subject;
    topicField.hidden = topic.value !== 'support';
    changeTopic.hidden = !topicField.hidden;
    idleLabel = mode.send;
    if (!pending) submitLabel.textContent = idleLabel;
    setError(name, '');
    setError(message, '');
    if (clearStatus) { status.textContent = ''; delete status.dataset.state; }
    if (animate && !reduce.matches) {
      for (const node of [document.querySelector('.contact-copy'), document.querySelector('.form-panel')]) {
        node?.animate?.([{opacity: .65}, {opacity: 1}], {duration: 180, easing: 'ease-out'});
      }
    }
  }
  topic.addEventListener('change', () => {
    if (pending || !validTopic(topic.value)) return;
    applyMode({animate: true});
    const address = new URL(location.href);
    address.searchParams.set('topic', topic.value);
    history.replaceState(null, '', address);
  });
  changeTopic.addEventListener('click', () => {
    if (pending) return;
    topicField.hidden = false;
    changeTopic.hidden = true;
    topic.focus();
  });
  form.querySelectorAll('[name=reply_method]').forEach(input => input.addEventListener('change', setContactMode));
  applyMode();
  setContactMode();
  submit.disabled = false;

  function validate() {
    const details = contact.value.trim();
    const method = form.elements.reply_method.value;
    setError(name, name.required && !name.value.trim() ? messages.name : '');
    let detailsError = !details ? messages.required : '';
    if (!detailsError && method === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details)) detailsError = messages.email;
    if (!detailsError && method === 'Telegram' && !/^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(details)) detailsError = messages.details;
    if (!detailsError && method === 'WhatsApp' && (!/^\+?[\d\s()\-]{7,24}$/.test(details) || !/^\d{7,15}$/.test(details.replace(/\D/g, '')))) detailsError = messages.details;
    setError(contact, detailsError);
    setError(message, message.required ? (!message.value.trim() ? messages.required : message.value.trim().length < 10 ? messages.message : '') : '');
    return form.querySelector('[aria-invalid=true]');
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    const invalid = validate();
    if (invalid) {
      status.dataset.state = 'error';
      status.textContent = messages.invalid;
      invalid.focus();
      return;
    }
    if (form.elements.botcheck.checked) return;
    const sentTopic = topic.value;
    const mode = config.modes[sentTopic];
    pending = true;
    submit.disabled = changeTopic.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitLabel.textContent = messages.sending;
    status.dataset.state = 'pending';
    status.textContent = messages.sending;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const data = new FormData(form);
      for (const field of ['name', 'contact_details', 'message']) data.set(field, String(data.get(field) || '').trim());
      // Web3Forms uses this reserved field for the email's Reply-To header.
      if (data.get('reply_method') === 'Email') data.set('replyto', data.get('contact_details'));
      controls.forEach(control => { control.disabled = true; });
      measure('attempt', sentTopic);
      const response = await fetch(form.action, {method: 'POST', body: data, signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer'});
      let result;
      try { result = await response.json(); } catch { result = null; }
      if (!response.ok || result?.success !== true) throw new Error('delivery_unconfirmed');
      measure('result', sentTopic, 'accepted');
      form.reset();
      topic.value = sentTopic;
      applyMode({clearStatus: false});
      setContactMode();
      status.dataset.state = 'success';
      status.textContent = mode.success;
      try { sessionStorage.removeItem('deviny_contact_language_draft'); } catch { /* Optional draft. */ }
    } catch (error) {
      measure('result', sentTopic, error.message === 'delivery_unconfirmed' ? 'failed' : 'unconfirmed');
      status.dataset.state = 'error';
      status.textContent = error.message === 'delivery_unconfirmed' ? messages.failure : messages.network;
    } finally {
      clearTimeout(timeout);
      pending = false;
      submit.disabled = changeTopic.disabled = false;
      controls.forEach(control => { control.disabled = false; });
      submitLabel.textContent = idleLabel;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
