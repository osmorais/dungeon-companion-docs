---
resumo: Quadro do Mestre (1.2.0) — gaveta lateral só do mestre na sessão: o que tem, como cada parte funciona, endpoints e limites.
tipo: conceito
status: ativo
atualizado: 2026-10-20
---

# Dungeon Companion — Quadro do Mestre

Entregue na versão **1.2.0** (2026-10-20, api `47a7b08`, web `d4e6a65`), em 4 fases pedidas pelo
usuário numa conversa só. Antes disso as funções do mestre ficavam espalhadas pela tela da sessão
(~25 `@if (isOwner())`, duplicadas entre layout desktop e mobile).

## Onde fica

- Componente `dungeon-companion-web/src/app/dm-board/` (`DmBoardComponent`, SCSS próprio — o
  `session-panel.component.scss` está no limite de 32 kB).
- Gaveta pela **esquerda** (340 px; no celular `calc(100vw - 28px)`, pra sobrar lugar pra aba),
  aberta e fechada por uma aba vertical de expandir/recolher, igual no desktop e no celular:
  recolhida, `DmBoardTabComponent` fica presa na lateral esquerda da tela (z-index 940);
  expandida, a mesma aba (◀) fica na borda direita da gaveta. Sem ✕ e sem botão no cabeçalho ou
  no quadro AVENTURA. Estilo da aba em `dm-board-tab.scss`, usado pelos dois componentes.
- Histórico da posição: 1.2.0 — botão no cabeçalho (substituiu ROLAR DADOS / TESTE SECRETO /
  IMAGENS) e gaveta pela direita; 1.2.1 — aba à esquerda no desktop e, no celular, botão no
  quadro AVENTURA com gaveta em tela cheia e ✕; 1.2.2 — aba também no celular.
- z-index da gaveta 950/951 — abaixo dos modais e toasts da sessão (overlay 1000+).
- Fecha pela aba, clique no fundo ou Esc. Botão que abre modal fecha a gaveta antes
  (`closeDmBoard(); openX()` no template do session-panel); toggles mantêm aberta.
- Só renderiza para o dono da sessão (`dmBoardOpen() && isOwner()`).

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
