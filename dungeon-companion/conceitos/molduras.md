---
resumo: Card do personagem na sessão (1.7.1): molduras de imagem (anel do avatar, barras de XP e de vida), barra de XP e DANO/CURA na gaveta de ações.
tipo: conceito
status: ativo
atualizado: 2026-10-22
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

Pendente: conferir a altura dos cards em 1080p ([`backlog.md`](../backlog.md), "Combate e sessão").
