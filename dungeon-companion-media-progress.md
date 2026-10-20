# Progresso — Implementação do bloco "Média" da auditoria

Registrado em 2026-09-12. Continuação de `dungeon-companion-mechanics-audit.md`. Objetivo:
implementar todo o bloco "Média" (~55 itens), **exceto** deslocamento alternativo (voo), por
pedido explícito do usuário. Plano original salvo em
`/home/osmor/.claude/plans/luminous-exploring-hummingbird.md` (pode não sobreviver a limpezas —
este doc é a fonte de verdade durável).

## Estabilidade atual

- `npm run build` limpo nos dois repositórios (api e web) no estado atual.
- Pré-requisitos 1/2 + Ondas 1-9 já commitados e enviados (api: commit `883c710`; web: commit
  `2da230a`). Depois disso a sessão seguiu pra outras features (rolagem de dinheiro inicial, Tom
  assistente) — nada relacionado ao bloco "Média" foi implementado desde então.
- Migração de banco **já aplicada em produção** (script temporário rodado e apagado, convenção já
  usada nesta sessão): `ALTER TABLE character_level_history ADD COLUMN choice_data JSONB NULL` e
  `ALTER TABLE character ADD COLUMN chosen_pact_boon TEXT NULL`. Essas colunas existem no banco
  mas **ainda não são usadas por nenhuma feature** (só a Parte 2 do plano, pré-requisito pra
  telas de escolha futuras).
- Nenhuma regressão conhecida nas features já em produção (Fúria, Canalizar Divindade, Chi do
  Monge) — todas continuam funcionando, só passaram a usar a nova estrutura de lista em vez de
  recurso único.

## Concluído

### Pré-requisito 1 — Generalização de recursos rastreáveis
- `TRACKABLE_RESOURCES` (`rules.ts`): `Record<id_class, TrackableResource>` →
  `Record<id_class, TrackableResource[]>` — uma classe pode ter vários recursos ao mesmo tempo.
- `CharacterSheet.character_sheet.resource_tracker` (objeto único) → `resource_trackers: []`
  (lista) — backend e frontend (ficha + modal de ações da sessão) já adaptados.
- `maxTrackableResourceUses` foi refeita pra receber o dicionário de `resources` **já mesclado**
  (classe + subclasse) em vez do `classRule` inteiro — isso é o que permite um recurso existir
  só numa subclasse específica sem vazar pras outras (ex: Integridade Corporal só na Mão Aberta).
- Nova fórmula suportada em `resources`: `mod:CHA` ou `mod:CHA+1` (bônus baseado em modificador
  de atributo, não só número fixo por nível) — usada por Inspiração Bárdica (mod. CAR) e Sentido
  Divino do Paladino (1 + mod. CAR). Implementada em `maxTrackableResourceUses`.
- `ChiAbility` (o catálogo do Monge) ganhou `resourceKey` (de qual recurso consome) e
  `subclassId?` (se só existe numa subclasse específica) — `getKnownChiAbilities` agora aceita
  `idSubclass` e filtra por ele.
- `buildClassResources` (o campo informativo `class_resources`, ainda sem UI nenhuma) agora
  exclui as chaves que já pertencem a `TRACKABLE_RESOURCES`, pra não duplicar/mostrar fórmulas
  cruas tipo `mod:CHA` quando essa UI for construída.

### Pré-requisito 2 — Mecanismo genérico de escolha
- Migração aplicada (ver acima). `LevelUpConfirmInput`/`applyLevelUp` ganharam `choice_data`
  opcional de ponta a ponta (backend e frontend), gravado no INSERT do level-up.
- Novo `character.repository.ts`: `findChoiceData(idCharacter)`.
- **Ainda não tem nenhum consumidor** — a Dádiva do Pacto do Bruxo (que usaria isso) não foi
  implementada ainda (ver pendências).

### Onda 1 — Guerreiro
Retomar Fôlego (nv1), Surto de Ação (nv2, 2 usos no nv17), Indomável (nv9, 2 usos no 13, 3 no 17)
— os três agora rastreados (contador + usar/desfazer). Guerreiro não tinha nenhum recurso antes.

### Onda 2 — Bardo
Inspiração Bárdica rastreada com fórmula `mod:CHA`. Fonte de Inspiração (nv5) simplificada pra
sempre recarregar em descanso curto (RAW só vale a partir do nv5; motor não modela recarga
condicionada a nível — decisão aceita). Segredos Mágicos (nv10/14/18): novo campo
`spell_pool_any_class` no preview de level-up abre o pool de escolha de magia pra qualquer
classe conjuradora nesses 3 níveis específicos (wizard de level-up já atualizado).

### Onda 3 — Paladino
Sentido Divino (`mod:CHA+1`), Curar pelo Toque (pool `5×nível`, chave já existia parcialmente,
completada em todos os níveis), Toque Purificador (`mod:CHA`, a partir do nv14) — os três
recarregam só em descanso longo.

### Onda 4 — Feiticeiro
Pontos de Feitiçaria — os dados já estavam praticamente prontos no `resources` (só faltava
registrar em `TRACKABLE_RESOURCES`). Metamágica e Restauração Mística já tinham texto
informativo correto, não precisaram de mudança.

### Onda 5 — Mago
Recuperação Arcana rastreada (1×/dia, simplificado pra recarregar só em descanso longo — RAW é
"1×/dia" mas o motor não tem conceito de "dia", só descanso). **Deixado de fora**: Maestria de
Magias (nv18) e Assinatura Mágica (nv20) — exigem escolher magias específicas do grimório E
simular "conjurar de graça", escopo maior que não coube no padrão genérico de recurso.

### Onda 6 — Monge
Integridade Corporal (Mão Aberta, recurso subclasse-específico, motivou o refactor do
pré-requisito 1). Palma Vibrante, Artes Sombrias e Técnica de Mão Oculta plugadas no catálogo
`MONK_CHI_ABILITIES` (já ganham botão de usar). Artes Marciais (dado desarmado escalando) já
estava informativo desde antes desta sessão, nada a fazer.

### Onda 7 — Druida
Forma Selvagem (2 usos, recarrega curto/longo, vira ilimitado no nv20). Recuperação Natural
(Círculo da Terra, recurso subclasse-específico, 1×/descanso longo).

### Onda 8 — Ranger
Consciência Primitiva (nv3) — não precisou de código novo: já gasta um espaço de magia comum,
que já é rastreado pelo sistema de magia existente.

### Onda 9 — Bruxo (parcial)
Mestre Místico (nv20, 1×/descanso longo) rastreado. **Deixado de fora**: Dádiva do Pacto (a
escolha em si precisaria de uma tela nova inteira, do mesmo tamanho da implementação de Estilo
de Luta), Invocações Místicas (catálogo grande, ~já previsto pro final) e Arcana Mística
(precisaria de escolha de magia específica por nível + rastreio individual por magia, mais
complexo que um único contador).

## Pendente (ordem sugerida daqui pra frente)

1. **Guerreiro — Mestre de Batalha**: Superioridade em Combate (recurso "dados de superioridade"
   + catálogo de manobras — reaproveita o padrão `ChiAbility` genérico) e Estudioso da Guerra.
   **Cavaleiro Arcano**: Vínculo com Arma.
2. **Dádiva do Pacto do Bruxo** (nv3): implementar a escolha em si (Corrente/Lâmina/Grimório),
   reaproveitando o mesmo padrão de `fightingStyleChoice`/`toolProficiencyChoice` — já tem a
   coluna `chosen_pact_boon` pronta no banco, só falta todo o resto (tipo em `rules.ts`,
   validação em `build()`/`confirmLevelUp`, tela nova no wizard de level-up).
3. **Talentos com tela de escolha nova**: Resiliente (escolher atributo), ~~Afiar Habilidades
   (escolher 3 perícias/ferramentas)~~ — **feito em 2026-10-18** (versão 1.1.7, primeiro
   consumidor de `choice_data`; ver `dungeon-companion-status.md`), Iniciado em Magia (escolher
   classe + 2 truques + 1 magia de 1º círculo — maior escopo). Usam o mecanismo `choice_data` do
   Pré-requisito 2.
   Segredos Mágicos do Bardo já usa uma variante disso (mas via `new_spell_ids`, não `choice_data`).
4. ~~**Ataque Furtivo do Ladino na UI**~~ — **feito em 2026-10-16** (traços mecânicos, fase 2:
   "Somar ao dano" no modal de ataque da sessão, 1×/turno; ver `dungeon-companion-tracos-mecanicos.md`).
5. **Catálogos grandes** (deixar por último, cada um é como uma feature própria):
   Invocações Místicas do Bruxo, Metamágica do Feiticeiro em detalhe (hoje só o contador
   existe), Manobras do Mestre de Batalha do Guerreiro.

## Decisões/simplificações aceitas (importante lembrar ao continuar)

- Recargas condicionadas a nível (Fonte de Inspiração do Bardo, Restauração Feiticeira do
  Feiticeiro nv20) **não são modeladas** — o motor só sabe "recarrega em descanso curto" ou "só
  longo", fixo por classe, sem variar por nível.
- "Recuperar espaços de magia" (Recuperação Arcana, Recuperação Natural, Mestre Místico) rastreia
  só **se o uso já foi gasto hoje** — a escolha de qual espaço específico volta continua manual,
  via os controles de espaço de magia já existentes.
- Recursos podem ser subclasse-específicos desde o refactor da Onda 6 — usar
  `subclassRule.featuresByLevel[nível].resources` pra isso, exatamente como classe.
