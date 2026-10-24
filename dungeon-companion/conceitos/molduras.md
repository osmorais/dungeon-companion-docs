---
resumo: Card do personagem na sessão (1.7.1): molduras de imagem (anel do avatar, barras de XP e de vida), barra de XP e DANO/CURA na gaveta de ações.
tipo: conceito
status: ativo
atualizado: 2026-10-24
---

# Dungeon Companion — Molduras do card e barras

Entrou na **1.7.1** (web `2026e36`, api `fcd4abf`).

## Imagens

- Folhas geradas pelo usuário no ChatGPT com fundo transparente (prompts na conversa da entrega:
  pixel art, 3 peças por tema, miolo transparente): [`artes/molduras-card-fantasia.png`](../artes/molduras-card-fantasia.png)
  e [`artes/modulras-card-sombrio.png`](../artes/modulras-card-sombrio.png) (nome com erro, mover
  pendente no backlog).
- [`scripts/molduras/frames.py`](../scripts/molduras/frames.py) recorta por componente (alfa > 200),
  tira o brilho fraco (alfa < 110) e grava `dungeon-companion-web/src/assets/frames/`
  `xp-bar-<tema>.webp`, `hp-bar-<tema>.webp` (640 px) e `avatar-ring-<tema>.webp` (320 px); imprime
  a geometria (frações da imagem): medalhão (`mcx/mcy/mr/mry`), trilho (`tx0/tx1/ty0/ty1`). O
  miolo do anel foi medido à parte (flood fill do vão central). Venv com Pillow, numpy, scipy.

## No web

- Variáveis por tema no `styles.scss`: `--xp-frame`, `--hp-frame`, `--avatar-ring` e a geometria
  `--xpf-*`, `--hpf-*`, `--ring-*` (ao trocar a imagem, refazer as medidas).
- **Barras**: mixin `src/app/hp-bar/_frame-bar.scss` — a moldura cobre tudo; trilho e medalhão
  ficam por baixo nas frações; texto por cima do trilho; fonte em `cqw`.
  - `app-xp-bar` (`src/app/xp-bar/`): nível no medalhão, `xp/next XP`; pode subir → trilho e
    medalhão dourados pulsando, "SUBIR DE NÍVEL!"; medalhão azul com XP, escuro com 0. Sem
    `next_level_xp` (API antiga) mostra só o nível.
  - `app-hp-bar` (`src/app/hp-bar/`): verde → vermelho (`hpColor`), temporários em azul,
    medalhão na cor da vida (apagado com 0).
  - Preenchimento mínimo 7% (`FRAME_BAR_MIN_FILL`) — o começo do trilho fica sob os enfeites.
- **Anel**: `.avatar-ring-wrap` (tamanho em `--avatar-size`) + `<span class="avatar-ring">`
  (global no `styles.scss`); as margens abrem espaço pros enfeites. Usado nos cards da sessão
  (desktop `clamp(48px, 7vh, 92px)`, celular 56 px), no `app-character-card` (aviso de lançamento e
  de troca de vez, 76 px) e nos toasts de rolagem (100 px) e de habilidade (84 px).
- API: `next_level_xp` (`xpNeededForLevel`) no resumo do personagem do detalhe da sessão.

## DANO/CURA na gaveta de ações

- O jogador aplica no próprio PV no destaque da gaveta (`canAdjustHp`, `adjustHp`), ao lado dos PV;
  saiu do card. O mestre continua com os controles nos cards (e também vê na gaveta). A sessão
  aplica com as regras de sempre (`adjustHpFor` → `applyPlayerDamage` / `applyPlayerHeal`).
- **1.7.3** (web `96c6176`): aplicar fecha a gaveta (`submitHp` → `close`) e a sessão toca o impacto
  em tela cheia das rolagens (`DamageImpactService.trigger`: golpe no dano, névoa na cura; força
  pela fração do PV máximo, passando `1d<PV máximo>` como notação). Só pra quem aplicou e só com
  EFEITOS ligado. Botões **CURA TOTAL** (máximo − atual; desabilitado com a vida cheia) e **DANO
  TOTAL** (atual + temporários; desabilitado caído — a Resistência Implacável continua valendo).

## 1.7.4 (web `fc71b00`)

- **Gaveta na sua vez**: quando a vez passa (ou o combate começa) pro personagem deste jogador, a
  sessão abre a gaveta de ações dele depois do aviso de troca de vez (`scheduleMyTurnDrawer` com
  `TURN_CHANGE_TOAST_MS`; fechar o aviso abre na hora) com `turnFocus`: faixa "SUA VEZ!", destaque
  pulsando, FINALIZAR TURNO em dourado e o título COMBATE dourado — todas as ações continuam. Não
  abre ao recarregar no meio da vez (`turnStateSeen`), se a vez já passou, se é de outro jogador ou
  com outra gaveta aberta. Só personagem de jogador.
- **Barra de XP clicável**: brilhando (dá pra subir) e só pro dono (`canOpenLevelUp`,
  `isMyCharacter`), vira botão → `/character-sheet/:id?sessionId=…&levelUp=1`, e a ficha abre a
  subida de nível ao carregar se der pra subir (`openLevelUpIfRequested`).
- **Avatar nas barras das gavetas**: `.bottom-drawer-avatar` (`bottom-drawer.scss`) com o anel,
  à esquerda e sobressaindo da barra — recolhidas (`app-character-drawer` com o avatar do
  personagem, `app-dm-board-tab` com `assets/dm.png`) e no topo das gavetas abertas (Quadro do
  Mestre; ações e grimório com `barAvatar()`).

Pendente: conferir a altura dos cards em 1080p ([`backlog.md`](../backlog.md), "Combate e sessão").

## Fundo padrão do card (1.8.1, web `f2ccd64`)

- Arte gerada pelo usuário no ChatGPT (parede de masmorra com tochas, pixel art, centro liso e
  escuro, detalhes só nas beiradas, sem moldura): original em
  [`artes/card-fundo-masmorra.png`](../artes/card-fundo-masmorra.png) (1024 × 1536). No web vai
  como `src/assets/frames/character-card-bg.webp` (512 × 768, reduzido com vizinho mais próximo,
  ~77 KB), mesma imagem nos dois temas.
- Variável global `--character-card-bg` no `:root` do `styles.scss`.
- Usada no card de exemplo da tela inicial, nos cards do jogador na mesa (`.player-card` e
  `.mobile-player-card`) e no `app-character-card` (avisos de troca de vez e de lançamento),
  exceto monstro (`.turn-card:not(.turn-card--monster)`).
- Personagem com imagem própria: o `[style.background-image]` do template (imagem escurecida)
  sobrepõe o fundo padrão; o padrão vai sem escurecer. As classes `--has-bg` dos cards da mesa
  ficaram sem regra no CSS.
- Escrever com propriedades separadas (`background-image`, `-size`, `-position`), nunca o atalho
  `background:` — ver `gotchas.md`.

## Moldura nova do SOMBRIO (1.8.3, web `0688b9d`)

- Arte do usuário (ChatGPT, 1254 px, caveiras e dourado): original em
  [`artes/card-frame-sombrio.png`](../artes/card-frame-sombrio.png); no web,
  `src/assets/frames/card-frame-sombrio.png` reduzida pra 627 px (vizinho mais próximo, ~92 KB).
- Medidas na imagem de 627 px: faixa de cima 29–70, de baixo 33–73 (a partir da borda), laterais
  20–60; enfeite do canto até ~111 px na horizontal, ~139 px pra baixo no alto (corrente) e
  ~111 px embaixo.
- Corte e largura viraram variáveis por tema no `styles.scss` (`--card-frame-slice`,
  `--card-frame-width`, usadas no `border-image` da `.framed-card`):
  - FANTASIA: `72` / `22px` (como antes);
  - SOMBRIO: `140 112 113 112` / `34px 27px 28px 27px` (cima, direita, baixo, esquerda), escala
    ~0,245 — faixa de ~10 px que termina entre 14 e 18 px, cobrindo a borda de 11 px.
- Ao trocar uma moldura, medir de novo (ver `gotchas.md`).

