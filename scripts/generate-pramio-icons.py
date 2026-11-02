#!/usr/bin/env python3
"""Derive all PRAMIO favicons from the single approved SVG mark."""
from pathlib import Path
from io import BytesIO
from PIL import Image
import cairosvg

assets = Path('assets')
svg = (assets / 'pramio-favicon.svg').read_bytes()
for size in (16, 32, 48, 180, 192, 512):
    raw = cairosvg.svg2png(bytestring=svg, output_width=size*4, output_height=size*4)
    image = Image.open(BytesIO(raw)).resize((size, size), Image.Resampling.LANCZOS)
    image.save(assets / f'pramio-icon-{size}.png', optimize=True)
Image.open(assets / 'pramio-icon-48.png').save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('PRAMIO R14 favicon icons: 16/32/48/180/192/512 and favicon.ico')
