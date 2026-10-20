---
resumo: Traços e habilidades de classe/raça/talento que rolam, somam e aplicam na sessão. Fases 1–4 feitas; limites em "O que ficou de fora".
tipo: conceito
status: ativo
atualizado: 2026-10-16
---

# Dungeon Companion — Plano: traços e habilidades mecânicos

Registrado em 2026-10-16, antes de qualquer implementação. Mesmo objetivo das magias
(`dungeon-companion/conceitos/magias-mecanicas.md`): o que hoje é só texto ou só "gasta o recurso" passa a
**rolar, somar e aplicar** dentro da sessão. Base: a auditoria de mecânicas
(`dungeon-companion/conceitos/auditoria-mecanicas.md`, classificação feature a feature) e o que já foi
automatizado desde então (`dungeon-companion/historico/media-progress.md`, `dungeon-companion/historico/levelup-plan.md`).

## Como está hoje (levantamento de 2026-10-16)

- **Já automatizado (passivo, entra na ficha)**: CA sem armadura (Bárbaro/Monge/Linhagem
  Dracônica), Estilo de Luta (Arqueria/Defesa/Duelo), PV extra (Anão da Colina, Resiliência
  Dracônica, Vigoroso), deslocamento (Movimento Rápido, Monge, Elfo da Floresta), salvaguardas
  (Alma de Diamante, Aura de Proteção, Mente Escorregadia, Resiliente), Especialização, Alerta e
  Observador, Campeão Primitivo, CDs fixas no texto (Presença Intimidante, Tranquilidade, Abjurar
  Inimigo, Encantamento Hipnotizante).
- **Recursos rastreados com botão "USAR"** (gastam e recarregam no descanso): Fúrias, Inspiração
  Bárdica, Mestre Místico, Canalizar Divindade (Clérigo e Paladino, com as opções de cada
  domínio/juramento), Forma Selvagem, Recuperação Natural, Pontos de Feitiçaria (Criar Espaço de
  Magia), Retomar Fôlego, Surto de Ação, Indomável, Recuperação Arcana, Pontos de Chi (Rajada de
  Golpes, Defesa Paciente, Passo do Vento, Ataque Atordoante, Corpo Vazio, Palma Vibrante, Artes
  Sombrias, Técnica de Mão Oculta), Integridade Corporal, Sentido Divino, Curar pelo Toque,
  Toque Purificador.
- **O "USAR" só desconta o recurso**: não rola dado, não cura, não mostra CD, não soma nada no
  ataque e **não avisa a mesa**. Ex.: Retomar Fôlego gasta o uso mas o jogador rola 1d10+nível
  na mão; Fúria gasta mas o +2 de dano não entra nos ataques; Criar Espaço de Magia gasta os
  pontos mas não devolve o espaço.
- **Dados que escalam por nível já calculados**, mas só exibidos (`class_resources`): Ataque
  Furtivo, Dano de Fúria, Artes Marciais, Inspiração Bárdica (dado).
- **Traços de raça**: todos só texto (Sopro do Draconato, Sortudo, Resistência Implacável,
  Ataques Selvagens, resistências e vantagens raciais).
- **Talentos**: só os de número fixo automatizados (Vigoroso, Alerta, Observador, aumentos de
  atributo); o resto é texto (Mestre em Armas Grandes, Mestre-Atirador, Sortudo, Curandeiro…).

O que dá pra reaproveitar das magias: o modal de rolagem (ataque → acerto → dano, crítico,
"somar ao dano" com opções e marcações, resistência com CD e metade, cura, aplicar no alvo),
`spell_cast` como anúncio na mesa, e o padrão "catálogo no código + rolagem pronta na ficha".

## Mapa — o que precisa ficar mecânico

### A. Habilidades ativáveis: rolar / aplicar ao usar
| Habilidade | Hoje | Mecânico |
|---|---|---|
| Retomar Fôlego (Guerreiro) | gasta | cura 1d10 + nível, aplicar em si |
| Integridade Corporal (Monge, Mão Aberta) | gasta | cura fixa 3 × nível, aplicar em si |
| Curar pelo Toque (Paladino) | gasta 1 ou 5 | escolher quantos PV do pool → cura no alvo |
| Canalizar Divindade: Preservar a Vida (Vida) | gasta | pool 5 × nível pra distribuir entre alvos |
| Canalizar Divindade: Radiação do Amanhecer (Luz) | gasta | resistência CON, 2d10 + nível radiante, metade |
| Canalizar Divindade: Expulsar Mortos-Vivos / Infiéis / Ímpios, Ira da Natureza | gasta | CD + atributo no anúncio |
| Ataque Atordoante (Monge) | gasta 1 chi | CD de CON no anúncio |
| Palma Vibrante (Monge, Mão Aberta) | gasta | resistência CON, 10d10 necrótico se falhar |
| Criar Espaço de Magia (Feiticeiro) | gasta pontos | também devolve o espaço do círculo |
| Arma de Sopro (Draconato) | texto | **recurso novo** (curto/longo) + resistência DES/CON, 2d6→5d6 por nível, metade |
| Inspiração Bárdica | gasta | anuncia "deu inspiração d8 a X" (uso pelo aliado → C) |
| Sentido Divino, Surto de Ação, Corpo Vazio, Passo do Vento, Defesa Paciente, Forma Selvagem, Recuperação Arcana/Natural, Mestre Místico, Toque Purificador | gasta | anúncio na mesa ("usou X") |

### B. Dano/ataque extra no acerto (mesmo passo "Somar ao dano" das Destruições)
| Item | Mecânico |
|---|---|
| Ataque Furtivo (Ladino) | marcação "Ataque Furtivo (Nd6)" em arma de acuidade ou à distância, 1×/turno |
| Fúria (Bárbaro) | marcação "em fúria" soma o Dano de Fúria em ataque corpo a corpo de Força |
| Golpe Divino (Clérigo, vários domínios, nv8/14) | marcação +1d8/+2d8 do tipo do domínio, 1×/turno |
| Matador de Inimigos (Ranger nv20) | marcação +mod. SAB, 1×/turno |
| Arma Sagrada (Devoção) | marcação +mod. CAR no ataque |
| Golpe Dirigido (Guerra) | depois do d20: "+10 no ataque" gastando Canalizar Divindade |
| Mestre em Armas Grandes / Mestre-Atirador (talentos) | marcação antes do ataque: −5 ataque, +10 dano |
| Crítico Aprimorado/Superior (Campeão) | crítico com 19–20 / 18–20 |
| Crítico Brutal (Bárbaro nv9/13/17), Ataques Selvagens (Meio-Orc) | +1/2/3 dados da arma no crítico corpo a corpo |
| Artes Marciais (Monge) | ação "Ataque desarmado" com o dado de artes marciais e DES/FOR |
| Rajada de Golpes (Monge) | ao usar: 2 ataques desarmados em sequência (como os raios) |

### C. Ajustes no d20 (teste, ataque, resistência)
| Item | Mecânico |
|---|---|
| Sortudo (Halfling) | 1 natural → oferece rolar de novo |
| Sortudo (talento) | recurso novo (3/descanso longo) → "usar Sortudo" rola mais um d20 |
| Indomável (Guerreiro) | ao falhar resistência, oferece rolar de novo gastando o uso |
| Inspiração Bárdica recebida | o aliado soma o dado num teste/ataque/resistência |
| Vantagens condicionais (Fúria em FOR, Resistência Anã/Halfling Robusto vs veneno, Ancestralidade Feérica vs enfeitiçar, Bravura vs medo, Esperteza Gnômica vs magia, Sentido de Perigo) | lembrete no modal do teste de resistência/perícia ("vantagem contra: veneno") |

### D. Defesas ao aplicar dano no alvo (fase 4 das magias)
| Item | Mecânico |
|---|---|
| Fúria (resistência a contundente/cortante/perfurante) | ao aplicar dano físico num bárbaro em fúria: metade |
| Resistências por tipo (Draconato, Tiefling/fogo, Anão e Halfling Robusto/veneno, Proteção contra Energia…) | o tipo do dano já vem no rótulo das magias → metade automático |
| Resistência Implacável (Meio-Orc) | cair a 0 PV → fica com 1 (1×/descanso longo, recurso novo) |
| Esquiva Sobrenatural (Ladino nv5) / Evasão (Ladino/Monge nv7) | opção "metade" / "nenhum dano no sucesso de DES" ao aplicar |

### E. Continua texto (sem número, ou depende de decisão do mestre)
Visão no escuro, idiomas, Transe, Ação Ardilosa, Andarilho de Telhados, ritual/utilidade,
Forma Selvagem em si (motor de forma alternativa), companheiro animal, Ataque Extra (o jogador
já ataca de novo pelo botão — ver decisões), e o resto marcado "Narrativa" na auditoria.

## Proposta técnica

1. **Catálogo no código** (`src/services/character-sheet/ability-mechanics.ts` na api), igual a
   `spell-mechanics.ts`: por nome da habilidade/traço/talento (e classe/subclasse/raça), o tipo
   (cura, cura fixa, resistência, anúncio, soma no acerto, ajuste no d20, defesa), dados por
   nível e atributo.
2. **A ficha devolve tudo pronto** (`loadCharacter`):
   - `class_abilities[].roll` — o que o "USAR" faz (mesmo formato de `SpellRoll`: cura/resistência
     com CD e dados já escalados);
   - `attack_riders` — opções de "somar ao dano"/ataque com os números do personagem (Ataque
     Furtivo 3d6, Dano de Fúria +2, Golpe Divino 1d8…) e em que ataque valem;
   - `roll_modifiers` — faixa de crítico, dados extras no crítico, Sortudo, lembretes de vantagem;
   - `damage_defenses` — resistências e reações pra quem aplica dano (usado pela sessão).
3. **Web**: o "USAR" passa a abrir o modal (cura/resistência) ou só anunciar; o ataque com arma
   junta `attack_riders` ao passo "Somar ao dano" (já existe pras Destruições); o modal de d20
   ganha reroll (Sortudo/Indomável) e os lembretes; "aplicar no alvo" usa `damage_defenses`.
4. **Recursos novos**: Arma de Sopro (Draconato), Sortudo (talento), Resistência Implacável — mesmo
   mecanismo de `resource_uses_expended` (JSON já existente, **sem migração**). Exige ampliar
   `TRACKABLE_RESOURCES` pra raça/talento (hoje é por classe).
5. **Anúncio na mesa**: reaproveitar `spell_cast` (ou um `ability_used` irmão) pra "Thorin usou
   Retomar Fôlego", com a CD quando houver.

## Decisões do usuário (2026-10-16)

1. **Efeitos ativos (Fúria etc.) ficam guardados no personagem** até acabar (estado persistido,
   desligado no fim do combate / ao encerrar) — não é só marcação no ataque.
2. **1×/turno trava pela vez do combate** (com combate ativo, só oferece uma vez por turno).
3. **Inspiração Bárdica recebida fica guardada** no personagem até ser usada.
4. **Começar pela fase 1 (A).**

## Status da implementação

Fases 1 a 4 implementadas (as quatro do plano).

### Fase 1 (A) — habilidades ativáveis rolam e anunciam (2026-10-16, api `d8c4a16`, web `29bf359`)

**API** — `src/services/character-sheet/ability-mechanics.ts` (`abilityMechanicsFor`): cada item de
`class_abilities` da ficha ganha `roll` (mesmo formato `SpellRoll` das magias), `variable_cost` e
`restores_slot`.
- Cura: Retomar o Fôlego (1d10 + nível), Integridade Corporal (3 × nível, fixo — virou habilidade
  ativável da Mão Aberta nv6), Preservar a Vida (5 × nível, **distribuir** entre alvos), Curar pelo
  Toque (o jogador escolhe quantos pontos do pool → cura igual).
- Resistência com dano: Radiação do Amanhecer (CON, 2d10 + nível radiante, metade), Palma
  Vibrante (CON, 10d10; texto próprio "se falhar, cai a 0 PV; se passar, sofre o dano").
- Só CD no anúncio: Expulsar Mortos-Vivos, Ler Pensamentos (Clérigo), Expulsar os Infiéis,
  Expulsar os Ímpios, Abjurar Inimigo (Paladino) — CD de magia; Ataque Atordoante (Monge) — CD de
  chi = 8 + proficiência + SAB.
- Criar Espaço de Magia devolve um espaço gasto do círculo (só habilita se houver um gasto).
- Anúncio: `spell_cast` ganhou `is_ability` → toast "USOU" (magias continuam "LANÇOU").

**Web** — "USAR" na tela de ações: gasta, anuncia (com CD quando houver) e abre a rolagem/cura
(com "aplicar no alvo"), devolve o espaço ou pede a quantidade (Curar pelo Toque). Modal ganhou
valor fixo (mostra o total sem rolar e não vai pro log — o log exige dados), modo "distribuir"
(quanto aplicar em cada alvo, com o que sobra) e texto próprio da resistência. Na ficha isolada o
"USAR" também abre a rolagem e devolve o espaço.

**Ficou pra depois desta fase**: Ira da Natureza (o alvo escolhe FOR ou DES), Inspiração Bárdica
guardada no aliado (fase 4/C), Arma de Sopro (fase 3).

Testes: api `ability-mechanics.unit.ts` + casos na ficha e no anúncio; web
`player-actions-modal.component.spec.ts` (novo) + casos no modal. Dois testes antigos do modal
(Destruição Divina e somar ao dano) ficaram com o d20 fixo — eram instáveis desde o crítico (5% de
chance de 20 natural dobrar os dados).

### Fase 2 (B) — traços que somam no ataque (2026-10-16, api `ddd5be7`, web `33e0a63`)

**Estado no personagem** (decisões 1 e 2): coluna nova **`character.active_effects JSONB NULL`**
(`{active: [...], turn_uses: {...}}`) — **migração precisa rodar em produção antes do deploy da
api** (`ALTER TABLE character ADD COLUMN IF NOT EXISTS active_effects JSONB NULL;`, registrada em
`docs/database/database.sql`) — **aplicada em produção em 2026-10-16**, autorizada pelo usuário.
`PATCH /api/character-sheet/{id}/active-effects` liga/desliga
Fúria/Arma Sagrada (`{effect, active}`) ou marca uma soma 1×/turno (`{turn_use, turn_key}`), com a
permissão de sempre (dono ou mestre da sessão). Os efeitos ativos zeram no descanso longo e no
fim do combate (`clearActiveEffectsInSession`).

**API** — `combat-features.ts` (`buildCombatFeatures`) → `combat_features` na ficha carregada:
- `crit_min`: Campeão 19 (nv3) / 18 (nv15);
- `melee_crit_extra_dice`: Crítico Brutal 1/2/3 (nv9/13/17) + Ataques Selvagens (Meio-Orc) +1;
- `riders`: Ataque Furtivo (dado do nível, acuidade/distância, 1×/turno), Fúria (Dano de Fúria,
  corpo a corpo de Força, só com Fúria ativa), Golpe Divino (domínios com o traço, nv8 1d8 /
  nv14 2d8, tipo do domínio, 1×/turno), Matador de Inimigos (Ranger nv20, + mod. SAB, 1×/turno);
- `attack_bonuses`: Arma Sagrada (Devoção, + mod. CAR mín. 1, com o efeito ativo);
- `power_attack`: Mestre em Armas Grandes (corpo a corpo pesada) / Mestre-Atirador (distância);
- `unarmed`: ataque desarmado do Monge (dado de Artes Marciais, melhor de FOR/DES).
`class_abilities[].activates` (Fúria, Arma Sagrada) e `unarmed_attacks` (Rajada de Golpes = 2).

**Web** — ataque com arma monta tudo isso: Fúria/Arma Sagrada ativas entram sozinhas (no rótulo
também), o ataque poderoso vira uma marcação antes de rolar (−5/+10), crítico com a faixa do
personagem e dados extras no corpo a corpo, somas de traço no passo "Somar ao dano" junto com as
magias (as 1×/turno somem depois de usadas na vez atual; a sessão passa `turnKey` =
`<combate>:<rodada>:<participante>`; fora de combate não trava). "Ataque Desarmado" na lista de
armas do Monge; "USAR" Rajada de Golpes abre 2 golpes. Seção "EFEITOS ATIVOS" com "Encerrar".
Na ficha isolada, "USAR" Fúria/Arma Sagrada também liga o efeito.

Testes: api `combat-features.unit.ts` + efeitos ativos/descanso longo/fim de combate; web modal
(crítico 19, Crítico Brutal, ataque poderoso, somas fixas e 1×/turno), tela de ações (Fúria,
Arma Sagrada, Ataque Furtivo travado, desarmado/Rajada) e `combatTurnKey` da sessão.

### Fase 3 — raça e talentos com recurso (2026-10-16, api `1d9e1b2`, web `e88a1ff`)

**Recursos de raça e talento** (sem migração — mesmo `resource_uses_expended`):
`RACE_TRACKABLE_RESOURCES` / `FEAT_TRACKABLE_RESOURCES` em `rules.ts` (máximo fixo), somados aos
de classe na ficha, no gasto (`PATCH resource-uses`) e nas recargas de descanso.
- **Arma de Sopro** (Draconato): 1 uso, descanso curto; virou habilidade ativável de raça
  (`getKnownRaceAbilities`) → "USAR" abre o modal: resistência de DES, CD 8 + CON + proficiência,
  fogo, metade se passar, 2d6 → 3d6 (nv6) → 4d6 (nv11) → 5d6 (nv16).
- **Resistência Implacável** (Meio-Orc): 1 uso, descanso longo, **aplicada pela API** em
  `updateCharacterHp` (jogador): dano que zeraria o PV grava 1, marca o uso e avisa a mesa
  ("USOU Resistência Implacável"). O endpoint de PV do jogador agora devolve
  `{current_hit_points}` e a sessão usa esse valor. NPCs ficam de fora.
- **Sortudo (Halfling)**: `combat_features.halfling_lucky` → no modal, um 1 natural no d20 (teste,
  resistência, ataque) oferece "rolar o 1 de novo" (vale o novo), uma vez por rolagem.
- **Sortudo (talento)**: recurso "Pontos de Sorte" (3, descanso longo) → no modal, "PONTO DE
  SORTE" rola mais um d20 e fica com o melhor, uma vez por rolagem, e debita o ponto.
- Com Sortudo disponível, teste/resistência esperam o "CONCLUIR" (antes fechavam sozinhos); a
  rolagem refeita vai de novo pro log com "(Sortudo)" / "(Ponto de Sorte)".

Testes: api — integridade (habilidade de raça usa recurso de raça; talento com recurso existe),
Arma de Sopro, recursos na ficha/gasto/recargas, Resistência Implacável no PV; web — modal
(Halfling, Ponto de Sorte, crítico recalculado), tela de ações (opções de sorte, débito) e sessão
(PV devolvido pela API).

### Fase 4 (C/D) — d20 e defesas (2026-10-16, api `1c39eba`, web `1f5fe40`)

Sem migração: a Inspiração guardada fica no JSONB `character.active_effects` que já existe
(`bardic_inspiration: {sides, from} | null`, zera no descanso longo e no fim do combate como o resto).

**Ajustes no d20** (modal de rolagem; com qualquer um disponível, a rolagem espera o "CONCLUIR"):
- **Indomável** (Guerreiro): só em **resistência**; "🛡 INDOMÁVEL" rola o d20 de novo, vale o
  novo, gasta 1 uso (`PATCH resource-uses`), log com "(Indomável)".
- **Inspiração Bárdica**: o "USAR" do bardo (`targets_ally`) pede o aliado da sessão → gasta o
  uso, anuncia e chama `POST /api/game-session/{id}/bardic-inspiration`
  (`{id_character, id_player_session}`; checa permissão sobre o bardo, classe Bardo, aliado na
  sessão com personagem e diferente do bardo). O dado (d6/d8 nv5/d10 nv10/d12 nv15) fica
  guardado no personagem do aliado. No modal do aliado (teste, resistência, ataque),
  "🎵 INSPIRAÇÃO BÁRDICA (dN)" soma o dado ao total uma vez e apaga a inspiração
  (`PATCH active-effects {consume_inspiration: true}`; sem inspiração → 422).
- **Lembretes de vantagem** (`combat_features.d20_reminders`, "💡" abaixo do título, só no d20):
  Anão e Halfling Robusto (veneno), Elfo/Meio-Elfo (enfeitiçar), Halfling (medo), Gnomo (INT/SAB/CAR
  contra magia), Bárbaro nv2+ (Sentido de Perigo, DES), Fúria ativa (testes e resistências de
  FOR). Filtrados pelo tipo (teste × resistência) e atributo da rolagem. O jogador decide se rola
  com vantagem — é lembrete, não muda a rolagem.

**Defesas ao aplicar dano no alvo** (`PlayerCharacterSummary.defenses`, calculado na API em
`damageDefensesFor` e enviado nos jogadores/NPCs da sessão):
- Resistência por tipo: Anão/Halfling Robusto (veneno), Tiefling e Draconato (fogo), Fúria ativa
  (contundente/cortante/perfurante). O tipo do dano vem da magia (`damage_type`) ou da arma; o
  web normaliza ("concussão" → contundente etc.). Alvo resistente → metade, com nota no painel.
- **Esquiva Sobrenatural** (Ladino nv5): botão extra no painel de aplicar, só contra ataque com
  d20 (não em acerto automático/resistência) → metade.
- **Evasão** (Ladino/Monge nv7): em resistência de DES com metade no sucesso → falhou = metade,
  passou = 0 (registra "✓ alvo: 0" sem chamar a API).
- As reduções acumulam (resistência + esquiva = metade da metade, arredondando pra baixo).

Testes: api — dado da Inspiração por nível, lembretes por raça/subraça/classe/Fúria, defesas
(resistências, esquiva, evasão), `targets_ally`, consumir a inspiração (e 422 sem ela),
`grantBardicInspiration` (permissão, só bardo, aliado fora da sessão, si mesmo, grava o dado);
web — modal (Indomável só em resistência, Inspiração soma e avisa, lembretes, resistência do
alvo, Evasão, Esquiva só com ataque), tela de ações (lembretes filtrados por atributo,
Inspiração/Indomável nas opções, fluxo do aliado, tipo de dano da arma) e sessão (aliados e
defesas nos alvos).

### O que ficou de fora (depois das 4 fases)

- Tudo da seção E continua texto (visão no escuro, Ação Ardilosa, Forma Selvagem, companheiro
  animal, Ataque Extra etc.).
- Vantagem condicional é só **lembrete**: o modal não rola 2d20 sozinho; o jogador decide.
- Resistências vindas de **magia** (Proteção contra Energia, Pele de Pedra…) e de itens não entram
  nas defesas do alvo — só raça, Fúria, Esquiva Sobrenatural e Evasão.
- Monstros não têm defesas automáticas (resistências do bestiário ficam com o mestre); NPCs têm
  as mesmas defesas dos jogadores, mas não a Resistência Implacável.
- Indomável não verifica se a resistência falhou (a CD não é conhecida pelo modal) — o botão fica
  disponível em toda resistência enquanto houver uso.
