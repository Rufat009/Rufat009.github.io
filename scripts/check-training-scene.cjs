// Lifecycle checks; screenshot review verifies the actual composition.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../training-scene.js'), 'utf8');
function events(target = {}) {
  const listeners = new Map();
  return Object.assign(target, {
    addEventListener(k, cb) { listeners.set(k, cb); },
    removeEventListener(k) { listeners.delete(k); },
    emit(k) { listeners.get(k)?.(); },
  });
}
function fixture({reduced = false, observer = true} = {}) {
  const classes = new Set(), pending = new Map();
  const scene = {classList: {add: k => classes.add(k), remove: k => classes.delete(k)}};
  const reduce = events({matches: reduced});
  const document = events({hidden: false, querySelector: () => scene});
  let callback, disconnected = false;
  class IO {
    constructor(cb) { callback = cb; }
    observe() {}
    disconnect() { disconnected = true; }
  }
  const root = events({document, matchMedia: () => reduce,
    setTimeout(cb, ms) { pending.set(1, {cb, ms}); return 1; },
    clearTimeout(id) { pending.delete(id); },
    IntersectionObserver: observer ? IO : undefined,
  });
  vm.runInNewContext(source, root);
  return {classes, reduce, document, root, pending,
    enter(ratio) { if (!disconnected) callback?.([{target: scene, intersectionRatio: ratio, isIntersecting: ratio > 0}]); },
    get disconnected() { return disconnected; },
  };
}
const f = fixture();
f.enter(.3); assert.equal(f.classes.size, 0, 'Do not start while mostly offscreen');
f.enter(.8); assert.equal(f.classes.has('is-playing'), true);
assert.equal(f.pending.get(1).ms, 4600, 'Autoplay remains below five seconds');
f.enter(.9); assert.equal(f.pending.size, 1, 'Only one sequence per visit');
f.pending.get(1).cb(); assert.equal(f.classes.size, 0); assert.equal(f.disconnected, true);
f.enter(.8); assert.equal(f.classes.size, 0, 'Scrolling back must not replay');
for (const kind of ['hidden', 'reduced', 'resize', 'exit']) {
  const x = fixture(); x.enter(.8);
  if (kind === 'hidden') { x.document.hidden = true; x.document.emit('visibilitychange'); }
  if (kind === 'reduced') { x.reduce.matches = true; x.reduce.emit('change'); }
  if (kind === 'resize') x.root.emit('resize');
  if (kind === 'exit') x.enter(0);
  assert.equal(x.classes.size, 0, kind + ' settles the complete readable state');
  assert.equal(x.pending.size, 0); assert.equal(x.disconnected, true);
}
for (const options of [{reduced:true}, {observer:false}]) {
  const x = fixture(options); x.enter(.8); assert.equal(x.classes.size, 0);
}
console.log('Training scene: entry, finite duration, no replay, visibility, resize, reduced motion and fallback passed.');
