---
resumo: Prompts do ChatGPT pros fundos padrão dos cards de NPC e de monstro na mesa (1.13.1) e do fundo da tela de lançamento e dos avisos de monstro no Sombrio (1.13.2), formato e onde ligar no web.
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

## Fundo da tela de lançamento e dos avisos (1.13.2)

Variável `--notice-bg` do `styles.scss`, usada no painel da tela de lançamento da mesa
(`spell-cast-notice`), no painel de quem lança (`.roll-cast-stage` do modal de rolagem) e nos
avisos de monstro revelado e derrotado. Entra com `cover`. **Retrato no celular, quadrado no
desktop** (`@media (min-width: 768px)` no fim do `styles.scss`): o retrato cortava demais no
painel quase quadrado do desktop.

| Tema | Formato | Original (`artes/`) | No web (`src/assets/frames/`) |
|---|---|---|---|
| Sombrio | retrato 1024×1536 | [`aviso-fundo-altar.png`](../artes/aviso-fundo-altar.png) | `notice-bg-sombrio.webp` (800×1200) |
| Sombrio | quadrado 1254×1254 | [`aviso-fundo-altar-quadrado.png`](../artes/aviso-fundo-altar-quadrado.png) | `notice-bg-sombrio-quadrado.webp` (1000×1000) |
| Fantasia | retrato 1024×1536 | [`aviso-fundo-fantasia.png`](../artes/aviso-fundo-fantasia.png) | `notice-bg-fantasia.webp` (800×1200) |
| Fantasia | quadrado 1254×1254 | [`aviso-fundo-fantasia-quadrado.png`](../artes/aviso-fundo-fantasia-quadrado.png) | `notice-bg-fantasia-quadrado.webp` (1000×1000) |

WebP qualidade 82. O Fantasia é um tapete carmesim com selo dourado, cercado de livros, mapas,
moedas e velas; as versões quadradas e a do Fantasia foram geradas pelo usuário a partir do prompt
abaixo (o do Sombrio em retrato), sem prompt próprio registrado.

```
Crie uma imagem em pixel art, estilo jogo retrô de fantasia sombria (16-bit), formato retrato 1024x1536, para ser usada como FUNDO de uma janela de jogo onde cartas são jogadas e dados são rolados (num site de RPG, tema escuro/gótico).

Cena: o tampo de uma mesa antiga de pedra escura e madeira enegrecida, vista exatamente de cima (vista de topo, sem perspectiva), como uma mesa de ritual numa cripta. No centro, um círculo arcano muito sutil gravado na pedra, quase apagado, com runas ilegíveis e um brilho fraco vermelho-brasa. Nos quatro cantos, detalhes que podem ser cortados: velas derretidas com chama baixa, ossos pequenos, cera escorrida, rachaduras com brilho de brasa. O centro da imagem (a maior parte da área) deve ficar escuro, uniforme e com POUCO contraste, porque cartas, dados e texto vão ficar por cima; os detalhes interessantes ficam só perto das bordas.

Paleta gótica, escura e pouco saturada: marrom-preto (#1C0B0B, #2A140C, #40251A), pedra cinza-escura (#2E2A28, #3A3330), dourado velho apagado nos detalhes (#C9A35C, #D8A33E), acentos de vermelho-sangue seco e brasa (#52301F, #8A2A12). Iluminação fraca e quente vinda das velas dos cantos; centro na penumbra.

Sem cartas, sem dados, sem personagens, sem criaturas, sem texto, sem letras legíveis, sem moldura, sem bordas, sem marca d'água. Pixels nítidos, sem anti-aliasing, sem desfoque.
```

