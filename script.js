/* Small progressive enhancements; content and navigation are rendered in HTML. */
(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  const motions = new Map();
  const easing = 'cubic-bezier(.16,1,.3,1)';

  // Read the current rendered size before cancelling, so a second click reverses
  // from the current position instead of jumping to either endpoint.
  function slide(element, open, {reveal, complete, closedHeight = 0, content = element, wasOpen}) {
    const from = element.getBoundingClientRect().height;
    const opacity = wasOpen ? getComputedStyle(content).opacity : '0';
    const previous = motions.get(element);
    if (previous) {
      previous.animations.forEach(animation => animation.cancel());
      motions.delete(element);
    }
    element.style.removeProperty('height');
    reveal();
    const to = open ? element.getBoundingClientRect().height : closedHeight;
    const cleanup = () => {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      complete();
    };
    if (reduce.matches || !element.animate || Math.abs(to - from) < 1) {
      cleanup();
      return;
    }
    element.style.height = `${from}px`;
    element.style.overflow = 'hidden';
    const options = {duration: open ? 300 : 220, easing, fill: 'both'};
    const size = element.animate([{height: `${from}px`}, {height: `${to}px`}], options);
    const fade = content.animate([{opacity}, {opacity: open ? '1' : '0'}], {...options, easing: 'ease'});
    const state = {animations: [size, fade], finish: () => {
      if (motions.get(element) !== state) return;
      motions.delete(element);
      state.animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
      cleanup();
    }};
    motions.set(element, state);
    size.onfinish = state.finish;
  }

  const groups = new Map();
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.disclosure-content');
    if (!summary || !content || !details.animate) return;
    const group = details.getAttribute('name');
    // Native grouping remains in the HTML fallback. Enhanced grouping lets the
    // previous row finish closing instead of the browser collapsing it instantly.
    details.removeAttribute('name');
    const state = {open: details.open, setOpen};
    if (group) {
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(state);
    }
    function setOpen(open) {
      if (state.open === open) return;
      const wasOpen = details.open;
      state.open = open;
      summary.setAttribute('aria-expanded', String(open));
      content.inert = !open;
      if (!open && content.contains(document.activeElement)) summary.focus({preventScroll: true});
      const style = getComputedStyle(details);
      const closedHeight = summary.getBoundingClientRect().height
        + parseFloat(style.borderTopWidth || 0) + parseFloat(style.borderBottomWidth || 0);
      slide(details, open, {
        reveal: () => { details.open = true; },
        complete: () => { details.open = state.open; },
        closedHeight, content, wasOpen,
      });
    }
    summary.setAttribute('aria-expanded', String(state.open));
    content.inert = !state.open;
    summary.addEventListener('click', event => {
      event.preventDefault();
      const open = !state.open;
      if (open && group) groups.get(group).forEach(other => { if (other !== state) other.setOpen(false); });
      setOpen(open);
    });
    // Browser find-in-page or another native action may reveal a closed row.
    details.addEventListener('toggle', () => {
      if (motions.has(details) || state.open === details.open) return;
      state.open = details.open;
      summary.setAttribute('aria-expanded', String(state.open));
      content.inert = !state.open;
      if (state.open && group) groups.get(group).forEach(other => { if (other !== state) other.setOpen(false); });
    });
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  let menuOpen = false;
  const setMenu = (open, animate = true) => {
    const wasOpen = menuOpen;
    menuOpen = open && mobile.matches;
    toggle?.setAttribute('aria-expanded', String(menuOpen));
    if (!nav) return;
    nav.inert = mobile.matches && !menuOpen;
    if (nav.inert) nav.setAttribute('aria-hidden', 'true');
    else nav.removeAttribute('aria-hidden');
    const complete = () => nav.classList.toggle('is-open', menuOpen);
    if (!animate || !mobile.matches) {
      motions.get(nav)?.finish();
      complete();
      return;
    }
    if (wasOpen === menuOpen) return;
    slide(nav, menuOpen, {
      wasOpen: nav.classList.contains('is-open'),
      reveal: () => nav.classList.add('is-open'),
      complete,
    });
  };
  const closeMenu = (restoreFocus = false) => {
    const focusWithin = nav?.contains(document.activeElement);
    setMenu(false);
    if (restoreFocus || focusWithin) toggle?.focus({preventScroll: true});
  };
  setMenu(false, false);
  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  mobile.addEventListener('change', () => {
    const focusInClosingNav = mobile.matches && nav?.contains(document.activeElement);
    const focusOnHiddenToggle = !mobile.matches && document.activeElement === toggle;
    setMenu(false, false);
    if (focusInClosingNav) toggle?.focus({preventScroll: true});
    else if (focusOnHiddenToggle) nav?.querySelector('a')?.focus({preventScroll: true});
  });
  // Hide the fallback links only after their toggle has working handlers.
  if (toggle && nav) document.documentElement.classList.add('menu-ready');
  // A resize or accessibility preference change settles into the requested state.
  const settle = () => [...motions.values()].forEach(state => state.finish());
  addEventListener('resize', settle, {passive: true});
  reduce.addEventListener('change', () => { if (reduce.matches) settle(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });

  // Preserve legacy inbound anchors without carrying obsolete claims into the page.
  const aliases = {'#pricing':'#options', '#cta':'#get-started', '#testimonials':'#why-choose'};
  if (aliases[location.hash]) {
    const hash = aliases[location.hash];
    history.replaceState(null, '', location.pathname + location.search + hash);
    document.querySelector(hash)?.scrollIntoView();
  }
})();
