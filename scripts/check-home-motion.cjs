/* Behavioral checks for the motion controller without a browser or renderer. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function events(target = {}) {
  const listeners = new Map();
  target.addEventListener = (name, fn) => listeners.set(name, fn);
  target.emit = (name, event = {}) => listeners.get(name)?.(event);
  return target;
}

function fixture({reduced = false, fine = true, width = 1440} = {}) {
  const styles = new Map(), classes = new Set(), pending = new Map();
  const media = [events({matches: reduced}), events({matches: fine})];
  const hero = events({getBoundingClientRect: () => ({left: 50, top: 100, width: 1300, height: 730})});
  const bounds = {left: 780, top: 100, width: 560, height: 660};
  const scene = {
    closest: () => hero,
    getBoundingClientRect: () => bounds,
    style: {setProperty: (k, v) => styles.set(k, v), removeProperty: k => styles.delete(k)},
    classList: {add: k => classes.add(k), remove: k => classes.delete(k), toggle: (k, value) => value ? classes.add(k) : classes.delete(k)},
  };
  const document = events({hidden: false, querySelector: () => scene});
  const root = events({document, innerWidth: width, innerHeight: 900});
  let id = 0, now = 0, intersect;
  Object.assign(root, {
    matchMedia: query => query.includes('reduced') ? media[0] : media[1],
    requestAnimationFrame: fn => { pending.set(++id, fn); return id; },
    cancelAnimationFrame: id => pending.delete(id),
    IntersectionObserver: class { constructor(fn) { intersect = fn; } observe() {} },
  });
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../home.js'), 'utf8'), root);
  const settle = () => {
    let count = 0;
    while (pending.size && count++ < 300) {
      const callbacks = [...pending.values()]; pending.clear(); now += 1000 / 60;
      callbacks.forEach(fn => fn(now));
    }
    assert.equal(pending.size, 0, 'Motion must stop scheduling frames after settling');
    assert.equal(classes.has('is-moving'), false, 'Transient compositor hint must be removed');
  };
  return {styles, classes, pending, media, hero, document, root, bounds, settle,
    intersection: visible => intersect([{isIntersecting: visible}]),
    move: type => hero.emit('pointermove', {pointerType: type, clientX: 10000, clientY: 10000})};
}

const scene = fixture();
scene.settle();
scene.move('mouse'); scene.settle();
assert.ok(parseFloat(scene.styles.get('--scene-x')) <= 14);
assert.ok(parseFloat(scene.styles.get('--scene-x')) > 13.9);
assert.ok(Math.abs(parseFloat(scene.styles.get('--scene-turn'))) <= 1.12);
scene.bounds.top = -2000; scene.root.emit('scroll'); scene.settle();
assert.ok(parseFloat(scene.styles.get('--scene-y')) <= 28.2, 'Pointer and scroll displacement must remain bounded');
scene.hero.emit('pointerleave'); scene.settle();
assert.ok(Math.abs(parseFloat(scene.styles.get('--scene-x'))) < .05);

scene.move('mouse'); scene.intersection(false);
assert.equal(scene.pending.size, 0, 'Offscreen scenes must stop');
scene.move('mouse'); assert.equal(scene.pending.size, 0);
scene.intersection(true); scene.settle();
scene.move('mouse'); scene.document.hidden = true; scene.document.emit('visibilitychange');
assert.equal(scene.pending.size, 0, 'Hidden documents must stop');
scene.document.hidden = false; scene.document.emit('visibilitychange'); scene.settle();

scene.move('mouse'); scene.media[0].matches = true; scene.media[0].emit('change');
assert.equal(scene.pending.size, 0, 'Reduced motion cancels pending frames');
assert.equal(scene.styles.size, 0, 'Reduced motion clears all displacement and rotation');
assert.equal(scene.classes.has('is-ready'), false);
scene.root.emit('scroll'); scene.move('mouse'); assert.equal(scene.pending.size, 0);
scene.media[0].matches = false; scene.media[0].emit('change'); scene.settle();

const phone = fixture({fine: false, width: 390}); phone.settle();
phone.move('touch'); phone.move('mouse'); assert.equal(phone.pending.size, 0, 'Coarse pointers do not drive parallax');
phone.bounds.top = -2000; phone.root.emit('scroll'); phone.settle();
assert.ok(parseFloat(phone.styles.get('--scene-y')) <= 7.8, 'Mobile scroll uses a shorter travel');
const reduced = fixture({reduced: true});
assert.equal(reduced.pending.size, 0, 'Reduced motion is respected at initial load');
assert.equal(reduced.classes.has('is-ready'), false);
console.log('Home motion: bounds, settling, pointer exit, visibility, mobile and reduced motion passed.');
