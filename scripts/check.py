#!/usr/bin/env python3
"""Check the committed static site without a browser or third-party packages."""
import json
import struct
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
errors = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.tags, self.ids = path, [], []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if 'id' in attrs: self.ids.append(attrs['id'])
    def find(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]

def resolve(address):
    file = ROOT / unquote(urlsplit(address).path).lstrip('/')
    if file.is_dir(): file /= 'index.html'
    return file

def check(condition, context, message):
    if not condition: errors.append(f'{context}: {message}')

def check_asset_versions(page):
    for tag, attrs in page.tags:
        address = attrs.get('src') if tag == 'script' else attrs.get('href') if tag == 'link' and attrs.get('rel') == 'stylesheet' else None
        if not address or not address.startswith('/'):
            continue
        target = resolve(address)
        if target.is_file():
            expected = sha256(target.read_bytes()).hexdigest()[:16]
            check(parse_qs(urlsplit(address).query).get('v') == [expected],
                  page.path.relative_to(ROOT), f'Missing or stale asset cache version: {address}')

copy = json.loads((ROOT / 'content/site.json').read_text())
check(set(copy) == {'en','ru','az'}, 'content', 'Expected all three languages')
for lang, content in copy.items():
    check(set(content) == set(copy['en']), lang, 'Missing or extra translation keys')
    check(set(content['messages']) == set(copy['en']['messages']), lang, 'Missing form message keys')
    check(set(content['contactModes']) == {'collaboration','specialist','support'}, lang, 'Missing contact scenarios')
    for mode, fields in content['contactModes'].items():
        check(set(fields) == set(copy['en']['contactModes'][mode]), lang, f'Missing contact scenario translation: {mode}')

distribution = json.loads((ROOT/'content/distribution.json').read_text())
for key, host in [('appStoreUrl','apps.apple.com'),('googlePlayUrl','play.google.com')]:
    store = urlsplit(distribution[key])
    check(store.scheme == 'https' and store.hostname == host and not store.username and not store.password,
          'distribution', f'Invalid HTTPS store URL: {key}')
check(isinstance(distribution.get('linksArePlaceholders'), bool), 'distribution', 'Declare whether store links are placeholders')

addresses = [e.text for e in ElementTree.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
check(len(addresses) == 12 and len(set(addresses)) == 12, 'sitemap', 'Expected four canonical page types in three languages')
canonical_count = len(addresses)
utility = ['https://deviny.me' + prefix + '404.html' for prefix in ['/','/ru/','/az/']]
check(not set(addresses) & set(utility), 'sitemap', '404 pages must not be indexed')
check(not any(urlsplit(address).path.endswith('/team.html') for address in addresses), 'sitemap', 'Legacy team redirect must not be indexed')
addresses += utility
pages = {resolve(a): Page(resolve(a)) for a in addresses}
local_links = 0
images = 0
for address in addresses:
    file = resolve(address)
    page = pages[file]
    check_asset_versions(page)
    context = file.relative_to(ROOT)
    check(len(page.find('h1')) == 1, context, 'Must have exactly one h1')
    check(len(page.find('main')) == 1, context, 'Must have exactly one main landmark')
    check(len(page.ids) == len(set(page.ids)), context, 'Duplicate IDs')
    check(page.find('link', rel='canonical', href=address), context, 'Invalid canonical URL')
    check(page.find('meta', name='description')[0].get('content'), context, 'Missing description')
    check(page.find('meta', property='og:url', content=address), context, 'Invalid Open Graph URL')
    locale = 'ru' if 'ru' in context.parts else 'az' if 'az' in context.parts else 'en'
    social_url = 'https://deviny.me/assets/social/deviny-' + locale + '.png'
    check(page.find('meta', property='og:image', content=social_url), context, 'Missing localized social card')
    check(page.find('meta', name='twitter:card', content='summary_large_image'), context, 'Missing large social card metadata')
    social = resolve(social_url)
    check(social.is_file(), context, 'Social card file missing')
    if social.is_file():
        png = social.read_bytes()
        check(png[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',png[16:24]) == (1200,630), context, 'Invalid social card dimensions/format')

    alternates = page.find('link', rel='alternate')
    check({a.get('hreflang') for a in alternates} == {'en','ru','az','x-default'}, context, 'Invalid hreflang set')
    for alt in alternates:
        target = resolve(alt['href'])
        check(target in pages, context, f'Unknown alternate: {alt["href"]}')
        if target in pages:
            check(pages[target].find('link', rel='alternate', href=address), context, 'Non-reciprocal alternate')
    for action in page.find('a'):
        prefix = '/' if context.parts[0] not in ['ru','az'] else '/' + context.parts[0] + '/'
        if 'data-primary-action' in action:
            destination = prefix + ('specialists.html' if file.name == 'specialists.html' else '') + '#get-started'
            check(action.get('href') == destination, context, 'Download CTA must lead to the relevant stores section')
            check(action.get('data-primary-action') == 'download', context, 'Unexpected primary action')
        if 'data-store' in action:
            check(action.get('href') == distribution.get(action['data-store']), context, 'Store URL differs from distribution config')
        check('topic=access' not in action.get('href',''), context, 'Removed access funnel remains in navigation')
    if file.name in ['index.html','specialists.html']:
        for store in ['appStoreUrl','googlePlayUrl']:
            check(len(page.find('a', **{'data-store':store})) == 2, context, 'Expected both stores in hero and closing section')
    for tag, attrs in page.tags:
        if tag == 'img':
            images += 1
            decorative = attrs.get('aria-hidden') == 'true' and attrs.get('alt') == ''
            check(bool(attrs.get('alt')) or decorative, context, 'Image without meaningful alt or explicit decorative semantics')
            check(attrs.get('width') and attrs.get('height'), context, 'Image dimensions missing')
        href = attrs.get('href') if tag in ['a','link'] else attrs.get('src') if tag in ['img','script'] else None
        if href is None: continue
        check(href != '#', context, 'Placeholder link')
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc: continue
        target = resolve(parsed.path) if parsed.path.startswith('/') else file.parent / parsed.path if parsed.path else file
        if target.is_dir(): target /= 'index.html'
        local_links += 1
        check(target.is_file(), context, f'Missing target: {href}')
        if parsed.fragment and target.is_file() and target.suffix == '.html':
            other = pages.get(target) or Page(target)
            check(parsed.fragment in other.ids, context, f'Missing anchor: {href}')
    if file.name not in ['index.html','404.html']:
        alias = file.parent / file.stem / 'index.html'
        check(alias.is_file() and alias.read_bytes() == file.read_bytes(), context, 'Missing or stale extensionless alias')
    if file.name == 'contacts.html':
        check(page.find('form', action='https://api.web3forms.com/submit', method='POST'), context, 'Form integration changed')
        check(page.find('input', name='access_key', value='d65989bf-2ada-4894-92f6-2623d96a01d4'), context, 'Published form key changed')
        check(page.find('script', id='contact-modes'), context, 'Contact scenario configuration missing')
    if file.name == '404.html':
        check(page.find('meta', name='robots', content='noindex,follow'), context, '404 must be noindex')
    if file.name == 'about.html':
        check('team' in page.ids and len(page.find('article', **{'class':'person'})) == 4, context, 'Merged team section missing')

for prefix in ['/','/ru/','/az/']:
    legacy = resolve(prefix+'team.html')
    redirect = Page(legacy)
    check_asset_versions(redirect)
    destination = 'https://deviny.me'+prefix+'about.html'
    check(redirect.find('link', rel='canonical', href=destination), legacy.relative_to(ROOT), 'Team compatibility canonical is wrong')
    check(redirect.find('meta', name='robots', content='noindex,follow'), legacy.relative_to(ROOT), 'Team compatibility page must not be indexed')
    check(redirect.find('meta', **{'http-equiv':'refresh','content':'0;url='+prefix+'about.html#team'}), legacy.relative_to(ROOT), 'Team redirect target is wrong')
    check((legacy.parent/'team/index.html').read_bytes() == legacy.read_bytes(), legacy.relative_to(ROOT), 'Stale team compatibility alias')

check((ROOT/'CNAME').read_text().strip() == 'deviny.me', 'CNAME', 'Existing domain changed')
result = {'canonical_pages':canonical_count,'utility_pages':len(utility),'legacy_team_redirects':6,'local_references_checked':local_links,'images_checked':images,'errors':errors}
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
