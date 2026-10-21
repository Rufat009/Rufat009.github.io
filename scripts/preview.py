#!/usr/bin/env python3
"""Local preview + isolated Web3Forms mocks. Never deployed by GitHub Pages.
Run: python3 scripts/preview.py --port 4173
Mock page: /__qa__/ru/contacts.html?mock=success|failure|network|malformed|slow
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import argparse, json, re
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        parsed=urlsplit(self.path)
        if parsed.path.startswith('/__qa__/'):
            requested=parsed.path.removeprefix('/__qa__/')
            file=(ROOT/requested).resolve()
            if file.is_dir(): file=file/'index.html'
            if not file.is_relative_to(ROOT) or file.suffix!='.html' or not file.is_file():
                self.send_error(404);return
            mode=parse_qs(parsed.query).get('mock',['success'])[0]
            script='''<script>window.__formMock={mode:MODE,count:0,payloads:[]};const originalFetch=window.fetch.bind(window);window.fetch=async (url,options)=>{if(String(url)!=='https://api.web3forms.com/submit')return originalFetch(url,options);const m=window.__formMock;m.count++;document.documentElement.dataset.mockRequests=String(m.count);m.payloads.push(Object.fromEntries(options.body.entries()));await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,m.mode==='slow'?8000:200);options.signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'))},{once:true})});if(m.mode==='network')throw new TypeError('Mock network failure');if(m.mode==='malformed')return new Response('invalid',{status:200});return new Response(JSON.stringify({success:m.mode!=='failure'}),{status:m.mode==='failure'?422:200,headers:{'Content-Type':'application/json'}})};</script>'''.replace('MODE',json.dumps(mode))
            html=file.read_text()
            options=parse_qs(parsed.query)
            if options.get('analytics')==['debug']:
                html=html.replace('<head>', '<head><script src="/scripts/analytics-qa.js"></script>')
            if options.get('motion')==['reduce']:
                # Local-only emulation of the reduced-motion startup branch.
                html=html.replace('<head>', '<head><style>*,*:before,*:after{animation:none!important;transition:none!important}</style><script>const nativeMatchMedia=window.matchMedia.bind(window);window.matchMedia=q=>q===\'(prefers-reduced-motion: reduce)\'?{matches:true,media:q,addEventListener(){},removeEventListener(){}}:nativeMatchMedia(q);</script>')
            if options.get('scripts')==['off']:
                html=re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S)
            elif file.name=='contacts.html': html=html.replace('<head>','<head>'+script)
            if options.get('textscale')==['2']:
                html=html.replace('</head>','<style>:root{font-size:32px}</style></head>')
            if options.get('a11y')==['1']:
                html=html.replace('</head>','<script src="/__qa_axe.js" defer></script><script defer src="/__qa_audit.js"></script></head>')
            data=html.encode()
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data);return
        if parsed.path in ['/__qa_axe.js','/__qa_audit.js']:
            if parsed.path=='/__qa_axe.js':
                source=Path('/private/tmp/deviny-site-qa/node_modules/axe-core/axe.min.js')
                if not source.is_file(): self.send_error(404);return
                data=source.read_bytes()
            else:
                data=b"""const vitals={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())vitals.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)vitals.cls+=e.value}).observe({type:'layout-shift',buffered:true});window.addEventListener('load',async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});const out=document.createElement('script');out.type='application/json';out.id='qa-audit-result';out.textContent=JSON.stringify({version:axe.version,violations:result.violations,incomplete:result.incomplete.map(x=>x.id),passes:result.passes.length});document.body.append(out);setTimeout(()=>{const perf=document.createElement('script');perf.id='qa-perf-result';perf.type='application/json';perf.textContent=JSON.stringify({vitals,nav:performance.getEntriesByType('navigation').map(n=>({duration:n.duration,domContentLoaded:n.domContentLoadedEventEnd,responseStart:n.responseStart,transferSize:n.transferSize})),paint:performance.getEntriesByType('paint').map(p=>({name:p.name,time:p.startTime})),resources:performance.getEntriesByType('resource').filter(r=>!r.name.includes('__qa_')).map(r=>({url:r.name,bytes:r.transferSize,duration:r.duration}))});document.body.append(perf)},500)});"""
            self.send_response(200);self.send_header('Content-Type','application/javascript');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data);return
        path=ROOT/parsed.path.lstrip('/')
        if not path.is_dir() and not path.suffix and not parsed.path.endswith('/') and path.with_suffix('.html').is_file():
            self.send_response(302);self.send_header('Location',parsed.path+'.html'+('?' + parsed.query if parsed.query else ''));self.end_headers();return
        return super().do_GET()
    def send_error(self,code,message=None,explain=None):
        if code==404:
            prefix=urlsplit(self.path).path.split('/')[1]
            file=ROOT / (prefix if prefix in ['ru','az'] else '') / '404.html'
            if file.is_file():
                data=file.read_bytes()
                self.send_response(404)
                self.send_header('Content-Type','text/html; charset=utf-8')
                self.send_header('Content-Length',str(len(data)))
                self.end_headers();self.wfile.write(data);return
        super().send_error(code,message,explain)
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--port',type=int,default=4173);args=ap.parse_args()
    print(f'Deviny preview: http://127.0.0.1:{args.port}/ru/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
