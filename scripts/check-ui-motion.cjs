/* Behavioral checks only: fake layout/WAAPI values do not verify browser rendering. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

function events(target = {}) {
  const listeners = new Map();
  target.addEventListener = (name, fn) => {
    if (!listeners.has(name)) listeners.set(name, []);
    listeners.get(name).push(fn);
  };
  target.emit = (name, input = {}) => {
    const event = {preventDefault() { this.defaultPrevented = true; }, ...input};
    listeners.get(name)?.forEach(fn => fn(event));
    return event;
  };
  return target;
}

function fixture({reduced = false, mobile = true, waapi = true, has = true} = {}) {
  const nodes = [], animations = [];
  const document = events({activeElement: null, hidden: false});
  class Node {
    constructor(kind, natural = 0) {
      events(this);
      this.kind = kind; this.natural = natural; this.open = false;
      this.attrs = new Map(); this.classes = new Set(); this.children = [];
      this.inert = false; this.dataset = {};
      this.style = {removeProperty(name) { delete this[name]; }};
      this.classList = {
        contains: key => this.classes.has(key),
        add: key => this.classes.add(key),
        remove: key => this.classes.delete(key),
        toggle: (key, on) => on ? this.classes.add(key) : this.classes.delete(key),
      };
      if (!waapi) this.animate = undefined;
      nodes.push(this);
    }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    setAttribute(name, value) { this.attrs.set(name, value); }
    removeAttribute(name) { this.attrs.delete(name); }
    contains(node) { return node === this || this.children.some(child => child.contains(node)); }
    focus() { document.activeElement = this; }
    querySelector(selector) { return this.selectors?.[selector] || null; }
    getBoundingClientRect() {
      let height = this.kind === 'details' ? (this.open ? this.natural : 54)
        : this.kind === 'nav' ? (this.classes.has('is-open') ? this.natural : 0)
        : this.natural;
      if (this.style.height) height = parseFloat(this.style.height);
      const motion = this.heightAnimation;
      if (motion && !motion.cancelled) {
        const [from, to] = motion.frames.map(frame => parseFloat(frame.height));
        height = from + (to - from) * motion.progress;
      }
      return {height};
    }
    animate(frames, options) {
      const animation = {
        frames, options, progress: 0, cancelled: false, onfinish: null,
        cancel: () => { animation.cancelled = true; },
        finish: () => { animation.progress = 1; animation.onfinish?.(); },
      };
      if ('height' in frames[0]) this.heightAnimation = animation;
      if ('opacity' in frames[0]) this.opacityAnimation = animation;
      animations.push(animation);
      return animation;
    }
  }
  const details = [246, 310, 190].map((height, i) => {
    const node = new Node('details', height), summary = new Node('summary', 52);
    const body = new Node('body', height - 54);
    node.open = i === 0; node.setAttribute('name', 'needs');
    node.selectors = {summary, '.disclosure-content': body};
    node.children = [summary, body]; node.summary = summary; node.body = body;
    return node;
  });
  const toggle = new Node('button'), nav = new Node('nav', 174);
  const navLink = new Node('link'); nav.children.push(navLink);
  nav.selectors = {'a': navLink};
  document.documentElement = new Node('html');
  document.querySelector = selector => selector === '.menu-toggle' ? toggle : null;
  document.getElementById = id => id === 'primary-nav' ? nav : null;
  document.querySelectorAll = selector => selector === 'details' ? details : [];
  const media = {
    reduce: events({matches: reduced}), mobile: events({matches: mobile}),
  };
  const root = events({document,
    matchMedia: query => query.includes('reduced') ? media.reduce : media.mobile,
    CSS: {supports: () => has},
    getComputedStyle: node => {
      const motion = node.opacityAnimation;
      const opacity = motion && !motion.cancelled
        ? +motion.frames[0].opacity + (+motion.frames[1].opacity - +motion.frames[0].opacity) * motion.progress : 1;
      return {opacity: String(opacity), borderTopWidth: '1px', borderBottomWidth: '1px'};
    },
    location: {hash: '', pathname: '/ru/', search: ''},
    history: {replaceState() {}},
  });
  vm.runInNewContext(source, root);
  const finish = () => nodes.forEach(node => {
    if (node.heightAnimation && !node.heightAnimation.cancelled) node.heightAnimation.finish();
  });
  return {document, root, media, details, nav, navLink, toggle, animations, finish};
}

const f = fixture();
assert.equal(f.nav.inert, true, 'Collapsed mobile links are excluded immediately');
assert.equal(f.details[0].getAttribute('name'), null, 'JS takes over grouping only when animation is supported');
assert.equal(f.details[0].body.inert, false);
assert.equal(f.details[1].body.inert, true);
f.details[1].summary.emit('click');
assert.equal(f.details[0].open, true, 'Closing content remains rendered through its animation');
assert.equal(f.details[0].body.inert, true, 'Closing content stops accepting focus immediately');
assert.equal(f.details[0].summary.getAttribute('aria-expanded'), 'false');
assert.equal(f.details[1].summary.getAttribute('aria-expanded'), 'true');

// A browser-native reveal must update the enhanced control's state as well.
const native = fixture();
native.details[2].open = true; native.details[2].emit('toggle');
assert.equal(native.details[2].body.inert, false);
assert.equal(native.details[2].summary.getAttribute('aria-expanded'), 'true');
native.finish();
assert.equal(native.details[0].open, false);
native.details[2].summary.emit('click'); native.finish();
assert.equal(native.details[2].open, false);
f.finish();
assert.equal(f.details[0].open, false);
assert.equal(f.details[1].open, true);
assert.equal(f.details[1].style.height, undefined, 'Natural sizing is restored');

// Reverse an accordion while partway closed; stale completion cannot close it.
f.details[1].summary.emit('click');
const stale = f.details[1].heightAnimation.onfinish;
f.details[1].heightAnimation.progress = .4;
const intermediate = f.details[1].getBoundingClientRect().height;
f.details[1].summary.emit('click');
assert.equal(parseFloat(f.details[1].heightAnimation.frames[0].height), intermediate);
stale();
f.finish();
assert.equal(f.details[1].open, true);
assert.equal(f.details[1].summary.getAttribute('aria-expanded'), 'true');

f.toggle.emit('click');
assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
assert.equal(f.nav.inert, false);
f.nav.heightAnimation.progress = .5;
const menuIntermediate = f.nav.getBoundingClientRect().height;
f.toggle.emit('click');
assert.equal(parseFloat(f.nav.heightAnimation.frames[0].height), menuIntermediate);
assert.equal(f.nav.inert, true);
f.nav.heightAnimation.progress = .4;
f.nav.opacityAnimation.progress = .4;
const closingOpacity = +f.nav.opacityAnimation.frames[0].opacity * .6;
f.toggle.emit('click');
assert.equal(+f.nav.opacityAnimation.frames[0].opacity, closingOpacity, 'Reopening preserves current opacity as well as height');
f.finish();
assert.equal(f.nav.classes.has('is-open'), true);
f.toggle.emit('click');
f.finish();
assert.equal(f.nav.classes.has('is-open'), false);
assert.equal(f.nav.style.height, undefined);

f.toggle.emit('click'); f.finish(); f.document.activeElement = f.navLink;
f.document.emit('keydown', {key: 'Escape'});
assert.equal(f.document.activeElement, f.toggle, 'Escape restores focus');
f.finish();
f.toggle.emit('click');
f.media.mobile.matches = false; f.media.mobile.emit('change');
assert.equal(f.nav.classes.has('is-open'), false);
assert.equal(f.nav.inert, false, 'Desktop navigation must remain available after resizing');
assert.equal(f.nav.getAttribute('aria-hidden'), null);

// Crossing a breakpoint must not strand keyboard focus in hidden controls.
const resizeFocus = fixture({mobile: false});
assert.equal(resizeFocus.document.documentElement.classes.has('menu-ready'), true);
resizeFocus.navLink.focus();
resizeFocus.media.mobile.matches = true; resizeFocus.media.mobile.emit('change');
assert.equal(resizeFocus.nav.inert, true);
assert.equal(resizeFocus.document.activeElement, resizeFocus.toggle);
resizeFocus.media.mobile.matches = false; resizeFocus.media.mobile.emit('change');
assert.equal(resizeFocus.document.activeElement, resizeFocus.navLink);
assert.equal(resizeFocus.nav.inert, false);


f.details[2].summary.emit('click');
f.media.reduce.matches = true; f.media.reduce.emit('change');
assert.equal(f.details[2].open, true);
assert.equal(f.details[2].style.height, undefined);
const animationCount = f.animations.length;
f.details[2].summary.emit('click');
assert.equal(f.details[2].open, false);
assert.equal(f.animations.length, animationCount, 'Reduced motion never schedules height animation');

const reduced = fixture({reduced: true});
reduced.toggle.emit('click');
assert.equal(reduced.nav.classes.has('is-open'), true);
reduced.details[1].summary.emit('click');
assert.equal(reduced.details[0].open, false);
assert.equal(reduced.details[1].open, true);
assert.equal(reduced.animations.length, 0);

const fallback = fixture({waapi: false, has: false});
assert.equal(fallback.details[0].getAttribute('name'), 'needs');
assert.equal(fallback.details[0].summary.emit('click').defaultPrevented, undefined);
fallback.toggle.emit('click');
assert.equal(fallback.nav.classes.has('is-open'), true);
assert.equal(fallback.animations.length, 0);

console.log('UI motion: grouping, reversal, stale completion, focus, resize, reduced motion and fallbacks passed.');
