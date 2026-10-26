---
resumo: Prompts do ChatGPT pros fundos padrão dos cards de NPC e de monstro na mesa (1.13.1), formato e onde ligar no web.
tipo: procedimento
status: ativo
atualizado: 2026-10-26
---

# Dungeon Companion — Fundos padrão dos cards de NPC e de monstro

Desde a 1.13.1 as linhas de NPC e de monstro da mesa têm a moldura dos cards dos personagens. O
fundo padrão do card do personagem é a parede de masmorra com tochas (`character-card-bg.webp`,
1.8.1); NPC e monstro têm um fundo próprio cada, nas variáveis `--npc-card-bg` e
`--monster-card-bg` do `styles.scss` do web (iguais nos dois temas).

**Feito em 2026-10-26** com os dois prompts abaixo: originais em
[`artes/card-fundo-taverna.png`](../artes/card-fundo-taverna.png) (NPC) e
[`artes/card-fundo-covil.png`](../artes/card-fundo-covil.png) (monstro), 1536×1024; no web,
`src/assets/frames/npc-card-bg.webp` e `monster-card-bg.webp` (1200 px, WebP qualidade 82).

## Formato

- As linhas são **largas e baixas** (desktop ~5:1, celular ~2,5:1) e o fundo entra com `cover`:
  só a **faixa do meio** aparece. Gerar em paisagem (1536×1024) com tudo que importa numa faixa
  horizontal no centro, e o resto podendo ser cortado.
- Por cima vão o anel do avatar (à esquerda), nome, classe, barra de vida e botões: o fundo precisa
  ser **escuro e de pouco contraste**, sem nada chamativo no lado esquerdo.

## Prompt — NPC

```
Crie uma imagem em pixel art, estilo jogo retrô de fantasia medieval (16-bit), formato paisagem
1536x1024, para ser usada como FUNDO de um card de personagem aliado (NPC) num site de RPG.
Cena: interior de uma taverna/salão de guilda à noite, parede de madeira escura e pedra, uma
lareira e lanternas com luz quente âmbar, estantes e mapas pendurados, ao fundo e desfocados.
Toda a cena importante numa faixa horizontal no meio da imagem; o alto e o baixo podem ser
cortados. Paleta escura e quente (marrons, âmbar, dourado apagado), pouco contraste, iluminação
suave vinda da direita. O lado esquerdo deve ser mais escuro e vazio (vai ficar um retrato em
cima). Sem personagens, sem texto, sem moldura, sem bordas. Pixels nítidos, sem anti-aliasing.
```

## Prompt — monstro

```
Crie uma imagem em pixel art, estilo jogo retrô de fantasia medieval (16-bit), formato paisagem
1536x1024, para ser usada como FUNDO de um card de monstro num site de RPG.
Cena: covil de uma criatura numa caverna/masmorra, rocha escura e úmida, ossos e armas quebradas
no chão, um brilho vermelho/brasa vindo de fendas no chão e uma névoa baixa, ao fundo e
desfocados. Toda a cena importante numa faixa horizontal no meio da imagem; o alto e o baixo
podem ser cortados. Paleta escura e fria com acentos vermelhos (cinza-azulado, preto, vermelho
brasa), pouco contraste, luz vinda da direita. O lado esquerdo deve ser mais escuro e vazio (vai
ficar a imagem do monstro num anel em cima). Sem criaturas, sem texto, sem moldura, sem bordas.
Pixels nítidos, sem anti-aliasing.
```

## Pra trocar uma imagem

1. Original no repositório de docs (`artes/`), como as outras artes.
2. Converter pra WebP (largura ~1200 px) em `dungeon-companion-web/src/assets/frames/`
   (`npc-card-bg.webp`, `monster-card-bg.webp`).
3. No `styles.scss`: `--npc-card-bg: url('/assets/frames/npc-card-bg.webp');` e o mesmo pro
   monstro (nos dois temas, se a variável estiver por tema).
