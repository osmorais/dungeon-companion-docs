---
resumo: Bestiário do livro (tabela `monster`, 428 fichas do Manual dos Monstros em português): formato do JSON, como foi gerado, correções e próximos passos.
tipo: conceito
status: ativo
atualizado: 2026-10-25
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
  com a ficha em inglês da API (chaves iguais, então as telas continuam mostrando).
- O site lê do `data_snapshot` só: `name`, `size`, `type`, `alignment`, `armor_class[0].value`,
  `hit_points`, `hit_dice`, `speed` (chave: valor), os 6 atributos, `challenge_rating`, `xp`,
  `special_abilities` e `actions` (`name`/`desc`).

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

## Próximos passos

Ver `backlog.md`, seção "Monstros".
