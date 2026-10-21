/* One finite demonstration, with the complete scene as the no-JS default. */
(() => {
  const scene = document.querySelector('[data-workout-scene]');
  if (!scene || !globalThis.IntersectionObserver) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  let played = false, timer;
  const finish = () => {
    clearTimeout(timer);
    scene.classList.remove('is-playing');
    observer.disconnect();
    reduce.removeEventListener('change', preference);
    document.removeEventListener('visibilitychange', visibility);
    removeEventListener('resize', finish);
  };
  const preference = () => { if (reduce.matches) finish(); };
  const visibility = () => { if (document.hidden) finish(); };
  const observer = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.target === scene);
    if (!entry) return;
    if (played) {
      if (!entry.isIntersecting) finish();
      return;
    }
    if (entry.intersectionRatio < .65 || document.hidden) return;
    played = true;
    scene.classList.add('is-playing');
    timer = setTimeout(finish, 4600);
  }, {threshold: [0, .65]});
  observer.observe(scene);
  reduce.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  addEventListener('resize', finish, {passive: true});
})();
