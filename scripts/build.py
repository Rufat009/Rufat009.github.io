#!/usr/bin/env python3
"""Render committed, crawlable HTML. Python stdlib only; no Pages build dependency."""
import json
from hashlib import sha256
from pathlib import Path
from html import escape as e
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
COPY = json.loads((ROOT / 'content/site.json').read_text())
DISTRIBUTION = json.loads((ROOT / 'content/distribution.json').read_text())
for key, host in [('appStoreUrl', 'apps.apple.com'), ('googlePlayUrl', 'play.google.com')]:
    parsed = urlsplit(DISTRIBUTION[key])
    if parsed.scheme != 'https' or parsed.hostname != host or parsed.username or parsed.password:
        raise ValueError(f'{key} must use the store’s HTTPS host')
PAGES = ['home', 'specialists', 'about', 'contacts']
ORIGIN = 'https://deviny.me'
SAFE_REL = 'rel="noopener noreferrer"'

def asset_url(path):
    """A changed asset must never reuse a previous release's browser cache."""
    version = sha256((ROOT / path.lstrip('/')).read_bytes()).hexdigest()[:16]
    return f'{path}?v={version}'

def page_assets(page):
    styles = ['/global.css']
    scripts = []
    if page == 'home':
        styles.append('/home.css')
        scripts += ['/home.js', '/product-scenes.js']
    if page == 'specialists':
        styles.append('/specialists.css')
    scripts += ['/i18n.js', '/script.js']
    if page == 'contacts':
        scripts.append('/components/contacts/contacts.js')
    return ''.join(f'<link rel="stylesheet" href="{asset_url(path)}">' for path in styles) + ''.join(
        f'<script src="{asset_url(path)}" defer></script>' for path in scripts)

def url(lang, page='home'):
    suffix = {'home':'','notfound':'404.html'}.get(page, f'{page}.html')
    return ('/' if lang == 'en' else f'/{lang}/') + suffix

def arrow():
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def link(href, label, cls='text-link', extra=''):
    return f'<a class="{cls}" href="{e(href)}" {extra}>{e(label)}{arrow()}</a>'

def primary_action(lang, c, cls='button', page='home'):
    return link(url(lang, page) + '#get-started', c['cta'], cls, 'data-primary-action="download"')

def store_links(c, note=True):
    apple = '<path d="M17.1 12.8c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.6 2.2 2.8 2.1 1.1 0 1.6-.7 3-.7s1.9.7 3.1.7c1.3 0 2-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.6-1-2.6-4ZM14.8 6.5c.6-.8 1.1-1.8 1-2.9-1 .1-2.1.7-2.8 1.4-.6.7-1.2 1.8-1 2.8 1 .1 2.1-.5 2.8-1.3Z"/>'
    play = '<path d="m4 3 11 9L4 21V3Zm1.5-.3L18 9.6 15.8 11 5.5 2.7ZM16 13l2 1.4L5.5 21.3 16 13Zm1-1 2.5-1.6 1.8 1c.5.3.5.9 0 1.2l-1.8 1L17 12Z"/>'
    links = ''.join(f'<a class="store-link" href="{e(DISTRIBUTION[key])}" data-store="{key}" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg><span><small>{e(c["storeAction"])}</small><strong>{label}</strong></span></a>' for key,label,icon in [('appStoreUrl','App Store',apple),('googlePlayUrl','Google Play',play)])
    caption = '<p class="release-note">' + e(c['releaseNote']) + '</p>' if note else ''
    return f'<div class="download-options">{caption}<div class="store-links">{links}</div></div>'

def header(lang, page, c):
    langs=''.join(f'<a href="{url(l,page)}" lang="{l}" hreflang="{l}" data-language="{l}" aria-label="{v["langName"]}"'+(' aria-current="true"' if l==lang else '')+f'>{l.upper()}</a>' for l,v in COPY.items())
    if page == 'contacts':
        action = ''
    else:
        action = primary_action(lang,c,'button button-small header-cta',page='specialists' if page == 'specialists' else 'home')
    return f'''<a class="skip-link" href="#main">{c['skip']}</a>
<header class="site-header"><div class="wrap header-inner">
<a class="brand" href="{url(lang)}" aria-label="Deviny — {c['back']}"><img src="/assets/logo.png" width="627" height="202" alt="Deviny"></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span>{c['menu']}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16"/><path d="M4 16h16"/></svg></button>
<nav id="primary-nav" class="primary-nav" aria-label="{c['menu']}">
<a href="{url(lang)}#possibilities">{c['navFeatures']}</a><a href="{url(lang)}#features">{c['navSupport']}</a><a href="{url(lang,'specialists')}" {'aria-current="page"' if page=='specialists' else ''}>{c['navPros']}</a>
<a href="{url(lang, 'specialists' if page == 'specialists' else 'home')}#get-started">{c['navStart']}</a>
</nav><nav class="languages" aria-label="{c['language']}">{langs}</nav>
{action}
</div></header>'''

def footer(lang,c):
    links = ''.join(f'<a href="{url(lang,p)}">{c[k]}</a>' for p,k in [('about','navAbout'),('specialists','navPros'),('contacts','navContact')])
    links += f'<a href="{url(lang)}#faq">{c["navFaq"]}</a>'
    return f'''<footer class="site-footer"><div class="wrap"><div class="footer-main"><div class="footer-brand"><a class="brand" href="{url(lang)}"><img src="/assets/product/wordmark.webp" width="145" height="50" loading="lazy" alt="Deviny"></a><p>{c['footer']}</p></div><nav aria-label="{c['menu']}" class="footer-nav">{links}</nav><div class="footer-contact"><a href="mailto:contact@deviny.me">contact@deviny.me</a><div class="social-links"><a href="https://www.linkedin.com/company/deviny" rel="noopener noreferrer">LinkedIn</a><a href="https://www.instagram.com/deviny.me/" rel="noopener noreferrer">Instagram</a><a href="https://x.com/devinyMe" rel="noopener noreferrer">X</a></div></div></div><div class="footer-bottom"><span>{c['rights']}</span><div><a href="https://api.deviny.me/legal/privacy.html" hreflang="en">{c['privacy']}</a><a href="https://api.deviny.me/legal/terms.html" hreflang="en">{c['terms']}</a></div></div></div></footer>'''

def steps(rows):
    return '<ol class="steps">'+''.join(f'<li><span class="step-number" aria-hidden="true">0{i+1}</span><div><h3>{e(a)}</h3><p>{e(b)}</p></div></li>' for i,(a,b) in enumerate(rows))+'</ol>'

def feed_icon(name):
    paths = {
        'mic': '<rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
        'video': '<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 9 6-4v14l-6-4"/>',
        'lock': '<rect x="4" y="10" width="16" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3"/>',
        'community': '<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M5 5a3 3 0 0 0 0 6M19 5a3 3 0 0 1 0 6M2 19v-2a4 4 0 0 1 3-4m17 6v-2a4 4 0 0 0-3-4"/>',
        'plus': '<path d="M12 5v14M5 12h14"/>',
        'search': '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
        'bell': '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
        'more': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
        'heart': '<path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>',
        'chat': '<path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3Z"/>',
        'repost': '<path d="m7 3-4 4 4 4M3 7h14a3 3 0 0 1 3 3m-3 11 4-4-4-4M21 17H7a3 3 0 0 1-3-3"/>',
        'home': '<path d="m2 11 10-8 10 8M5 9v12h5v-7h4v7h5V9"/>',
        'list': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10 8h7m-7 4h7m-7 4h7M7 8h.1M7 12h.1M7 16h.1"/>',
        'weights': '<path d="M3 9v6m3-9v12m12-12v12m3-9v6M6 12h12"/>',
        'calendar': '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18M8 15h2m4 0h2m-8 3h2"/>',
        'person': '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>',
        'signal': '<path d="M3 18v-3m5 3v-6m5 6V8m5 10V4"/>',
        'wifi': '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0m-3 4h.01"/>',
        'battery': '<rect x="2" y="6" width="18" height="12" rx="3"/><path d="M23 10v4M5 9h12v6H5Z"/>',
    }
    return f'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{paths[name]}</svg>'

def hero_feed(c):
    """An explicitly requested feed illustration with fictional demonstration posts."""
    f = c['heroFeed']
    actions = ''.join(feed_icon(name) for name in ['heart', 'chat', 'repost'])
    navigation = ''.join(f'<span class="feed-nav-item {"is-current" if i == 0 else ""}">{feed_icon(icon)}<span>{e(label)}</span></span>' for i,(icon,label) in enumerate(zip(['home','list','chat','weights','person'],f['nav'])))
    return f'''<div class="home-feed" data-hero-visual="feed-demo" role="img" aria-label="{e(f['description'])}"><div class="feed-illustration" aria-hidden="true">
<div class="feed-status"><span>9:41</span><span class="feed-status-icons">{feed_icon('signal')}{feed_icon('wifi')}{feed_icon('battery')}</span></div>
<div class="feed-header"><span class="feed-header-add">{feed_icon('plus')}</span><img class="feed-logo" src="/assets/logo.png" width="627" height="202" alt="Deviny"><span class="feed-header-tools">{feed_icon('search')}{feed_icon('bell')}</span></div>
<div class="feed-posts"><div class="feed-post"><div class="feed-author"><span class="feed-avatar feed-avatar-athlete"><img src="/assets/product/community-hero.webp" width="1642" height="958" alt="{e(f['athleteName'])}"></span><span class="feed-author-name"><strong>{e(f['athleteName'])}</strong><span>{e(f['athleteRole'])}</span></span>{feed_icon('more')}</div>
<p class="feed-caption">{e(f['athletePost'])}</p><img class="feed-photo" src="/assets/product/community-hero.webp" width="1642" height="958" alt="{e(c['homePhotoAlt'])}" fetchpriority="high"><div class="feed-reactions">{actions}<span>{e(f['today'])}</span></div></div>
<div class="feed-post"><div class="feed-author"><span class="feed-avatar feed-avatar-trainer"><img src="/assets/product/training.webp" width="1200" height="1200" alt="{e(f['trainerName'])}"></span><span class="feed-author-name"><strong>{e(f['trainerName'])}</strong><span>{e(f['trainerRole'])}</span></span>{feed_icon('more')}</div>
<p class="feed-caption">{e(f['trainerPost'])}</p><img class="feed-photo feed-photo-training" src="/assets/product/training.webp" width="1200" height="1200" alt="{e(c['photoAlt'])}"><div class="feed-reactions">{actions}<span>{e(f['today'])}</span></div></div></div>
<div class="feed-nav">{navigation}</div><span class="feed-home-indicator"></span>
</div></div>'''

def iphone_frame(content):
    return f'<div class="home-device-frame"><div class="home-device-screen">{content}</div><img class="home-device-shell" src="/assets/product/iphone-17-pro-silver.webp" width="1332" height="2748" alt="" aria-hidden="true" draggable="false" fetchpriority="high"></div>'

def training_diagram(c, mode):
    labels = c['trainingSceneLabels']
    def node(x,y,r,kind,label,style):
        size = 54 if kind == 'weights' else 38
        return f'<g class="training-diagram-node {style}"><circle cx="{x}" cy="{y}" r="{r}"/><svg x="{x-size/2}" y="{y-size/2}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none">{feed_icon(kind).split(">",1)[1].rsplit("</svg>",1)[0]}</svg><text x="{x}" y="{y+r+26}" text-anchor="middle">{e(label)}</text></g>'
    if mode == 'partner':
        paths = '<path d="M140 54h78q26 0 26 26v9q0 26 26 26h80M140 168h78q26 0 26-26v-1q0-26 26-26"/>'
        sources = node(98,54,36,'person',labels['you'],'diagram-you') + node(98,168,36,'person',labels['partner'],'diagram-partner')
    else:
        paths = '<path d="M147 115h203"/>'
        sources = node(98,115,42,'list' if mode == 'program' else 'person',labels['program'] if mode == 'program' else labels['you'],'diagram-you')
    return f'<div class="training-visual" aria-hidden="true"><svg class="training-diagram" viewBox="0 0 520 242" fill="none" focusable="false"><g class="training-diagram-path">{paths}<path d="m337 106 13 9-13 9"/></g>{sources}{node(418,115,60,"weights",labels["session"],"diagram-session")}</svg></div>'

def training_modes(lang,c):
    """Native radios explain concrete workflows; no mock app controls or user data."""
    choices, panels = [], []
    for mode in c['trainingModes']:
        key = mode['id']
        choices.append(f'<label class="training-choice"><input class="sr-only" type="radio" name="training-mode" value="{key}" aria-controls="training-{key}" {"checked" if key == "partner" else ""}><span>{e(mode["label"])}</span></label>')
        journey = ''.join(f'<li><span class="training-route-step" aria-hidden="true">{i+1}</span><div><strong>{e(title)}</strong><p>{e(text)}</p></div></li>' for i,(title,text) in enumerate(mode['journey']))
        panels.append(f'''<article class="training-panel" id="training-{key}" data-training-mode="{key}" aria-labelledby="training-{key}-title">
<div class="training-story"><h3 id="training-{key}-title">{mode['title']}</h3><p>{e(mode['text'])}</p>{primary_action(lang,c,'text-link')}</div>
{training_diagram(c,key)}
<ol class="training-journey" aria-label="{e(mode['journeyLabel'])}">{journey}</ol>
</article>''')
    return f'''<section class="home-training wrap" id="training" aria-labelledby="training-title"><div class="home-training-intro"><h2 id="training-title">{c['loopTitle']}</h2><p>{c['loopText']}</p></div><div class="training-explorer"><fieldset class="training-choices"><legend class="sr-only">{e(c['trainingModeLabel'])}</legend>{''.join(choices)}</fieldset><div class="training-panels">{''.join(panels)}</div></div><div class="training-kit" id="training-tools">{''.join(story_feature(c,key) for key in ['exercise-catalog','workout-editor','workout-history'])}</div></section>'''

def feature_record(c, key):
    return next(item for group in c['featureGroups'] for item in group['items'] if item['id'] == key)

def story_feature(c, key, cls='story-feature', title=None, icon=None):
    item = feature_record(c, key)
    heading = title if title is not None else e(item['title'])
    symbols = {
        'privacy': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
        'safety': '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
        'app-lock': '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
        'public-profile': '<path d="M12 15V3m-4 4 4-4 4 4M6 10H4v11h16V10h-2"/>',
        'referrals': '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2m3-14v8m-4-4h8"/>'
    }
    mark = f'<svg class="privacy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">{symbols[icon]}</svg>' if icon else ''
    return f'<article class="{cls}" id="feature-{key}" data-capability="{key}"><h3>{mark}{heading}</h3><p>{e(item["text"])}</p></article>'

def story_photo(c, name, cls, sizes):
    metadata = json.loads((ROOT / f'assets/product/{name}.webp.json').read_text())
    width,height = metadata['dimensions']
    return f'<img class="{cls}" src="/assets/product/{name}.webp" srcset="/assets/product/{name}-560.webp 560w, /assets/product/{name}.webp 1080w" sizes="{sizes}" width="{width}" height="{height}" alt="{e(c["realisticMediaAlts"][name])}" loading="lazy" decoding="async">'

def scene_tabs(prefix, labels, label):
    return '<div class="scene-switch-controls" role="tablist" aria-label="'+e(label)+'">'+''.join(f'<button type="button" role="tab" id="{prefix}-tab-{i}" aria-controls="{prefix}-panel-{i}" aria-selected="{str(i==0).lower()}" tabindex="{0 if i==0 else -1}">{e(title)}</button>' for i,title in enumerate(labels))+'</div>'

def people_story(c):
    t = c['landingStories']
    return f'''<section class="wrap people-story" id="support" aria-labelledby="why-choose"><span class="story-anchor" id="possibilities"></span><span class="story-anchor" id="how-works"></span>
<div class="people-story-copy"><h2 id="why-choose">{t['peopleTitle']}</h2><p class="story-lead">{e(t['peopleText'])}</p><div class="people-conversations">{''.join(story_feature(c,key) for key in ['social-feed','friends','discussions'])}</div></div>
<aside class="people-partner"><div class="partner-match" role="img" aria-label="{e(c['productScenes']['partnerMatch'])}"><div aria-hidden="true"><svg class="partner-connection" viewBox="0 0 480 260" fill="none"><path d="M115 85C240 85 240 175 365 175"/></svg><span class="partner-person partner-you">{e(c['productScenes']['partnerYou'])}</span><span class="partner-person partner-other">{e(c['productScenes']['partnerOther'])}</span><div class="partner-preferences">{''.join('<span>'+e(label)+'</span>' for label in c['productScenes']['partnerTags'])}</div></div></div><div class="partner-details">{story_feature(c,'gymbro','partner-feature')}{link('#training',t['partnerAction'])}</div></aside>
</section>'''

def clubs_story(c):
    t = c['landingStories']
    nodes = ''.join(f'<a class="club-node" href="#feature-{key}">{e(label)}{arrow()}</a>' for key,label in zip(['clubs','club-challenges','club-activity'],t['clubLabels']))
    photo = story_photo(c,'club-outdoors-photo','club-photo','(max-width: 650px) calc(100vw - 40px), (max-width: 1200px) 46vw, 540px')
    return f'''<section class="clubs-story" id="community" aria-labelledby="clubs-title"><div class="wrap clubs-story-inner"><div class="clubs-intro"><h2 id="clubs-title">{t['clubsTitle']}</h2><p class="story-lead">{e(t['clubsText'])}</p></div><div class="club-media">{photo}<div class="club-links">{nodes}</div></div><div class="club-life">{''.join(story_feature(c,key) for key in ['clubs','club-challenges','club-activity'])}</div></div></section>'''

def programs_story(c):
    scene = c['productScenes']
    tabs = scene_tabs('program', [row[0] for row in c['homeProgramKinds']], scene['programChoice'])
    panels = []
    for i,(title,text) in enumerate(c['homeProgramKinds']):
        photo = story_photo(c,['program-strength-photo','program-nutrition-photo'][i],'program-photo','(max-width: 650px) calc(100vw - 88px), (max-width: 850px) 560px, (max-width: 1200px) 42vw, 500px')
        panels.append(f'<section class="scene-panel program-preview program-preview-{i}" id="program-panel-{i}" role="tabpanel" aria-labelledby="program-tab-{i}" tabindex="0">{photo}<h3>{e(title)}</h3><p>{e(text)}</p></section>')
    return f'''<section class="wrap programs-story" id="features" aria-labelledby="program-story-title"><div class="program-story-copy" id="program-tools"><h2 id="program-story-title">{c['programTitle']}</h2><p class="story-lead">{e(c['programText'])}</p><div class="program-decisions">{story_feature(c,'authors-reviews')}{story_feature(c,'program-library')}</div><p class="program-price-note" id="options">{e(c['programPurchase'])}</p></div><div class="program-picker" data-scene-switch data-capability="program-catalog">{tabs}<div class="scene-panels">{''.join(panels)}</div></div><div class="program-search">{story_feature(c,'search-filters')}</div></section>'''

def progress_story(c):
    t = c['landingStories']
    return f'''<section class="progress-story" id="progress" aria-labelledby="progress-title"><div class="wrap progress-story-inner"><header><h2 id="progress-title">{t['progressTitle']}</h2><p class="story-lead">{e(t['progressText'])}</p></header><div class="progress-composition"><div class="progress-trail">{story_feature(c,"journey","progress-note")}{story_feature(c,"achievements","progress-note")}</div><div class="progress-ranking"><div class="ranking-stage" aria-hidden="true"><span class="ranking-place ranking-second">2</span><span class="ranking-place ranking-first">1</span><span class="ranking-place ranking-third">3</span></div>{story_feature(c,"leaderboards","ranking-note")}</div></div></div></section>'''

def personal_story(c):
    t,u = c['landingStories'],c['lowerScenes']
    facts = ''.join(story_feature(c,key,cls='personal-fact',icon=key) for key in ['public-profile','referrals'])
    appearance = feature_record(c,'appearance')
    lock = feature_record(c,'app-lock')
    biometric = '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M24 8H16a8 8 0 0 0-8 8v8m48-16h8a8 8 0 0 1 8 8v8M8 56v8a8 8 0 0 0 8 8h8m32 0h8a8 8 0 0 0 8-8v-8M28 30v7m24-7v7m-13-7v16h-5m-6 7c6 8 18 8 24 0"/></svg>'
    return f'''<section class="wrap personal-story" id="personal" aria-labelledby="personal-title"><div class="personal-intro"><h2 id="personal-title">{t['privacyTitle']}</h2><p class="personal-caption">{e(u['privacyLabel'])}</p><div class="personal-details">{facts}</div></div><div class="privacy-console"><div class="personal-appearance" id="feature-appearance" data-capability="appearance"><h3>{e(appearance['title'])}</h3><p><span lang="en">English</span><span lang="ru">Русский</span><span lang="az">Azərbaycanca</span></p></div><fieldset class="privacy-theme"><legend class="sr-only">{e(u['themeLabel'])}</legend><label><input class="sr-only" type="radio" name="privacy-preview-theme" value="light" checked><span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></svg>{e(u['light'])}</span></label><label><input class="sr-only" type="radio" name="privacy-preview-theme" value="dark"><span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/></svg>{e(u['dark'])}</span></label></fieldset><article class="privacy-lock" id="feature-app-lock" data-capability="app-lock"><div class="privacy-lock-art">{biometric}<span class="pin-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><div><h3>{e(lock['title'])}</h3><p>{e(lock['text'])}</p></div></article><div class="privacy-settings">{''.join(story_feature(c,key,icon=key) for key in ['privacy','safety'])}</div></div></section>'''

def professionals_story(lang,c):
    photo = story_photo(c,'specialist-session-photo','professional-photo','(max-width: 650px) calc(100vw - 40px), (max-width: 1000px) 38vw, 420px')
    return f'''<aside class="professional-band" id="specialists" data-capability="professional-tools"><div class="home-professionals wrap">{photo}<div class="professional-invitation"><h2>{c['proTitle']}</h2><p>{e(feature_record(c,"professional-tools")["text"])}</p>{link(url(lang,'specialists'),c['proLink'])}</div></div></aside>'''

def home(lang,c):
    faqs = [list(row) for row in c['faqs']]
    plus = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
    faq = ''.join(f'<details id="faq-{i+1}" name="home-faq" {"open" if i == 0 else ""}><summary>{e(title)}{plus}</summary><div class="disclosure-content"><p>{e(text)}</p></div></details>' for i,(title,text) in enumerate(faqs))
    closing = c['finalText']
    program_icon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16m-11 5 2 2 4-4"/></svg>'
    return f'''<section class="home-hero wrap">
<div class="home-hero-copy"><h1>{c['heroTitle']}</h1><p class="home-hero-description">{c['heroText']}</p>{store_links(c)}<div class="home-actions">{link('#possibilities',c['learn'])}</div></div>
<div class="home-product-scene" data-home-scene>
<div class="home-scene-backdrop" aria-hidden="true"><div class="home-scene-disc"></div><svg class="home-scene-orbit" viewBox="0 0 600 600" fill="none"><ellipse cx="300" cy="300" rx="286" ry="200" transform="rotate(-32 300 300)" pathLength="1"/></svg></div>
<div class="home-device">{iphone_frame(hero_feed(c))}</div>
<a class="home-float home-float-people" href="#support"><span class="home-float-top"><span class="home-float-portraits" aria-hidden="true"><span class="feed-avatar feed-avatar-athlete"><img src="/assets/product/community-hero.webp" width="1642" height="958" alt="" aria-hidden="true"></span><span class="feed-avatar feed-avatar-trainer"><img src="/assets/product/training.webp" width="1200" height="1200" alt="" aria-hidden="true"></span></span><span class="home-float-arrow">{arrow()}</span></span><span class="home-float-label">{e(c['heroPeopleLabel'])}</span><strong>{e(c['heroPeopleTitle'])}</strong></a>
<a class="home-float home-float-program" href="#features"><span class="home-float-top"><span class="home-float-icon">{program_icon}</span><span class="home-float-arrow">{arrow()}</span></span><span class="home-float-label">{e(c['heroProgramLabel'])}</span><strong>{e(c['heroProgramTitle'])}</strong></a>
</div>
</section>
{people_story(c)}
{clubs_story(c)}
{programs_story(c)}
{training_modes(lang,c)}
{progress_story(c)}
{personal_story(c)}
{professionals_story(lang,c)}
<section class="home-faq wrap" id="faq" aria-labelledby="faq-title"><div class="faq-intro"><h2 id="faq-title">{c['faqTitle']}</h2><aside class="faq-contact"><h3>{e(c['lowerScenes']['faqHelp'])}</h3>{link(url(lang,'contacts')+'?topic=support',c['lowerScenes']['faqAction'])}</aside></div><div class="home-faq-list">{faq}</div></section>
<section class="home-closing" id="get-started"><div class="wrap home-closing-inner"><h2>{c['finalTitle']}</h2><div><p>{closing}</p>{store_links(c,note=False)}</div></div></section>'''

def professional_onboarding(c):
    # Concept diagrams communicate the task, without inventing an app screen or a successful verification.
    diagrams = [
        '<rect x="33" y="22" width="174" height="118" rx="12"/><circle cx="79" cy="65" r="17"/><path d="M50 110c0-18 13-28 29-28s29 10 29 28M130 58h49m-49 16h36m-36 32h49"/><circle class="onboarding-gold" cx="200" cy="27" r="22"/><path d="M191 27h18m-9-9v18"/>',
        '<path d="M65 140V20h82l27 27v93H65Zm82-120v27h27M84 64h47m-47 17h33"/><circle class="onboarding-gold" cx="157" cy="112" r="31"/><circle cx="157" cy="112" r="19"/><path d="M157 100v13l9 6"/>',
        '<rect x="38" y="18" width="127" height="128" rx="10"/><circle class="onboarding-gold" cx="61" cy="51" r="7"/><circle class="onboarding-gold" cx="61" cy="82" r="7"/><circle class="onboarding-gold" cx="61" cy="113" r="7"/><path d="M83 51h59M83 82h48m-48 31h59M196 111V36m-17 17 17-17 17 17"/>'
    ]
    items = []
    for i,((title,text),drawing) in enumerate(zip(c['proSteps'],diagrams)):
        note = f'<p class="onboarding-review-note">{e(c["proVerificationNote"])}</p>' if i == 1 else ''
        items.append(f'<li><div class="onboarding-visual" aria-hidden="true"><svg viewBox="0 0 240 160" fill="none">{drawing}</svg></div><span class="onboarding-number" aria-hidden="true">{i+1}</span><div class="onboarding-copy"><h3>{e(title)}</h3><p>{e(text)}</p>{note}</div></li>')
    return f'<section class="wrap professional-onboarding" id="professional-start" aria-labelledby="professional-start-title"><h2 id="professional-start-title">{e(c["proStepsTitle"])}</h2><ol class="onboarding-route" role="list">{"".join(items)}</ol></section>'

def professional_trust(c):
    # Content/identity diagrams; no fabricated qualifications, approval badge or price.
    diagrams = [
        '<rect x="15" y="20" width="132" height="119" rx="12"/><circle cx="61" cy="62" r="17"/><path d="M33 111c0-19 12-29 28-29s28 10 28 29M103 52h23m-23 17h17"/><path class="trust-document" d="M114 89h44v56h-44z"/><path class="trust-document-lines" d="M125 105h22m-22 12h22m-22 12h14"/>',
        '<path d="M23 35c29-10 48-7 67 7 19-14 38-17 67-7v97c-29-10-48-7-67 7-19-14-38-17-67-7V35ZM90 42v97M37 56c15-3 25-1 38 5m-38 16c15-3 25-1 38 5m-38 16c15-3 25-1 38 5m31-42c13-6 23-8 38-5m-38 26c13-6 23-8 38-5m-38 26c13-6 23-8 38-5"/><path class="trust-document" d="M128 26h16v35l-8-5-8 5V26Z"/>'
    ]
    features = ''.join(f'<article class="client-trust-feature"><div class="client-trust-copy"><h3>{e(title)}</h3><p>{e(text)}</p></div><svg class="client-trust-visual" viewBox="0 0 180 160" fill="none" aria-hidden="true">{drawing}</svg></article>' for (title,text),drawing in zip(c['trustRows'][:2],diagrams))
    support_title, support_text = c['trustRows'][2]
    return f'''<section class="professional-trust" id="client-trust" aria-labelledby="client-trust-title"><div class="wrap professional-trust-inner"><h2 id="client-trust-title">{e(c['trustTitle'])}</h2><div class="client-trust-features">{features}</div><aside class="client-trust-terms"><h3>{e(c['proPilotTitle'])}</h3><p>{e(c['proPilotText'])}</p></aside><div class="client-trust-support"><div><h3>{e(support_title)}</h3><p>{e(support_text)}</p></div>{link('mailto:contact@deviny.me','contact@deviny.me')}</div></div></section>'''

def specialists(lang,c):
    workspace = c['specialistWorkspace']
    tools = ''.join(f'<li class="expert-tool"><span class="expert-tool-icon">{feed_icon(icon)}</span><div><strong>{e(title)}</strong><span>{e(text)}</span></div></li>' for icon,(title,text) in zip(['list','person','calendar'],workspace['tools']))
    workflow = ''.join(f'<li><h2>{e(title)}</h2><p>{e(text)}</p></li>' for title,text in c['specialistWorkflow'])
    return f'''<section class="wrap expert-hero" aria-labelledby="expert-title">
<div class="expert-hero-copy"><h1 id="expert-title">{c['specialistTitle']}</h1><p class="lead">{c['specialistText']}</p>{store_links(c)}<div class="specialist-question">{link(url(lang,'contacts')+'?topic=specialist',c['specialistCta'])}</div></div>
<figure class="expert-scene"><figcaption class="sr-only">{e(workspace['label'])}</figcaption><div class="expert-scene-disc" aria-hidden="true"></div><svg class="expert-scene-orbit" viewBox="0 0 560 560" fill="none" aria-hidden="true"><ellipse cx="280" cy="280" rx="267" ry="210" transform="rotate(-28 280 280)" pathLength="1"/></svg><div class="expert-workspace"><span class="expert-workspace-brand" aria-hidden="true">Deviny<span class="expert-brand-mark"></span></span><ul class="expert-tools">{tools}</ul></div></figure>
<ol class="expert-practice">{workflow}</ol>
</section>
{professional_onboarding(c)}
{professional_trust(c)}
<section class="wrap pro-band specialist-closing" id="get-started"><h2>{c['specialistFinalTitle']}</h2><div><p>{c['specialistFinalText']}</p>{store_links(c)}<div class="specialist-question">{link(url(lang,'contacts')+'?topic=specialist',c['specialistCta'])}</div></div></section>'''

def team_cards(c):
    people=[('Rufat Ahmedov','rufat','rufat-ahmadov-21b531360'),('Emil Abdullaev','emil','emil-abdullayev-846b832a5'),('Timur Sikachevskiy','tima','timur-sikachevskiy-029024288'),('Arxun Abdullazade','arxun','arhun-abdullazade-5173522a4')]
    return ''.join(f'<article class="person"><img src="/assets/team/{file}.webp" width="600" height="720" loading="lazy" alt="{name}"><div><h3>{name}</h3><p>{e(c["teamRoles"][i])}</p>{link("https://www.linkedin.com/in/"+profile+"/",c["profile"],extra=SAFE_REL)}</div></article>' for i,(name,file,profile) in enumerate(people))

def about(lang,c):
    return f'''<section class="page-hero wrap about-hero"><h1>{c['aboutTitle']}</h1><p class="lead">{c['aboutText']}</p></section>
<section class="wrap about-principles"><article><h2>{c['aboutPurposeTitle']}</h2><p>{c['aboutPurposeText']}</p></article><article><h2>{c['aboutChoiceTitle']}</h2><p>{c['aboutChoiceText']}</p></article></section>
<section class="wrap about-team" id="team" aria-labelledby="team-title"><h2 id="team-title">{c['aboutTeamTitle']}</h2><p class="section-intro">{c['aboutTeamText']}</p><div class="team-grid">{team_cards(c)}</div></section>
<section class="wrap collaboration about-collaboration"><h2>{c['teamEnd']}</h2><p>{c['teamEndText']}</p>{link(url(lang,'contacts')+'?topic=collaboration',c['contact'],'button')}</section>'''

def contacts(lang,c):
    def field(key,name,placeholder,autocomplete):
        return f'<div class="field"><label id="{name}-label" for="{name}">{c[key]}</label><input id="{name}" name="{name}" autocomplete="{autocomplete}" maxlength="{100 if name=="name" else 254}" required placeholder="{e(c[placeholder])}" aria-describedby="{name}-error"><p class="field-error" id="{name}-error"></p></div>'
    topics=''.join(f'<option value="{v}" {"selected" if v=="support" else ""}>{e(t)}</option>' for v,t in zip(['support','specialist','collaboration'],c['topics']))
    radios=''.join(f'<label><input type="radio" name="reply_method" value="{v}" {"checked" if v=="Email" else ""}><span>{v}</span></label>' for v in ['Email','Telegram','WhatsApp'])
    m = c['contactModes']['support']
    return f'''<section class="wrap contact-layout"><div class="contact-copy"><h1 id="contact-title"><span>{e(m['heading'][0])}</span><br><em>{e(m['heading'][1])}</em></h1><p class="lead" id="contact-intro">{e(m['text'])}</p><div class="contact-email"><span>{c['emailLabel']}</span><a href="mailto:contact@deviny.me">contact@deviny.me{arrow()}</a></div></div><div class="form-panel"><div class="form-heading"><h2 id="contact-form-title">{e(m['formTitle'])}</h2><button type="button" class="text-button" id="change-topic" hidden>{e(c['changeTopic'])}</button></div><form id="contact-form" action="https://api.web3forms.com/submit" method="POST" novalidate><input type="hidden" name="access_key" value="d65989bf-2ada-4894-92f6-2623d96a01d4"><input type="hidden" name="subject" value="{e(m['subject'])}"><input type="hidden" name="language" value="{lang}"><input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" aria-hidden="true"><div class="field" id="topic-field"><label for="topic">{c['topic']}</label><select name="topic" id="topic">{topics}</select></div><fieldset><legend>{c['reply']}</legend><div class="reply-options">{radios}</div></fieldset>{field('details','contact_details','detailsPlaceholder','email')}{field('name','name','namePlaceholder','name')}<div class="field"><label id="message-label" for="message">{c['message']}</label><textarea name="message" id="message" rows="5" required minlength="10" maxlength="5000" placeholder="{e(m['messagePlaceholder'])}" aria-describedby="message-error"></textarea><p class="field-error" id="message-error"></p></div><p class="form-disclosure">{c['formDisclosure']} <a href="https://api.deviny.me/legal/privacy.html" hreflang="en">{c['privacy']}</a></p><button type="submit" class="button form-submit" disabled data-enable-submit><span>{e(m['send'])}</span>{arrow()}</button><p class="form-status" id="form-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p><noscript><p>{c['nojs']}</p></noscript></form><script type="application/json" id="form-messages">{json.dumps(c['messages'],ensure_ascii=False)}</script><script type="application/json" id="contact-modes">{json.dumps({'modes':c['contactModes'],'name':c['name'],'message':c['message']},ensure_ascii=False)}</script></div></section>'''

def notfound(lang,c):
    return f'''<section class="wrap not-found"><p class="error-code" aria-hidden="true">404</p><h1>{c['notFoundTitle']}</h1><p class="lead">{c['notFoundText']}</p><div class="recovery-actions">{link(url(lang),c['homeLink'],'button')}{link(url(lang,'contacts')+'?topic=support',c['notFoundContact'])}</div></section>'''

RENDER={'home':home,'specialists':specialists,'about':about,'contacts':contacts,'notfound':notfound}

def document(lang,page,c):
    address=url(lang,page)
    alternates='\n'.join(f'<link rel="alternate" hreflang="{l}" href="{ORIGIN}{url(l,page)}">' for l in COPY)
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f5f5f0"><title>{e(c['titles'][page])}</title><meta name="description" content="{e(c['descriptions'][page])}">{'<meta name="robots" content="noindex,follow">' if page=='notfound' else ''}<link rel="canonical" href="{ORIGIN}{address}">{alternates}<link rel="alternate" hreflang="x-default" href="{ORIGIN}{url('en',page)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Deviny"><meta property="og:title" content="{e(c['titles'][page])}"><meta property="og:description" content="{e(c['descriptions'][page])}"><meta property="og:url" content="{ORIGIN}{address}"><meta property="og:locale" content="{c['locale']}"><meta property="og:image" content="https://deviny.me/assets/social/deviny-{lang}.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(c['socialTitle'].replace(chr(10), ' '))}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://deviny.me/assets/social/deviny-{lang}.png"><link rel="icon" type="image/png" href="/assets/favicon.png"><script>document.documentElement.classList.add("js")</script><link rel="preload" href="/assets/fonts/deviny-sans.woff2" as="font" type="font/woff2" crossorigin>{page_assets(page)}</head><body data-page="{page}">{header(lang,page,c)}<main id="main">{RENDER[page](lang,c)}</main>{footer(lang,c)}</body></html>'''

def team_redirect(lang,c):
    destination=url(lang,'about')+'#team'
    script = """const target=new URL(DESTINATION,location.origin);target.search=location.search;const chosen=target.searchParams.get('lang');if(['en','ru','az'].includes(chosen)){target.pathname=(chosen==='en'?'/':'/'+chosen+'/')+'about.html';target.searchParams.delete('lang');}target.hash=location.hash||'#team';location.replace(target.href);""".replace('DESTINATION',json.dumps(destination))
    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(c['titles']['about'])}</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="{ORIGIN}{url(lang,'about')}"><script>{script}</script><meta http-equiv="refresh" content="0;url={destination}"><link rel="stylesheet" href="{asset_url("/global.css")}"></head><body><main class="wrap page-hero"><h1>{c['aboutTeamTitle']}</h1>{link(destination,c['aboutTeam'],'button')}</main></body></html>'''

def build():
    entries=[]
    for lang,c in COPY.items():
        for page in PAGES + ['notfound']:
            address=url(lang,page)
            output=document(lang,page,c)
            target=ROOT/address.lstrip('/')
            if address.endswith('/'): target=target/'index.html'
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(output)
            # Old public navigation used /about. Directory aliases work on Pages
            # without a server rewrite and share the canonical .html address.
            if page not in ['home','notfound']:
                alias = target.parent / page / 'index.html'
                alias.parent.mkdir(parents=True, exist_ok=True)
                alias.write_text(output)
            if page != 'notfound':
                entries.append(f'<url><loc>{ORIGIN}{address}</loc></url>')
        for legacy in [url(lang,'team'), url(lang,'team').removesuffix('.html')+'/index.html']:
            destination=ROOT/legacy.lstrip('/')
            destination.parent.mkdir(parents=True,exist_ok=True)
            destination.write_text(team_redirect(lang,c))
        # Kept as useful shared source fragments; included at build time, never fetched by JS.
        if lang=='en':
            (ROOT/'components/header/header.html').write_text(header(lang,'home',c))
            (ROOT/'components/footer/footer.html').write_text(footer(lang,c))
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+'\n'.join(entries)+'\n</urlset>\n')
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /scripts/\nDisallow: /content/\nSitemap: https://deviny.me/sitemap.xml\n')
    print(f'Rendered {len(entries)} canonical pages in EN/RU/AZ plus localized 404 and legacy team redirects; preserved CNAME.')

if __name__=='__main__': build()
