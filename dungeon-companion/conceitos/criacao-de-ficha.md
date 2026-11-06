---
resumo: Criação de ficha (wizard do web) — passo 1 com raça por miniaturas (1.17.11), sugestão de atributos pela classe (1.17.10) e armas do catálogo sem bônus (1.17.9).
tipo: conceito
status: ativo
atualizado: 2026-11-06
---

# Dungeon Companion — Criação de ficha

O wizard fica em `dungeon-companion-web/src/app/character-wizard/` (passos e métodos de
atributo no `CLAUDE.md` do web). Este doc começou na 1.17.10 e ainda não cobre o wizard inteiro:
o histórico anterior (validação na API, barra de progresso, cartas nas etapas) está em
[`historico/diario-2026-09-10_a_2026-10-18.md`](../historico/diario-2026-09-10_a_2026-10-18.md).

## Passo 1: detalhes primeiro e raça por miniaturas (1.17.11, web `27b9a87`)

- Ordem: **Detalhes do personagem** (nome, idade, alinhamento) em cima, **Construção básica**
  embaixo, nos dois layouts. O campo NÍVEL saiu da tela (a criação é sempre nível 1;
  `core_build.level` continua 1 no dado enviado).
- **Raça**: o select virou uma grade de miniaturas (`ng-template #racePicker`, usado no mobile e no
  desktop; 3 por linha no celular). Escolher chama `selectRace()`, que grava o id e chama o mesmo
  `onRaceChange()` de antes (clicar na já escolhida não faz nada). Depois de escolher, a arte da
  raça aparece maior logo abaixo, com o nome; a grade continua visível pra trocar. Traços,
  ferramenta, aumento de atributo, sub-raça e truque racial seguem embaixo, como antes.
- **Artes**: originais (PNG 1254x1254, fundo escuro) em [`artes/races/`](../artes/races/), com o
  nome `<id_race><nome>.png`; `dungeon-companion-web/design/races/process.py` grava
  `src/assets/races/race-<id>.webp` em 512 px (16–26 kB cada; precisa de Pillow). Quais ids têm
  arte: `src/app/constants/race-images.ts` (`raceImage`); as 9 raças têm arte desde a 1.17.12
  (Humano, web `78c69c4`). Raça sem arte (id fora da lista) aparece com a inicial do nome.
- Classe, antecedente e alinhamento ganharam `<option [value]="0" disabled>Selecione...</option>`
  (o estado inicial desses ids é 0, e o select aparecia vazio).
- Testes: `race-images.spec.ts`; escolha da raça em `character-wizard.component.spec.ts`.

## Sugestão de atributos pela classe (1.17.10, web `101a210`)

- A classe é escolhida no passo 1 e os atributos no passo 2, então o passo 2 já sabe a classe.
- Tabela em `src/app/constants/attribute-priority.ts` (`CLASS_ATTRIBUTE_PRIORITY`, por `id_class`),
  tirada da "Construção Rápida" de cada classe no Livro do Jogador: `primary` recebe o maior valor,
  `secondary` o seguinte. Quando o livro dá duas opções (Guerreiro FOR ou DES; Clérigo FOR ou
  CON; Ladino CAR ou INT; Mago CON ou DES), as duas ficam na mesma prioridade e a `note` diz quando
  escolher cada uma. Só existe no web, não é cópia da api.
- Na tela: aviso abaixo do método de geração ("maior valor em …, depois …") e selo `1º`/`2º` no
  nome do atributo, nos três métodos, no celular e no desktop (`ng-template #priorityBadge` no
  topo do template; `attributeRank(stat)` no componente).
- É só sugestão: não distribui nem trava valor. Ideia de botão "aplicar sugestão" no
  [`backlog.md`](../backlog.md).
- Testes: tabela em `rules-constants.spec.ts` (valores do livro, sem atributo repetido, nota só
  quando há escolha); troca de classe em `character-wizard.component.spec.ts`.

## Armas do catálogo sem bônus (1.17.9)

As armas das opções da criação vêm cruas da tabela `weapon`, sem `attack_bonus` nem
`damage_modifier` (só a ficha calcula). A carta trata o ausente — ver
[`cartas.md`](cartas.md) e [`gotchas.md`](../gotchas.md).
