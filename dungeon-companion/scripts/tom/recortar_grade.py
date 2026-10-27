"""Recorta a grade do Tom editada (ex.: pelo ChatGPT) de volta nas 9 poses de 402x436.

A grade editada pode voltar em outro tamanho e com o Tom um pouco maior: cada pose é ajustada à
altura da figura na grade original, com os pés na mesma linha e o mesmo centro (a magia encosta
na borda direita, como no original), e o contorno quase transparente (alfa < 16) é limpo.

Uso (precisa do Pillow):
  python recortar_grade.py <grade original.png> <grade editada.png> <pasta de saída>
A grade original é a gerada por montar_grade.py com as poses de antes da edição.
Ver procedimentos/artes-tom.md.
"""
import sys, os
from PIL import Image
orig_sheet, new_sheet, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
names = ['tom', 'tom-hi', 'tom-pointing', 'tom-like', 'tom-celebrating',
         'tom-reading', 'tom-casting-spell', 'tom-forging', 'tom-stop']
W, H, GAP = 402, 436, 48
orig = Image.open(orig_sheet).convert('RGBA')
new = Image.open(new_sheet).convert('RGBA')
sx, sy = new.width / orig.width, new.height / orig.height
solid = lambda im: im.getchannel('A').point(lambda a: 255 if a > 128 else 0).getbbox()
for i, n in enumerate(names):
    r, c = divmod(i, 3)
    x0, y0 = GAP + c * (W + GAP), GAP + r * (H + GAP)
    ocell = orig.crop((x0, y0, x0 + W, y0 + H))
    ob = solid(ocell)
    ncell = new.crop((round(x0 * sx), round(y0 * sy), round((x0 + W) * sx), round((y0 + H) * sy)))
    # halo quase transparente que o ChatGPT deixou em volta
    a = ncell.getchannel('A').point(lambda v: 0 if v < 16 else v)
    ncell.putalpha(a)
    nb = solid(ncell)
    fig = ncell.crop(nb)
    k = (ob[3] - ob[1]) / fig.height  # mesma altura do original
    fig = fig.resize((max(1, round(fig.width * k)), ob[3] - ob[1]), Image.LANCZOS)
    cx = (ob[0] + ob[2]) / 2
    left = round(cx - fig.width / 2)
    if n == 'tom-casting-spell':
        left = ob[2] - fig.width  # o efeito encosta na borda direita, como no original
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.paste(fig, (left, ob[1]), fig)
    canvas.save(f'{out}/{n}.png')
    print(n, 'escala %.3f' % k, 'bbox novo', solid(canvas), 'orig', ob)
