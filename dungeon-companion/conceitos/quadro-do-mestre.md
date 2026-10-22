---
resumo: Quadro do Mestre (1.2.0) — gaveta só do mestre na sessão (lateral no desktop, de baixo no celular), e a gaveta AÇÕES DE PERSONAGEM do jogador: o que tem, como cada parte funciona, endpoints e limites.
tipo: conceito
status: ativo
atualizado: 2026-10-21
---

# Dungeon Companion — Quadro do Mestre

Entregue na versão **1.2.0** (2026-10-20, api `47a7b08`, web `d4e6a65`), em 4 fases pedidas pelo
usuário numa conversa só. Antes disso as funções do mestre ficavam espalhadas pela tela da sessão
(~25 `@if (isOwner())`, duplicadas entre layout desktop e mobile).

## Onde fica

- Componente `dungeon-companion-web/src/app/dm-board/` (`DmBoardComponent`, SCSS próprio — o
  `session-panel.component.scss` está no limite de 32 kB).
- Gaveta **de baixo**, igual no celular e no desktop (1.3.17). Recolhida, `DmBoardTabComponent` é
  uma barra larga presa na base da tela (▲ QUADRO DO MESTRE, puxador em cima, seta animada,
  "TOQUE PARA ABRIR"); aberta, a mesma barra (▼, "TOQUE PARA FECHAR") fica no topo da gaveta e
  recolhe. Sem ✕ e sem cabeçalho.
- Estilo em `dungeon-companion-web/src/app/bottom-drawer/bottom-drawer.scss` (`.bottom-drawer-bar`
  + `--attached`, `-bar-label`, `-hint`, `-arrow`, `.bottom-drawer`, `.bottom-drawer-backdrop`,
  `.bottom-drawer-body`), o mesmo das gavetas AÇÕES DE PERSONAGEM, ações e inventário (ver
  abaixo). Celular: largura toda, base da tela, até 85vh. Desktop: largura dos quadros
  (`min(1440px, 96vw)`, como o `.container`), na base da tela (o rodapé foi pro topo na 1.3.18); as seções do quadro se
  distribuem em colunas (`column-width: 320px`).
- Histórico da posição: 1.2.0 — botão no cabeçalho (substituiu ROLAR DADOS / TESTE SECRETO /
  IMAGENS) e gaveta pela direita; 1.2.1 — aba à esquerda no desktop e, no celular, botão no
  quadro AVENTURA com gaveta em tela cheia e ✕; 1.2.2 — aba também no celular; 1.3.16 — no
  celular, gaveta de baixo com barra fixa na base; 1.3.17 — gaveta de baixo também no desktop.
- Camadas (1.3.17): barra 140, fundo 145, gaveta 146 — acima do rodapé (100), abaixo do modal de
  rolagem (200), do `.overlay` dos modais (999+) e dos toasts. Antes eram 940/950/951, e a barra
  ficava por cima dos modais.
- Sessão desktop com gaveta (mestre, ou jogador com personagem): `.container--drawer` põe 84 px
  de `padding-bottom` pra barra + puxador, sem quebrar a página única.
- Fecha pela aba, clique no fundo ou Esc. Botão que abre modal fecha a gaveta antes
  (`closeDmBoard(); openX()` no template do session-panel); toggles mantêm aberta.
- Só renderiza para o dono da sessão (`dmBoardOpen() && isOwner()`).

### Gaveta AÇÕES DE PERSONAGEM (jogador; celular 1.3.16, desktop 1.3.17)

- `CharacterDrawerComponent` (`dungeon-companion-web/src/app/character-drawer/`): desde a 1.3.18
  é **só a barra** presa na base, pro jogador que tem personagem na sessão (`myPlayer()` no
  session-panel: jogador da sessão com o `user_id` de quem está logado; `null` pro mestre). Tocar
  emite `open` e o session-panel abre direto a gaveta de ações do personagem (não existe mais a
  tela intermediária com AÇÕES/FICHA/ITENS da 1.3.16). A barra some enquanto as ações ou o
  inventário estão abertos. Os botões FICHA/ITENS/FINALIZAR saíram do card do jogador; o mestre
  continua com eles nos cards.
- Junto na 1.3.16 (sessão no celular): quadros vazios escondidos e ROLAGENS recolhida
  (`mobileRollsOpen`). Com o COMBATE escondido sem luta, o mestre inicia a luta pelo quadro.

### Ações e inventário como gaveta (1.3.17)

- `PlayerActionsModalComponent` e `PlayerInventoryModalComponent` (abertos pelos cards do mestre
  ou pela gaveta do jogador) usam a mesma gaveta de baixo, com o nome na barra do topo ("▼
  INVENTÁRIO — NOME") no lugar do título e do ✕. Fecham pela barra ou pelo fundo.
- Desktop: o inventário fica numa coluna central de até 900 px.
- O modal de rolagem e os detalhes de magia/item abertos de dentro das ações continuam como
  janela, por cima (z-index 200).

### Tela de ações e grimório (1.3.18)

- **Destaque** (`.pa-hero`): PV (ao vivo — `liveHp` vem do session-panel, `liveHpFor`; NPC usa o
  da ficha), CA, CD/ATQ de magia (só conjurador), dados de vida; botões FINALIZAR TURNO/ATRASAR
  (`canEndTurn` = `isCharacterCurrentTurn(id) && canEndCurrentTurn()`), ROLAR DADO e, pro jogador
  abrindo o próprio personagem (`showLinks`), FICHA e ITENS (`openMyInventory`). Efeitos ativos
  logo abaixo.
- **Colunas fixas** (`.pa-columns`/`.pa-col`, grid `auto-fit minmax(300px, 1fr)`): COMBATE (armas,
  habilidades por recurso, recursos de classe) | MAGIAS (espaços, preparadas, botão ABRIR
  GRIMÓRIO) | TESTES E DESCANSO (resistências 2 por linha, perícias, descansos). Na 1.3.17 eram
  CSS `columns`, que redistribuíam as seções quando algo abria — por isso "mudava de lugar".
- **Grimório**: `view` = `'actions' | 'grimoire'` no `PlayerActionsModalComponent`; a barra do
  topo vira "◀ VOLTAR ÀS AÇÕES". Abas `grimoireTabs()`: PRONTAS (truques + preparadas; TODAS pra
  quem não prepara) e um por círculo; abre sempre em PRONTAS. Cards (`grimoireSpells()`) com
  LANÇAR / LANÇAR NVx e PREPARAR / ✓ PREPARADA; o card inteiro abre a descrição (botões com
  `stopPropagation`). Estado do card `spellCardState`: `ready` (faixa dourada à esquerda),
  `preparable` (cor normal), `locked` (sem vaga ou em combate, opacidade 0.7). Espaços de magia
  num `<ng-template #slotsBar>` usado nas duas telas.
- **Voltar às ações**: rolagem aberta pelas ações tem `backLabel` no `RollModalComponent` ("◀
  VOLTAR ÀS AÇÕES"/"AO GRIMÓRIO"; executar a rolagem ainda fecha a gaveta). Ficha aberta pelas
  ações: `viewCharacterSheet(id, true)` → `?fromActions=<id>`; o voltar da ficha
  ("← VOLTAR ÀS AÇÕES") navega pra `/session/:id?reopenActions=<id>`, e o session-panel
  (`reopenActions` input + effect) reabre as ações quando a sessão carrega e limpa a URL.

## Arquitetura

O quadro **não guarda estado da sessão**: recebe `detail` (o `GameSessionDetail`) e emite eventos;
o `session-panel` executa o que já fazia antes (modais, PV editado, revelar monstro). Exceções que
chamam a API direto do quadro: fichas da visão do grupo, descanso do grupo, anotações e apagar
sessão — nenhuma delas mexe no PV editado localmente.

`monsterDisplayName` saiu do session-panel para `session-panel/monster-display-name.ts` (usado
pelos dois).

## Seções

| Seção | O que faz |
|---|---|
| DADOS | Rolar dados (pública/oculta) e teste secreto — mesmos modais de antes |
| ROLAGENS OCULTAS | `recent_rolls` com `is_hidden`, mais nova primeiro. Etiqueta **SECRETO** (resposta de jogador, `id_character != null`) ou **OCULTA** (do mestre) |
| GRUPO | Tabela nome / CA / PV / PP / CD + efeitos ativos e Inspiração Bárdica. PV vem do `detail` (ao vivo); o resto vem da ficha (`getCharacterById`, buscada ao abrir e no ↻; ficha que falha mostra "—") |
| ANOTAÇÕES | Texto privado do mestre, até 10.000 caracteres |
| DESCANSO | Curto ou longo pro grupo, com checklist de jogadores e NPCs |
| DANO / CURA EM ÁREA | Valor + alvos (jogadores, NPCs, monstros) com **½** por alvo |
| CENA | Imagens de referência + lista de monstros com VISÍVEL/OCULTO |
| COMBATE | Status, iniciar / adicionar / encerrar (os botões continuam também no painel de combate) |
| MESA | + NPC, + monstro (continuam também no rodapé das listas) |
| RECOMPENSAS | Distribuir XP (saiu do painel de combate) |
| SESSÃO | Código, jogadores, POLLING e EFEITOS (pro mestre saíram do cabeçalho; jogadores ainda veem lá) |
| ENCERRAR SESSÃO | Apagar a sessão, confirmando com o código |

Carregamento (1.2.3; desde a 1.3.1 o skeleton vale no site todo — ver `gotchas.md`): anotações mostram um bloco de skeleton enquanto carregam, e CA/PP/CD do
grupo ficam em skeleton até a ficha chegar (`GroupRow.hasSheet`); depois, "—" quando não há valor.

Fora da gaveta: rolagens ocultas ganharam **🔒** no histórico e no toast de rolagem (só o mestre
recebe essas rolagens, então só ele vê).

## Como cada parte funciona

### CA, Percepção passiva e CD (visão do grupo)

Vêm da ficha calculada, não das colunas `character.armour_class` / `passive_perception` /
`spell_save_dc`: essas ficam congeladas no valor da criação (trocar armadura e subir de nível não
atualizam). Por isso o quadro faz uma requisição por personagem ao abrir.

### Descanso do grupo

- `POST /api/game-session/{id}/rest` `{rest_type: 'short'|'long', id_player_sessions?, id_npc_sessions?}`
  → `{rested: string[], skipped: {name, reason}[]}`. Só o mestre (403); exige ao menos um alvo.
- `GameSessionService.partyRest` chama, por personagem, `CharacterSheetService.longRest` ou
  `shortRest` (mesma regra do descanso individual). Injeção com
  `@inject('services.CharacterSheetService')` — ver `gotchas.md`, "Injeção de dependência".
- **Longo**: PV cheio, metade dos Dados de Vida, espaços e recursos, encerra efeitos ativos.
  Personagem com 0 PV fica de fora (`skipped`, "sem pontos de vida"). Publica
  `player_hp_updated` (mantém o PV temporário) / `npc_hp_updated` por alvo.
- **Curto**: `CharacterSheetService.shortRest` (novo) só recarrega recursos de descanso curto,
  sem gastar Dado de Vida — antes só o `rollHitDie` recarregava, e quem estava com PV cheio
  nunca recuperava Surto de Ação, Chi etc. Cada jogador gasta os próprios dados em AÇÕES.
- Evento `party_rested {rest_type, character_names}` (só se alguém descansou) → reação do Tom
  pra mesa. O reducer não muda estado.
- Depois do longo o quadro recarrega as fichas (efeitos acabaram).

### Bruxo no descanso curto

Correção que veio junto: `recoverPactSlotsOnShortRest` zera os espaços gastos do bruxo
(`WARLOCK_CLASS_ID = 3`, em `rules.ts`) no `shortRest` e no `rollHitDie`, que passam a devolver
`slots_expended: {}` quando é bruxo.

### Dano / cura em área

Só no front. O quadro monta `AreaApplyRequest {kind, targets: [{type, id, amount}]}` (metade
arredonda pra baixo; alvo que ficaria com 0 sai) e o session-panel aplica em
`applyAreaAmount` pelo mesmo caminho do DANO/CURA do card (`applyPlayerDamage`,
`applyNpcHpDelta`, `applyMonsterHpDelta`). Cura em jogador **para no máximo** e não abre a
confirmação de PV temporário (diferente do card).

### Anotações

- Coluna `game_session.dm_notes TEXT` (criada em produção em 2026-10-20).
- `GET` / `PUT /api/game-session/{id}/dm-notes` (`{notes}`), só o dono (403; 404 se a sessão não
  existe). Limite `DM_NOTES_MAX_LENGTH = 10_000`; texto em branco grava `null`. Nunca vai no
  `GameSessionDetail` (que os jogadores recebem).
- Front: SALVAR explícito com "SALVO / ALTERAÇÕES NÃO SALVAS"; **salva o pendente no
  `ngOnDestroy`** (a gaveta fecha também quando uma ação abre modal). Se o carregamento falhar a
  edição fica bloqueada (`notesLoaded`), senão salvar apagaria as anotações existentes.
- LGPD: entra na exportação (`sessions_as_dm[].dm_notes`) e some com a sessão/conta. Ver
  `conceitos/lgpd.md`.

### Apagar sessão

- Usa o `DELETE /api/game-session/{id}` que já existia (sem tela até então). Agora publica
  `session_deleted` depois de apagar.
- Front: confirmação digitando o código da sessão (sem diferenciar maiúsculas/espaços) → volta
  pra `/my-sessions`. Jogadores conectados: `onSessionDeleted` desliga socket/polling e mostra
  "O MESTRE ENCERROU ESTA SESSÃO" com botão pro início (o próprio mestre não vê o aviso).

## Limites conhecidos

- Rolagens ocultas dependem do log de 30 rolagens por sessão: em sessão movimentada as ocultas
  mais antigas somem da lista.
- Dano em área não aplica resistência automaticamente (o mestre marca ½), igual ao DANO do card.
- Descanso do grupo não avisa telas de ficha/ações já abertas dos jogadores (atualizam ao reabrir).
