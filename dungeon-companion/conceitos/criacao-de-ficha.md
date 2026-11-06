---
resumo: Criação de ficha (wizard do web) — por enquanto, a sugestão de atributos pela classe (1.17.10) e as armas do catálogo sem bônus (1.17.9).
tipo: conceito
status: ativo
atualizado: 2026-11-06
---

# Dungeon Companion — Criação de ficha

O wizard fica em `dungeon-companion-web/src/app/character-wizard/` (passos e métodos de
atributo no `CLAUDE.md` do web). Este doc começou na 1.17.10 e ainda não cobre o wizard inteiro:
o histórico anterior (validação na API, barra de progresso, cartas nas etapas) está em
[`historico/diario-2026-09-10_a_2026-10-18.md`](../historico/diario-2026-09-10_a_2026-10-18.md).

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
