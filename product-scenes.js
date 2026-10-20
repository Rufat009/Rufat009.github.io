/* Local previews explain product formats; no messages or requests are sent. */
(() => {
  document.querySelectorAll('[data-scene-switch]').forEach(scene => {
    const tabs = [...scene.querySelectorAll('[role="tab"]')];
    const panels = [...scene.querySelectorAll('[role="tabpanel"]')];
    if (!tabs.length || tabs.length !== panels.length) return;
    function select(index, focus = false) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].classList.toggle('is-active', selected);
        panels[i].setAttribute('aria-hidden', String(!selected));
        panels[i].inert = !selected;
        panels[i].tabIndex = selected ? 0 : -1;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(next, true);
      });
    });
    select(0);
    scene.classList.add('scene-ready');
  });
})();
