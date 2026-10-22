---
resumo: Cartas de card game (magias na 1.4.0; armas a seguir) e o aviso de lançamento de magia da mesa (1.5.0): componentes, imagens, eventos e fluxo.
tipo: conceito
status: ativo
atualizado: 2026-10-22
---

# Dungeon Companion — Cartas e lançamento de magia

Magias viraram cartas na **1.4.0** (web `be10d57`) e o lançamento de magia ganhou um aviso único
pra mesa com as cartas na **1.5.0** (código: web `31232a9`, api `95e1d64`, commitados pelo usuário;
versão, testes, verso da carta e ajustes: web `76153a5`, api `2e2a361`). As cartas foram feitas
pensando nas **armas**, que vêm em seguida (ver "Próximo: cartas de arma").

## Imagens

- Prompts e onde salvar: [`procedimentos/artes-cartas.md`](../procedimentos/artes-cartas.md).
- Originais (PNG do ChatGPT, ~30 MB) neste repositório, em [`artes/spell-cards/`](../artes/spell-cards/):
  `frame-<tema>.png` (moldura), `back-<tema>.png` (verso), `school-<escola>.png` (8 escolas).
- `dungeon-companion-web/design/spell-cards/process.py` lê os originais daqui, limpa o halo do
  fundo e grava WebP em `src/assets/cards/`: `card-frame-<tema>.webp`, `card-back-<tema>.webp`
  (760×1064, sem cortar a margem) e `spell-school-<escola>.webp` (800×600). Precisa de Pillow
  (num venv). São os primeiros WebP do site.
- Tema: variáveis `--card-face` (moldura) e `--card-back` (verso) no `styles.scss`.

## A carta: `app-game-card` (`src/app/game-card/`)

- Só desenha. Recebe `GameCardData` (`game-card.model.ts`): título, medalhão ("T"/"3" na magia,
  "+5" na arma), arte (ou ícone de reserva sobre `artBackground`), faixa (escola · círculo), números
  do pergaminho, descrição e etiquetas ("PREPARADA").
- Áreas da moldura em **% da imagem inteira**, iguais nos dois temas (medidas nas originais):
  medalhão 8,6–22,6% × 4,5–14,5%; nome 25,8–88,8% × 6,4–12,1%; arte 13,9–86,2% × 15,7–52,8%;
  faixa 18,5–81,7% × 55,8–60,6%; pergaminho 13,6–86,3% × 63,5–90,6%. Fonte em `cqw` (largura da
  carta, `container-type: inline-size`) com mínimo em px.
- `size="mini"` (grade: dois números, sem descrição) e `size="full"` (tela cheia: quatro números
  com o valor embaixo do rótulo, quebrando linha, e a descrição rolando no pergaminho).
- Tela cheia: botão **LER TUDO** (`expanded`) sobe o pergaminho por cima da arte e da faixa;
  RECOLHER volta. Sempre abre recolhida.
- Estado (`GameCardState`): `ready` (brilho dourado), `preparable` (normal), `locked` (dessaturada).
  Regra em `spellCardState()` (`spell-card.ts`): truque, preparada ou de quem não prepara = pronta;
  não preparada com vaga e fora de combate = dá pra preparar; senão bloqueada.
- Conversor `spellToCard()` (`spell-card.ts`): escola com acento → arquivo (`schoolSlug`, "Evocação"
  → `evocacao`), sem escola → ícone do grimório e faixa "MAGIA".

## Carta em tela cheia: `app-card-viewer`

- Substituiu os modais de detalhe de magia na gaveta de ações/grimório, no Grimório de Magias e na
  ficha. A carta grande no centro, os botões da tela por projeção (`<app-card-viewer>botões…`),
  "◀ VOLTAR…" no topo, fundo e Esc fecham. Camada 190 (acima das gavetas 146, abaixo do modal de
  rolagem 200 — quem lança pela carta fecha a carta antes de abrir a rolagem).
- Na gaveta de ações, a carta aberta guarda só o id (`selectedSpellId`) e lê a magia atual da
  ficha, pra o PREPARAR feito na própria carta aparecer na hora.

## Onde as cartas aparecem

- **Grimório da sessão** (segunda tela da gaveta de ações): grade `.card-grid` (global no
  `styles.scss`: mínimo ~190px no desktop, 2 por linha no celular), LANÇAR/PREPARAR embaixo de cada
  carta (`<ng-template #spellActions>`, o mesmo da lista e da tela cheia). Botão **CARTAS | LISTA**
  (`grimoireMode`), não guardado — reabre em CARTAS.
- **Grimório de Magias** (`spell-catalog-list`): grade de cartas com a busca e paginação de
  antes; esqueleto `.card-skeleton`.
- **Ficha**: círculos continuam começando fechados; dentro, grade de cartas (celular e desktop).
  Tela cheia com PREPARAR (x/y) e LANÇAR.

## Aviso de lançamento de magia (1.5.0)

### O que a mesa vê
- **Um aviso só por lançamento** (`app-spell-cast-notice`, `src/app/spell-cast/`), que cresce:
  card do personagem (`app-character-card`) + carta da magia **jogada e virando** (cai de costas
  com o verso do tema e vira) + as rolagens (dados em pixel art, total, ACERTOU/ERROU/CRÍTICO).
- Só aparece quando há resultado: magia de ataque abre com o ataque (AGUARDANDO… até quem lança
  decidir) e o dano entra no mesmo aviso; magia só de dano (ou resistência + dano) abre com o dano;
  magia sem dados abre direto, só com as cartas (e a CD, se tiver).
- Some **8 s** depois de "terminou" (`SPELL_CAST_DONE_MS`, com barra de tempo); sem notícia de
  quem lança, some em **120 s** (`CAST_NOTICE_SAFETY_MS`). Fecha pelo ✕ ou tocando fora. Vários
  lançamentos seguidos entram em **fila**. Etapa atrasada não reabre nem volta atrás.
- O impacto de dano em tela cheia e o comentário do Tom tocam quando a rolagem aparece no aviso.

### O que quem lança vê
- O modal de rolagem em **modo lançamento** (`@Input() cast: SpellCastContext`): em cima o mesmo
  palco da mesa (`app-spell-cast-stage`), embaixo as decisões de sempre (rolar, acertou?, dano,
  Destruição, aplicar). Quem lança com rolagem **não** recebe o aviso da mesa daquele lançamento
  (`ownCast` → `markOwnCast`); magia sem dados ele vê como a mesa.

### Como funciona
- `PlayerActionsModalComponent.castSpell` monta o `SpellCastContext` (`newCastId()`, carta, card do
  personagem — `actorCard` vindo da sessão via `characterCardFor`, ou da ficha). Sem rolagem:
  manda a etapa `done` sem rolagens e fecha. Com rolagem: abre o modal com o `cast`.
- O modal manda as rolagens com `cast_id` e, a cada passo, a **etapa inteira**
  (`POST /api/game-session/{id}/spell-cast-stage`): ataque registrado (pending), acertou/errou,
  dano registrado; ao ser destruído (fechou, terminou ou desistiu), `done`. As etapas vão em fila
  (promises encadeadas) pra mesa receber na ordem; `done` vai uma vez só.
- **API**: `GameSessionService.publishSpellCastStage` valida (`cast_id` 8–64 de `[A-Za-z0-9_-]`,
  fase `open|done`, até 30 rolagens com `kind` attack/damage/heal e `outcome`, CD+atributo juntos),
  exige as mesmas permissões de rolar pelo personagem (`canPostRollFor`), busca a carta da magia
  (`findSpellCard`, sem descrição) e publica `spell_cast_stage` com o `user_id` de quem lançou.
  **Nada é gravado.** No `/roll`, `cast_id` é validado e vai só no evento `roll_added` (a inserção
  lista as colunas, então o campo não chega ao banco).
- **Mesa** (`session-panel`): `onSpellCastStage` guarda a etapa por lançamento e monta
  `activeCastView` achando as rolagens no histórico pelo id. Rolagens com `cast_id` não entram na
  fila de avisos avulsos (`checkForNewRolls`) e vão direto pro histórico.
- O anúncio antigo `spell_cast` ("LANÇOU") **não é mais usado pra magias da gaveta**; continua pra
  habilidades de classe ("USOU"), Resistência Implacável e magias somadas no acerto de arma.
- Sem socket (modo POLLING), não há etapas: as rolagens aparecem como avisos avulsos, como antes.

## Próximo: cartas de arma

- Decidido: **uma arte por arma** (37 do catálogo + ataque desarmado), em 3 folhas (4×4, 4×4, 3×2)
  geradas no ChatGPT — prompt e ordem das células em `procedimentos/artes-cartas.md`. Originais vão
  em `artes/weapon-cards/`; o recorte grava `src/assets/cards/weapon-<id>.webp`.
- Mesma moldura e mesma carta: falta o `weaponToCard` (medalhão = bônus de ataque, faixa =
  categoria · alcance, pergaminho = dano/tipo/propriedades, fundo da arte pela cor do tipo de dano).
- O banco **não tem a categoria** (simples/marcial): deduzir pela ordem (ids 1–14 simples, 15–37
  marciais) ou criar coluna — decidir na hora.
- O aviso de lançamento recebe `GameCardData`, então o ataque com arma pode usar o mesmo palco.
