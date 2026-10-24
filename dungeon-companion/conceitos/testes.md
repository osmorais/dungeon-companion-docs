---
resumo: Suítes unitárias (api: Mocha, web: Vitest) — como rodar, estrutura, o que está coberto.
tipo: conceito
status: ativo
atualizado: 2026-10-24
---

# Dungeon Companion — Testes unitários (regressão)

Criado em 2026-10-14. Suíte de testes unitários dos dois repositórios, feita pra rodar **a cada
nova implementação** e garantir que o que já existia continua funcionando. Nenhum teste toca o
banco de dados, a rede ou o browser — rodam em poucos segundos.

| Repo | Comando | Framework | Testes |
|---|---|---|---|
| `dungeon-companion-api` | `npm run test:unit` | Mocha + `@loopback/testlab` (should.js + sinon) | 433 (em 2026-10-22) |
| `dungeon-companion-web` | `npm run test:run` | Vitest (via `ng test`, builder `@angular/build:unit-test`) | 436 (em 2026-10-22) |

---

## Como rodar

### API (`~/projects/dungeon-companion-api`)

```bash
npm run test:unit
```

- Compila `src/` + `src/__tests__/` com `tsconfig.test.json` pra pasta `dist-test/` (gitignored,
  ignorada também pelo ESLint/Prettier) e roda o mocha em `dist-test/__tests__/unit/**/*.unit.js`.
- **Não** sobe a aplicação nem conecta no Postgres: os repositórios são substituídos por stubs
  (`createStubInstance`). O `PostgresDatasource` só abre conexão sob demanda, então importar os
  repositórios nos testes é seguro.
- Rodar um arquivo só (depois de já ter compilado com o comando acima):
  ```bash
  npx mocha dist-test/__tests__/unit/services/combat.service.unit.js
  ```
- Filtrar por nome de teste: `npx mocha "dist-test/__tests__/unit/**/*.unit.js" -g "level-up"`.
- Lint dos testes: `npx eslint src/__tests__` (o `.eslintrc.js` inclui o `tsconfig.test.json` no
  `parserOptions.project` — sem isso o ESLint dava erro de parsing em qualquer arquivo de teste).

**Atenção:** `npm test` (o script antigo do template LoopBack) é outra coisa — faz rebuild
completo, sobe a aplicação pros testes de aceitação em `src/__tests__/acceptance` (precisa de
banco/`.env`) e roda o lint inteiro do projeto, que tem débito de prettier pré-existente. Pra
regressão do dia a dia, usar `npm run test:unit`.

### Web (`~/projects/dungeon-companion-web`)

```bash
npm run test:run      # roda uma vez e sai (equivale a ng test --watch=false)
npm test              # modo watch (fica rodando a cada alteração)
```

- Especificações ficam ao lado do código, com sufixo `.spec.ts`.
- `npx vitest run <arquivo>` sozinho **não** roda os specs (falha sem testes: o ambiente do
  Angular vem do builder `@angular/build:unit-test`). Rodar a suíte com `npm run test:run`.
- Fábricas de dados de teste ficam em `src/testing/session-fixtures.ts` — essa pasta está
  excluída do build da aplicação em `tsconfig.app.json`, então nunca entra no bundle.

### Rotina sugerida a cada implementação

```bash
cd ~/projects/dungeon-companion-api && npm run test:unit && npm run build
cd ~/projects/dungeon-companion-web && npm run test:run && npm run build
```

---

## Estrutura dos arquivos

### API — `src/__tests__/unit/`

```
fixtures.ts                               # fábricas: stats, armour, weapon, spell, skill,
                                          #   characterInput (criação), rawCharacter (como vem do banco),
                                          #   DB_SKILLS/dbSkill (tabela skill), persistedFromCreation
                                          #   (espelho dos INSERTs de createCharacter)
character-sheet/calculator.unit.ts        # funções puras do motor de regras
character-sheet/rules.unit.ts             # integridade das tabelas de dados (rules.ts / feats.ts)
services/character-sheet.service.unit.ts  # criação, level-up, recursos, descansos, magia, equipamento
services/character-creation.unit.ts       # criação → gravação → ficha carregada (todas as combinações)
character-sheet/spell-mechanics.unit.ts   # catálogo de mecânica de magia + dados por círculo/nível
character-sheet/ability-mechanics.unit.ts # o que o "USAR" das habilidades de classe faz
character-sheet/combat-features.unit.ts   # traços no ataque (crítico, somas, ataque poderoso, desarmado)
services/combat.service.unit.ts           # iniciativa, turnos, atraso, adicionar participantes
services/game-session.service.unit.ts     # visibilidade, PV, monstros, XP, rolagens
services/account.service.unit.ts          # perfil, exportação e exclusão de conta (LGPD)
services/image-cleanup.service.unit.ts    # limpeza de imagens órfãs no storage
services/monster-catalog.service.unit.ts  # imagem do catálogo (trocar/remover)
services/rate-limit.service.unit.ts       # limite de tentativas + IP do cliente
services/character-options.service.unit.ts # perícias do antecedente (nome e id da tabela skill)
services/secret-roll-requests.unit.ts     # pedidos de teste secreto (uso único, dono, validade)
services/auth.service.unit.ts             # hash do token de redefinição de senha
```

### Web

```
src/testing/session-fixtures.ts                          # player, npc, monster, roll, participant, combat, sessionDetail
src/app/services/session-event.reducer.spec.ts           # reducer dos eventos do socket
src/app/constants/rules-constants.spec.ts                # constantes de regras (espelho do backend)
src/app/session-panel/session-panel.component.spec.ts    # lógica do painel de sessão
src/app/character-sheet/character-sheet.component.spec.ts # lógica da ficha (círculos de magia)
src/app/game-card/spell-card.spec.ts                      # magia → carta, escola, cor da carta
src/app/game-card/weapon-card.spec.ts                     # arma → carta, categoria, cor por dano
src/app/game-card/game-card.component.spec.ts             # LER TUDO / RECOLHER
src/app/game-card/card-viewer.component.spec.ts           # carta em tela cheia (Esc)
src/app/spell-cast/spell-cast-stage.model.spec.ts         # dados do aviso de lançamento
src/app/spell-cast/spell-cast-context.spec.ts             # etapa com magia ou arma, verbo do aviso
src/app/spell-cast/spell-cast-stage.component.spec.ts     # carta virada, dados rolando, revelação
src/app/game-card/card-hand.component.spec.ts             # a "mão": navegação, arrastar, clique fora
src/app/spell-catalog-list/spell-grimoire.component.spec.ts # grimório do mestre: busca, páginas, Esc
src/app/app.spec.ts                                      # smoke test: o app é criado
src/app/legal/legal-info.spec.ts                         # constantes/rotas da privacidade e termos
src/app/legal/legal-page.component.spec.ts               # página de privacidade/termos
src/app/auth/signup/signup.component.spec.ts             # aceite de termos + idade no cadastro
src/app/account/account.component.spec.ts               # página Minha Conta (LGPD)
src/app/auth/auth-errors.spec.ts                         # mensagens de erro da API + senha mínima
src/app/services/google-identity.service.spec.ts         # carregamento sob demanda do login Google
src/app/character-wizard/character-wizard.component.spec.ts # perícias do antecedente no wizard
src/app/modal-burst/modal-burst.component.spec.ts        # explosão na entrada dos modais da sessão
src/app/secret-roll/secret-roll.spec.ts                  # teste secreto (mestre pede, jogador rola)
src/app/player-actions-modal/player-actions-modal.component.spec.ts # "USAR" das habilidades
src/app/roll-modal/spell-roll-config.spec.ts             # magia → configuração do modal de rolagem
```

---

## O que está coberto

### API — motor de regras (`calculator.unit.ts`)

- **Normalização e resolução**: `normalizeKey`/`normalizeSkill` (português → chave interna);
  resolver raça/classe/antecedente/sub-raça/subclasse por id, com erro pra id inexistente;
  subclasse só é achada dentro da própria classe.
- **Modificador e proficiência**: tabela de modificadores do PHB; bônus de proficiência 2→6 nos
  níveis certos.
- **Atributos**: bônus de raça + sub-raça; atributo ausente cai pra 8; Campeão Primitivo (Bárbaro
  nv20, +4 FOR/CON, máx. 24).
- **Testes de resistência**: Alma de Diamante (Monge nv14), Aura de Proteção (Paladino nv6, mín.
  +1), Mente Escorregadia (Ladino nv15), montagem dos blocos de atributo.
- **Deslocamento**: Movimento Rápido (Bárbaro nv5, perde com armadura pesada), Deslocamento sem
  Armadura do Monge (tabela por nível, perde com armadura/escudo), formatação com vírgula.
- **CA**: sem armadura (normal, Bárbaro com CON, Monge com SAB, Linhagem Dracônica 13+DES),
  armadura leve/média (DES limitado)/pesada, escudo +2, Estilo Defesa +1 só com armadura.
- **PV**: PV máximo (dado cheio no nv1 + média nos seguintes, mínimo 1), PV rolado no level-up,
  Resiliência Dracônica.
- **Armas**: atributo usado (FOR, acuidade = maior, munição = DES), Arqueria (+2 ataque à
  distância), Duelo (+2 dano só com uma única arma de uma mão).
- **Traços**: features de classe/subclasse acumuladas por nível; texto do Estilo de Luta
  escolhido (Guerreiro e Paladino); CDs fixas calculadas (Presença Intimidante, Tranquilidade).
- **Conjuração**: não conjurador; Mago nv1 (CD, ataque, espaços, gastos, magias por círculo,
  máximo preparado); Paladino nv1 sem espaços; Cavaleiro Arcano (INT + tabela de terço-conjurador).
- **Idiomas e perícias**: idiomas à escolha do antecedente sem duplicar; perícias treinadas
  (escolhidas + antecedente + raça) sem duplicar.

### API — integridade das tabelas (`rules.unit.ts`)

Pega erros de digitação/cópia no `rules.ts` (arquivo de ~4.500 linhas editado à mão):

- As 12 classes existem, com `featuresByLevel` completo do nível 1 ao 20.
- Níveis de ASI (padrão 4/8/12/16/19; Guerreiro +6/14; Ladino +10).
- Nível de escolha de subclasse por classe (Bruxo/Clérigo/Feiticeiro 1, Druida/Mago 2, resto 3);
  toda classe tem subclasses com ids únicos.
- Estilo de Luta: Guerreiro nv1, Paladino/Ranger nv2 (Paladino sem Arqueria).
- Espaços de magia de 1 a 20 pra toda classe conjuradora e pro terço-conjurador; valores-chave
  (conjurador completo, Bruxo, Paladino); grupos de conjurador sem sobreposição; grimório do Mago.
- Recursos rastreáveis: número fixo / "Ilimitadas" / ausente / fórmula `mod:CHA(+N)`; **toda
  chave de `TRACKABLE_RESOURCES` existe em algum `resources`** de classe ou subclasse; valores por
  nível (Fúrias, Surto de Ação, Indomável, Chi, Curar pelo Toque, Canalizar Divindade do Paladino,
  Forma Selvagem); tipo de recarga (curto/longo).
- Habilidades ativáveis: filtro por nível, habilidade de subclasse só pra subclasse certa
  (Palma Vibrante × Artes Sombrias), **toda habilidade aponta pra um recurso válido da classe**.
- XP: tabela do PHB e XP do próximo nível; Segredos Mágicos (Bardo 10/14/18).
- Talentos: chave = `id_feat`; bônus mecânicos (Vigoroso, Alerta, Observador).

### API — ficha de personagem (`character-sheet.service.unit.ts`)

- **Criação (`build`)**: ficha completa de um Humano Guerreiro nv1 (PV, CA, iniciativa,
  deslocamento, proficiência, salvaguardas, ouro, XP, recursos); riqueza inicial (soma + valores
  inválidos); trava de criação só no nível 1; Estilo de Luta obrigatório/proibido; ferramenta do
  Anão; Anão da Colina (+1 PV, 7,5m); subclasse obrigatória (Clérigo) / proibida (Bárbaro) na
  criação; Linhagem Dracônica; Bárbaro (Fúrias, `class_resources`, CA com CON); Bardo
  (Inspiração = mod. CAR); Ladino (Ataque Furtivo); Monge nv1; percepção passiva; armadura +
  escudo + Defesa.
- **Level-up — travas**: personagem inexistente; só dono ou mestre da sessão; nível 20; XP
  insuficiente.
- **Level-up — preview**: Guerreiro 1→2, 2→3 (subclasses), 3→4 (talentos); Cavaleiro Arcano
  (espaços + magias); Paladino 1→2 (Estilo de Luta, lista cheia); Bardo 2→3 (Aptidão), 9→10
  (Segredos Mágicos); Mago 1→2 (grimório +2, escolas); subclasse inválida.
- **Level-up — confirm**: PV ganho e dados gravados; dado fora do intervalo; requisição
  duplicada; subclasse e Estilo de Luta obrigatórios/proibidos; ASI (soma 2, limites, fora do
  nível); talentos (desconhecido, com atributo, Vigoroso retroativo e nos níveis seguintes); CD e
  ataque de magia recalculados com ASI; magias novas (limite, já conhecida, duplicada, classe
  não conjuradora); Aptidão (quantidade, duplicada, perícia não treinada ou já especialista).
- **Recursos consumíveis**: gastar/desfazer limitado ao máximo/mínimo; delta inválido; recurso
  de outra classe ou ainda não liberado; Integridade Corporal só na Mão Aberta; permissão.
- **Descansos**: curto (cura dado + CON, recarrega só recursos de descanso curto, não passa do
  máximo, travas); longo (PV cheio, metade dos dados de vida mín. 1, espaços e recursos zerados,
  exige PV > 0).
- **Espaços de magia**: gastar/devolver com limite; delta inválido; círculo sem espaço.
- **Equipamento**: CA recalculada; armadura/escudo sem proficiência bloqueados.

### API — criação → ficha gravada (`character-creation.unit.ts`, 2026-10-16)

Simula o caminho completo sem banco: payload no formato do wizard → `createCharacter` →
`persistedFromCreation` (o que os INSERTs gravariam) → `loadCharacter`.

- **Matriz completa**: as 13 variações de raça/sub-raça × as 21 de classe/subclasse (Bruxo,
  Clérigo e Feiticeiro com cada subclasse do nível 1) × os 13 antecedentes (3.549 fichas, um
  teste por classe/subclasse). Em cada uma, a ficha carregada precisa **bater com a calculada na
  criação** (cabeçalho, PV/CA/iniciativa/deslocamento, atributos e salvaguardas, armas, traços,
  proficiências e idiomas, equipamento e ouro, recursos, habilidades, conjuração) **e refletir as
  escolhas**: atributos = base + raça + sub-raça, PV pelo dado da classe + CON (+ Anão da Colina /
  Linhagem Dracônica), perícias escolhidas treinadas e bônus corretos, especialização, ferramenta
  do Anão, traços de raça/sub-raça/classe/subclasse/antecedente, estilo de luta, truque racial e
  magias da classe, CD/ataque de magia, ouro rolado + do antecedente.
- **Escolhas específicas**: os 6 Estilos de Luta gravados e com efeito (Defesa com armadura,
  Arqueria, Duelo); as 3 ferramentas do Anão; Especialização do Ladino e Bênção do Conhecimento
  (válidas e inválidas, sem gravar nada quando inválidas); armaduras leve/média/pesada + escudo;
  Defesa sem Armadura (Bárbaro/Monge); magias do Mago por círculo; Clérigo com lista cheia sem
  preparar; truque racial em classe não conjuradora; avatar; nome padrão.
- **Validações antes de gravar**: sub-raça obrigatória/inválida (chave ou nome de exibição),
  raça/classe/antecedente inexistentes, subclasse inválida, dono da ficha.
- **Bugs achados pela matriz e corrigidos em 2026-10-16** (testes de regressão): as perícias do
  antecedente não ficavam treinadas na ficha gravada (o wizard não as manda em `choices.skills`;
  agora `computeSkills` marca as do antecedente e as fixas da raça) e a percepção passiva caía
  depois de gravar; `normalizeSkill('Atuação')` não virava `performance` (em `calculator.unit.ts`).
  Fichas criadas antes da correção continuam sem essas perícias no banco.

### Magias com rolagem (2026-10-16)

- API `spell-mechanics.unit.ts`: integridade do catálogo (ataque tem tipo, dados válidos, nomes
  únicos, truque não escala por círculo); truque ×1–×4 por nível; Rajada Mística com feixes por
  nível; "Em Níveis Superiores" (+1 dado/círculo, Arma Espiritual a cada 2 círculos + mod.);
  raios do Raio Ardente; dardos dos Mísseis; Mão de Bigby; `buildSpellRoll` (chaves por círculo,
  acerto automático sem bônus, magia sem mecânica). Em `character-sheet.service.unit.ts`: ficha
  de conjurador ganha `roll` só nas magias cadastradas; classe não conjuradora fica sem.
- Web `spell-roll-config.spec.ts`: sem mecânica → `null`; truque usa a chave "0"; círculo
  escolhido; raios viram `instances`; acerto automático junta os dardos; variante no nome.
  `roll-modal.component.spec.ts`: acerto automático abre no dano; vários raios (ataque/dano por
  raio, erro oferece o próximo, último encerra, "encerrar" antes do fim, título com progresso).
- Fase 2 (resistência): API — integridade (atributo sempre; "passou" só com dano; fora do
  catálogo as que somam dano em arma e o Contato Extraplanar), Bola de Fogo com CD do personagem,
  truques de resistência por nível, Onda Troveante +1d8 (livro), bônus fixo (Desintegrar/Dedo da
  Morte), dados extras (Tempestade de Gelo), dano total sempre, resistência sem dano;
  `announceSpellCast` com CD/atributo validados juntos. Web — `spellRollConfig` de resistência,
  dados extras, sem dano → sem modal mas com CD no anúncio, `saveNote`; modal com linha da CD,
  dano de quem passa (só quando é metade) e dados extras.
- Fase 3 (cura): API — integridade (cura tem dados de cura, sem dano/resistência), Curar
  Ferimentos por círculo, Vitalidade Falsa (PV temporários +5/círculo), Aura de Vitalidade e
  Regeneração, Discípulo da Vida (+2 + círculo, não em PV temporários nem em dano) e Cura Suprema
  (nv17); `addRoll` aceita `heal`. Web — `spellRollConfig` de cura/PV temporários/Cura Suprema;
  modal registra `heal`, não dispara impacto de dano e usa o máximo com a Cura Suprema.
- Fase 4: API — magias que somam dano (Destruições só no próximo acerto, com CD e tipo de
  ataque; Lancinante escala; Banidora 5d6 sem resistência; Bruxaria/Marca do Caçador em todo
  acerto), Lâmina Flamejante. Web — `spell-riders.spec.ts` (opções por tipo de ataque, espaço
  disponível, magia preparada, `isOnHitSpell`); modal: crítico dobra os dados e não o
  modificador, "Somar ao dano" (Destruição gasta o espaço e soma, contínua só soma, só no
  primeiro raio), aplicar no alvo (sem alvos encerra como antes; com alvos espera o CONCLUIR,
  inteiro/metade em vários alvos, PV temporários só em quem aceita, erro não oferece);
  `session-panel`: alvos do mestre × do jogador, dano/cura/PV temporários aplicados com as regras
  de PV, NPC/monstro limitados.
- Efeitos de tela das magias: `services/spell-effect.spec.ts` (rótulo → elemento, vários tipos,
  crítico/raios no rótulo, arma sem efeito, cura/PV temporários); `spell-impact.component.spec.ts`
  (partículas por intensidade, classes do elemento, névoa/brilhos/valor, variante de PV
  temporários); serviço com `effect` e duração maior da cura; impacto escolhe magia × golpe;
  modal e toast passam tipo/rótulo (cura agora dispara).

### Traços mecânicos (2026-10-16)

Fases 1 a 3 descritas em `dungeon-companion/conceitos/tracos-mecanicos.md` (seção "Status"). Fase 4:
- API `combat-features.unit.ts`: dado da Inspiração Bárdica por nível; lembretes de vantagem
  (raça/subraça, Sentido de Perigo, Fúria); defesas (resistências por raça e Fúria, Esquiva
  Sobrenatural nv5, Evasão nv7). `ability-mechanics.unit.ts`: `targets_ally` só na Inspiração.
  `character-sheet.service.unit.ts`: consumir a inspiração (422 sem ela).
  `game-session.service.unit.ts`: `grantBardicInspiration` (permissão, só bardo, aliado fora da
  sessão, a si mesmo, grava o dado do nível).
- Web `roll-modal.component.spec.ts`: Indomável só em resistência; Inspiração soma o dado e vai
  pro log; lembretes; resistência do alvo (metade), Evasão (0 / metade), Esquiva só contra ataque.
  `player-actions-modal.component.spec.ts`: lembretes por atributo, Inspiração/Indomável nas
  opções do d20, fluxo do aliado, tipo de dano da arma. `session-panel.component.spec.ts`: aliados
  e defesas nos alvos. `spell-roll-config.spec.ts` passou a esperar `damageType`/`save.ability`.

### Criação: validação das escolhas e itens iniciais (2026-10-16)

- API `creation-rules.unit.ts`: cota de perícias igual à do web; Meio-Elfo (aceita 2 diferentes;
  recusa faltando, repetido, CAR, inválido; outra raça não escolhe); perícias (cota, repetida,
  fora da lista, Bardo livre, Meio-Elfo com 2 livres); magias (cota por classe + truque racial;
  recusa inexistente, repetida, círculo alto, cota estourada); armadura (classe, "não-metal",
  Anão da Montanha, domínios com pesada; recusa sem proficiência).
- API `character-creation.unit.ts`: payload fora das regras → 422 sem gravar (Meio-Elfo,
  perícias, magias, armadura/escudo, Clérigo da Vida × da Luz); Meio-Elfo grava o +1. O payload
  das combinações passou a mandar a escolha do Meio-Elfo; `fixtures.spell()` registra o círculo
  pro stub de `findSpellLevelsByIds`.
- API `starting-items.unit.ts`: todo nome de classe/antecedente mapeado; todo item de destino
  existe no seed; inventário do Guerreiro Soldado; somas (Mago Sábio, Clérigo Acólito); sem
  antecedente. `game-session.service.unit.ts`: `addPlayer` passa os itens do kit; sem
  personagem, nenhum.
- Web `character-wizard.component.spec.ts`: botões do Meio-Elfo (2, sem CAR, troca de raça
  limpa); armadura por sub-raça/domínio (trocar o domínio tira a armadura); Meio-Elfo só com 2
  perícias fora da lista. `rules-constants.spec.ts`: tabelas espelhadas da API.
- Pendências da criação: API — `creation-rules.unit.ts` (lista da classe vazia pra quem não
  conjura, magia fora da lista recusada, truque racial fixo/Alto Elfo aceito só como truque,
  listas iguais às do web por contagem/soma); `character-creation.unit.ts` (Bardo com magia de
  outra classe → 422, Tiefling com Taumaturgia passa; armas do kit entram sem repetir); os
  testes passaram a usar ids reais de magia (`fixtures.classSpell`, círculos lidos do seed);
  `starting-items.unit.ts` (todo item fora do inventário é arma mapeada/armadura/escudo/dinheiro,
  toda arma do kit existe no seed, armas por classe/antecedente); `character-options` manda
  `starting_weapons`. Web — wizard (armas do kit marcadas/travadas e fora do payload) e
  `rules-constants.spec.ts` (mesma contagem/soma das listas de magia).

### Talento Habilidoso (2026-10-18)

- API `character-sheet.service.unit.ts` ("Habilidoso"): preview com `proficiency_choice` (e
  `null` nos outros talentos); 2 perícias + 1 ferramenta treinam as perícias e vão pro
  `choice_data`; quantidade errada, repetida, já treinada, inexistente, ferramenta fora da lista
  e sem escolha → erro; outro talento não aceita perícias; ferramenta do talento aparece na ficha.
- Web `level-up-modal.component.spec.ts` (novo): página só pro talento que escolhe, perícias não
  treinadas, limite de 3, payload com `skill_ids`/`tools`, trocar de talento limpa.

### Aviso de subir de nível com vários personagens (2026-10-18)

- Web `session-panel.component.spec.ts` ("aviso de subir de nível"): vários avisos seguidos
  viram um só com todos os nomes, sem repetir e sem trocar a `key`; texto "SUBIRAM" com "E";
  some sozinho; um só = "SUBIU"; depois de fechar, o próximo abre um aviso novo.

### Aviso de troca de vez em tela cheia (2026-10-18)

- Web `turn-change-toast.component.spec.ts`: mostra rodada, "VEZ DE", quem sai e a foto de quem
  entra; "É A SUA VEZ!" e sem card de saída; clique fecha. `session-panel.component.spec.ts`
  ("aviso de troca de vez"): card do jogador com foto; monstro escondido "misterioso" pro jogador
  e com imagem pro mestre; "É A SUA VEZ" só pro dono; some sozinho.

### Animação na troca de vez (2026-10-18)

- Web `session-panel/turn-transition.spec.ts`: quando animar (vez passa no mesmo combate; não ao
  começar, terminar, repetir ou trocar de combate); posições relativas à lista e conversão pra
  tela depois de rolar a página; sem Web Animations só pulsa o destino (e a classe sai depois);
  com Web Animations o marcador sai da posição antiga, vai até o card novo e some ao terminar;
  destino inexistente não faz nada. (jsdom não tem `Element.animate`: o teste define um stub.)
- Instabilidade corrigida em `roll-modal.component.spec.ts` ("impacto de dano"): o d20 era
  sorteado de verdade e um 20 natural (5%) virava crítico, mudando rótulo e notação do dano —
  o bloco agora fixa `Math.random` (mesma correção feita antes no teste de crítico).

### Conjuração longa em combate (2026-10-18)

- Web `player-actions-modal.component.spec.ts`: `isLongCastingTime` (minuto/hora sim; ação, ação
  bônus, reação, vazio não); em combate pede confirmação e cancelar não gasta o espaço;
  confirmar lança; fora de combate lança sem perguntar.

### Quadro do Mestre (2026-10-20, versão 1.2.0)

Contexto: [`quadro-do-mestre.md`](quadro-do-mestre.md).

- Web `dm-board/dm-board.component.spec.ts`: nome do monstro (apelido / slug em Title Case);
  status do combate; contador de revelados; fechar; rolagens ocultas (filtro e etiqueta
  SECRETO/OCULTA); visão do grupo (PV da sessão + CA/PP/CD/efeitos da ficha, Inspiração Bárdica,
  ficha que falha vira "—", sem personagem não busca); descanso (todos marcados, jogadores e NPCs
  separados, desmarcar, pulados com motivo, erro da API, nada marcado não chama); área (metade
  arredonda pra baixo, 0 sai da lista, emitir limpa, valor inválido); anotações (carregar,
  pendente, salvar, salvar no `ngOnDestroy`, falha ao carregar bloqueia salvar); apagar sessão
  (código certo/errado, erro da API, não salva anotação de sessão apagada). O mock de
  `GameSessionService`/`CharacterService` repassa pra variável do teste porque vários testes trocam
  o mock depois do `configureTestingModule`.
- Web `session-panel.component.spec.ts`: dano/cura em área (valor por alvo, PV temporário primeiro,
  cura de jogador para no máximo sem pedir PV temporário, alvo ausente ignorado); sessão apagada
  (jogador vê o aviso, mestre não).
- Api `game-session.service.unit.ts`: `partyRest` (validação, só mestre, longo pula 0 PV e mantém
  PV temporário nos eventos, curto só recarrega, sem descanso não avisa); anotações (só mestre lê
  e grava, branco vira `null`, tipo e limite de 10.000); `deleteSession` publica `session_deleted`
  só quando apagou.
- Api `character-sheet.service.unit.ts`: `shortRest` recarrega só recursos de descanso curto sem
  mexer em PV; bruxo recupera a Magia de Pacto no `shortRest` e no `rollHitDie` (e outra classe
  não).
- Os testes unitários **não** pegam erro de injeção de dependência (ver `gotchas.md`).

### Nome de usuário (2026-10-24, versão 1.9.0)

- Api `username.service.unit.ts` (novo): regras de formato, base e candidatos das sugestões; livre,
  em uso (sem maiúsculas), formato inválido com sugestões, o próprio nome na troca, 422/409 com
  `details.suggestions`, corrida no índice único (`23505`) → 409.
- Api `auth.service.unit.ts`: cadastro grava o nome de usuário, nome em uso não cria, corrida vira
  409, `/auth/me` devolve `username` (bcrypt substituído por stub). `account.service.unit.ts`:
  troca do nome, 409 passa adiante, tipo errado 422, perfil sem nome. `game-session.service.unit.ts`:
  `createSession` e `addPlayer` usam o nome de usuário e recusam conta sem nome (422).
- Web `username.spec.ts`, `username-status.component.spec.ts` (espera entre teclas com relógio
  simulado, livre/em uso/inválido/nome atual/sem resposta/vazio) e `choose-username.component.spec.ts`
  (novos); casos novos em `auth.guard.spec.ts` (redireciona pra `/nome-de-usuario`),
  `auth.service.spec.ts`, `signup.component.spec.ts`, `account.component.spec.ts` e
  `loading-states.spec.ts` (entrar/criar sessão sem nome).

### Tela inicial e sessão expirada (2026-10-24, versão 1.8.1)

- `auth.guard.spec.ts`: com o `AuthService` real e o `/auth/me` respondendo 401 ou 500, o
  `loggedInMatch` devolve `false`, apaga o token e não navega; no `authGuard` o 401 continua indo
  pro `/login`. `auth.service.spec.ts`: `clearSession(null)` só limpa; SAIR leva pro `/login`
  (1.8.2 — o teste da 1.8.0 esperava `/`).
- `landing.component.spec.ts`: personagem de exemplo (meio-orc bárbaro, sem cabelo/barba, pele
  original), avatar dentro do anel, XP antes da vida.
- `avatar-display.component.spec.ts` (novo): `basePath` troca só a base; sem cabelo/barba não monta
  as camadas.

### Grimório do mestre (2026-10-22, versão 1.6.6)

- Web `spell-grimoire.component.spec.ts` (novo): carrega o catálogo em cartas (20 por página); busca
  com espera e volta pra página 1; paginação não passa das pontas; Esc fecha, mas não junto com a
  carta em tela cheia.

### Baralho e mão (2026-10-22, versão 1.6.5)

- Web `card-hand.component.spec.ts` (novo): começa na primeira e não passa das pontas; posição no
  carrossel; setas/Esc; arrastar > 50px; mão que encolhe; clique fora fecha (botão e carta não);
  clique logo depois de arrastar não fecha. `player-actions-modal`: mão de magias prontas
  (truques + preparadas, na ordem); ATACAR na mão fecha a mão (substituiu o teste da tela cheia
  de arma).

### Cartas viradas e rolagens com impacto (2026-10-22, versão 1.6.2)

- Web `spell-cast-stage.component.spec.ts` (novo, timers falsos): nenhuma rolagem enquanto a carta
  vira; dados rolando e depois o total; dano treme e ataque não; várias rolagens uma por vez.
  `session-panel`: impacto de dano toca uma vez, no total revelado, e não no ataque.

### Ataque com arma no aviso (2026-10-22, versão 1.6.1)

- Web `weapon-card.spec.ts`: ida e volta da carta da arma (ficha → evento → mesa) e do desarmado.
  `spell-cast-context.spec.ts` (novo): etapa manda `weapon` sem `id_spell`; verbo LANÇOU/ATACOU COM.
  `player-actions-modal`: ataque na gaveta abre o modal com a carta da arma e emite `ownCast`.
  `session-panel`: aviso "ATACOU COM" montado do evento.
- API `game-session.service.unit.ts`: publica com arma sem buscar magia; exige magia **ou** arma e
  valida a carta da arma.

### Armas em cartas (2026-10-22, versão 1.6.0)

- Web `weapon-card.spec.ts` (novo): simples × marcial (sem ligar pra acento/caixa); carta da arma
  (bônus, arte, faixa, dano com modificador, peso); arma fora do catálogo usa o ícone; cor por tipo
  de dano; carta do desarmado. `player-actions-modal.component.spec.ts`: ATACAR na carta em tela
  cheia fecha a carta e abre a rolagem.

### Cartas de magia e aviso de lançamento (2026-10-21/22, versões 1.4.0 e 1.5.0)

- Web `spell-card.spec.ts`: escola com acento/desconhecida, carta da magia (truque, sem escola,
  PREPARADA), as três cores. `card-viewer`: Esc fecha. `game-card`: LER TUDO/RECOLHER.
- Web `player-actions-modal.component.spec.ts`: grimório abre em CARTAS e a tela cheia acompanha o
  PREPARAR; lançamento sem dados vai `done` pra mesa; com dados abre o modal com o palco e emite
  `ownCast`.
- Web `roll-modal.component.spec.ts` ("lançamento de magia"): ataque pendente → acertou → dano →
  `done` uma vez; erro manda ERROU; rolagem comum sem etapa nem `cast_id`.
- Web `session-panel.component.spec.ts` ("aviso do lançamento de magia"): rolagem do lançamento não
  vira aviso avulso; 8 s após terminar; etapa atrasada; fila; quem lançou não vê; tempo máximo.
- Web `spell-cast-stage.model.spec.ts`, `session-event.reducer.spec.ts` (`spell_cast_stage`).
- API `game-session.service.unit.ts`: `publishSpellCastStage` (publica com a carta, valida, exige
  permissão e magia) e `cast_id` no `addRoll` (só no evento, validado).

### Ações reorganizadas e grimório (2026-10-21, versão 1.3.18)

- Web `player-actions-modal.component.spec.ts` ("grimório", novo): abre em PRONTAS e volta às
  ações; abas e magias por aba pra quem prepara; TODAS pra quem não prepara; cor do card
  (pronta / dá pra preparar / bloqueada sem vaga ou em combate).
- Web `session-panel.component.spec.ts`: "gaveta de ações: destaque" (PV ao vivo com temporário,
  NPC sem PV ao vivo, personagem da vez, ITENS abre o próprio inventário) e "volta da ficha aberta
  pelas ações" (`fromActions` na ida, reabrir + limpar URL na volta).
- Web `character-sheet.component.spec.ts` ("voltar"): com `fromActions` volta reabrindo as ações;
  sem, volta sem reabrir.
- Saiu `character-drawer.component.spec.ts` (3 testes): a gaveta intermediária virou só a barra.

### Sessão no celular com gavetas (2026-10-21, versão 1.3.16)

- Web `character-drawer.component.spec.ts` (novo): começa recolhida; o botão fecha a gaveta antes
  de emitir; Esc recolhe.
- Web `session-panel.component.spec.ts` ("celular: gaveta AÇÕES DE PERSONAGEM e rolagens"): mestre
  sem gaveta de personagem, jogador com a do próprio personagem, jogador sem personagem sem
  gaveta, rolagens começam recolhidas.

### Ficha no padrão visual (2026-10-21, versão 1.3.14)

- Web `character-sheet.component.spec.ts` (novo, primeiro da ficha): truques e círculos começam
  fechados; clicar abre e fecha só o círculo clicado. Instancia o componente sem `id` (não busca
  a ficha), com `CharacterService` vazio.

### Troca de vez com o card inteiro (2026-10-21, versão 1.3.13)

- Web `turn-change-toast.component.spec.ts`: card inteiro de jogador (moldura, jogador, classe,
  nível, PV, foto de fundo) e monstro só com imagem.
- Web `session-panel.component.spec.ts`: `turnCardFor` monta os dados de ficha do jogador.

### Tom sem spoiler (2026-10-21, versão 1.3.12)

- Web `session-panel.component.spec.ts` ("reação do Tom às rolagens"): com duas rolagens chegando
  juntas, o Tom comenta só a que está no aviso; ao fechar o aviso, comenta a próxima.

### Magias preparadas no início da luta (2026-10-21, versão 1.3.11)

- Api `character-sheet.service.unit.ts` ("preparar magia × combate"): antes de rolar a
  iniciativa pode; já na ordem de turnos recusa (409) sem gravar.
- Web `session-panel.component.spec.ts` ("magias preparadas antes da luta"): recusa da API volta
  o checkbox e mostra a mensagem; limite atingido não chama a API; preparo aceito conta.

### Menu inicial numa tela só (2026-10-21, versão 1.3.9)

- Web `home/home.component.spec.ts`: começa sem papel; abre/troca/fecha papel com as opções
  certas; Grimório fora das opções do mestre; cada opção navega e CRIAR PERSONAGEM trava
  enquanto busca.

### Lista de personagens completa (2026-10-21, versão 1.3.7)

- Web `character-list/character-card.spec.ts`: card montado da ficha com atributos na ordem do
  livro; "pode subir de nível" (e nível 20 não sobe); barra de XP; sinal do modificador; a lista
  busca a ficha de cada personagem e tolera ficha que falha.

### Monstro revelado entra no combate (2026-10-21, versão 1.3.4)

- Api `game-session.service.unit.ts` ("revelar com combate em andamento"): entra via
  `addParticipants` como monstro; já participante não entra de novo; sem combate só revela;
  quem não é mestre é barrado antes de consultar o combate.

### Ícones em pixel art (2026-10-21, versão 1.3.3)

- Web `session-panel.component.spec.ts`: `turnBanner` — mestre na vez de NPC precisa agir (d20),
  na vez de jogador só aguarda.

### Carregamento sem overlay bloqueante (2026-10-20, versão 1.3.1)

- Web `loading-overlay/flying-dragons.spec.ts`: limites do sorteio (`randomDragon`: altura 5–65%,
  sentido, 3,5–6 s, 140–220 px); sem carregamento não há dragão; entra um só; quem termina dá
  lugar a outro enquanto carrega; acabou o carregamento, ninguém novo entra; carregamento emendado
  não duplica.
- Web `loading-overlay.spec.ts`: mensagem só com `show('...')`.
- Web `skeleton/loading-states.spec.ts`: lista de personagens em skeleton até chegar e saindo dele
  no erro; entrar em sessão e criar sessão com um clique só (erro destrava); CRIAR PERSONAGEM no
  início busca as opções uma vez.

### Tema de cores (2026-10-20, versão 1.3.0)

- Web `services/theme.service.spec.ts`: sem preferência usa FANTASIA e marca o `<html>`; alternar
  troca o `data-theme` e grava `dc.theme`; lê a preferência salva; valor desconhecido cai no
  padrão; navegador sem armazenamento usa o padrão e troca só na tela.

### Skeleton loader na sessão (2026-10-20, versão 1.2.3)

- Web `loading-overlay/loading-overlay.spec.ts` (interceptor real com `HttpTestingController`):
  requisição normal mostra o overlay; com `suppressHttp()` não mostra; liberar volta ao normal e
  liberar duas vezes não desconta de outra tela; `SKIP_LOADING_OVERLAY` e `show()` explícito
  continuam valendo.
- Web `skeleton/skeleton-rows.component.spec.ts`: uma linha por row, larguras que se repetem.
- Web `session-panel.component.spec.ts`: a sessão desliga o overlay ao abrir e libera no destroy.
- `dm-board.component.spec.ts`: `GroupRow.hasSheet` (CA/PP/CD em skeleton até a ficha chegar).

### Aplicar em vários alvos (2026-10-18)

- Web `roll-modal.component.spec.ts` ("vários alvos de uma vez"): Bola de Fogo em 5 alvos com
  valores por alvo (falhou 20, passou 10, resistente e passou 5, Evasão e passou 0 sem chamar a
  API, monstro 20); aplicados saem da lista; marcar só alguns; Esquiva Sobrenatural por alvo num
  ataque com d20.

### Jogador aplica dano/cura em aliados e monstros (2026-10-17)

- API `hp-math.unit.ts`: dano consome PV temporário e para em 0; cura até o máximo (de 0 ou
  negativo parte de 0); PV temporário fica o maior. `game-session.service.unit.ts`
  ("applyAmount"): cura em aliado calculada no servidor + aviso; dano com Resistência Implacável;
  dano em monstro revelado sem devolver PV (evento de PV só pro mestre, aviso pra todos); monstro
  escondido 404 pro jogador e ok pro mestre; jogador não cura monstro; PV temporário só em
  jogador; quem não controla o personagem 403 sem gravar; validação de quantidade/tipo/alvo.
- Web `session-panel.component.spec.ts`: alvos do jogador (aliados, NPCs, só monstros revelados
  com `damageOnly`, quem rolou primeiro) — **substitui** o teste antigo "jogador: só o próprio
  personagem"; aplicar como jogador chama o endpoint e usa o PV devolvido; monstro não devolve
  PV; toast "APLICOU" junta alvos. `roll-modal.component.spec.ts`: cura não oferece alvo
  `damageOnly`.

### Imagens de referência da sessão (2026-10-17)

- API `game-session.service.unit.ts` ("imagens de referência"): mestre sobe com legenda aparada
  (vazia = sem legenda); jogador recebe 403 sem o arquivo chegar no storage; sessão inexistente
  404; legenda > 120 e limite de 30 → 422 sem upload; falha ao gravar descarta o arquivo; lista
  só pro mestre; mostrar grava e publica `reference_image_shown` (não é DM-only); imagem de outro
  mestre 403 / inexistente 404; fechar zera e publica; apagar limpa o storage e fecha pra todos
  só se estava aberta; jogador recebe a imagem em exibição no `getSession`.
- Web `reference-images.spec.ts`: validação do arquivo (tipo, 10 MB); biblioteca carrega, envia
  com legenda e põe no topo, mostra erro da API, mostrar fecha o modal, fechar pra todos, apagar
  com confirmação; Esc no visualizador. `session-event.reducer.spec.ts`: mostrar/trocar/fechar.
  `session-panel.component.spec.ts`: imagem aparece, fechar só some nesta tela, outra imagem
  aparece, e a mesma volta depois que o mestre fecha.

### Web — versão e notas de versão (`release-notes.spec.ts`, 2026-10-16)

Confere a regra de `.claude/rules/versionamento.md` a cada execução: versão atual = primeira
entrada = `package.json`; formato A.B.C sem repetir; cada versão a exatamente um passo da anterior
(`versionBump`: A zera B e C, B zera C, C +1); datas `AAAA-MM-DD` válidas e em ordem; título e
itens com tipo conhecido; data formatada em português sem depender do fuso; a página `/novidades`
mostra a versão atual e todas as versões.

### API — combate (`combat.service.unit.ts`)

- **Ordem de iniciativa**: total → DES → id, sem rolagem vai pro fim; `turn_order` manual do
  mestre tem prioridade; turno atual marcado; talento Alerta no desempate.
- **Iniciar luta**: só o mestre, sem combate duplicado, lista não vazia, participante de outra
  sessão rejeitado; com jogadores fica "rolando iniciativa"; só monstros rola automático (d20 +
  DES), ativa e anuncia monstros revelados **antes** do `combat_started`.
- **Adicionar participantes com combate em andamento**: permissões; ignora quem já está;
  NPC/monstro novos entram no fim da ordem (só se ativo); anúncio de monstro antes de
  `combat_participants_added`.
- **Rolar iniciativa**: dono ou mestre; rolagem repetida/combate encerrado/rolls vazio; o último
  a rolar ativa o combate com a ordem calculada; quem chega depois entra no fim.
- **Turnos**: avançar; virar a rodada (limpa atrasos); jogador só encerra o próprio turno, NPC só
  o mestre; fase errada.
- **Atrasar turno** (inclui a regressão do bug corrigido em 2026-10-14, ver abaixo): marca o
  atraso e passa a vez; **não** avança a rodada nem apaga o atraso; rodada completa simulada
  (`a` atrasa → `b` → `c` → `a` → rodada 2 começa em `a`); não dá pra atrasar duas vezes na
  mesma rodada.
- **Reordenar** (mestre, combate ativo, troca com vizinho, bordas) e **encerrar** (só mestre,
  esconde monstros, evento `combat_ended`).

### API — sessão (`game-session.service.unit.ts`)

- **Visibilidade**: mestre vê todos os monstros e rolagens; jogador recebe lista de monstros
  vazia, só os revelados (nome + imagem) e nenhuma rolagem oculta; sessão inexistente/sem acesso.
- **PV**: validação (inteiro, PV temporário ≥ 0); tradução de status (não encontrado / sem
  permissão); evento publicado; NPC e monstro só pelo mestre.
- **Status de monstro**: validação de PV, PV máx., CA e atributos (1–30); nome em branco vira
  `null`.
- **Monstros**: revelar (nome custom ou do snapshot + imagem), esconder/revelar só mestre,
  derrotar (fallback "Monstro").
- **XP**: validação; só mestre; `can_level_up` sempre que o total alcança o próximo nível
  (jogador e NPC; nunca no nível 20).
- **Rolagens**: campos obrigatórios e enums; acesso e permissão por personagem; **rolagem oculta
  só vale pro mestre** (jogador tem o campo ignorado).
- **Magia lançada**: só publica o evento (não persiste) e exige permissão.
- **Dono do personagem** (2026-10-16): entrar na sessão com personagem de outro usuário → 403,
  inexistente → 404 (sem gravar nem publicar evento); NPC só com personagem do próprio mestre;
  quem não é mestre recebe 403 antes da checagem.

### API — conta e imagens (LGPD)

- `account.service.unit.ts`: perfil sem hash; nome aparado/vazio → null/limite 255; exportação
  junta fichas completas + sessões + catálogo + rolagens; exclusão exige e-mail (case-insensitive)
  e senha (só se a conta tiver), erros 422, conta só-Google, limpeza de imagens depois do DELETE.
- `image-cleanup.service.unit.ts`: só apaga imagem sem referência, ignora nulos/duplicadas, nunca
  lança; helpers `storagePathFromPublicUrl` / `extensionForContentType`.
- `monster-catalog.service.unit.ts`: trocar/remover imagem do catálogo limpa a antiga; permissões.
- Em `character-sheet.service.unit.ts` / `game-session.service.unit.ts`: limpeza ao trocar
  imagem, excluir personagem, remover monstro (derrotar **não** limpa), troca recusada descarta o
  upload, exclusão de sessão só pelo mestre.

### API — segurança de autenticação

- `rate-limit.service.unit.ts`: até o máximo passa, a seguinte é 429 com minutos restantes;
  janela vence e libera; chaves/limites independentes; e-mail sem diferenciar maiúsculas;
  chave vazia ignorada; valores dos limites; `clientIp` (Cloudflare → último XFF → conexão).
- `auth.service.unit.ts`: `hashResetToken` (SHA-256); esqueci a senha grava só o hash e devolve o
  token puro; redefinir busca/consome pelo hash; token inválido.

### Web — reducer de eventos do socket (`session-event.reducer.spec.ts`)

Todos os tipos de evento de `SessionEvent`: adicionar/remover jogador e NPC; PV/PV temporário
(só do alvo certo, jogador sem personagem ignorado); XP de jogador e NPC; PV de NPC; monstro
adicionado/PV/imagem/status (atributos mesclados no snapshot); revelar (sem duplicar, inclusive
pro jogador que não tem a lista de monstros) e esconder; remover/derrotar; rolagem nova no topo
com limite de 30; magia lançada, descanso do grupo e sessão apagada não alteram estado; os 6 eventos de combate substituem o combate;
fim do combate esconde só os monstros indicados. Também garante que o reducer **não muta** o
estado anterior.

### Web — constantes de regras (`rules-constants.spec.ts`)

Várias são **cópias manuais do backend** — os valores esperados aqui são os mesmos conferidos
nos testes da API, então se um lado mudar sem o outro, um dos dois quebra:
espaços de magia (completo, meio-conjurador, Bruxo), limites de nível 1–20, truques do Clérigo
(bug antigo corrigido), magias conhecidas, grimório do Mago, grupos de conjurador, lista de
magias por classe, regras de armadura das 12 classes, regras de perícia por classe/raça, truques
raciais, opções de subclasse no nível 1 (mesmos ids do backend).

### Web — impacto de dano (2026-10-15)

- `services/damage-impact.service.spec.ts` — intensidade pela fração do dano máximo (1 golpe até
  40%, 2 acima, 3 a partir de 80%; vários grupos de dados; modificador negativo; notação
  ilegível), disparo com chave nova, fim automático (`DAMAGE_IMPACT_MS`), golpe novo reinicia o
  tempo, liga/desliga com preferência no `localStorage` (e sem quebrar se o armazenamento estiver
  bloqueado).
- `damage-impact/damage-impact.component.spec.ts` — nada sem dano; 1 a 3 golpes/flashes conforme a
  intensidade; valor do dano; `aria-hidden`.
- `roll-modal/roll-modal.component.spec.ts` — dispara só ao terminar a rolagem de **dano** (não no
  d20 do ataque, nem ao errar, nem em perícia), só dentro da sessão (ficha isolada não dispara),
  notação com os d8 da Destruição Divina.
- No `session-panel.component.spec.ts`: dano de outro jogador dispara junto com o toast; ataque/
  perícia/dados livres não; rolagem antiga da primeira carga não; vários danos seguidos disparam
  cada um quando o seu toast aparece.

### Web — painel de sessão (`session-panel.component.spec.ts`)

Testa a lógica sem renderizar o template (sem `id` de entrada o componente não busca a sessão
nem conecta no socket; serviços são mockados):

- **PV de jogador**: dano consome primeiro a vida temporária; dano menor que ela não toca no PV;
  PV não fica negativo; valor zero/negativo não faz nada; cura até o máximo mantém a vida
  temporária; cura acima do máximo pede confirmação de vida temporária (não acumula) —
  aceitar/recusar; estado da sessão atualizado após salvar.
- **PV de NPC e monstro**: limitados entre 0 e o máximo.
- **Monstro em destaque**: nenhum sem revelados; primeiro revelado sem combate; melhor iniciativa
  por padrão; troca pro monstro da vez e **mantém durante o turno de jogador**; turno atual só
  existe com combate ativo.

### Web — privacidade e termos (`legal-info.spec.ts`, `legal-page.component.spec.ts`)

- `resolveLegalDoc` (termos × qualquer outro valor cai na privacidade); títulos dos documentos.
- **As rotas `/privacidade` e `/termos` existem, apontam o documento certo e não têm
  `authGuard`** (precisam abrir sem login — são linkadas no cadastro e no login).
- Página escolhe o documento pela `data` da rota (com fallback) e expõe controlador, e-mail de
  contato e idade mínima usados no texto.

### Web — Minha Conta (`account.component.spec.ts`)

Carregar perfil / erro; salvar nome (aparado, vazio → null, erro do backend); botão de excluir só
com e-mail certo + senha (se tiver) + ciência; conta só-Google sem senha; sucesso encerra a sessão
local; erro 422 mostra a mensagem; nome do arquivo de exportação.

### Web — cadastro (`signup.component.spec.ts`)

- Sem o aceite (idade mínima + termos) não cria conta nem entra com Google, e mostra a mensagem.
- Com o aceite: confirmação de senha continua validada; cadastro e login Google chamam o
  `AuthService` e navegam pra home.

---

## Bug encontrado pelos testes (já corrigido)

Ao escrever os testes de combate apareceram dois problemas encadeados no **atrasar turno**
(`CombatService.delayTurn` / `advanceToNextTurn`):

1. O atraso era marcado antes de calcular o próximo — quem atrasou caía no fim da ordem, a conta
   "dava a volta" e virava rodada nova: o contador de rodada subia +1 e o atraso era apagado na
   hora (a trava de "já atrasou nesta rodada" nunca funcionava).
2. Escondido pelo primeiro: na virada de rodada, a rodada nova começava pela ordem ainda com os
   atrasos aplicados, e quem atrasou perdia a vez na rodada seguinte.

Os dois foram corrigidos e estão cobertos pelos testes da seção "Atrasar turno".

---

## Ao adicionar uma funcionalidade nova

1. Escrever (ou pedir) os testes da regra nova no mesmo padrão — regra pura em
   `calculator.unit.ts`/`rules.unit.ts`, fluxo com banco em `services/*.unit.ts` usando os
   stubs dos repositórios, evento novo de socket no `session-event.reducer.spec.ts`.
2. Se mudar uma tabela que existe nos dois repos (espaços de magia, armaduras, grupos de
   conjurador, subclasses do nível 1), atualizar os dois lados — os testes dos dois conferem os
   mesmos valores.
3. Rodar a rotina sugerida acima antes de commitar.
4. Teste que precisar ficar desativado temporariamente: `it.skip(...)` com um comentário dizendo
   por quê (o mocha mostra como "pending", o Vitest como "skipped").

## Limites do que não está coberto

- Repositórios (SQL) e controllers — exigiriam banco de teste; os testes de aceitação do
  template (`src/__tests__/acceptance`) continuam precisando do app no ar.
- Templates/HTML e CSS do Angular, socket.io real, upload pro Supabase.
- Outros componentes do web (ficha, modal de level-up, etc.) — o wizard de criação só tem spec
  das perícias do antecedente.
