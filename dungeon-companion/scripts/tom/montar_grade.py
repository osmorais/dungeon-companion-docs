"""Junta as 9 poses do Tom (402x436 cada) numa grade 3x3 com fundo transparente.

Uso (precisa do Pillow, ex.: num venv):
  python montar_grade.py <pasta com as poses> <saída.png>
  python montar_grade.py ~/projects/dungeon-companion-web/src/assets/tom tom-grade.png
Ver procedimentos/artes-tom.md.
"""
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
names = ['tom', 'tom-hi', 'tom-pointing', 'tom-like', 'tom-celebrating',
         'tom-reading', 'tom-casting-spell', 'tom-forging', 'tom-stop']
W, H, GAP, COLS = 402, 436, 48, 3
rows = (len(names) + COLS - 1) // COLS
sheet = Image.new('RGBA', (COLS * W + (COLS + 1) * GAP, rows * H + (rows + 1) * GAP), (0, 0, 0, 0))
for i, n in enumerate(names):
    im = Image.open(f'{src}/{n}.png').convert('RGBA')
    assert im.size == (W, H), (n, im.size)
    r, c = divmod(i, COLS)
    sheet.paste(im, (GAP + c * (W + GAP), GAP + r * (H + GAP)), im)
sheet.save(out)
print(out, sheet.size)
