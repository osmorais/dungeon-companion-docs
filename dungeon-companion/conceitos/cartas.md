---
resumo: Cartas de card game (magias na 1.4.0, armas na 1.6.0) e o aviso de lançamento de magia da mesa (1.5.0): componentes, imagens, eventos e fluxo.
tipo: conceito
status: ativo
atualizado: 2026-10-22
---

# Dungeon Companion — Cartas e lançamento de magia

Magias viraram cartas na **1.4.0** (web `be10d57`) e o lançamento de magia ganhou um aviso único
pra mesa com as cartas na **1.5.0** (código: web `31232a9`, api `95e1d64`, commitados pelo usuário;
versão, testes, verso da carta e ajustes: web `76153a5`, api `2e2a361`). As **armas** viraram
cartas na **1.6.0** (web `1b6d39c`), com a mesma carta e a mesma moldura.

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
- O impacto de dano em tela cheia e o comentário do Tom tocam quando o total aparece no palco.

### Entrada da carta e revelação das rolagens (1.6.2, web `4ad4759`)
- **Carta virada pra baixo**: `cs-throw` (2,4 s, `CAST_INTRO_MS`) — cai de costas, assenta, fica
  ~1 s mostrando o verso, levanta e vira. As rolagens só aparecem depois (`introDone`).
- **Cada rolagem**: entra com os dados rolando ("?", ~0,9 s, `CAST_ROLL_REVEAL_MS`) → o total
  grande (30 px) "bate" (`cs-slam`, escala 3 → 1) com clarão na cor da rolagem (ataque dourado,
  dano vermelho, cura verde) → carimbo ACERTOU / ERROU / CRÍTICO! (`cs-stamp`). Dano faz o aviso
  tremer (`cs-shake`). Várias rolagens juntas entram uma por vez (1,1 s entre elas).
- O palco emite `rollRevealed(id)` quando o total aparece; o aviso repassa e a mesa
  (`onCastRollRevealed`) toca o impacto de dano/cura e o Tom **nessa hora** — antes tocavam na
  chegada da etapa, com a carta ainda caindo. Uma vez por rolagem.
- Movimento reduzido: carta já de frente (sem verso), resultados direto, sem tremer nem clarão. Com
  as animações do Windows desligadas o navegador pede isso — foi oferecido mostrar o verso mesmo
  assim (sem o giro), sem resposta ainda.
- **1.6.3** (web `c36f9aa`): o verso não aparecia — a frente cobria o tempo todo. A opacidade
  animada estava no mesmo elemento do giro 3D; o surgir foi pro `.cs-spell` (`cs-appear`) e o
  `cs-throw` ficou só com `transform`. Ver `gotchas.md`.

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

## Cartas de arma (1.6.0)

- **Uma arte por arma**: 37 do catálogo + ataque desarmado, em 3 folhas (4×4, 4×4, 3×2) geradas no
  ChatGPT — prompt e ordem das células em `procedimentos/artes-cartas.md`. Originais em
  [`artes/weapon-cards/`](../artes/weapon-cards/) (`weapon-1.png` a `weapon-3.png`).
- `dungeon-companion-web/design/weapon-cards/process.py` recorta em `src/assets/cards/weapon-<id>.webp`
  (id do catálogo `weapon`) e `weapon-unarmed.webp`, 384×384 com fundo transparente. O gerador não
  respeita a grade (arma passando da célula, ponta da vizinha entrando), então o recorte procura
  numa área 30% maior que a célula e fica com as **peças opacas cujo centro cai na célula** (peça
  menor que 3% da maior é sujeira). Leva ~1,5 min (busca em Python puro).
- `weaponToCard` / `unarmedToCard` (`src/app/game-card/weapon-card.ts`): medalhão = bônus de ataque;
  arte pelo id (1–37; fora disso, ícone de espada/arco); `artFit: 'contain'` (arma inteira, com
  sombra) sobre `artBackground` = degradê pela cor do tipo de dano (cortante vermelho, perfurante
  azul, concussão ocre; outro, neutro); faixa "SIMPLES/MARCIAL · CORPO A CORPO/DISTÂNCIA";
  números DANO (com o modificador), TIPO, PROPRIEDADES, PESO.
- **Categoria simples/marcial**: o banco não tem (proficiência é texto), então fica no web pela lista
  de nomes das 14 armas simples do livro (`isSimpleWeapon`). A ordem do catálogo bate com o livro
  (ids 1–14 simples, 15–37 marciais).
- **Onde**: gaveta de ações (coluna COMBATE, grade com **ATACAR** embaixo; tela cheia com ATACAR
  via `selectedWeaponCard`/`attackFromCard`) e ficha (grade com ATACAR no celular e no desktop; a
  tela cheia substituiu o modal da arma).
- Desde a **1.6.1** o ataque com arma usa o aviso da mesa (ver "Ataque com arma no aviso").

## Ataque com arma no aviso (1.6.1)

- Mesmo aviso, mesmo modal e mesmo endpoint do lançamento de magia (web `52890ea`, api `7d70526`).
  A mesa vê "THORIN **ATACOU COM** MACHADO DE BATALHA" (`castVerb`) + a carta da arma + ataque →
  acertou/errou → dano. Vale pro desarmado (carta do punho), inclusive os golpes do Monge.
- `SpellCastContext` ficou genérico: `idSpell` **ou** `weapon` (`WeaponCardInfo`). Na gaveta,
  `rollAttack` / `rollUnarmed` chamam `startWeaponCast` (só com `sessionId` — a ficha isolada não
  tem mesa e segue sem aviso).
- **API**: `POST /spell-cast-stage` aceita `weapon` no lugar de `id_spell` (exatamente um dos dois).
  A carta da arma vem do cliente porque bônus e modificador dependem da ficha; `validWeaponCard`
  limita textos e exige inteiros em faixa. O evento leva `spell` **ou** `weapon` (o outro `null`).
- Mesa: `weaponInfoToCard` remonta a carta (`id_weapon` null = desarmado).
- **Deploy**: api antes do web — a api antiga recusa a etapa com arma, e enquanto isso a mesa não vê
  o aviso dos ataques (as rolagens com `cast_id` também não viram aviso avulso).
