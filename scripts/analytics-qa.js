/* Local preview only: expose sanitized events as readable DOM evidence. */
(() => {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || !location.pathname.startsWith('/__qa__/')) return;
  document.documentElement.dataset.analyticsDebug = 'true';
  const events = [];
  let output;
  const render = () => { if (output) output.textContent = JSON.stringify(events, null, 2); };
  document.addEventListener('deviny:metric', event => {
    events.push(event.detail);
    if (events.length > 100) events.shift();
    render();
  });
  // Exercise store-click instrumentation without leaving the local fixture.
  document.addEventListener('click', event => {
    if (event.target.closest('a[data-store]')) event.preventDefault();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.createElement('details');
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:1000;width:min(560px,calc(100vw - 24px));max-height:40vh;overflow:auto;padding:16px;background:#fff;color:#202822;border:1px solid #596157;font:13px/1.5 monospace;box-shadow:0 4px 24px #0002';
    const summary = document.createElement('summary');
    summary.textContent = 'Локальная проверка событий — данные не отправляются';
    output = document.createElement('pre');
    output.id = 'analytics-qa-events';
    output.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere';
    panel.append(summary, output);
    document.body.append(panel);
    render();
  });
})();
