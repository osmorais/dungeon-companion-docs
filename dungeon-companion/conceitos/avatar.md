---
resumo: Avatar em camadas (corpo, roupa, barba, cabelo, sorriso): personalizador em abas, imagens, tons de pele por raça e como acrescentar opções novas.
tipo: conceito
status: ativo
atualizado: 2026-10-22
---

# Dungeon Companion — Avatar

O avatar é um retrato de busto em pixel art montado com camadas PNG de **64×64**, empilhadas na
mesma posição: **corpo → roupa → barba → cabelo → sorriso**. O preset fica no personagem
(`avatar_preset`, JSON; a api só guarda, não valida as chaves).

## Código (web)

- `src/app/models/avatar-preset.interface.ts`: `AvatarPreset` e as listas de opções
  (`AVATAR_CLASSES`, `AVATAR_HAIR_STYLES`, `AVATAR_BEARD_STYLES`, `AVATAR_HAIR_COLORS`,
  `AVATAR_SKIN_COLORS`), tons por raça (`AVATAR_SKIN_BY_RACE`, `skinTonesFor`,
  `resolveSkinColor`) e o caminho do corpo (`avatarBasePath`).
- `src/app/avatar-display/`: desenha as camadas a 100% do tamanho do host. Usado na ficha, na
  sessão e nas miniaturas do personalizador.
- `src/app/avatar-customizer/` (1.6.9): prévia no topo e abas **CORPO** (gênero + pele),
  **CABELO** (cor + estilo), **BARBA** (só masculino), **ROUPA** (12 roupas de classe) e **ROSTO**
  (sorriso; não aparece pra draconato). Cada opção é uma miniatura: o `app-avatar-display` com o
  preset atual e só aquela opção trocada; a escolhida tem borda dourada e ✓. As miniaturas são
  recalculadas só quando o preset muda (`buildTiles`). Mudar pra feminino tira a barba e, se a aba
  BARBA estava aberta, volta pra CORPO. Usado no passo AVATAR da criação (celular e desktop) e no
  modal EDITAR AVATAR da ficha.

## Imagens (`dungeon-companion-web/src/assets/avatar/`)

| Pasta | Conteúdo |
|---|---|
| `race/`, `race_fem/` | corpos originais das 9 raças (fonte pra gerar os tons; o app não carrega mais) |
| `race_skin/` | corpo já no tom de pele: `base_<raça>_<tom>.png` / `base_fem_<raça>_<tom>.png` (126 arquivos, 1.6.10) |
| `clothes/`, `clothes_fem/` | `class_<classe>.png` / `class_<classe>_fem.png` |
| `hair/` | `<estilo>_<cor>.png`, cores `blond`, `grey`, `lbrown`, `red` |
| `beard/` | `<estilo>_<cor>.png`, mesmas cores |
| `mouth/` | `smile.png` |

### Cabelos (1.6.9)

13 estilos: os 5 antigos (`hair_short_01–03`, `hair_long_01–02`) e 8 novos — `hair_short_04`
(Topete), `hair_mohawk`, `hair_bald_tufts` (Calvo), `hair_curly`, `hair_long_03`,
`hair_ponytail`, `hair_braid`, `hair_bun`. Vieram da folha
[`artes/avatar/hair/hair-sheet.png`](../artes/avatar/hair/hair-sheet.png) (ChatGPT) via
[`scripts/avatar/hair.py`](../scripts/avatar/hair.py): recorte por componente (alfa > 128), remoção
do couro cabeludo em cor de pele (moicano, calvo, laterais do topete), redução por caixa até 64×64
encaixada na cabeça da base, e as 4 cores tiradas da paleta dos cabelos que já existiam (mapa de
luminância). Depois o usuário ajustou as posições à mão antes do commit (web `125293e`).

### Tons de pele (1.6.10)

Antes era um `filter` CSS na imagem do corpo, que escurecia também olhos e boca. Agora cada tom é
uma imagem recolorida por [`scripts/avatar/skin.py`](../scripts/avatar/skin.py) com as cores de
[`scripts/avatar/tones.json`](../scripts/avatar/tones.json):

- **máscara de pele**: matiz perto do tom do rosto da base + saturação mínima, mais o contorno
  escuro; ficam de fora o branco dos olhos, íris, lábios, presas, a faixa do peito feminino e os
  **chifres do tiefling** (região menos saturada que cresce a partir das pontas);
- **cor nova**: luminância relativa à mediana da pele → sombra multiplicando o tom, brilho
  clareando em direção ao branco (`hl` por tom).

| Raças | Tons |
|---|---|
| humano, meio-elfo, halfling | `pale`, `light`, `medium`, `tan` (Moreno), `dark`, `very_dark` (Retinto) |
| elfo | humanos + `elf_moon` (Lunar), `drow` |
| anão, gnomo | humanos + `stone` (Cinza Pedra) |
| tiefling | humanos + `infernal_red`, `infernal_crimson`, `infernal_purple`, `infernal_blue` |
| meio-orc | `orc_green`, `orc_grey`, `orc_dark` |
| draconato | `dragon_gold`, `_brass`, `_bronze`, `_copper`, `_silver`, `_red`, `_blue`, `_green`, `_black`, `_white` |

Tom salvo que não existe pra raça (ex.: `medium` num meio-orc, preset antigo) cai no tom do
desenho original (`resolveSkinColor`: tiefling vermelho, meio-orc verde, draconato ouro, demais
`medium`). Tiefling salvo com tom humano mudou de aparência na 1.6.10 (antes era o vermelho
escurecido pelo filtro).

## Acrescentar opções novas

1. O usuário gera a folha no ChatGPT (prompts combinados: busto de frente 64×64, só a peça, fundo
   sólido, grade sem texto, referências anexadas) e coloca em `artes/avatar/<categoria>/`.
2. Recortar e encaixar com o mesmo processo do `hair.py` (os scripts têm caminhos absolutos da
   máquina do usuário; rodar num venv com Pillow, numpy e scipy), conferindo a prévia sobre as
   bases masculina e feminina.
3. Cabelo e barba: gerar as 4 cores pela paleta existente. Roupa: versão masculina e feminina.
4. Registrar a chave e o rótulo na lista do `avatar-preset.interface.ts`; camada nova (chapéu)
   precisa de campo novo no `AvatarPreset`, `<img>` no `avatar-display` e aba no personalizador.

Pendências (barbas, roupas, chapéus, rostos): [`backlog.md`](../backlog.md), seção "Avatar".
