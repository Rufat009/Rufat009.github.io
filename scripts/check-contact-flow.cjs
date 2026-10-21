/* Isolated interaction tests. No requests are sent; DOM objects are simulated. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'components/contacts/contacts.js'), 'utf8');
function fixture({lang = 'ru', query = '?topic=support', response = 'success', draft} = {}) {
  const prefix = lang === 'en' ? '' : `${lang}/`;
  const html = fs.readFileSync(path.join(root, prefix, 'contacts.html'), 'utf8');
  const json = id => JSON.parse(html.match(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`))[1]);
  const config = json('contact-modes'), messages = json('form-messages');
  const nodes = new Map(), calls = [], timers = new Map(), removed = [];
  const metrics = [];
  const document = {title: '', activeElement: null, dispatchEvent(event) { metrics.push(event.detail); }};
  class Node {
    constructor(id = '', value = '') {
      this.id = id; this.value = value; this.textContent = ''; this.dataset = {};
      this.required = false; this.disabled = false; this.hidden = false;
      this.attrs = new Map(); this.listeners = new Map(); nodes.set(id, this);
    }
    setAttribute(name, value) { this.attrs.set(name, value); }
    removeAttribute(name) { this.attrs.delete(name); }
    getAttribute(name) { return this.attrs.get(name); }
    addEventListener(name, callback) {
      if (!this.listeners.has(name)) this.listeners.set(name, []);
      this.listeners.get(name).push(callback);
    }
    emit(name) { return Promise.all((this.listeners.get(name) || []).map(fn => fn({preventDefault() {}}))); }
    focus() { document.activeElement = this; }
    querySelector(selector) { return this.selectors?.[selector] || null; }
  }
  const form = new Node('contact-form');
  form.action = 'https://api.web3forms.com/submit';
  const fields = {};
  for (const [key,value] of Object.entries({topic:'support', name:'',contact_details:'',message:'',subject:config.modes.support.subject,language:lang,access_key:'d65989bf-2ada-4894-92f6-2623d96a01d4'})) {
    fields[key] = new Node(key, value);
  }
  fields.botcheck = new Node('botcheck'); fields.botcheck.checked = false;
  const methods = ['Email','Telegram','WhatsApp'].map((value,i) => {
    const radio = new Node(`method-${i}`, value); radio.checked = i === 0; return radio;
  });
  fields.reply_method = {get value() { return methods.find(r => r.checked).value; }};
  form.elements = fields;
  const submit = new Node('submit'), submitLabel = new Node('submit-label');
  submit.selectors = {span:submitLabel};
  const status = new Node('form-status');
  for (const id of ['change-topic','topic-field','contact-intro','contact-form-title','name-label','message-label','name-error','contact_details-error','message-error']) new Node(id);
  const title = new Node('contact-title');
  title.selectors = {span:new Node('title-first'), em:new Node('title-last')};
  new Node('form-messages').textContent = JSON.stringify(messages);
  new Node('contact-modes').textContent = JSON.stringify(config);
  const controls = [fields.topic, ...methods, fields.contact_details, fields.name, fields.message, fields.botcheck];
  form.querySelector = selector => selector === '[type=submit]' ? submit
    : selector === '[aria-invalid=true]' ? controls.find(n => n.getAttribute('aria-invalid') === 'true') || null : null;
  form.querySelectorAll = selector => selector === '[name=reply_method]' ? methods : controls;
  form.reset = () => {
    fields.topic.value = 'support'; fields.name.value = fields.message.value = fields.contact_details.value = '';
    fields.subject.value = config.modes.support.subject;
    methods.forEach((m,i) => {m.checked = i === 0;});
  };
  if (draft) { form.dataset.draftRestored = 'true'; fields.topic.value = draft; }
  document.getElementById = id => nodes.get(id);
  document.querySelector = () => null;
  const initial = new URL(`https://preview.test/${prefix}contacts.html${query}`);
  const location = {href:initial.href, search:initial.search};
  const history = {replaceState(_state,_title,address) {
    const next = new URL(String(address), location.href); location.href = next.href; location.search = next.search;
  }};
  let timerId = 0, resolveRequest;
  const success = () => ({ok:true,json:async()=>({success:true})});
  const fetch = async (url, options) => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    calls.push({url, data:Object.fromEntries(options.body), options});
    if (response === 'network') throw new TypeError('isolated network failure');
    if (response === 'failure') return {ok:false,json:async()=>({success:false})};
    if (response === 'malformed') return {ok:true,json:async()=>{throw new Error('invalid JSON');}};
    if (response === 'slow') return new Promise((resolve,reject) => {
      resolveRequest = () => resolve(success());
      options.signal.addEventListener('abort', () => reject(new Error('timeout')), {once:true});
    });
    return success();
  };
  class FormDataMock extends Map {
    constructor() {
      super();
      for (const [key,node] of Object.entries(fields)) {
        if (key !== 'botcheck' && !node.disabled) this.set(key,node.value);
      }
    }
  }
  vm.runInNewContext(source, {document,location,history,URL,URLSearchParams,AbortController,FormData:FormDataMock,fetch,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    matchMedia:()=>({matches:true}),
    sessionStorage:{removeItem:key=>removed.push(key)},
    setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),
  });
  return {form,fields,config,messages,nodes,document,submit,submitLabel,status,calls,timers,removed,location,metrics,
    reply(method) { methods.forEach(n=>{n.checked=n.value===method;});return methods.find(n=>n.checked).emit('change'); },
    resolve:()=>resolveRequest(), timeout:()=>[...timers.values()].forEach(fn=>fn())};
}
(async () => {
  for (const lang of ['en','ru','az']) {
    for (const topic of ['support','specialist','collaboration']) {
      const f = fixture({lang, query:`?topic=${topic}`});
      assert.equal(f.fields.topic.value, topic);
      assert.equal(f.fields.name.required, true);
      assert.equal(f.fields.message.required, true);
      assert.equal(f.document.title, f.config.modes[topic].title);
      assert.equal(f.submit.disabled, false);
      f.fields.name.value = ' Visitor ';
      f.fields.contact_details.value = '  visitor@example.test  ';
      await f.form.emit('submit');
      assert.equal(f.calls.length, 0, 'An inquiry must contain a message');
      assert.equal(f.metrics.length, 0, 'Invalid form is not a support attempt');
      f.fields.message.value = ' A question about Deviny. ';
      await f.form.emit('submit');
      assert.equal(f.calls.length, 1);
      assert.equal(f.calls[0].data.contact_details, 'visitor@example.test');
      assert.equal(f.calls[0].data.replyto, 'visitor@example.test');
      assert.equal(f.calls[0].data.message, 'A question about Deviny.');
      assert.equal(f.calls[0].data.subject, f.config.modes[topic].subject);
      assert.equal(f.calls[0].data.topic, topic);
      assert.equal(f.calls[0].data.language, lang);
      assert.equal(f.status.textContent, f.config.modes[topic].success);
      assert.equal(f.status.dataset.state, 'success');
      assert.equal(JSON.stringify(f.metrics), JSON.stringify([{stage:'attempt',topic},{stage:'result',topic,outcome:'accepted'}]));
      assert.equal(f.fields.topic.value, topic);
      assert.equal(f.submitLabel.textContent, f.config.modes[topic].send);
      assert.equal(f.document.activeElement, f.status);
      assert.equal(f.timers.size, 0);
    }
  }
  function fillInquiry(f) {
    f.fields.name.value = 'Visitor'; f.fields.message.value = 'A question about Deviny.';
    return f;
  }
  const invalid = fillInquiry(fixture());
  await invalid.form.emit('submit');
  assert.equal(invalid.calls.length, 0);
  assert.equal(invalid.document.activeElement, invalid.fields.contact_details);
  invalid.fields.contact_details.value = 'not-an-email';
  await invalid.form.emit('submit');
  assert.equal(invalid.calls.length, 0);
  assert.equal(invalid.nodes.get('contact_details-error').textContent, invalid.messages.email);

  const specialist = fixture({query:'?topic=specialist'});
  specialist.fields.contact_details.value = 'specialist@example.test';
  await specialist.form.emit('submit');
  assert.equal(specialist.calls.length, 0);
  assert.equal(specialist.document.activeElement, specialist.fields.name);
  specialist.fields.name.value = '李';
  specialist.fields.message.value = 'I would like to publish a program.';
  await specialist.form.emit('submit');
  assert.equal(specialist.calls[0].data.topic, 'specialist');
  assert.equal(specialist.status.textContent, specialist.config.modes.specialist.success);

  const telegram = fillInquiry(fixture());
  await telegram.reply('Telegram'); telegram.fields.contact_details.value = '@example_user';
  await telegram.form.emit('submit');
  assert.equal(telegram.calls[0].data.reply_method, 'Telegram');
  assert.equal(telegram.calls[0].data.replyto, undefined);
  const whatsapp = fillInquiry(fixture());
  await whatsapp.reply('WhatsApp'); whatsapp.fields.contact_details.value = '+994 50 123 45 67';
  await whatsapp.form.emit('submit');
  assert.equal(whatsapp.calls[0].data.reply_method, 'WhatsApp');
  assert.equal(whatsapp.calls[0].data.replyto, undefined);

  const change = fixture({query:'?topic=collaboration'});
  change.fields.contact_details.value = 'keep@example.test';
  await change.nodes.get('change-topic').emit('click');
  assert.equal(change.nodes.get('topic-field').hidden, false);
  assert.equal(change.document.activeElement, change.fields.topic);
  change.fields.topic.value = 'support'; await change.fields.topic.emit('change');
  assert.equal(change.fields.message.required, true);
  assert.equal(change.fields.message.getAttribute('minlength'), '10');
  assert.equal(change.fields.contact_details.value, 'keep@example.test');
  assert.equal(new URL(change.location.href).searchParams.get('topic'), 'support');

  const draft = fixture({query:'?topic=support', draft:'specialist'});
  assert.equal(draft.fields.topic.value, 'specialist', 'Restored language-switch draft wins over old query');
  const legacy = fixture({query:'?topic=access'});
  assert.equal(legacy.fields.topic.value, 'support', 'Removed access intent falls back to general questions');
  const unknown = fixture({query:'?topic=constructor'});
  assert.equal(unknown.fields.topic.value, 'support');

  for (const response of ['failure','network','malformed']) {
    const f = fillInquiry(fixture({response})); f.fields.contact_details.value = 'keep@example.test'; f.fields.message.value = 'Keep this comment';
    await f.form.emit('submit');
    assert.equal(f.status.dataset.state, 'error');
    assert.equal(f.fields.message.value, 'Keep this comment');
    assert.equal(f.fields.contact_details.value, 'keep@example.test');
    assert.equal(f.submit.disabled, false);
    assert.equal(f.fields.contact_details.disabled, false);
    assert.equal(f.form.getAttribute('aria-busy'), undefined);
    assert.equal(f.removed.length, 0, 'Failure keeps the language draft');
    assert.equal(f.metrics[1].outcome, response === 'network' ? 'unconfirmed' : 'failed');
  }
  const slow = fillInquiry(fixture({response:'slow'})); slow.fields.contact_details.value = 'slow@example.test';
  const sending = slow.form.emit('submit');
  await slow.form.emit('submit');
  assert.equal(slow.calls.length, 1, 'Duplicate submissions are ignored');
  assert.equal(slow.metrics.length, 1, 'Duplicate attempts are not counted');
  assert.equal(slow.submit.disabled, true);
  assert.equal(slow.fields.topic.disabled, true);
  slow.resolve(); await sending;
  assert.equal(slow.status.dataset.state, 'success');

  const timeout = fillInquiry(fixture({response:'slow'})); timeout.fields.contact_details.value = 'timeout@example.test';
  const pending = timeout.form.emit('submit'); timeout.timeout(); await pending;
  assert.equal(timeout.status.dataset.state, 'error');
  assert.equal(timeout.fields.contact_details.value, 'timeout@example.test');
  assert.equal(timeout.submit.disabled, false);
  assert.equal(timeout.timers.size, 0);

  const honeypot = fillInquiry(fixture()); honeypot.fields.contact_details.value = 'bot@example.test'; honeypot.fields.botcheck.checked = true;
  await honeypot.form.emit('submit'); assert.equal(honeypot.calls.length, 0);
  console.log('Contact flow: EN/RU/AZ support, specialist questions, partnerships, required messages, channel validation, draft precedence, payload, success/failure/network/malformed/timeout and duplicate protection passed. No requests sent.');
})().catch(error=>{console.error(error);process.exitCode=1;});
