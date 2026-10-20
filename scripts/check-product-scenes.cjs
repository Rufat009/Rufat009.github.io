/* Keyboard and accessibility state checks; this does not render a browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function node() {
  const attrs = new Map(), listeners = new Map(), classes = new Set();
  return { attrs, classes, focused: false,
    setAttribute: (k, v) => attrs.set(k, v),
    addEventListener: (k, v) => listeners.set(k, v),
    classList: {add: k => classes.add(k), toggle: (k, on) => on ? classes.add(k) : classes.delete(k)},
    focus() { this.focused = true; },
    emit(type, key) { let prevented = false; listeners.get(type)?.({key, preventDefault() { prevented = true; }}); return prevented; },
  };
}
function scene(count, panelCount = count) {
  const root = node(), tabs = Array.from({length:count}, node), panels = Array.from({length:panelCount}, node);
  root.querySelectorAll = selector => selector === '[role="tab"]' ? tabs : panels;
  return {root, tabs, panels};
}
const programs = scene(2), chat = scene(3), malformed = scene(2, 1);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../product-scenes.js'), 'utf8'), {
  document: {querySelectorAll: () => [programs.root, chat.root, malformed.root]},
});
function selected(scene, index) {
  assert.equal(scene.tabs.filter(tab => tab.tabIndex === 0).length, 1, 'One tab is reachable in the tab sequence');
  scene.tabs.forEach((tab, i) => {
    assert.equal(tab.attrs.get('aria-selected'), String(i === index));
    assert.equal(scene.panels[i].inert, i !== index, 'Inactive previews cannot receive interaction');
    assert.equal(scene.panels[i].attrs.get('aria-hidden'), String(i !== index));
    assert.equal(scene.panels[i].tabIndex, i === index ? 0 : -1);
  });
}
selected(programs, 0); selected(chat, 0);
assert.equal(malformed.root.classes.has('scene-ready'), false, 'Invalid markup keeps the readable fallback');
chat.tabs[2].emit('click'); selected(chat, 2); selected(programs, 0);
assert.equal(chat.tabs[2].emit('keydown', 'ArrowRight'), true); selected(chat, 0);
assert.equal(chat.tabs[0].focused, true);
chat.tabs[0].emit('keydown', 'ArrowLeft'); selected(chat, 2);
chat.tabs[2].emit('keydown', 'Home'); selected(chat, 0);
chat.tabs[0].emit('keydown', 'End'); selected(chat, 2);
assert.equal(chat.tabs[2].emit('keydown', 'Tab'), false, 'Native Tab movement must not be intercepted');
programs.tabs[1].emit('click'); selected(programs, 1); selected(chat, 2);
console.log('Product previews: initial state, independent selectors, click, arrow wrapping, Home/End, focus and inactive-panel isolation passed.');
