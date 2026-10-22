from PIL import Image
import numpy as np, json, sys
AV='/home/osmor/projects/dungeon-companion-web/src/assets/avatar/'
def hsv(a):
    r,g,b=a[...,0],a[...,1],a[...,2]
    mx=a.max(-1); mn=a.min(-1); d=mx-mn
    h=np.zeros_like(mx)
    m=d>1e-6
    rr=(mx==r)&m; gg=(mx==g)&m&~rr; bb=m&~rr&~gg
    h[rr]=((g-b)[rr]/d[rr])%6; h[gg]=((b-r)[gg]/d[gg])+2; h[bb]=((r-g)[bb]/d[bb])+4
    h=h*60; s=np.where(mx>0,d/np.maximum(mx,1e-6),0)
    return h,s,mx
from scipy import ndimage
def ndimage_dilate(x): return ndimage.binary_dilation(x,iterations=1)
def hum_core(h): return ndimage.binary_erosion(h,iterations=2)
def hexc(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)])/255
TOL={'tiefling':14,'half_orc':22}
def skin_mask(a,race):
    rgb=a[...,:3]; al=a[...,3]>0
    h,s,v=hsv(rgb)
    face=a[28:44,22:42]; fm=face[...,3]>0
    fh,fs,fv=hsv(face[...,:3])
    sel=fm&(fs>0.3)
    ref=np.median(fh[sel])
    dh=np.abs((h-ref+180)%360-180)
    tol=TOL.get(race,20)
    m=al&(((dh<tol)&(s>0.25))|((v<0.3)&(dh<45)))
    if race=='tiefling':
        # chifres: região menos saturada que a pele, crescendo a partir das pontas
        yy,xx=np.mgrid[0:64,0:64]
        cand=al&(yy<24)&((s<0.665)|(v<0.25))
        lab,_=ndimage.label(cand)
        tips=[lab[y,x] for y in range(0,4) for x in range(64) if lab[y,x]]
        horns=np.isin(lab,list(set(tips)))
        m&=~horns
    return m
def recolor(a,m,mid,hl_amt):
    rgb=a[...,:3]
    lum=rgb@[0.299,0.587,0.114]
    L0=np.median(lum[m])
    t=lum/L0
    tmax=max(np.percentile(t[m],99),1.05)
    mid=np.array(mid)
    hl=mid+(1-mid)*hl_amt
    lo=mid[None,None,:]*np.minimum(t,1)[...,None]
    up=mid+(hl-mid)*np.clip((t-1)/(tmax-1),0,1)[...,None]
    new=np.where((t<=1)[...,None],lo,up)
    out=a.copy(); out[m,:3]=new[m]
    return out
