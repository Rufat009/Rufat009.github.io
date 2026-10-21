/* One finite demonstration, with the complete scene as the no-JS default. */
(() => {
  const scene = document.querySelector('[data-workout-scene]');
  if (!scene || !globalThis.IntersectionObserver) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  let played = false, timer;
  const threshold = Math.min(.65, innerHeight / scene.getBoundingClientRect().height * .75);
  const finish = () => {
    clearTimeout(timer);
    scene.classList.remove('is-playing');
    scene.classList.remove('is-armed');
    observer.disconnect();
    reduce.removeEventListener('change', preference);
    document.removeEventListener('visibilitychange', visibility);
    removeEventListener('resize', resize);
  };
  const preference = () => { if (reduce.matches) finish(); };
  const resize = () => { if (played) finish(); };
  const visibility = () => { if (document.hidden) finish(); };
  const observer = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.target === scene);
    if (!entry) return;
    if (played) {
      if (!entry.isIntersecting) finish();
      return;
    }
    if (entry.intersectionRatio < threshold || document.hidden) return;
    played = true;
    scene.classList.remove('is-armed');
    scene.classList.add('is-playing');
    timer = setTimeout(finish, 4600);
  }, {threshold: [0, threshold]});
  observer.observe(scene);
  scene.classList.add('is-armed');
  reduce.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  addEventListener('resize', resize, {passive: true});
})();
