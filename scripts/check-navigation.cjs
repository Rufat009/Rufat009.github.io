/* Route/language tests in a VM. No browser rendering or network requests. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'i18n.js'),'utf8');
function fixture({lang='ru',page='contacts',route='/ru/contacts.html?topic=support#message',draft=null,busy=false}={}) {
  const url = new URL(route,'https://preview.test');
  let replaced,stored;
  const fields=Object.fromEntries(['name','contact_details','message','topic'].map(k=>[k,{value:k==='topic'?'support':''}]));
  let selectedMethod='Email';
  const methods=['Email','Telegram','WhatsApp'].map(value=>({value,get checked(){return selectedMethod===value;},set checked(on){if(on)selectedMethod=value;}}));
  const form={dataset:{},elements:{namedItem:name=>fields[name]},
    getAttribute:()=>busy?'true':null,
    querySelector:selector=>methods.find(m=>selector.includes(`value="${m.value}"`)),
  };
  const anchors=['en','ru','az'].map(locale=>({href:`https://preview.test/${locale==='en'?'':locale+'/'}${page==='notfound'?'404':page}.html`,listeners:{},
    addEventListener(name,fn){this.listeners[name]=fn;}}));
  const document={documentElement:{lang},body:{dataset:{page}},querySelector:()=>form,querySelectorAll:()=>anchors};
  const sessionStorage={getItem:()=>JSON.stringify(draft),removeItem(){},setItem(_key,value){stored=JSON.parse(value);}};
  class Data extends Map{constructor(){super(Object.entries(fields).map(([k,n])=>[k,n.value]));this.set('reply_method',methods.find(m=>m.checked).value);}}
  vm.runInNewContext(source,{document,location:{origin:url.origin,search:url.search,hash:url.hash,pathname:url.pathname,replace:address=>{replaced=String(address);}},URL,URLSearchParams,
    localStorage:{setItem(){}},sessionStorage,FormData:Data,Date});
  return {fields,form,methods,anchors,get replaced(){return replaced;},get stored(){return stored;}};
}
const redirect=fixture({lang:'en',route:'/contacts.html?lang=az&topic=specialist#message'});
assert.equal(redirect.replaced,'https://preview.test/az/contacts.html?topic=specialist#message');
const notfound=fixture({lang:'en',page:'notfound',route:'/ru/missing-page'});
assert.equal(notfound.replaced,'/ru/404.html');
const override=fixture({lang:'en',page:'notfound',route:'/ru/missing-page?lang=az'});
assert.equal(override.replaced,'https://preview.test/az/404.html');
const current=fixture({draft:{at:Date.now(),name:'A'.repeat(200),contact_details:'x'.repeat(400),message:'z'.repeat(6000),topic:'specialist',reply_method:'Telegram'}});
assert.equal(current.form.dataset.draftRestored,'true');
assert.equal(current.fields.name.value.length,100);
assert.equal(current.fields.contact_details.value.length,254);
assert.equal(current.fields.message.value.length,5000);
assert.equal(current.fields.topic.value,'specialist');
assert.equal(current.methods[1].checked,true);
let prevented=false;
current.anchors[0].listeners.click({preventDefault(){prevented=true;}});
assert.equal(prevented,false);
assert.equal(new URL(current.anchors[0].href).searchParams.get('topic'),'support');
assert.equal(current.stored.topic,'specialist','Actual draft intent is preserved even if old link query differs');
assert.equal(current.stored.reply_method,'Telegram');
const pending=fixture({busy:true});
pending.anchors[0].listeners.click({preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(pending.stored,undefined);
const expired=fixture({draft:{at:Date.now()-700000,name:'old',topic:'support'}});
assert.equal(expired.form.dataset.draftRestored,undefined);
for (const lang of ['en','ru','az']) {
  const prefix=lang==='en'?'':lang+'/';
  const html=fs.readFileSync(path.join(root,prefix,'team.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [search,hash,expected] of [['','','/'+prefix+'about.html#team'],['?lang=az&topic=support','','/az/about.html?topic=support#team'],['','#team','/'+prefix+'about.html#team']]) {
    let actual;
    vm.runInNewContext(script,{URL,location:{origin:'https://preview.test',search,hash,replace:value=>{actual=String(value);}}});
    assert.equal(actual,'https://preview.test'+expected);
  }
}
console.log('Navigation: localized 404, explicit language precedence, draft retention/limits, pending navigation protection and all legacy team redirects passed.');
