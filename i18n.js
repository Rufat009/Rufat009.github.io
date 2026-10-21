/* Every locale has crawlable static HTML. This file preserves old ?lang links
   and context when a visitor deliberately switches language. */
(() => {
  const locales = new Set(['en', 'ru', 'az']);
  const current = document.documentElement.lang;
  const requested = new URLSearchParams(location.search).get('lang');
  const page = document.body.dataset.page || 'home';
  const route = lang => (lang === 'en' ? '/' : `/${lang}/`) + (page === 'home' ? '' : page === 'notfound' ? '404.html' : `${page}.html`);
  // GitHub Pages serves the root 404 document even for a localized bad URL.
  const pathLocale = location.pathname.split('/')[1];
  if (page === 'notfound' && !locales.has(requested) && locales.has(pathLocale) && pathLocale !== current) {
    location.replace(route(pathLocale));
    return;
  }
  if (locales.has(requested) && requested !== current) {
    const target = new URL(route(requested), location.origin);
    target.search = location.search;
    target.searchParams.delete('lang');
    target.hash = location.hash;
    location.replace(target.href);
    return;
  }
  const storageKey = 'deviny_contact_language_draft';
  const form = document.querySelector('#contact-form');
  if (form) {
    try {
      const draft = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      sessionStorage.removeItem(storageKey);
      if (draft && Date.now() - draft.at < 10 * 60 * 1000) {
        form.dataset.draftRestored = 'true';
        for (const name of ['name', 'contact_details', 'message', 'topic']) {
          if (typeof draft[name] === 'string') {
            const limit = name === 'message' ? 5000 : name === 'name' ? 100 : name === 'contact_details' ? 254 : 20;
            form.elements.namedItem(name).value = draft[name].slice(0, limit);
          }
        }
        const method = form.querySelector(`input[name="reply_method"][value="${['Email', 'Telegram', 'WhatsApp'].includes(draft.reply_method) ? draft.reply_method : 'Email'}"]`);
        if (method) method.checked = true;
      }
    } catch { /* A blocked preference store must not block the form. */ }
  }
  document.querySelectorAll('[data-language]').forEach(anchor => {
    const target = new URL(anchor.href);
    target.search = location.search;
    target.searchParams.delete('lang');
    target.hash = location.hash;
    anchor.href = target.href;
    anchor.addEventListener('click', event => {
      // Resolve the current hash on click: it may have changed since initial load.
      const destination = new URL(anchor.href);
      destination.hash = location.hash;
      anchor.href = destination.href;
      if (form?.getAttribute('aria-busy') === 'true') { event.preventDefault(); return; }
      if (form) {
        const draft = {at: Date.now()};
        for (const name of ['name', 'contact_details', 'message', 'topic', 'reply_method']) {
          draft[name] = new FormData(form).get(name);
        }
        try { sessionStorage.setItem(storageKey, JSON.stringify(draft)); } catch { /* Optional draft. */ }
      }
    });
  });
})();
