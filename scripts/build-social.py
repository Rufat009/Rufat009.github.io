#!/usr/bin/env python3
"""Export the code-drawn social cards. Authoring only: requires Pillow.
The generated PNGs are committed; the static site has no image-library runtime.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
COPY = json.loads((ROOT / 'content/site.json').read_text())
OUT = ROOT / 'assets/social'
OUT.mkdir(parents=True, exist_ok=True)
BG, INK, GOLD, MUTED = '#f7f7f2', '#232923', '#806124', '#596057'
SCALE = 2

def card(lang, c):
    im = Image.new('RGB', (1200 * SCALE, 630 * SCALE), BG)
    d = ImageDraw.Draw(im)
    def font(size):
        return ImageFont.truetype(str(ROOT / 'assets/fonts/deviny-sans.woff2'), size * SCALE)
    def text(x, y, value, size, color):
        d.text((x*SCALE, y*SCALE), value, font=font(size), fill=color, anchor='lt')
    def line(points, color, width=2):
        d.line([(x*SCALE,y*SCALE) for x,y in points], fill=color, width=width*SCALE, joint='curve')
    def ellipse(box, fill=None, outline=None, width=2):
        d.ellipse(tuple(v*SCALE for v in box), fill=fill, outline=outline, width=width*SCALE)
    text(70, 62, 'Deviny', 43, INK)
    text(70, 555, 'deviny.me', 23, MUTED)
    lines = c['socialTitle'].split('\n')
    size = 76
    while max(d.textlength(value, font=font(size)) for value in lines) > 860*SCALE:
        size -= 1
    for i, value in enumerate(lines):
        text(70, 225+i*92, value, size, INK if i == 0 else GOLD)
    words = c['socialText'].split()
    subtitle, row = [], ''
    for word in words:
        candidate = (row+' '+word).strip()
        if d.textlength(candidate, font=font(27)) > 780*SCALE:
            subtitle.append(row); row=word
        else: row=candidate
    subtitle.append(row)
    for i,value in enumerate(subtitle): text(73, 435+i*36, value, 27, MUTED)
    # The hero's gold field, with three connected symbols: people, plan, workout.
    ellipse((972,-85,1640,715), fill='#e8c77f')
    line([(1065,221),(1065,410)], GOLD)
    for y in [195,315,435]: ellipse((1027,y-38,1103,y+38), fill=BG)
    ellipse((1056,173,1074,191), outline=INK)
    d.arc((1047*SCALE,195*SCALE,1083*SCALE,220*SCALE),180,360,fill=INK,width=3*SCALE)
    d.rounded_rectangle((1048*SCALE,294*SCALE,1082*SCALE,336*SCALE),radius=5*SCALE,outline=INK,width=3*SCALE)
    for y in [306,315,324]: line([(1056,y),(1074,y)],INK)
    line([(1044,435),(1086,435)],INK,3)
    for x,h in [(1045,10),(1053,18),(1077,18),(1085,10)]: line([(x,435-h),(x,435+h)],INK,3)
    im.resize((1200,630),Image.Resampling.LANCZOS).save(OUT/f'deviny-{lang}.png', optimize=True)

if __name__ == '__main__':
    for lang,c in COPY.items(): card(lang,c)
    print('Exported three localized social cards (1200 × 630).')
