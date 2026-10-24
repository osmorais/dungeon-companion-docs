---
resumo: Ranking global dos feitos das mesas (1.7.0): o que conta, onde grava, endpoint, tela e privacidade.
tipo: conceito
status: ativo
atualizado: 2026-10-24
---

# Dungeon Companion — Ranking

Botão **RANKING** na tela inicial (PARA TODOS) → `/ranking` (logado). Mostra, **pra todos os
usuários**, os 10 maiores feitos de cada categoria, de todas as mesas: avatar e nome do personagem,
**nome de usuário** atual do jogador (desde a 1.9.0, `COALESCE(u.username, ps.player_name)`; antes
era o apelido digitado ao entrar na mesa) e nome da sessão. Entrou na **1.7.0** (api `69c8e8f`, web `e0e6040`); virou
lista na **1.7.1** (web `2026e36`).

## O que conta

Uma linha por **personagem numa sessão** (`character_session_stats`, chave `id_game_session` +
`id_character`). Só personagem de jogador daquela sessão grava (`bumpStats` faz `INSERT … SELECT …
WHERE EXISTS player_session`); NPC e monstro não entram. A contagem começou na 1.7.0 — o histórico
antigo não existe (o log guarda só as últimas 30 rolagens por sessão, regra que continua igual).

Regras puras em `dungeon-companion-api/src/services/ranking-stats.ts`; quem chama é
`GameSessionService.recordStats` (erro só vai pro log, nunca derruba a jogada):

| Onde | O que soma |
|---|---|
| `addRoll` | `rolls_count`; d20 puro (`keptD20`: vantagem = maior, desvantagem = menor) → `d20_count`, `d20_sum`, `nat20`, `nat1`; rolagem de **dano** → `damage_dealt` e `biggest_hit` (máximo); de **cura** → `healing_done` — contam na rolagem, aplicadas ou não (decisão do usuário) |
| `applyAmount` (jogador aplicando) | dano que zera monstro → `monsters_defeated` de quem aplicou; dano em jogador → `damage_taken` e, se caiu a 0, `knockouts` do alvo |
| `updateCharacterHp` (PV editado à mão) | queda → `damage_taken` (+ `knockouts` se chegou a 0) |
| `grantXp` | `xp_gained` |
| `publishSpellCastStage` com magia e fase `done`; `announceSpellCast` sem `is_ability` | `spells_cast` |

O mestre aplicando dano pelos cards grava o PV direto (não passa por `applyAmount`), então não conta
golpe final.

## Categorias

`RANKING_CATEGORIES` (mesmo arquivo): DANO CAUSADO, MAIOR GOLPE, CAÇADOR (monstros), DANO SOFRIDO,
CURANDEIRO, CRÍTICOS (20 natural), AZARADO (1 natural), SORTUDO (média do d20, mínimo 20 rolagens),
QUASE MORTO (quedas), ARQUIMAGO (magias), ROLADOR (rolagens), VETERANO (XP). Empate: quem chegou
primeiro (`updated_at`).

## API e tela

- `GET /api/ranking` (`RankingController` → `RankingService` → `RankingRepository.topFor`): uma
  consulta por categoria, top 10, juntando personagem, sessão e `player_session` (quem saiu da mesa
  some) e pulando quem tem `users.show_in_ranking = false`.
- Web `src/app/ranking/`: abas por categoria (no celular rolam de lado) e **lista** do 1º ao 10º,
  top 3 em ouro/prata/bronze; números no padrão brasileiro.

## Privacidade

- Opção "Mostrar meus personagens no ranking" em /conta (`PATCH /api/account` com
  `show_in_ranking`); exportação traz `ranking_stats`; tudo some em cascata com a conta, a sessão ou
  o personagem. Política atualizada (seções 2, 3, 4, 7, 8). Ver [`lgpd.md`](lgpd.md).
- Banco: [`estado-atual.md`](../estado-atual.md), "Mudanças feitas direto no banco de produção"
  (22/10).
