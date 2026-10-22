---
resumo: Prompts do ChatGPT pras artes das cartas de magia e de arma (molduras, escolas, folhas de armas) e onde salvar cada imagem.
tipo: procedimento
status: ativo
atualizado: 2026-10-21
---

# Dungeon Companion — Artes das cartas (magias e armas)

Artes das cartas de magia e de arma (visão "card game" do grimório e da coluna COMBATE das ações),
geradas pelo usuário no ChatGPT.

- **Originais (PNG, ~25 MB das magias)**: neste repositório de docs, em
  [`artes/spell-cards/`](../artes/spell-cards/) (magias) e `artes/weapon-cards/` (armas). Ficam
  fora do repositório web pra não pesar o clone; e nada de `src/assets/` ou `public/` lá, porque
  tudo isso vai pro site.
- **Script de preparo** (no web): `design/spell-cards/process.py` lê os originais daqui (ou da
  pasta passada como argumento), limpa o halo do fundo, reduz e grava WebP em
  `src/assets/cards/` (`card-frame-<tema>.webp`, `spell-school-<escola>.webp`). Precisa de Pillow.
  As armas vão ganhar um `design/weapon-cards/process.py` no mesmo esquema (recorte das folhas).
- Uso no site: `app-game-card` / `app-card-viewer` (`src/app/game-card/`), moldura pela variável
  de tema `--card-face`. Áreas da moldura em % no SCSS do componente.

O site escreve o texto por cima (nome, círculo/bônus, escola/tipo, dano, descrição) — as imagens
**não** têm texto.

## Arquivos esperados

Em `artes/spell-cards/` (salvos em 2026-10-21):

| Arquivo | O quê |
|---|---|
| `frame-fantasia.png` | Moldura da carta, tema Fantasia |
| `frame-sombrio.png` | Moldura da carta, tema Sombrio (mesmo layout) |
| `school-<escola>.png` | Ilustração por escola: `abjuracao`, `adivinhacao`, `conjuracao`, `encantamento`, `evocacao`, `ilusao`, `necromancia`, `transmutacao` |

Em `artes/weapon-cards/` (a gerar):

| Arquivo | O quê |
|---|---|
| `weapons-1.png` | Folha de armas 1 (4×4) |
| `weapons-2.png` | Folha de armas 2 (4×4) |
| `weapons-3.png` | Folha de armas 3 (3×2) |

## Prompt das armas (ChatGPT)

Uma arte por arma: 37 do catálogo (`weapon` no banco, ids 1–37) + ataque desarmado = 38, em 3
folhas. Arma sozinha, fundo transparente; o fundo da janela de arte é pintado pelo site por tipo
de dano. **A ordem importa**: o recorte é por posição (célula N da folha = arma da lista).

Gerar as três na mesma conversa; na 2 e na 3 acrescentar: "same style, palette, outline,
lighting and scale as the previous sheet". Célula com texto ou fora da ordem: pedir a folha de novo.

### Prompt base

Trocar `[GRADE]` e `[LISTA]` por folha.

```
A sprite sheet of fantasy RPG weapons in 16-bit pixel art, for trading-card artwork.
Grid: [GRADE], all cells exactly the same size, one weapon per cell, centered, each weapon filling about 80% of its cell. No grid lines, no cell borders, no labels, no text, no numbers.
Background: fully TRANSPARENT (PNG with alpha), no shadows on the ground, no backdrop.
Style: crisp pixel art, no blur or anti-aliasing, dark outline #1C0B0B on every shape, limited palette of steel greys, worn wood browns, leather, brass and gold accents (#CCAA44), small highlights. Same lighting (from top-left), same level of pixel detail and same scale feel in every cell.
Orientation: long weapons (swords, axes, polearms, staffs) drawn diagonally from bottom-left to top-right; bows and crossbows drawn upright; small weapons centered.
Weapons in reading order (left to right, top to bottom):
[LISTA]
```

### Folha 1 — `weapons-1.png` — `[GRADE]` = `4 columns × 4 rows, 1024×1024 px`

| Célula | Arma (id) | `[LISTA]` |
|---|---|---|
| 1 | Adaga (1) | `1. dagger` |
| 2 | Azagaia (2) | `2. javelin` |
| 3 | Bordão (3) | `3. quarterstaff (plain wooden staff)` |
| 4 | Clava Grande (4) | `4. greatclub (huge wooden club)` |
| 5 | Foice Curta (5) | `5. sickle` |
| 6 | Lança (6) | `6. spear` |
| 7 | Maça (7) | `7. mace (flanged head)` |
| 8 | Machadinha (8) | `8. handaxe` |
| 9 | Martelo Leve (9) | `9. light hammer` |
| 10 | Porrete (10) | `10. club (small wooden cudgel)` |
| 11 | Arco Curto (11) | `11. shortbow` |
| 12 | Besta Leve (12) | `12. light crossbow` |
| 13 | Dardo (13) | `13. throwing dart (three small darts)` |
| 14 | Funda (14) | `14. sling with a stone` |
| 15 | Alabarda (15) | `15. halberd` |
| 16 | Cimitarra (16) | `16. scimitar` |

### Folha 2 — `weapons-2.png` — `[GRADE]` = `4 columns × 4 rows, 1024×1024 px`

| Célula | Arma (id) | `[LISTA]` |
|---|---|---|
| 1 | Chicote (17) | `1. whip (coiled leather whip)` |
| 2 | Espada Curta (18) | `2. shortsword` |
| 3 | Espada Grande (19) | `3. greatsword (two-handed)` |
| 4 | Espada Longa (20) | `4. longsword` |
| 5 | Glaive (21) | `5. glaive (long pole with single curved blade)` |
| 6 | Lança de Montaria (22) | `6. jousting lance` |
| 7 | Lança Longa (23) | `7. pike (very long spear)` |
| 8 | Maça Estrela (24) | `8. morningstar (spiked ball on a handle)` |
| 9 | Machado Grande (25) | `9. greataxe (two-handed double-bitted axe)` |
| 10 | Machado de Batalha (26) | `10. battleaxe` |
| 11 | Malho (27) | `11. maul (huge two-handed hammer)` |
| 12 | Mangual (28) | `12. flail (spiked ball on a chain)` |
| 13 | Martelo de Guerra (29) | `13. warhammer` |
| 14 | Picareta de Guerra (30) | `14. war pick` |
| 15 | Rapieira (31) | `15. rapier (thin blade with ornate cup hilt)` |
| 16 | Tridente (32) | `16. trident` |

### Folha 3 — `weapons-3.png` — `[GRADE]` = `3 columns × 2 rows, 1536×1024 px`

| Célula | Arma (id) | `[LISTA]` |
|---|---|---|
| 1 | Arco Longo (33) | `1. longbow` |
| 2 | Besta de Mão (34) | `2. hand crossbow (small, one-handed)` |
| 3 | Besta Pesada (35) | `3. heavy crossbow` |
| 4 | Rede (36) | `4. weighted throwing net` |
| 5 | Zarabatana (37) | `5. blowgun with a dart` |
| 6 | Ataque desarmado | `6. clenched fist wrapped in leather hand wraps (unarmed strike)` |

Saída do recorte (a fazer): `src/assets/cards/weapon-<id>.webp` e `weapon-unarmed.webp`. Arma nova no
catálogo: gerar uma imagem avulsa no mesmo estilo e salvar com o id dela.

## Prompt das magias (ChatGPT)

Molduras por tema + uma ilustração por escola (a ilustração serve pros dois temas).

### Moldura — tema Fantasia (`frame-fantasia.png`)

```
16-bit pixel art trading card frame for a fantasy RPG spell card, front side, vertical, aspect ratio 5:7 (1000x1400 px). Crisp pixel art, no anti-aliasing blur, dark outline #1C0B0B on every shape.

Palette: dark reddish-brown wood/leather (#5E2D12, #1D0A0A), rust-orange borders (#99430A), gold trim and rivets (#CCAA44, #FFAA00), small accents of deep red (#6B1616).

Layout, top to bottom, all areas EMPTY (no text, no letters, no numbers, no symbols inside them):
1. Top: a horizontal name banner (gold-trimmed plaque), about 10% of the card height, plain flat fill.
2. Top-left corner, overlapping the banner: a round gold medallion with an empty dark center (a level number will be placed there later).
3. Art window: a rectangular window about 45% of the card height, 4:3 ratio, with a beveled gold inner border. The window itself must be fully TRANSPARENT.
4. Under the art window: a thin ribbon/plaque, about 6% of the height, plain flat fill (school name goes here later).
5. Bottom: a large text box about 30% of the height, aged parchment fill (#E8D9B5 to #CFBF96), very subtle texture, flat enough for small text to be readable on top.

Decorative details: ornate corner pieces with small rivets on all four corners, a thin rune-like engraved pattern along the outer border, symmetrical left/right. The area OUTSIDE the card must be fully transparent (PNG with alpha). No characters, no creatures, no text, no watermark, no signature.
```

### Moldura — tema Sombrio (`frame-sombrio.png`)

Mesmo prompt, trocando o parágrafo da paleta por este, e pedindo "same layout, same proportions,
same area positions as the previous image":

```
Palette (darker, less saturated, gothic): very dark brown-black (#1C0B0B, #40251A), worn bronze borders (#6B4329), muted old-gold trim and rivets (#D8A33E, #C9A35C), small accents of dried-blood red (#52301F). Parchment text box slightly darker and greyer (#D8CDB8 to #B8A88C). Corner pieces with subtle skull or bone motifs instead of plain ornaments.
```

### Ilustração por escola (`school-<escola>.png`)

Prompt base, trocando `[TEMA]`; gerar em sequência pedindo "same style, palette and level of
pixel detail as the previous image".

```
16-bit pixel art illustration for a fantasy RPG spell card art window, 4:3 ratio (1200x900 px), full-bleed scene filling the whole image edge to edge (no frame, no border, no text, no letters, no runes that look like text). Crisp pixel art, dark outline #1C0B0B, limited palette, dramatic lighting, warm earthy base tones (browns, dark reds, gold) plus the school's accent color described below. Centered composition with a clear focal point that still reads when the image is small. No people's faces in close-up, no watermark.

Theme: [TEMA]
```

| Arquivo | `[TEMA]` |
|---|---|
| `school-abjuracao.png` | `Abjuration magic: a glowing hexagonal arcane shield and protective runic circle deflecting incoming sparks, accent color pale blue and silver.` |
| `school-adivinhacao.png` | `Divination magic: a floating crystal eye inside a scrying orb above an open star map, constellations glowing, accent color deep violet and starlight white.` |
| `school-conjuracao.png` | `Conjuration magic: a summoning portal opening in a stone floor circle, swirling mist and a silhouette emerging, accent color teal and green.` |
| `school-encantamento.png` | `Enchantment magic: hypnotic spiraling ribbons of light and floating hearts and chains around a lute and a mask, accent color pink and magenta.` |
| `school-evocacao.png` | `Evocation magic: an explosive fireball and crackling lightning bolt bursting from an outstretched staff, accent color bright orange and electric yellow.` |
| `school-ilusao.png` | `Illusion magic: mirrored double images and a shimmering doorway that fades into nothing, shifting masks in the air, accent color iridescent purple and cyan.` |
| `school-necromancia.png` | `Necromancy magic: a skull on an altar wreathed in green ghostly flames, bony hands rising from the ground, accent color sickly green and black.` |
| `school-transmutacao.png` | `Transmutation magic: an alchemical circle turning stone into gold, a flask pouring liquid that changes into a butterfly, accent color emerald and gold.` |
