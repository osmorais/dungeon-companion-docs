---
resumo: Catálogo de mecânica de magias (spell-mechanics.ts), modal de rolagem, aplicar no alvo, efeitos de tela. Fases 1–4 feitas.
tipo: conceito
status: ativo
atualizado: 2026-10-16
---

# Dungeon Companion — Plano: magias mecânicas (rolar ataque/dano/cura ao lançar)

Registrado em 2026-10-16. **Fases 1 a 4 e os efeitos de tela foram implementados e enviados no
mesmo dia** — ver "Status da implementação" e "Efeitos de tela das magias" no fim. Decisões do
usuário: catálogo no código (não em colunas do banco); aplicar dano/cura no alvo é opcional e
segue as permissões de PV atuais. Ver `dungeon-companion/estado-atual.md` pro contexto geral e
`dungeon-companion/historico/spells-progress.md` pras descrições de magia.

**Resumo do que existe hoje** (catálogo `src/services/character-sheet/spell-mechanics.ts` na api):
- ataque mágico / acerto automático: 20 magias (inclui Lâmina Flamejante);
- resistência com dano: 47; resistência sem dano (só a CD no anúncio): 66;
- cura: 8 (com Discípulo da Vida e Cura Suprema do Clérigo da Vida);
- somam dano no ataque: 9 (6 Destruições, Bruxaria, Marca do Caçador, Manto do Cruzado);
- crítico dobra os dados; aplicar no alvo opcional; efeitos de tela por elemento e névoa de cura.

| Fase | api | web |
|---|---|---|
| 1 — ataque e automático | `c0909e4` | `13d9934` |
| 2 — resistência | `a9ac41b` | `659710b` |
| 3 — cura | `3eb6902` | `bf06297` |
| 4 — crítico, somam dano, aplicar no alvo | `4f3b155` | `5492760` |
| Efeitos de tela | — | `7ac13e1` |

## Pedido

Hoje, ao lançar uma magia, o jogador escolhe o círculo e o espaço é gasto, mas nenhum dado é
rolado: ele precisa abrir "rolar dados", ler a descrição e montar a rolagem na mão. O objetivo é
que lançar a magia abra o modal de rolagem, igual ao ataque com arma (d20 → "passou da CA?" →
dano no mesmo modal).

## Como funciona hoje (levantamento de 2026-10-16)

- **Arma** (`player-actions-modal.rollAttack`): monta um `AbilityRollConfig` com
  `rollType: 'attack'`, bônus de ataque e `damage: {diceCount, diceSides, modifier}` (só **um**
  grupo de dados, ex.: `1d8`). O `roll-modal` rola o d20, espera o mestre confirmar o acerto e
  rola o dano no mesmo modal (com a Destruição Divina como fase extra opcional). As rolagens vão
  pro log da sessão (`roll_type` `attack`/`damage`) e o dano dispara o impacto em tela.
- **Magia** (`player-actions-modal.castSpell` e `character-sheet.castSpell`): só gasta o espaço
  (`updateSpellSlots`) e anuncia `spell_cast` (toast informativo). **Truques não podem ser
  lançados** (`isCastable` devolve `false` pra nível 0), então Raio de Fogo, Rajada Mística etc.
  nem têm botão.
- **Dados da magia**: a tabela `spell` tem `description` (texto conferido com o livro) e uma
  coluna **`damage`** (ex.: `1d10`, `8d6`, `1d4+1`) preenchida em 114 das 361 magias — mas a API
  **não lê** essa coluna em lugar nenhum. Não existe nada estruturado sobre tipo de ataque,
  resistência, tipo de dano, escala por círculo ou por nível de personagem.
- **Crítico**: o modal só destaca o 20 natural; não dobra os dados de dano (nem pra arma).

## Levantamento das 361 magias (heurística sobre a descrição, só leitura)

Números aproximados — servem pra dimensionar, a classificação final é manual.

| Tipo | Qtde | Exemplos | O que o modal faz |
|---|---|---|---|
| **Ataque mágico** com dano | ~18 | Raio de Fogo, Toque Chocante, Rajada Mística, Raio Guiador, Raio Ardente, Orbe Cromática, Infligir Ferimentos | igual arma: d20 + ataque de magia → acerto → dano |
| **Resistência** com dano | ~55 | Mãos Flamejantes, Bola de Fogo, Relâmpago, Chama Sagrada, Despedaçar | mostra "CD X de DES — metade se passar" e rola o dano (inteiro e metade) |
| **Acerto automático** | 1–2 | Mísseis Mágicos | rola o dano direto (por dardo) |
| **Cura** | ~8 | Curar Ferimentos, Palavra Curativa, Oração Curativa | rola dado + mod. de conjuração |
| **Dano extra em outro ataque** ("rider") | ~12 | Destruições do Paladino, Bruxaria, Marca do Caçador, Arma Elemental, Lâmina Flamejante, Arma Espiritual | efeito que soma dados nos próximos ataques com arma — fase própria |
| **Resistência sem dano** | ~31 | Comando, Imobilizar Pessoa, Banimento | só mostrar a CD no anúncio |
| **Utilidade/buff sem dado** | ~200 | Escudo Arcano, Invisibilidade, Voo | continua só gastando espaço e anunciando |
| **Escala "Em Níveis Superiores"** | 104 | Bola de Fogo (+1d6/círculo), Raio Ardente (+1 raio/círculo) | dados dependem do círculo escolhido |

## Proposta

### 1. Catálogo estruturado de mecânica de magia (API)

Novo `src/services/character-sheet/spell-mechanics.ts`, no mesmo padrão de `rules.ts`/`feats.ts`
(regra versionada no código, testada em `rules.unit.ts`, conteúdo confirmado com o usuário antes
de entrar), indexado por `id_spell`:

```ts
interface SpellMechanics {
  kind: 'attack' | 'save' | 'auto' | 'heal';
  attack?: 'melee' | 'ranged';
  save?: {ability: StatKeyEn; onSuccess: 'half' | 'none'};
  /** Grupos de dados no círculo base (ou nível 1 pra truque), ex.: [{count: 8, sides: 6, type: 'fogo'}]. */
  dice: {count: number; sides: number; type?: string}[];
  /** Soma o modificador de conjuração (cura, Bordão Místico com Rajada Agonizante etc.). */
  addCastingMod?: boolean;
  bonus?: number;                          // Mísseis Mágicos: +1 por dardo
  /** Raios/dardos/projéteis: cada um é uma rolagem própria. */
  instances?: {base: number; perSlotAbove?: number; byCharacterLevel?: boolean};
  /** "Em Níveis Superiores": +N dados a cada `every` círculos acima do base. */
  upcast?: {count: number; sides: number; every?: number};
  /** Truque: dados ×2/×3/×4 nos níveis 5/11/17 do personagem. */
  cantripScaling?: boolean;
}
```

**Por que no código e não em colunas novas da tabela `spell`**: as regras do jogo já moram em
`rules.ts` (confirmadas com o usuário, com teste de integridade); a tabela `spell` guarda o texto.
Alternativa (colunas no banco) fica registrada caso se queira editar sem deploy.

**Como preencher**: um script gera um rascunho a partir da coluna `damage` + regex na descrição
(tipo de ataque, atributo da resistência, "metade", tipo de dano, "Em Níveis Superiores") e eu
reviso; o usuário confere por círculo (mesmo processo das classes no level-up). Começar pelos
truques e 1º–3º círculos (os mais usados).

### 2. API devolve a rolagem já resolvida na ficha

`loadCharacter` acrescenta em cada magia da ficha um `roll` calculado pro personagem:
ataque de magia / CD do personagem, e os dados **por círculo disponível** (ex.: Bola de Fogo
`{3: '8d6', 4: '9d6', 5: '10d6'}`; truque já escalado pelo nível; Raio Ardente com o número de
raios por círculo). Assim a regra fica num lugar só (API), e o web só lê — sem duplicar tabela
nos dois repos.

### 3. Roll modal (web)

- `damage` passa a aceitar **vários grupos de dados** (`dice: {count, sides}[]`) em vez de um só
  — necessário pra `1d4+1` ×3, Orbe Cromática `3d8`, Destruição Divina já usa um "extra".
- Novos fluxos a partir do mesmo modal:
  - **Ataque mágico**: idêntico ao da arma, usando `spell_attack_bonus`. Vários raios = repete
    "raio 1 de 3".
  - **Resistência**: sem d20 do conjurador; mostra a CD e o atributo, botão "rolar dano", resultado
    mostra inteiro e metade (o mestre aplica em cada alvo).
  - **Automático**: rola o dano direto.
  - **Cura**: rola dado + modificador (`roll_type` novo `heal` no log da sessão — exige ampliar o
    enum no backend).
- `castSpell` gasta o espaço e, se a magia tiver mecânica, abre o modal; sem mecânica, continua só
  anunciando. **Truques passam a ser lançáveis** (sem gastar espaço).
- Toast `spell_cast` ganha a CD quando for magia de resistência (cobre as ~31 sem dano).

### 4. Fora deste primeiro escopo (fases seguintes)

- **Efeitos que somam em ataques com arma** (Destruições, Bruxaria, Marca do Caçador, Arma
  Elemental): precisam de "efeito ativo" no personagem até acabar/perder concentração — reaproveita
  a ideia da fase `smite-choice` do modal.
- **Aplicar dano/cura direto no PV** de monstro/jogador escolhido como alvo.
- **Concentração**, condições e buffs (Bênção +1d4, Escudo Arcano +5 CA).
- **Crítico dobrando dados** (vale também pra arma — hoje não existe).

## Status da implementação

### Fase 1 — ataque mágico e acerto automático (2026-10-16, api `c0909e4`, web `13d9934`)

**API**
- `src/services/character-sheet/spell-mechanics.ts`: `SPELL_MECHANICS` (por `id_spell`) com 19
  magias — truques Chicote de Espinhos, Criar Chamas, Raio de Fogo, Raio de Gelo, Rajada Mística,
  Toque Arrepiante, Toque Chocante; 1º Infligir Ferimentos, Mísseis Mágicos, Orbe Cromática, Raio
  Adoecente, Raio de Bruxa, Raio Guiador; 2º Arma Espiritual, Flecha Ácida de Melf, Raio Ardente;
  3º Toque Vampírico; 5º Mão de Bigby (Punho Cerrado); 7º Espada de Mordenkainen.
  `resolveSpellRollAtSlot` / `buildSpellRoll` calculam dados por círculo e por nível.
- `loadCharacter` acrescenta `roll` (tipo `SpellRoll` em `character-options-types.ts`) em cada
  magia com mecânica, só pra quem conjura (truque racial de classe não conjuradora fica sem).
- Testes: `character-sheet/spell-mechanics.unit.ts` + 2 casos em `character-sheet.service.unit.ts`.

**Web**
- `roll-modal/spell-roll-config.ts`: `spellRollConfig(spell, slotLevel)` monta o `AbilityRollConfig`.
- `roll-modal`: `autoHit` (pula o d20) e `instances` (repete ataque+dano por raio, com "PRÓXIMO:
  RAIO 2 DE 3" e "ENCERRAR"; o título mostra o progresso, que também vai pro log da sessão).
- `player-actions-modal` e `character-sheet`: lançar abre o modal depois de gastar o espaço;
  **truques passam a ter botão "Lançar truque"** (sem gastar espaço; sem mecânica, só anuncia).

**Simplificações aceitas na fase 1** (o mestre aplica pela descrição): metade do dano ao errar e
dano no turno seguinte da Flecha Ácida; cura do Toque Vampírico; dano repetido do Raio de Bruxa;
condição do Raio Adoecente; tipo da Orbe Cromática aparece como "à escolha"; Mão de Bigby só
Punho Cerrado; Mísseis Mágicos rolam todos os dardos juntos (cada dado aparece separado).

**Conteúdo a conferir pelo usuário**: os números acima vieram das descrições do banco (já
conferidas com o livro). A descrição da **Rajada Mística** no banco perdeu o parágrafo dos feixes
extras por nível (o `magias.txt` tem: 2 no 5º, 3 no 11º, 4 no 17º) — o catálogo usa a regra do
livro; o texto do banco pode ser completado.

### Fase 2 — resistência (2026-10-16, api `a9ac41b`, web `659710b`)

**Com dano (47 magias)** — o modal abre direto no dano (sem d20 do conjurador), mostra
"CD X de <Atributo> — metade do dano se passar / sem dano se passar / dano total sempre" e, depois
de rolar, "Quem passar na resistência: N" quando é metade. O mestre aplica em cada alvo.
- Truques (escala pelo nível, sem dano se passar): Chama Sagrada, Espirro Ácido, Rajada de
  Veneno, Zombaria Viciosa.
- 1º–3º: Braços de Hadar, Mãos Flamejantes, Onda Troveante, Repreensão Infernal, Sussurros
  Dissonantes, Despedaçar, Esfera Flamejante, Esquentar Metal (dano total sempre), Raio Lunar,
  Bola de Fogo, Convocar Relâmpagos, Espíritos Guardiões, Fome de Hadar (só o ácido),
  Glifo de Vigilância (Runa Explosiva), Relâmpago.
- 4º–9º: Assassino Fantasmagórico, Muralha de Fogo, Tempestade de Gelo (2d8 + 4d6), Tentáculos
  Negros de Evard, Coluna de Chamas, Cone de Frio, Conjurar Saraivada, Névoa Mortal, Onda
  Destrutiva, Praga de Insetos, Círculo da Morte, Corrente de Relâmpagos, Desintegrar (+40),
  Doença Plena, Esfera Congelante de Otiluke, Muralha de Espinhos, Muralha de Gelo, Raio Solar,
  Bola de Fogo Controlável, Dedo da Morte (+30), Tempestade de Fogo, Enfraquecer Intelecto (dano
  total sempre), Explosão Solar, Nuvem Incendiária, Tsunami, Chuva de Meteoros (40d6),
  Encarnação Fantasmagórica.

**Sem dano rolável (66 magias)** — não abrem modal; o toast "LANÇOU" na mesa mostra "CD X de
<Atributo>". Inclui as de dano especial demais pra um botão (Símbolo, Terremoto, Muralha
Prismática, Tempestade da Vingança, Rajada Prismática, Força Fantasmagórica, Rogar Maldição…).

**Fora**: Contato Extraplanar (CD fixa 15) e as que somam dano no próximo ataque com arma
(Destruições, Golpe Constritor, Saraivada de Espinhos, Flecha Relampejante → fase 4).

**API**: `SpellMechanics` ganhou `kind: 'save'`, `save {ability, onSuccess}`, `extraDice`;
`SpellRoll` ganhou `save_ability`/`save_dc`/`save_on_success` e `extra_dice` por círculo.
`spell_cast` (anúncio) aceita `save_dc`/`save_ability` opcionais (validados juntos).
**Web**: `spellRollConfig` monta a resistência; `roll-modal` com `save` e `extraDice`; toast com a CD.

**Descrições corrigidas no banco de produção** (2026-10-16, autorizado pelo usuário, texto do
`magias.txt`): Zombaria Viciosa (estava Carisma → Sabedoria), Onda Troveante (faltava o "+1d8
por círculo"), Rajada Mística (faltavam os feixes por nível), Onda Destrutiva ("5d5" → 5d6 — o
próprio livro imprimiu 5d5, erro de impressão).

### Fase 3 — cura (2026-10-16, api `3eb6902`, web `bf06297`)

Lançar abre o modal direto na rolagem de cura (dado + modificador de conjuração), registrada no
log da sessão como `roll_type: 'heal'` (tipo novo na API e no web; o banco não tem CHECK nessa
coluna) e sem o impacto de dano em tela. O mestre/jogador aplica a cura no PV.
- Curar Ferimentos (1d8), Palavra Curativa (1d4), Oração Curativa (2d8), Palavra Curativa em
  Massa (1d4), Curar Ferimentos em Massa (3d8) — todas + mod. e +1 dado por círculo.
- Aura de Vitalidade: 2d6 sem modificador (a cada ação bônus).
- Regeneração: 4d8 + 15 (o 1 PV por turno depois fica com o mestre).
- Vitalidade Falsa: **PV temporários** 1d4 + 4, +5 por círculo acima do 1º.
- **Clérigo do Domínio da Vida**: Discípulo da Vida soma 2 + círculo do espaço (só cura de PV,
  1º círculo ou maior); Cura Suprema (nv17) usa o valor máximo dos dados.
- Fora: valores fixos sem dado (Cura Completa, Palavra de Poder Curar, Cura Completa em Massa,
  Armadura de Agathys) e a cura do Toque Vampírico (metade do dano causado).

### Fase 4 — crítico, magias que somam dano no ataque e aplicar no alvo (2026-10-16, api `4f3b155`, web `5492760`)

**Crítico** (web, `roll-modal`): 20 natural no d20 do ataque (arma ou magia) → "ACERTO CRÍTICO!",
sem a opção "não acertei", e o dano rola o **dobro de todos os dados** (arma/magia, extras,
Destruição Divina e magias somadas); o modificador não dobra. Vale também por raio/feixe.

**Magias que somam dano no ataque** (`kind: 'rider'` no catálogo da API):
- Destruições — Colérica (1d6 psíquico, SAB), Lancinante (1d6 fogo +1d6/círculo, CON), Troveante
  (2d6 trovejante, FOR), Estonteante (4d6 psíquico, SAB): ataque corpo a corpo com arma; Cegante
  (3d8 radiante, CON) e Banidora (5d6 energia — o livro traduzido traz 5d6, o original é 5d10):
  qualquer arma. **Gastam o espaço no acerto**: no modal, antes do dano, "Usar uma magia neste
  acerto?" com uma opção por círculo disponível (igual à Destruição Divina); anuncia a magia na
  mesa com a CD do efeito extra, que aparece também depois do dano. Na lista de magias o botão de
  lançar delas vira "use ao acertar um ataque com arma" (não gasta o espaço duas vezes).
- Bruxaria (1d6 necrótico, **qualquer ataque**, inclusive ataque mágico), Marca do Caçador (1d6,
  arma) e Manto do Cruzado (1d4 radiante, arma): lançadas antes (gastam o espaço ao lançar);
  no acerto o jogador marca "Magias ativas no alvo". Em vários raios, a Destruição vale só no
  primeiro; as contínuas continuam marcadas.
- Lâmina Flamejante entrou como ataque mágico (3d6 fogo, +1d6 a cada 2 círculos).
- Fora: Golpe Constritor, Saraivada de Espinhos, Flecha Relampejante (dano por turno/em área) e
  Arma Elemental (mexe no bônus de ataque).

**Aplicar no alvo (opcional)** — decisão inicial do usuário: manter as permissões de PV; em
2026-10-17 (versão 1.1.1) o usuário liberou o jogador pra aplicar em aliados e monstros.
- A sessão monta os alvos: mestre → todos os jogadores, NPCs e monstros; jogador → todos os
  jogadores (quem rolou primeiro), NPCs e os monstros **revelados** (só dano, `damageOnly`, sem
  ver o PV). Sem alvos, nada muda (o modal encerra sozinho como antes).
- O jogador aplica por `POST /api/game-session/{id}/apply-amount` (`id_character` de quem rolou,
  alvo, quantidade, tipo): o servidor confere que ele controla quem rolou, calcula o PV
  (`hp-math.ts`, mesmas regras do lote + Resistência Implacável), publica os eventos de PV e um
  aviso `amount_applied` ("Ana APLICOU 8 de dano em Goblin, Orc" — alvos seguidos do mesmo valor
  juntam num toast). Monstro escondido = 404 pro jogador. O mestre continua no caminho antigo.
- Desde 1.1.2 (2026-10-18) os alvos são marcados em lista (vários de uma vez, magia em área),
  cada um com o seu "PASSOU"/"ESQUIVA" e o valor já com resistência/Evasão; só a cura
  distribuída continua alvo a alvo.
- Com alvos, depois de rolar dano/cura o modal mostra "Aplicar…? (opcional)": escolhe o alvo,
  "APLICAR N" (e "PASSOU: N/2" nas resistências que dão metade), pode aplicar em vários alvos
  (área) e só fecha no "CONCLUIR". Erro de ataque não oferece aplicar.
- Regras ao aplicar: dano em jogador consome a vida temporária primeiro; cura de magia vai só até
  o máximo (não vira PV temporário); PV temporários não acumulam (fica o maior) e só em jogador;
  NPC/monstro entre 0 e o máximo. Usa os mesmos endpoints de PV (a API continua validando).

### Próximos passos possíveis
No [`backlog.md`](../backlog.md), seção "Magias".

## Efeitos de tela das magias (2026-10-16, web `7ac13e1`)

Mesmo mecanismo do impacto de dano (`DamageImpactService` + `<app-damage-impact>`, respeita o
liga/desliga "efeitos de tela" e o "reduzir movimento" do sistema). Só CSS, estilo pixel art, sem
imagens. Componente novo `spell-impact/`.
- **Magia de dano**: projétil atravessa a tela até o centro e explode (núcleo, anel, 8/12/16
  partículas conforme a intensidade, 1 flash na cor do elemento; treme na intensidade 3). Cores
  por elemento: fogo, frio, elétrico, trovejante, ácido, veneno, necrótico, radiante, psíquico,
  energia; físicos/"à escolha" usam um violeta arcano.
- **Cura**: véu verde, névoa subindo do pé da tela, brilhos e "+N" verde (2 s). PV temporários:
  variante azul-clara.
- **Arma** continua com o golpe + flash.
- O efeito sai do **tipo e do rótulo da rolagem** que já vão pro log (`spellEffectFor` em
  `services/spell-effect.ts`: "Dano: <magia> (<tipo>)" → elemento; `heal` → névoa) — quem só
  recebe o toast vê o mesmo efeito, sem mudança na API. Mudança de comportamento: rolagem de
  cura passou a disparar efeito (antes não disparava nada).
- Melhoria possível: trocar o CSS por sprites pixel art (o usuário se ofereceu pra buscar).
