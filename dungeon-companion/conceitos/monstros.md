---
resumo: Bestiário do livro (tabela `monster`, 428 fichas do Manual dos Monstros em português): formato do JSON, como foi gerado, ações mecânicas do monstro na mesa, descrição (lore) e carta do monstro, ficha na gaveta e ação na tela de lançamento (1.13.0), bestiário do mestre e catalogar em cartas com filtros (1.14.0).
tipo: conceito
status: ativo
atualizado: 2026-10-28
---

# Dungeon Companion — Monstros

## Catálogo do mestre (1.10.0)

Api `395e250` (merge `1b1c62d`, PR #3), web `a628317` (merge `4c0d64b`, PR #5).

- O mestre busca no **bestiário** (tabela `monster`): `GET /api/monster-catalog/bestiary` (lista
  `{index, name, challenge_rating, size, type}` ordenada por nome) e `/bestiary/{slug}` (a ficha,
  `data`), via `MonsterRepository`. Escolhe e "cataloga" (`POST /api/monster-catalog` com
  `monster_api_slug` = slug do bestiário): PV, CA e `data` da tabela são copiados pra
  `monster_catalog` (`user_id`, `custom_name`, `image_url`, `data_snapshot`). Slug fora do
  bestiário dá 404. Ao entrar na sessão, é copiado de novo pra `monster_session`.
- Telas: "Catalogar novo monstro" (`monster-catalog-create`) e o "catalogar agora" do
  "+ ADICIONAR" da sessão (`add-monster-modal`, que cataloga e adiciona). A lista mostra ND e tipo;
  a busca ignora acento (`normalizeSearch`).
- `services/monster-format.ts` (web): `challengeRatingText` (0.25 → "1/4", usado em todo ND de
  monstro) e `monsterSpeedText` (`pairar: true` vira "pairar").
- A **dnd5eapi saiu** (`SrdMonsterService` apagado na 1.10.0). Monstros catalogados antes ficam
  com a ficha em inglês da API. **Desde a 1.14.0 o site não trata mais essas fichas** (decisão de
  2026-10-27): `isMechanicalStatBlock`, o texto da "ficha antiga" e os "sem testes" ficaram
  comentados no web. Elas aparecem quebradas — ver o backlog.
- O site lê do `data_snapshot`: `name`, `size`, `type`, `alignment`, `armor_class[0].value`,
  `hit_points`, `hit_dice`, `speed` (chave: valor), os 6 atributos, `challenge_rating`, `xp` e,
  desde a 1.11.0, os campos estruturados das habilidades e as defesas/sentidos (abaixo).

## Ações mecânicas na mesa (1.11.0)

Api `bf7ac7e`, web `b7c7720`. Só o mestre vê a ficha do monstro na mesa, então tudo isto é dele.
Feito em três fases (rolar e aplicar; usos e vez do monstro; lendárias, reações e covil), entregues
juntas na 1.11.0.

- **Ficha da mesa** (`src/app/monster-actions/`, web): `monster-actions.ts` converte cada habilidade
  estruturada num botão que abre **o mesmo modal de rolagem dos jogadores**:
  - `attack` → ATACAR (d20 + bônus; acertou → dano no mesmo modal, crítico no 20 dobra os dados);
  - `dc` → RESISTÊNCIA ("CD 13 de Destreza", rola o dano e o mestre aplica cheio ou metade/nada
    por alvo). Ataque com veneno depois do acerto (Aranha Gigante) vira dois botões, o ataque e
    "Mordida, resistência"; dano extra no acerto (chicote do Balor) fica num ataque só, com a CD
    como lembrete (`splitAttackDamage`, conferido nas 30 fichas com esse caso);
  - só dano → ROLAR DANO; dano com `note` (duas mãos, se agarrado) aparece como lembrete, sem somar;
  - TESTES: as 6 resistências (bônus da ficha ou modificador), os 6 atributos e as perícias.
- **Aplicar**: em jogadores, NPCs e outros monstros, vários de uma vez, com as defesas dos
  personagens (Fúria, raça, Evasão, Esquiva Sobrenatural). Ao terminar a rolagem, a ficha reabre
  com o PV atual.
- **Visibilidade**: monstro escondido rola **oculto** por padrão, revelado rola público; o mestre
  troca no próprio modal (o PÚBLICO/OCULTO deixou de ser só da rolagem livre).
- **Usos** (`monster_session.action_state`, JSONB; regra pura em `src/services/monster-action-state.ts`
  da api, `PATCH /api/game-session/monster-session/{id}/action-state`, só o dono da sessão; evento
  `monster_action_state_updated`, só pro mestre):
  - recarga (gasta ao usar; o **servidor** rola o d6 no início do turno do monstro e a ficha mostra
    o resultado), por dia e por descanso; ↺ devolve um uso; DESCANSO restaura tudo;
  - ações lendárias: contador por rodada (`legendary_count`, padrão 3), custo 1 ou 2, repostas no
    turno do monstro; reação: uma por rodada;
  - o gasto vai antes da rolagem: se a api recusar (422, ex.: ainda recarregando), o modal não abre.
- **Vez do monstro**: `CombatService.onTurnStart` (api) roda nos três pontos em que a vez muda. No
  web, a ficha do monstro abre sozinha pro mestre na vez dele, com faixa e FINALIZAR TURNO.
- **Multiataque guiado**: "Mordida 0/1, Garra 0/2", cada um rolando pelo botão do ataque.
- **Covil** (29 fichas com `lair_actions`): botão NO COVIL / SAIU DO COVIL (`in_lair`). Com o
  monstro no covil, o mestre recebe o lembrete "CONTAGEM 20: AÇÕES DE COVIL" quando a vez passa de
  quem tem 20+ pra quem tem menos (perde empates), ou na virada de rodada se ninguém tem 20
  (`crossedLairCount`, `session-panel/turn-transition.ts`). Recarregar a página não repete.
- **Defesas e sentidos** na ficha: vulnerabilidades, resistências, imunidades (dano e condição),
  sentidos e idiomas — só as linhas que a ficha tem.
- **Ficha antiga** (dnd5eapi, sem campos estruturados): só texto, com o aviso pra catalogar de novo
  pelo bestiário (`isMechanicalStatBlock`).
- **Segurança** (junto, na 1.11.0): rolagem e anúncio de magia **sem personagem** passaram a ser só
  do mestre (403 pro jogador). Antes um jogador conseguia registrar rolagem com qualquer nome
  ("Goblin", o mestre).

## Descrição (lore) e carta do monstro (1.11.0)

- **`monster.lore`** (TEXT): 2 a 3 frases por monstro, os 428, escritas na sessão de 2026-10-25,
  **inspiradas no livro, mas com texto próprio** (decisão do usuário). Sem números de combate. No
  seed, na linha do INSERT de `monster`. As bestas e os NPCs comuns ficaram mais curtos e simples.
- A api acha a descrição **pela slug** (`monster_session.monster_api_slug`), não pela cópia da
  ficha — vale pra monstros que já estavam nas mesas. Ficha antiga da dnd5eapi fica sem.
- `monsterRevealCard` (`src/services/monster-reveal.ts`, api): tipo, tamanho e lore. Vai em
  `monster_revealed`, em `revealed_monsters` (o que o jogador recebe, sem PV/CA) e, sem lore, em
  `monster_defeated`.
- **A carta** (`monsterToCard`, `game-card/monster-card.ts`, web): a mesma moldura das magias e
  armas; imagem do mestre ou a padrão (`assets/monster.png`, trocada na 1.11.0 por uma cena com
  vários monstros, 820 px); faixa "TIPO · TAMANHO"; medalhão "?"; descrição no pergaminho. Detalhe
  dos avisos em [`cartas.md`](cartas.md), "Carta do monstro".

## Ficha do monstro na gaveta (1.13.0)

Api `0f36654`, web `d146f46`. O modal da ficha saiu; o mestre abre a ficha na **gaveta de baixo**
(`src/app/monster-drawer/`), tocando no monstro da lista ou na carta do carrossel do combate.

- Mesmo visual da gaveta de ações dos personagens: o componente usa os estilos de
  `player-actions-modal` e `bottom-drawer` (`styleUrls`) + um SCSS próprio pequeno.
- **Barra**: imagem do monstro no anel e o nome. **Faixa** "VEZ DE …" na vez dele.
- **Destaque**: PV, CA, ND, dados de vida e MESA (REVELADO/ESCONDIDO); DANO, CURA, DANO TOTAL e
  CURA TOTAL no PV (`applyMonsterHpDelta`); FINALIZAR TURNO (na vez), REVELAR/ESCONDER, DERROTAR
  (fecha a gaveta e pede confirmação, como o botão da lista — 1.15.0, abaixo) e EDITAR STATUS (formulário
  dentro da gaveta; o rascunho e o salvar continuam na sessão).
- **Colunas**: MONSTRO (carta grande com a descrição, nome original e tipo, trocar imagem,
  atributos com modificador, deslocamento, defesas), AÇÕES e TESTES. `app-monster-actions` ganhou
  `part` (`all` | `actions` | `checks` | `traits`) pra cada coluna desenhar só a sua parte.
- **Ações em cartas** (1.13.2): na coluna AÇÕES (`asCards` + `imageUrl` no `app-monster-actions`),
  as ações que rolam (ataque, resistência, dano, de qualquer grupo) viram um baralho
  (`app-card-deck`) que abre a mão (`app-card-hand`), como as armas dos jogadores. Cada carta é
  `monsterActionToCard` com a descrição da ação e etiquetas (LENDÁRIA, REAÇÃO, usos); sem uso, a
  carta fica apagada (`locked`). Embaixo da carta da vez, ATACAR/RESISTÊNCIA/ROLAR DANO, o estado e
  o ↺. Os contadores de lendárias e da reação ficam junto do baralho. Multiataque, habilidades só de
  texto, covil, recarga e descanso continuam em lista.
- A gaveta é só desenho: entradas/saídas pra sessão, que grava. Mostra o monstro como está agora
  (`liveMonsterDetail`, pela sessão), e **fica aberta durante a rolagem** (a rolagem está numa camada
  acima): o multiataque guiado mantém a contagem entre um ataque e outro — antes, a ficha fechava ao
  rolar e a contagem zerava.

## Ação do monstro na tela de lançamento (1.13.0)

- Ação com carta (ataque, resistência, só dano) abre o modal de rolagem em modo lançamento, como
  magias e armas. `monster-actions.ts` monta a carta da ação junto com o botão (`card`:
  `MonsterActionCardInfo` com até 4 números — ATAQUE, DANO, CD, SE PASSAR/SE ACERTAR — e
  `castSave` com a CD pro palco). Testes do monstro (resistências, atributos, perícias) continuam no
  modal comum.
- **Api**: `POST /spell-cast-stage` aceita `monster_action` + `id_monster_session` (com
  `id_character` nulo) no lugar de magia ou arma. Só o mestre da sessão, só **monstro revelado**
  (escondido = 422), nome/imagem/tipo do monstro vêm do servidor (`findMonsterForCast`), não conta
  no ranking. O evento `spell_cast_stage` ganhou `monster_action` e `monster` (nulos fora disso).
- **Web**: `SpellCastContext` com `monsterAction`, `idMonsterSession` e `private`; quem age é a
  carta do monstro (`CharacterCardData.monsterCard`), a carta da direita é `monsterActionToCard`
  (imagem do monstro na arte, faixa "ATAQUE DE MONSTRO"/"EFEITO COM RESISTÊNCIA"/"DANO DE
  MONSTRO", bônus ou CD no medalhão); verbo "ATACOU COM" ou "USOU" (`monsterCastVerb`).
- **Monstro escondido** (`private`): o mestre rola no palco montado no próprio modal, a rolagem é
  oculta e nada é publicado. Nas ações com carta o PÚBLICO/OCULTO some (decisão: segue o monstro
  estar revelado).
- A rolagem do monstro fecha no fim da jogada (`rolled`), como a rolagem livre do mestre — no modo
  lançamento a janela só avisa e quem abriu fecha (ver `gotchas.md`).

## Tabela `monster` (bestiário de referência)

Dado de fábrica, igual pra todos (seed no fim do `database_inserts.sql` da api). Lida pelo catálogo
(acima).

| Coluna | |
|---|---|
| `id_monster` | SERIAL, 1–428 na ordem do livro |
| `slug` | único, = `data.index` (minúsculas, sem acento, hífens: `dragao-vermelho-anciao`) |
| `name`, `challenge_rating` (NUMERIC: 0.125, 0.25…), `hp_max`, `ac` | cópia de campos do `data` pra listar/ordenar |
| `data` | JSONB da ficha |

`data` usa **as chaves da dnd5eapi** (o site já lê esse formato) com **valores em português**,
mais campos nossos:

- `speed`: `terrestre`, `voo`, `natação`, `escalada`, `escavação` (texto "6 m") e `pairar: true`.
- `saving_throws` `[{ability: "CON", bonus: 6}]`, `skills` `[{name, bonus}]`,
  `damage_vulnerabilities/resistances/immunities` e `condition_immunities` (strings do livro),
  `senses` (linha inteira), `passive_perception`, `proficiency_bonus`, `swarm_of`, `page`.
- `special_abilities`, `actions`, `reactions`, `legendary_actions` (+ `legendary_desc`,
  `legendary_count`) e `lair_actions` (texto). Cada habilidade:
  - `name`, `desc` (texto do livro, limpo);
  - `usage`: `recharge {min}`, `per_day {times}`, `rest {rest}`, `cost {actions}` (lendária) ou
    `form {desc}` (restrições como "1/Turno", "Forma de Vampiro Apenas", "Tipo 2");
  - `attack`: `kind` (`melee_weapon`, `ranged_weapon`, `melee_or_ranged_weapon`, `melee_spell`,
    `ranged_spell`), `bonus`, `reach_m`, `range_m` ("9/36"), `target`;
  - `damage`: `[{dice: "2d6+5", average: 12, type: "concussão", note?}]` — `note` marca dano
    condicional ou alternativo (duas mãos, se agarrado, dano extra do traço); tipo `null` só no
    dano extra que segue o tipo da arma (com `note`);
  - `dc`: `{ability: "DES", value: 13, success: "metade" | "nenhum" | null}` (o primeiro teste);
  - `multiattack`: `[{action: "Garra", count: 2}]` (com alternativas, só a primeira).
- Tipos de dano: ácido, concussão, cortante, elétrico, **energia** (força — como o livro e o
  `spell-mechanics.ts` chamam), fogo, frio, necrótico, perfurante, psíquico, radiante,
  trovejante, veneno.

Números: 428 fichas (72 humanoides, 95 bestas, 45 dragões…), 35 com ações lendárias, 29 com
ações de covil, 700 ataques estruturados, 272 habilidades com CD.

## Como foi gerado (2026-10-24)

- Fonte: [`referencias/monstros.txt`](../referencias/monstros.txt), OCR do Manual dos Monstros em
  português — colunas embaralhadas, partes de ações antes do cabeçalho, números corrompidos (`�`).
  429 linhas "Classe de Armadura"; uma é texto do Servo Esporo, não ficha.
- 12 agentes montaram o JSON em lotes, um validador conferiu (média dos dados × PV, dado de vida
  × tamanho, ND × XP, bônus de proficiência, bônus de ataque × atributo, CD e médias presentes no
  texto, slugs únicos) e um script aplicou as correções e gerou o SQL. Os scripts ficaram só no
  scratchpad da sessão: **a fonte de verdade agora é o seed** no `database_inserts.sql`.
- Avisos que sobraram no validador são valores que o original também traz assim (Demilich 80 PV
  pra 20d4, golens, Hobgoblin Senhor da Guerra +9, bestas miúdas com +0, Sapo/Cavalo-Marinho/
  Guinchador sem ação).

### Correções pelo original

Decisão do usuário: quando o livro em português diverge do Manual dos Monstros original, vale o
original (o texto continua em português). Aplicadas:

- **Faltavam**: Anfíbio do Dragão Negro Filhote, Rocha do Ente, imunidade a veneno do Guardião do
  Escudo e do Horror de Elmo (força/necrótico/veneno), envenenado do Diabrete, Resistência à Magia
  do Yuan-ti Mestiço, Espetar do Rei/Rainha Povo Lagarto.
- **Números**: Mula +4, Cavalo de Carga +6, Ressurgido ND 5, Mephit da Fumaça imune a fogo,
  Mephit do Vapor INT 11/CAR 12, Otyugh visão no escuro 36 m, Quadrone CA 16, Arbusto Desperto
  FOR 3, Sacerdotisa Sahuagin FOR 12, Choque do Fogo-Fátuo (magia, 2d8 elétrico), Guincho do
  Guinchador como reação. Os agentes também corrigiram erros de cópia/conta do livro em PT (ursos,
  Alce Gigante, Barão Sahuagin, Glabrezu, Nalfeshnee, Tigre Dentes-de-Sabre, Pudim Negro,
  Homem-Chacal e outros).
- Yuan-ti Mestiço: ações dos 3 tipos com nome repetido viraram "Mordida (Tipo 1)" etc. (o site
  usa o nome como chave da lista).

## Bestiário e catalogar em cartas (1.14.0)

PR #8 do web (Carlos: cartas na lista do bestiário), merge `6578150`, com commits nossos:
`1adaad4` (code review) e `470afe7` (detalhe, catalogar, filtros); api `968ea90`.

- **Carta**: `catalogMonsterCard` (catálogo) e `bestiaryMonsterCard` (livro, com o nome
  customizado digitado) em `game-card/monster-card.ts` — a carta da revelação com o ND no
  medalhão e o resumo "tamanho tipo, tendência. CA · PV · ND" no pergaminho. ND 5+
  (`THREAT_CHALLENGE_RATING`) dá o estado `threat`: brilho vermelho e selo **PERIGOSO** no
  `game-card`. Nas listas, nome e resumo maiores pelas variáveis `--gc-title-size` e
  `--gc-desc-size` (padrão da carta pequena fora delas).
- **Ficha fora da mesa** (`app-monster-sheet`): números em destaque e colunas MONSTRO | AÇÕES |
  TESTES com os estilos da gaveta (`player-actions-modal.scss`), carta da lista na coluna
  MONSTRO, ações em cartas via `app-monster-actions` com `viewOnly` (sem rolar, usar, restaurar,
  covil, descanso nem contadores; testes viram etiquetas; lendárias "N POR RODADA"). Conteúdo
  projetado embaixo da carta e no rodapé (`[sheetFooter]`, canto de baixo à direita). `fit`: no
  desktop a ficha tem a altura da janela e cada coluna rola por dentro. Usada no detalhe
  (`monster-catalog-detail`, com TROCAR IMAGEM) e no catalogar (nome customizado + CATALOGAR,
  com o visual do ATACAR da mão). `monster-stat-block` foi apagado (sem uso).
- **Filtros** (`monster-filters/`): `filterMonsters` (nome e `altName` sem acento, faixa de ND
  `CR_TIERS`, tipo, tamanho, lendários, voadores; ordem `recent` | `name` com números naturais |
  `cr`), `monsterFilterOptions` (tipos em ordem alfabética, tamanhos na ordem do livro) e o painel
  `app-monster-filters` (coluna fixa à esquerda no desktop; no celular só a busca, o resto
  recolhe em ▼ FILTROS). Tela de catalogar: o livro inteiro em páginas de 8 (abrir a carta e
  voltar mantém filtros, página e rolagem). Bestiário: carrega o catálogo inteiro em lotes de 50
  (teto da api) e filtra no navegador, padrão "mais recentes".
- **Api**: `GET /api/monster-catalog/bestiary` passa a trazer `alignment`, `hp_max`, `ac`,
  `legendary` (tem `legendary_actions`) e `flies` (tem `speed.voo`), pra carta e os filtros.

## Derrota e XP do combate (1.15.0)

Api `3200b21`, web `b513c4e`. Antes, DERROTAR abria a distribuição de XP com o XP do monstro e
encerrar o combate perguntava "os monstros foram derrotados?" (e derrotava todos os do combate).

- **Derrotar** (linha do monstro e gaveta) pede confirmação — DERROTADO / AINDA NÃO — e tira o
  monstro (`defeatMonster`), sem abrir o XP.
- **0 PV**: o painel do mestre compara o PV de cada monstro a cada mudança da sessão
  (`watchMonstersAtZeroHp`); quem passa de >0 pra 0 entra na fila de `defeatPrompts` (mesma
  pergunta, com "chegou a 0 pontos de vida"). Vale pra qualquer caminho (gaveta, dano aplicado de
  rolagem, dano em área). Não dispara na primeira carga; some se o monstro for curado ou sair.
- **XP acumulado**: `combat_encounter.defeated_xp`. `GameSessionRepository.removeMonster` com
  `creditCombatXp` (só a derrota) soma o `data_snapshot.xp` do monstro no combate em andamento
  (`rolling_initiative`/`active`) do qual ele participa, na mesma transação da remoção (antes do
  cascade apagar a participação). O evento `monster_defeated` leva `combat_xp`
  (`{id_combat_encounter, defeated_xp}` ou nulo) e o reducer do web atualiza o encontro. O mestre
  vê "XP ACUMULADO" ao lado da RONDA.
- **Encerrar**: com XP acumulado, o mestre vê o total e escolhe DISTRIBUIR XP (o
  `distribute-xp-modal` com o total sugerido e os jogadores do combate marcados; o combate só
  encerra depois de conceder), ENCERRAR SEM XP ou VOLTAR AO COMBATE. Sem XP, encerra direto.
  Monstros que sobraram no combate continuam na mesa e não entram no total.

## Próximos passos

Ver `backlog.md`, seção "Monstros".

## Alvos de aplicar (1.13.2)

Aplicar dano/cura (rolagem e dano em área do Quadro do Mestre) lista **só monstros revelados**, pra
todos — antes o mestre via os escondidos, e num lançamento público o nome ia pra mesa no "APLICOU …
em …". O PV do escondido continua editável pelo card e pela gaveta.
