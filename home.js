/* Connections unfold from the feed in one brief entrance. Pointer and scroll
   then move the foreground, device and gold backdrop at different depths. */
(() => {
  const scene = document.querySelector('[data-home-scene]');
  if (!scene) return;
  const hero = scene.closest('.home-hero');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let visible = true, frame = 0, lastTime = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0, scrollY = 0;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const active = () => !reduce.matches && visible && !document.hidden;
  function draw(now) {
    frame = 0;
    if (!active()) return;
    const elapsed = lastTime ? Math.min(now - lastTime, 48) : 1000 / 60;
    const ease = 1 - Math.pow(.9, elapsed / (1000 / 60));
    lastTime = now;
    x += (targetX - x) * ease;
    y += (targetY + scrollY - y) * ease;
    scene.style.setProperty('--scene-x', x.toFixed(2) + 'px');
    scene.style.setProperty('--scene-y', y.toFixed(2) + 'px');
    scene.style.setProperty('--scene-turn', (x * .08).toFixed(3) + 'deg');
    if (Math.abs(targetX - x) + Math.abs(targetY + scrollY - y) > .05) {
      queue();
    } else {
      scene.classList.remove('is-moving');
      lastTime = 0;
    }
  }
  function queue() {
    if (!frame && active()) {
      scene.classList.add('is-moving');
      frame = requestAnimationFrame(draw);
    }
  }
  function readScroll() {
    if (!active()) return;
    const rect = scene.getBoundingClientRect();
    const travel = innerWidth <= 700 ? 13 : 32;
    scrollY = clamp((innerHeight * .55 - rect.top - rect.height * .5) / innerHeight, -.6, .6) * travel;
    queue();
  }
  function sync() {
    scene.classList.toggle('is-paused', !active());
    if (!active()) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      scene.classList.remove('is-moving');
    }
    if (reduce.matches) {
      x = y = targetX = targetY = scrollY = 0;
      scene.style.removeProperty('--scene-x');
      scene.style.removeProperty('--scene-y');
      scene.style.removeProperty('--scene-turn');
      scene.classList.remove('is-ready');
    } else {
      scene.classList.add('is-ready');
      readScroll();
    }
  }
  hero.addEventListener('pointermove', event => {
    if (!active() || !finePointer.matches || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1) * 14;
    targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1) * 9;
    queue();
  }, {passive:true});
  function resetPointer() { targetX = targetY = 0; queue(); }
  hero.addEventListener('pointerleave', resetPointer, {passive:true});
  hero.addEventListener('pointercancel', resetPointer, {passive:true});
  addEventListener('scroll', readScroll, {passive:true});
  addEventListener('resize', readScroll, {passive:true});
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  finePointer.addEventListener('change', resetPointer);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  });
  observer.observe(scene);
  sync();
})();
