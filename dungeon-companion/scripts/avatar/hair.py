import sys, json
from PIL import Image
import numpy as np
from scipy import ndimage
SHEET='/home/osmor/projects/docs/dungeon-companion/artes/avatar/hair/hair-sheet.png'
AV='/home/osmor/projects/dungeon-companion-web/src/assets/avatar/'
im=np.array(Image.open(SHEET)).astype(float)
rgb=im[...,:3]; a=im[...,3]
m=a>128
lab,n=ndimage.label(m)
objs=ndimage.find_objects(lab)
sizes=ndimage.sum(m,lab,range(1,n+1))
comps=sorted([i for i in range(n) if sizes[i]>2000], key=lambda i:(objs[i][0].start>450, objs[i][1].start))
# skin removal: smooth, skin-ish regions in comps 0,1,6 (swept, mohawk, bald)
lum=rgb.mean(2)
mean=ndimage.uniform_filter(lum,7); sq=ndimage.uniform_filter(lum*lum,7)
std=np.sqrt(np.maximum(sq-mean*mean,0))
skinish=(std<10)&m&(rgb[...,0]>90)&(rgb[...,0]-rgb[...,2]>60)
SKIN_SEEDS=json.loads(sys.argv[2]) if len(sys.argv)>2 else []
slab,_=ndimage.label(skinish)
remove=np.zeros_like(m)
for y,x in SKIN_SEEDS:
    if slab[y,x]: remove|= slab==slab[y,x]
remove=ndimage.binary_dilation(remove,iterations=2)&m&(rgb[...,0]>60)&(std<25)
# moicano: só a faixa central (as laterais raspadas deixam um contorno solto)
side=np.zeros_like(m); side[60:340,440:700]=True; side[60:340,522:612]=False
remove|=side
boxes=json.loads(sys.argv[1])
layers=[]
for k,i in enumerate(comps):
    sl=objs[i]
    mask=(lab[sl]==i+1)&~remove[sl]
    crop=np.zeros((*mask.shape,4)); crop[...,:3]=rgb[sl]*mask[...,None]; crop[...,3]=mask*255.0
    x0,y0,x1,y1=boxes[k]
    W,H=x1-x0,y1-y0
    pm=Image.fromarray(crop.astype(np.uint8),'RGBA')
    # premultiplied box downscale
    arr=np.array(pm).astype(float)
    small=np.stack([np.array(Image.fromarray(arr[...,c].astype(np.uint8)).resize((W,H),Image.BOX)).astype(float) for c in range(4)],-1)
    al=small[...,3]
    out=np.zeros((64,64,4))
    keep=al>=110
    col=np.where(al[...,None]>0, small[...,:3]*255/np.maximum(al[...,None],1),0)
    tile=np.zeros((H,W,4)); tile[...,:3]=col; tile[...,3]=keep*255
    # paste with clipping
    ys0,xs0=max(0,y0),max(0,x0); ys1,xs1=min(64,y1),min(64,x1)
    out[ys0:ys1,xs0:xs1]=tile[ys0-y0:ys1-y0, xs0-x0:xs1-x0]
    layers.append(out.clip(0,255).astype(np.uint8))
np.save('layers.npy',np.array(layers))
# preview: each hair on male human and female elf, plus existing hair_short_01 for reference
bases=[np.array(Image.open(AV+'race/base_human.png').convert('RGBA')), np.array(Image.open(AV+'race_fem/base_fem_human.png').convert('RGBA'))]
cloth=[np.array(Image.open(AV+'clothes/class_fighter.png').convert('RGBA')), np.array(Image.open(AV+'clothes_fem/class_fighter_fem.png').convert('RGBA'))]
def comp(base,*ls):
    img=Image.new('RGBA',(64,64),(20,20,40,255))
    for l in (base,)+ls: img.alpha_composite(Image.fromarray(l))
    return img
S=5
sheet=Image.new('RGBA',(64*S*len(layers)+ (len(layers)-1)*4, 64*S*2+4),(0,0,0,255))
for k,l in enumerate(layers):
    for r in range(2):
        sheet.paste(comp(bases[r],cloth[r],l).resize((64*S,64*S),Image.NEAREST),(k*(64*S+4), r*(64*S+4)))
sheet.save('hair_preview.png')
