# Dungeon Companion — Plano: Subir de Nível (Level Up)

Documento de planejamento pra funcionalidade de subir de nível um personagem já criado.
Registrado antes da implementação começar, por pedido do usuário. Ver
`dungeon-companion-status.md` pro contexto geral do projeto/sessões anteriores.

## STATUS ATUAL (2026-09-10, fim do dia) — continuar daqui amanhã

**Fase 1 está implementada e funcionando de ponta a ponta** (backend testado com
personagens descartáveis reais no banco, depois apagados; frontend buildado sem erros —
mas **ninguém testou pela UI ainda**, isso é o próximo passo). **Nada foi commitado ainda**
em nenhum dos dois repositórios — só está no working directory.

### O que já foi feito (além do plano original abaixo)

- **Todas as 12 classes** têm `featuresByLevel` completo (níveis 1-20), cada uma
  confirmada contra o livro pelo usuário (CSV ou foto da tabela oficial) antes de eu
  escrever os dados — não sobrou nenhuma pendência de "confirmar depois".
- **Catálogo de feats** (`src/services/character-sheet/feats.ts`, backend): 8 feats
  iniciais, alguns com `abilityIncrease` aplicado automaticamente (mesmo mecanismo do ASI).
- **Escolha de magias/truques novos ao subir de nível** — não estava no plano original,
  foi pedido depois que a Fase 1 "básica" já tava funcionando. Replica o mesmo modelo do
  wizard de criação (`hasSharedSpellPool` em `character-wizard.component.ts`): Bardo/
  Bruxo/Feiticeiro/Ranger/Mago têm um pool livre de magias distribuível entre círculos;
  Clérigo/Druida/Paladino têm cota fixa por círculo (igual à contagem de espaços de magia
  daquele círculo). O backend calcula os limites (reaproveitando os números já salvos em
  `featuresByLevel[n].resources['Truques Conhecidos']` / `['Magias Conhecidas']`, sem
  precisar de uma terceira tabela duplicada) e valida o que o frontend manda; o frontend
  busca o catálogo de magias do mesmo endpoint que o wizard já usa
  (`GET /api/character-options`) e filtra por `CLASS_SPELLS[classId]`.
- **Diferenças em relação ao plano original** (decisões tomadas durante a implementação,
  não durante o planejamento):
  - A rolagem de HP **não é feita pelo cliente** — o preview já rola o dado no servidor
    (`Math.floor(Math.random() * hitDie) + 1`) e devolve o resultado, seguindo a mesma
    convenção já usada em `rollHitDie` (descanso curto). O frontend só exibe o resultado
    (com o dado pixelado `PixelNumericDieComponent`) e reenvia esse mesmo valor no
    confirm — não inventa nem revalida a rolagem.
  - `preview` acabou virando **`GET`** (não `POST` como o plano original sugeria), já que
    não tem efeito colateral nenhum — mais correto semanticamente.
  - CA (`armour_class`) **não é recalculada** no level-up. Descoberta durante a
    implementação: essa coluna já é congelada desde a criação em **todo o app** (não só
    aqui) e não existe nenhum jeito de saber se o personagem tem escudo equipado depois
    da criação (esse dado nunca é persistido). Não é uma regressão da Fase 1, é uma
    limitação preexistente que ficou de fora do escopo.
  - Reaproveitei o helper `statsFromRaw` que já existia em `character-sheet.service.ts`
    em vez de duplicar um novo (removi minha primeira tentativa duplicada).
- **Bug encontrado e corrigido** (fora do escopo original, mas relacionado): o frontend
  (`constants/spell-rules.ts`) tinha a tabela de truques conhecidos do Clérigo errada
  (`3,3,3,3,3,3,3,3,3,4,...` — parecia cópia colada de outra classe). Corrigida pra
  `3,3,3,4,4,4,4,4,4,5,...`, batendo com a imagem do livro e com o que já tinha sido
  registrado corretamente no backend.
- **Migração de schema já aplicada em produção** (não é só um script pendente — já
  rodei contra o banco real): tabela `character_level_history` (histórico de nível:
  dado rolado, CON no momento, PV ganho, ASI ou feat escolhido). Documentada em
  `dungeon-companion-api/docs/database/database.sql`.

### Arquivos novos/alterados (nenhum commitado ainda)

**Backend** (`dungeon-companion-api`):
- Novos: `src/models/level-up-types.ts`, `src/services/character-sheet/feats.ts`.
- Alterados: `src/services/character-sheet/rules.ts` (featuresByLevel das 12 classes +
  SPELL_SLOTS até nível 20 + KNOWN_CASTER_CLASS_IDS/getWizardSpellbookSize),
  `src/services/character-sheet/calculator.ts` (`calcRolledLevelUpHp`),
  `src/services/character-sheet.service.ts` (`getLevelUpPreview`, `confirmLevelUp` +
  helpers privados), `src/repositories/character.repository.ts` (`applyLevelUp`,
  `hasLevelHistoryEntry`), `src/controllers/character.controller.ts` (2 endpoints novos),
  `docs/database/database.sql` (documentação da migração já aplicada).

**Frontend** (`dungeon-companion-web`):
- Novos: `src/app/level-up-modal/` (componente completo: .ts/.html/.scss),
  `src/app/models/level-up.interface.ts`.
- Alterados: `src/app/character-sheet/character-sheet.component.ts/.html/.scss` (botão +
  wiring do modal + reload da ficha após confirmar), `src/app/services/character.service.ts`
  (`previewLevelUp`, `confirmLevelUp`), `src/app/constants/spell-rules.ts` (fix do bug do
  Clérigo).

### Próximos passos (amanhã)

1. **Testar pela UI de verdade** — os dois servidores locais estavam no ar (API em
   `http://127.0.0.1:3000`, Web em `http://localhost:4200`) na última vez, mas essa
   sessão de terminal provavelmente não vai sobreviver até amanhã; rodar `npm start` nos
   dois de novo (ver `CLAUDE.md` de cada repo). Testar pelo menos: uma classe sem magia
   (ex: Bárbaro) subindo um nível de ASI e um sem; uma classe de pool livre (ex: Bardo)
   escolhendo magia nova; uma classe de cota por círculo (ex: Clérigo) escolhendo magia
   nova em mais de um círculo ao mesmo tempo; escolha de feat em vez de ASI.
2. **Se o teste passar, commitar e dar push** nos dois repositórios (ainda não foi feito
   nada disso — tudo só no working directory).
3. Depois disso, a Fase 1 está encerrada. Fases 2 (subclasse) e 3 (multiclasse) ficam
   pra quando o usuário pedir — não começar sem pedido explícito.

## Decisão de escopo (confirmada com o usuário em 2026-09-10)

A funcionalidade final inclui **subclasse** e **multiclasse**, mas será entregue em **fases**
— cada fase é usável e testável antes de começar a próxima:

- **Fase 1 (este plano)**: level-up de classe única. HP **rolado** (dado de vida da classe +
  modificador de Constituição daquele nível, não média fixa). ASI (Melhoria de Atributo) **ou**
  feat, com catálogo de feats. Fluxo de **revisão antes de confirmar** (mostra o que vai mudar
  antes de gravar). Sem assistência de IA — 100% manual/determinístico, igual ao resto do app.
- **Fase 2 (futura)**: subclasse (domínio/arquétipo/origem/patrono) — hoje não existe nenhum
  modelo de subclasse, é só texto narrativo dentro do trait de nível 1 de cada classe.
- **Fase 3 (futura)**: multiclasse — personagem passa a ter N entradas de classe+nível em vez
  de uma só (`id_class`/`level` fixos na tabela `character`). Só acontece **a partir do
  level-up** (confirmado): a criação de personagem continua sendo sempre 1 classe só, igual
  hoje; multiclasse é uma escolha feita ao subir de nível a partir do nível total 2.

**Premissa assumida pra Fase 1** (avisar se estiver errada): as features novas concedidas por
nível (ex: Ataque Extra, Retomar Fôlego) aparecem como **texto informativo** na ficha, sem
efeito mecânico automático aplicado em outros cálculos (ex: não vou fazer "Ataque Extra" dobrar
o número de ataques na aba de combate sozinho). Efeito mecânico automático de features fica pra
depois.

**Processo de conteúdo por classe**: o que cada uma das 12 classes ganha por nível (traits
mecânicos, não só sabor narrativo) será **confirmado com o usuário classe por classe**, antes
de cada uma ser implementada — não vou preencher a tabela `featuresByLevel` inteira de uma vez
sem checar.

## Estado atual (relevante pro level-up) — levantado por uma exploração de código antes deste plano

- `character-sheet.service.ts` calcula a ficha inteira (HP, CA, bônus de proficiência, slots de
  magia) só **na criação** (`build()`). Depois disso, `level`, `max_hit_points`,
  `armour_class`, `proficiency_bonus`, `spell_save_dc`, `spell_attack_bonus` ficam
  **congelados** em colunas da tabela `character` — só os slots de magia são recalculados ao
  carregar a ficha (`loadCharacter()`, a partir de `character.level`).
- `calculator.ts`: `getProfBonus(level)` já escala corretamente até nível 20 (reaproveitável).
  `calcMaxHP(hitDie, level, conMod, hpBonusPerLevel)` calcula a **média** de HP a partir do
  zero (não incremental) — pra Fase 1, com HP **rolado**, isso não serve mais como está: level
  up vai precisar de uma rolagem por nível, somada ao HP atual, não um recálculo do total.
- `rules.ts` → `SPELL_SLOTS`: só cobre **níveis 1-5** pra todas as classes. Acima disso,
  `buildSpellcasting()` cai silenciosamente no valor de `spellSlotsLevel1` (bug já existente,
  não é só limitação — qualquer personagem hoje criado direto em nível 6+ já tem esse problema).
- `rules.ts` → `CLASSES[n].traits`: lista **fixa e achatada** por classe, sem marcação de "em
  que nível é concedido" — é só o texto narrativo do nível 1. Nenhuma classe tem uma tabela de
  features por nível hoje.
- Não existe: tabela de ASI/feat por nível, catálogo de feats, coluna/tabela de histórico de
  nível (HP rolado por nível, ASI ou feat escolhido, features já concedidas).
- `character.repository.ts`: `level` só é gravado uma vez, no INSERT de criação — não existe
  nenhum método de UPDATE pra ele nem pros stats derivados.
- Frontend: o wizard de criação (`character-wizard/`) permite digitar level 1-20 livremente
  na criação (`&lt;input type="number" min=1 max=20&gt;`), e já tem tabelas completas de slots de
  magia até nível 20 em `constants/spell-rules.ts` — usadas só pra limitar escolhas durante a
  criação, nunca persistidas/reaproveitadas pelo backend. Não existe botão, modal, endpoint ou
  service method de "subir de nível" em lugar nenhum hoje.

## Plano técnico — Fase 1

### Backend

1. **Estender `SPELL_SLOTS` em `rules.ts` até nível 20** — usar como referência as tabelas já
   corretas do frontend (`spell-rules.ts`: `FULL_CASTER_SLOTS`/`HALF_CASTER_SLOTS`/
   `WARLOCK_SLOTS`). Corrige de quebra o bug do fallback silencioso pra magos level 6+.
2. **Tabela `featuresByLevel` por classe** (novo campo em `ClassRule`) — preenchida classe por
   classe, com confirmação prévia do usuário (ver seção "Processo de conteúdo por classe").
3. **Tabela de níveis de ASI por classe** — padrão 5e: 4, 8, 12, 16, 19 pra maioria; Guerreiro
   ganha extras em 6 e 14; Ladino ganha extra em 10. (Confirmar contagem exata por classe
   também durante a implementação de cada uma.)
4. **Catálogo inicial de feats** — um subconjunto (não os 40+ do PHB de uma vez), cada um com
   efeito mecânico declarado (ex: +1 em atributo específico, proficiência nova, etc.) pra poder
   aplicar automaticamente na ficha.
5. **Schema novo** (migração idempotente, seguindo o padrão `ALTER TABLE ... ADD COLUMN IF NOT
   EXISTS` já usado no `database.sql`):
   - Tabela `character_level_history` (ou nome similar): `id_character`, `level`,
     `hit_die_roll`, `con_modifier_at_level`, `hp_gained`, `asi_or_feat` (tipo + payload),
     `created_at` — histórico de cada nível subido, pra não duplicar ganhos e pra poder auditar.
   - Rastreamento de quais features já foram concedidas (pode ser derivado do
     `character_level_history` + `featuresByLevel`, sem precisar de tabela própria — avaliar
     na implementação).
6. **Endpoints novos**:
   - `POST /api/character-sheet/{id}/level-up/preview` — rola o dado de HP, calcula o que
     mudaria (novo HP, novas features, se cai em nível de ASI/feat, se ganha slots/magias
     novas), **sem gravar nada**. Devolve os dados pra tela de revisão.
   - `POST /api/character-sheet/{id}/level-up/confirm` — recebe as escolhas do usuário (ASI ou
     feat escolhido, magias novas escolhidas se aplicável) + o resultado da rolagem do preview,
     e aplica tudo numa transação: incrementa `level`, soma HP, recalcula e regrava CA/bônus de
     proficiência/spell DC/attack bonus, insere magias/skills novas, grava no histórico.
7. **Métodos novos em `character.repository.ts`**: UPDATE de level/HP/CA/bônus de
   proficiência/spellcasting; INSERT em `character_spell`/`character_skill` fora da transação
   de criação; INSERT no histórico de nível.
8. **Validação**: nível máximo 20 (hoje nada impede passar disso).

### Frontend

1. Botão **"SUBIR DE NÍVEL"** em `character-sheet.component` (visível quando `level < 20`).
2. Componente novo (modal, provavelmente `level-up-modal`): chama o `preview`, mostra a
   rolagem de HP (reaproveitando `PixelDieComponent`, que já existe pros dados d20/dN), lista
   as features novas, pede escolha de ASI vs. feat quando aplicável, pede escolha de magias
   novas quando aplicável, mostra resumo final, botão "confirmar" chama o `confirm`.
3. Métodos novos em `character.service.ts`: `previewLevelUp(id)`, `confirmLevelUp(id, choices)`.
4. Atualiza `sheetData` local (mesmo padrão já usado por `changeHp`/`patchCombatStats` em
   `character-sheet.component.ts`) após confirmar, sem precisar de reload completo.

## Processo de conteúdo por classe

Antes de escrever `featuresByLevel` de cada uma das 12 classes (Bárbaro, Bardo, Bruxo,
Clérigo, Druida, Feiticeiro, Guerreiro, Ladino, Mago, Monge, Paladino, Ranger), vou apresentar
pro usuário o que a classe ganha em cada nível (features mecânicas, não decoração) pra
confirmar contra o PHB antes de implementar. Ordem de implementação a definir — provavelmente
começando pelas classes sem conjuração (Bárbaro, Guerreiro, Ladino, Monge) por serem mais
simples, e deixando as conjuradoras completas por último por causa da interação com magia.

## Fase 2 (Subclasse) — pendências futuras

Algumas subclasses têm sub-sistemas complexos demais pra caber na premissa da Fase 1 (features
só como texto informativo, sem efeito mecânico automático) e foram deliberadamente modeladas de
forma simplificada. Registrado aqui pra não esquecer, caso algum dia valha a pena aprofundar:

- **Feiticeiro — Magia Selvagem**: a tabela de Surto de Magia Selvagem (d100, dezenas de
  efeitos aleatórios diferentes) não foi modelada — a feature "Surto de Magia Selvagem" só
  menciona que ela existe, como texto. Implementar de verdade exigiria uma tabela de rolagem
  própria (ação de rolar 1d100 e mostrar o efeito correspondente), fora do escopo do
  level-up/ficha atual.
- **Monge — Caminho dos Quatro Elementos**: as disciplinas elementais (dezenas de opções, cada
  uma com custo de chi próprio e efeito específico) não foram catalogadas — a feature
  "Discípulo dos Elementos" e as concessões de nível 6/11/17 só dizem "você aprende N
  disciplinas", sem listar/gerenciar quais. Implementar de verdade exigiria um catálogo de
  disciplinas (parecido com o catálogo de feats) + uma tela de escolha própria.
- **Druida — Círculo da Terra**: a escolha de terreno (Ártico, Costa, Deserto, Floresta,
  Montanha, Pântano, Planície ou Subterrâneo) concede magias extras sempre preparadas nos
  níveis 3º/5º/7º/9º, diferentes pra cada um dos 8 terrenos — não foi modelada; a feature
  "Magias de Círculo" só menciona que a escolha existe, como texto. Implementar de verdade
  exigiria uma escolha de terreno (provavelmente no momento de escolher a subclasse) + uma
  tabela de magias por terreno/nível, similar à de `featuresByLevel` só que com uma dimensão
  extra (terreno escolhido).
- **Ranger (Patrulheiro) — Conclave do Caçador**: em cada nível de feature (3º/7º/11º/15º), o
  Caçador escolhe uma entre 2-3 características diferentes (ex: Matador de Colossos vs.
  Matador de Gigantes vs. Destruidor de Hordas no 3º nível) — não foi modelado como escolha
  interativa, a feature só lista as opções como texto. Implementar de verdade exigiria um
  seletor por nível (parecido com a escolha de ASI vs. feat do level-up), guardando qual opção
  foi escolhida em cada um dos 4 níveis.

## Fase 3 (Efeito mecânico automático) — implementado em 2026-09-10

Escopo combinado com o usuário (não é tudo que "efeito mecânico automático" poderia significar —
só os 4 itens abaixo, escolhidos entre as opções de bônus passivo de atributo/perícia):

- **Campeão Primitivo** (Bárbaro, nível 20): FOR/CON +4 (máx. 24) aplicado "ao vivo" sobre os
  atributos persistidos (mesmo padrão da CA — ver `applyLevelBasedAttributeBonuses`), não gravado
  como novo valor base.
- **Alma de Diamante** (Monge, nível 14): proficiência em todas as resistências
  (`grantsAllSavingThrowProficiency`).
- **Deslocamento por nível**: Movimento Rápido (Bárbaro, nível 5, +3m sem armadura pesada) e
  Deslocamento sem Armadura (Monge, escalonado, sem armadura nem escudo) somados ao campo
  `speed` da ficha (`calcSpeedBonusMeters`/`formatSpeedWithBonus`).
- **Especialização/Aptidão/Bênção do Conhecimento** (dobro de bônus de proficiência em perícia):
  Ladino (nível 1 na criação + nível 6 no level-up), Bardo (nível 3 e 10, sempre no level-up) e
  Clérigo Domínio do Conhecimento (nível 1 na criação, concede treino novo em 2 perícias de uma
  lista fixa). Nova coluna `character_skill.is_expert` (migração já aplicada em produção) +
  `ExpertiseGrant` em `rules.ts` (`ClassLevelData`/`SubclassLevelData`) + telas novas no wizard
  de criação (Passo 4) e no level-up (`expertise_choice`/página "ESPECIALIZAÇÃO").

**Limitação pré-existente descoberta durante essa implementação (fora do escopo, não corrigida):**
`character_skill.total_skill_value`/`trained_value` são calculados **só na criação** e nunca
recalculados no level-up (diferente da CA e do deslocamento, que já viraram "ao vivo") — ou seja,
o bônus de perícia de um personagem já criado **não escala** quando o bônus de proficiência sobe
com o nível, ele fica congelado no valor de quando a perícia foi marcada como treinada. Isso é
anterior a esta sessão e afeta todas as perícias, não só as de Especialização — só ficou visível
agora porque o dobro de Especialização soma o bônus de proficiência *atual* em cima de um total
que pode já estar desatualizado. Não mexi nisso agora pra não expandir ainda mais o escopo;
avisar se quiser que eu recalcule perícias "ao vivo" também (mesmo padrão da CA/deslocamento).

**Atualização 2026-09-10 (mesmo dia, sessão seguinte):** a limitação acima foi corrigida —
`loadCharacter()` agora recalcula `total_skill_value` ao vivo (atributo atual + bônus de
proficiência atual), igual à CA/deslocamento. `character-sheet-print.ts` (exportação/impressão)
ganhou a correção de graça, por consumir o mesmo `CharacterSheet` já calculado.

Também foi implementado **rastreamento de recurso consumível** (Fúria do Bárbaro, Pontos de Chi
do Monge, Canalizar Divindade do Clérigo — Paladino não tem Canalizar Divindade na base 2014,
só nas subclasses de Domínio/Juramento como opção adicional, então ficou de fora): nova coluna
JSON `character.resource_uses_expended` (mesmo padrão de `spell_slots_expended`, pra não precisar
de coluna nova a cada recurso futuro — inclusive multiclasse, que pode um dia precisar de dois
recursos rastreados ao mesmo tempo). `TRACKABLE_RESOURCES`/`maxTrackableResourceUses` em
rules.ts; endpoint `PATCH .../resource-uses` (delta ±1, mesmo padrão de `spell-slots`); recarga
automática plugada em `rollHitDie` (descanso curto: só recursos com `rechargeOn: 'short_rest'`)
e `longRest` (sempre recarrega, é superconjunto do descanso curto). UI: caixa de pips ao lado da
caixa de Dados de Vida na ficha, com botões GASTAR/DESFAZER.

**Auditoria de criação de personagem (2026-09-11):** o usuário reportou que o truque à escolha
do Alto Elfo não estava sendo aplicado na criação. Levantamento completo de raça/sub-raça/classe
(nível 1)/antecedente encontrou mais 2 casos do mesmo tipo (texto narrativo nunca virando
mecânica de verdade), todos corrigidos:
- **Truques raciais**: Alto Elfo (à escolha, qualquer truque de mago), Gnomo das Florestas
  (fixo: Ilusão Menor) e Tiefling (fixo: Taumaturgia) — agora entram nas magias conhecidas do
  personagem mesmo em classes não conjuradoras. Excluídos da cota normal de truques da classe
  (não descontam nem duplicam) via `spellsByCircle`/`selectedSpellCountByCircle` no wizard.
  Limitação aceita: se o truque escolhido tiver ataque/CD (ex: Raio de Gelo) e a classe não for
  conjuradora, não há bônus de ataque/CD calculado pra ele — sem stat box na ficha.
- **Ferramenta de artesão do Anão**: escolha entre ferreiro/cervejeiro/pedreiro, nova coluna
  `character.chosen_tool_proficiency`, aparece em `proficiencies_and_languages.tools`.
- **Estilo de Combate do Guerreiro**: escolha entre os 6 estilos, nova coluna
  `character.chosen_fighting_style`. Só 3 dos 6 têm efeito mecânico real (mesmo padrão de "só
  automatizamos o que mapeia em cálculo já existente" usado no resto da Fase 3): Arqueria (+2
  ataque à distância), Defesa (+1 CA usando armadura), Duelo (+2 dano com uma arma corpo a corpo
  de uma mão, só se essa for a única arma da lista — aproximação, não existe conceito de "mão
  principal/secundária" no modelo de armas atual). Grande Arma (rerolagem de dano), Proteção
  (reação) e Combate com Duas Armas (mod. de dano na arma secundária) ficam só de exibição —
  exigiriam rerolagem de dado ou uma segunda arma "equipada" distinta, fora do escopo atual.

Não entrou nessa rodada: escolha do tipo de ancestral dracônico do Draconato (só afeta o tipo de
dano/resistência do sopro, sem número associado — mais cosmético).

**Atualização 2026-09-11/12 — Habilidades de Chi do Monge:** o usuário reportou que os pontos de
Chi apareciam na ficha, mas nenhuma habilidade pra gastá-los. Descoberta no caminho: as 3
características de nível 2 (Rajada de Golpes, Defesa Paciente, Passo do Vento) nem estavam
registradas em `featuresByLevel` — só um texto genérico de "Chi". Preenchidas com o texto exato
que o usuário colou do livro.

Implementado um catálogo `MONK_CHI_ABILITIES` (rules.ts) com as características **proativas**
(o jogador decide usar, sem depender de reagir a um gatilho): Rajada de Golpes/Defesa
Paciente/Passo do Vento (nível 2, 1 chi cada), Ataque Atordoante (nível 5, 1 chi), Corpo Vazio
— invisibilidade (nível 18, 4 chi) e projeção astral (nível 18, 8 chi). Exposto em
`character_sheet.chi_abilities`, com botão "USAR (N)" que gasta o custo de uma vez, reaproveitando
o mesmo endpoint de recurso consumível (`PATCH .../resource-uses`, que passou a aceitar qualquer
delta inteiro, não só ±1). Implementado tanto na ficha quanto nas ações da sessão (`player-
actions-modal`), igual ao pedido.

Ficaram de fora (continuam só como texto, sem botão de uso): **Defletir Projéteis** (nível 3) e a
rerolagem de **Alma de Diamante** (nível 14) — ambas são reativas (só fazem sentido em resposta a
um ataque/teste de resistência específico que já aconteceu), não uma ação proativa do tipo
"gastar N chi, quando eu quiser".

Ainda pendente da lista original de "efeito mecânico automático": **Ataque Extra** (dobrar/
triplicar ataques automaticamente na aba de combate). **Decisão do usuário (2026-09-10): não
implementar agora** — a ficha e o `session-panel` são dois sistemas de rolagem separados hoje (a
ficha rola local, a sessão tem feed de rolagens compartilhado + rastreamento de combate/
iniciativa pros participantes); o plano é futuramente trazer as opções de ação de classe (o que
inclui Ataque Extra) pra dentro do `session-panel`, então essa feature fica pra quando isso for
abordado, em vez de implementar duas vezes (uma na ficha isolada, outra na sessão).
