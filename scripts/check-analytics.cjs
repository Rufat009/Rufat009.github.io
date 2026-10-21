/* No network: verify the event boundary, destination and opt-out behavior. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
function fixture({enabled=true, host='deviny.me', protocol='https:', debug=false, placeholders=true, dnt, gpc=false, page='home', language='ru', throws=false, hidden=false}={}) {
  const listeners={}, requests=[], metrics=[], observed=[];
  let observer;
  const section={id:'get-started'};
  const document={
    body:{dataset:{page}},documentElement:{lang:language,dataset:{analyticsDebug:String(debug)}},
    visibilityState:hidden?'hidden':'visible',
    getElementById(id){return id==='analytics-config'?{textContent:JSON.stringify({enabled,provider:'plausible',domain:'deviny.me',linksArePlaceholders:placeholders})}:id==='get-started'?section:null;},
    addEventListener(name,fn){(listeners[name]||=[]).push(fn);},
    dispatchEvent(event){metrics.push(event.detail);},
  };
  const location={hostname:host,protocol,origin:`${protocol}//${host}`,href:`${protocol}//${host}/ru/?email=private@example.test#secret`};
  vm.runInNewContext(source, {document,location,navigator:{doNotTrack:dnt,globalPrivacyControl:gpc},URL,
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},
    IntersectionObserver:class{constructor(fn){observer=fn;}observe(node){observed.push(node);}unobserve(){}},
    fetch(url,options){requests.push({url,options,payload:JSON.parse(options.body)});if(throws)throw Error('blocked');return Promise.resolve({ok:true});},
  });
  const emit=(name,event)=>{for(const fn of listeners[name]||[])fn(event);};
  return {requests,metrics,listeners,document,emit,
    seen(){observer?.([{target:section,isIntersecting:true}]);},
    click({store,href='#get-started',region='hero',button=0,type='click'}={}){
      const anchor={dataset:{store},href:new URL(href,location.href).href,closest(selector){return (region==='hero'&&selector==='.home-hero, .expert-hero')||(region==='footer'&&selector==='.site-footer')||(region==='closing'&&selector==='#get-started')?{}:null;}};
      let prevented=false;
      emit(type,{type,button,target:{closest:()=>anchor},preventDefault(){prevented=true;}});
      assert.equal(prevented,false,'Measurement must not intercept navigation');
    },
  };
}
for(const options of [{enabled:false},{host:'preview.test'},{host:'localhost'},{protocol:'http:'},{gpc:true},{dnt:'1'},{dnt:'yes'},{page:'user/private'},{language:'private'}]) {
  const f=fixture(options);f.click();assert.equal(f.requests.length,0);assert.equal(f.metrics.length,0);
}
const local=fixture({enabled:false,host:'127.0.0.1',protocol:'http:',debug:true});
local.click({store:'appStoreUrl'});assert.equal(local.requests.length,0);assert.equal(local.metrics[1].name,'store_placeholder_click');
const production=fixture({debug:true});assert.equal(production.metrics.length,0,'Debug cannot be enabled on production');
for(const language of ['en','ru','az']) for(const page of ['home','specialists','about','contacts','notfound']) {
  const f=fixture({language,page});
  assert.equal(f.requests.length,1);
  const expected='https://deviny.me'+(language==='en'?'/':`/${language}/`)+(page==='home'?'':page==='notfound'?'404.html':`${page}.html`);
  assert.equal(f.requests[0].payload.url,expected);
  f.click({store:'appStoreUrl'});f.click({store:'googlePlayUrl',region:'closing',type:'auxclick',button:1});
  assert.equal(f.requests[1].payload.name,'store_placeholder_click');
  assert.equal(f.requests[2].payload.props.store,'google_play');
  assert.equal(f.requests[2].payload.props.region,'closing');
  f.click({store:'googlePlayUrl',type:'auxclick',button:2});assert.equal(f.requests.length,3);
  assert.ok(!JSON.stringify(f.requests).includes('private@example.test'));
  for(const r of f.requests){assert.equal(r.url,'https://plausible.io/api/event');assert.equal(r.options.credentials,'omit');assert.equal(r.options.referrerPolicy,'no-referrer');assert.equal(r.options.keepalive,true);}
}
const live=fixture({placeholders:false});live.click({store:'appStoreUrl'});assert.equal(live.requests[1].payload.name,'store_outbound_click');
const f=fixture();f.click();f.click({href:'/ru/specialists.html',region:'footer'});f.click({href:'/ru/contacts.html?topic=private@example.test'});
assert.equal(f.requests[1].payload.name,'download_intent');assert.equal(f.requests[2].payload.name,'specialist_interest');assert.equal(f.requests[3].payload.props.topic,'support');
f.emit('deviny:contact',{detail:{stage:'attempt',topic:'support',email:'private@example.test'}});
f.emit('deviny:contact',{detail:{stage:'result',topic:'support',outcome:'accepted',message:'private message'}});
assert.deepEqual(f.requests[5].payload.props,{page:'home',language:'ru',topic:'support',outcome:'accepted'});
f.emit('deviny:contact',{detail:{stage:'result',topic:'unknown',outcome:'accepted'}});assert.equal(f.requests.length,6);
f.seen();f.seen();assert.equal(f.requests.filter(r=>r.payload.name==='section_seen').length,1);assert.equal(f.requests.at(-1).payload.interactive,false);
const hidden=fixture({hidden:true});assert.equal(hidden.requests.length,0);hidden.document.visibilityState='visible';hidden.emit('visibilitychange');hidden.emit('visibilitychange');assert.equal(hidden.requests.length,1);
assert.doesNotThrow(()=>fixture({throws:true}).click());
const config=JSON.parse(fs.readFileSync(path.join(root,'content/analytics.json')));
assert.equal(typeof config.enabled,'boolean');
assert.equal(config.provider,'plausible');
assert.equal(config.domain,'deviny.me');
console.log('Analytics: disabled/local/production gates, DNT/GPC, 15 routes, placeholders vs store outbounds, click/auxclick, sanitized properties, support outcomes, section deduplication and failure isolation passed. No requests sent.');
