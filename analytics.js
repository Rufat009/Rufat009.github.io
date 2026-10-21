/* Explicit events only. No form values, storage, identifiers or URL parameters. */
(() => {
  const node = document.getElementById('analytics-config');
  if (!node) return;
  let config;
  try { config = JSON.parse(node.textContent); } catch { return; }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const debug = local && document.documentElement.dataset.analyticsDebug === 'true';
  const production = location.protocol === 'https:' && location.hostname === 'deviny.me';
  if (navigator.globalPrivacyControl === true || ['1', 'yes'].includes(navigator.doNotTrack)) return;
  if (!debug && !(production && config.enabled === true && config.provider === 'plausible' && config.domain === 'deviny.me')) return;

  const page = document.body.dataset.page;
  const language = document.documentElement.lang;
  if (!['home', 'specialists', 'about', 'contacts', 'notfound'].includes(page) || !['en', 'ru', 'az'].includes(language)) return;
  const path = (language === 'en' ? '/' : `/${language}/`) + (page === 'home' ? '' : page === 'notfound' ? '404.html' : `${page}.html`);
  const url = `https://deviny.me${path}`;
  const allowed = {
    region: ['header', 'hero', 'body', 'closing', 'footer'],
    store: ['app_store', 'google_play'],
    topic: ['support', 'specialist', 'collaboration'],
    outcome: ['accepted', 'failed', 'unconfirmed'],
    section: ['support', 'community', 'features', 'personal', 'faq', 'get-started'],
  };
  const events = new Set(['pageview', 'store_placeholder_click', 'store_outbound_click', 'download_intent', 'specialist_interest', 'contact_interest', 'support_attempt', 'support_result', 'section_seen']);
  function track(name, values = {}) {
    if (!events.has(name)) return;
    const props = {page, language};
    for (const [key, value] of Object.entries(values)) if (allowed[key]?.includes(value)) props[key] = value;
    const payload = {name, domain: 'deviny.me', url, props, interactive: name !== 'section_seen'};
    if (debug) {
      document.dispatchEvent(new CustomEvent('deviny:metric', {detail: payload}));
      return;
    }
    // Never hold up navigation or retry an event: analytics is best-effort.
    try {
      fetch('https://plausible.io/api/event', {
        method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'text/plain'},
        keepalive: true, credentials: 'omit', referrerPolicy: 'no-referrer',
      }).catch(() => {});
    } catch { /* A blocked analytics service must not affect the site. */ }
  }
  function region(element) {
    if (element.closest('.site-header')) return 'header';
    if (element.closest('.site-footer')) return 'footer';
    if (element.closest('#get-started')) return 'closing';
    if (element.closest('.home-hero, .expert-hero')) return 'hero';
    return 'body';
  }
  function click(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const position = region(anchor);
    const store = {appStoreUrl: 'app_store', googlePlayUrl: 'google_play'}[anchor.dataset.store];
    if (store) {
      track(config.linksArePlaceholders === false ? 'store_outbound_click' : 'store_placeholder_click', {store, region: position});
      return;
    }
    let target;
    try { target = new URL(anchor.href, location.href); } catch { return; }
    if (target.origin !== location.origin) return;
    if (target.hash === '#get-started') track('download_intent', {region: position});
    if (/\/(?:specialists\.html|specialists\/?|specialists\/index\.html)$/.test(target.pathname)) track('specialist_interest', {region: position});
    if (/\/(?:contacts\.html|contacts\/?|contacts\/index\.html)$/.test(target.pathname)) {
      const topic = target.searchParams.get('topic');
      track('contact_interest', {region: position, topic: allowed.topic.includes(topic) ? topic : 'support'});
    }
  }
  document.addEventListener('click', click);
  document.addEventListener('auxclick', click);
  document.addEventListener('deviny:contact', event => {
    const {stage, topic, outcome} = event.detail || {};
    if (!allowed.topic.includes(topic)) return;
    if (stage === 'attempt') track('support_attempt', {topic});
    if (stage === 'result' && allowed.outcome.includes(outcome)) track('support_result', {topic, outcome});
  });
  let started = false;
  function start() {
    if (started || document.visibilityState === 'hidden') return;
    started = true;
    track('pageview');
    if (typeof IntersectionObserver !== 'function') return;
    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || document.visibilityState === 'hidden' || seen.has(entry.target.id)) continue;
        seen.add(entry.target.id);
        track('section_seen', {section: entry.target.id});
        observer.unobserve(entry.target);
      }
    }, {threshold: 0.1});
    for (const id of allowed.section) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
  }
  document.addEventListener('visibilitychange', start);
  start();
})();
