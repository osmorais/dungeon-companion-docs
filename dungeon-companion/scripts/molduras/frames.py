from PIL import Image
import numpy as np, json
from scipy import ndimage
SRC='/home/osmor/projects/docs/dungeon-companion/artes/'
OUT='/home/osmor/projects/dungeon-companion-web/src/assets/frames/'
files={'fantasia':'molduras-card-fantasia.png','sombrio':'modulras-card-sombrio.png'}
names=['xp-bar','hp-bar','avatar-ring']
widths={'xp-bar':640,'hp-bar':640,'avatar-ring':320}
geo={}
for theme,f in files.items():
    im=np.array(Image.open(SRC+f)).astype(np.uint8)
    a=im[...,3]
    m=a>200
    lab,n=ndimage.label(m)
    sizes=ndimage.sum(m,lab,range(1,n+1)); objs=ndimage.find_objects(lab)
    comps=sorted([i for i in range(n) if sizes[i]>3000], key=lambda i:objs[i][0].start)
    for name,i in zip(names,comps):
        sl=objs[i]
        pad=2
        y0,y1=max(0,sl[0].start-pad),sl[0].stop+pad; x0,x1=max(0,sl[1].start-pad),sl[1].stop+pad
        crop=im[y0:y1,x0:x1].copy()
        own=ndimage.binary_dilation(lab[y0:y1,x0:x1]==i+1,iterations=2)
        al=crop[...,3].astype(float)
        al[~own]=0
        al[al<110]=0
        crop[...,3]=al.astype(np.uint8)
        H,W=crop.shape[:2]
        A=crop[...,3]>0
        g={'w':W,'h':H}
        if name=='avatar-ring':
            # círculo interno: varre da linha/coluna do centro pra fora
            cy,cx=H//2,W//2
            # encontra centro real: faixa transparente horizontal mais larga no meio
            best=None
            for y in range(int(H*0.3),int(H*0.7)):
                row=A[y]; xs=np.nonzero(~row[int(W*0.15):int(W*0.85)])[0]
                if len(xs):
                    run=xs.max()-xs.min()
                    if best is None or run>best[0]: best=(run,y,xs.min()+int(W*0.15),xs.max()+int(W*0.15))
            run,y,l,r=best
            cx=(l+r)/2
            col=A[:,int(cx)]; ys=np.nonzero(~col[int(H*0.1):int(H*0.9)])[0]+int(H*0.1)
            # maior trecho contínuo transparente contendo y
            t,b=y,y
            while t>0 and not col[t-1]: t-=1
            while b<H-1 and not col[b+1]: b+=1
            g.update(cx=cx/W, cy=(t+b)/2/H, rx=(r-l)/2/W, ry=(b-t)/2/H)
        else:
            # medalhão: coluna com o maior vão transparente vertical no 1/4 esquerdo
            best=None
            for x in range(0,int(W*0.3)):
                col=A[:,x]; 
                yc=H//2
                if col[yc]: continue
                t,b=yc,yc
                while t>0 and not col[t-1]: t-=1
                while b<H-1 and not col[b+1]: b+=1
                if t==0 or b==H-1: continue
                if best is None or b-t>best[0]: best=(b-t,x,t,b)
            d,mx,t,b=best
            row=A[(t+b)//2]; l,r=mx,mx
            while l>0 and not row[l-1]: l-=1
            while r<W-1 and not row[r+1]: r+=1
            g.update(mcx=(l+r)/2/W, mcy=(t+b)/2/H, mr=(r-l)/2/W, mry=(b-t)/2/H)
            # trilho: no meio da barra (x=55%), vão transparente vertical entre os trilhos
            x=int(W*0.55); col=A[:,x]; yc=None
            ys=np.nonzero(col)[0]
            # trilhos = dois blocos opacos; interior entre eles
            blocks=[]; start=None
            for yy in range(H):
                if col[yy] and start is None: start=yy
                if not col[yy] and start is not None: blocks.append((start,yy-1)); start=None
            if start is not None: blocks.append((start,H-1))
            top,bot=blocks[0],blocks[-1]
            g.update(ty0=(top[1]+1)/H, ty1=bot[0]/H, rail0=top[0]/H, rail1=bot[1]/H)
            # extremos do trilho: na linha do meio do vão, da direita do medalhão até a gema
            yy=int((top[1]+1+bot[0])/2); row=A[yy]
            xs=r+1
            while xs<W and not row[xs]: xs+=1  # pode bater no início
            # início do vão: primeira coluna transparente depois do medalhão
            x_start=r
            while x_start<W and row[x_start]: x_start+=1
            x_end=int(W*0.6)
            while x_end<W-1 and not row[x_end+1]: x_end+=1
            g.update(tx0=x_start/W, tx1=(x_end+1)/W)
        geo[f'{name}-{theme}']=g
        img=Image.fromarray(crop,'RGBA')
        w=widths[name]; h=round(H*w/W)
        img.resize((w,h),Image.LANCZOS).save(OUT+f'{name}-{theme}.webp',quality=92,method=6)
        img.save(f'crop-{name}-{theme}.png')
print(json.dumps(geo,indent=1))
