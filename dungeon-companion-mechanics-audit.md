# Auditoria de Automação Mecânica — Dungeon Companion (D&D 5e)

Registrado em 2026-09-12. Auditoria completa de todas as features de `featuresByLevel` (nível
1–20) das 12 classes e suas subclasses em `rules.ts`, mais o catálogo de `feats.ts`, classificando
cada uma por quão viável seria automatizar (hoje a maioria só existe como texto narrativo na
ficha). Não inclui raça/sub-raça/antecedente (já auditados em 2026-09-11, ver
`dungeon-companion-levelup-plan.md`).

## Convenções adotadas

1. **Vantagem/desvantagem sem bônus numérico** e **resistência/imunidade a dano ou condição sem
   número associado** → **Narrativa**. Não existe campo de "resistência a dano" nem de
   vantagem/desvantagem na ficha hoje.
2. **CDs fixas (8 + bônus de proficiência + modificador)** sem gatilho externo → **Fácil**, mesmo
   padrão já usado em `spell_save_dc`.
3. **Efeitos que dependem de ver o resultado de uma rolagem antes de decidir**, ou de um evento
   externo (ser atingido, cair a 0 PV, rolar iniciativa, matar com magia) → **Difícil/reativa** —
   não existe motor de gatilhos/reações nem simulação de rolagens no app.
4. **Efeitos que alteram o que uma magia específica faz quando conjurada** (cura extra, dano
   extra em truque) → também **Difícil** — a ficha só lista magias conhecidas/preparadas por
   nome, não resolve o que elas fazem.
5. **Velocidades alternativas (voo, escalada, natação)** → **Média** — só existe um campo de
   deslocamento a pé hoje.
6. Itens já decididos como fora de escopo em sessões anteriores (Ataque Extra, Defletir
   Projéteis/rerolagem de Alma de Diamante, Caminho dos Quatro Elementos, Magia Selvagem d100,
   Círculo da Terra por terreno, Conclave do Caçador, Draconato) **não foram reabertos**, só
   citados pra manter a lista nível-a-nível completa.

## Achados de arquitetura mais relevantes

1. **`TRACKABLE_RESOURCES` é 1:1 por classe** (`Record<id_class, TrackableResource>`). Bárbaro,
   Clérigo e Monge (já feitos) só precisam de 1 cada. Mas o Guerreiro precisaria de 3 ao mesmo
   tempo (Surto de Ação, Retomar Fôlego, Indomável) e **hoje não tem nem os dados em
   `resources`, nem entrada em `TRACKABLE_RESOURCES`** — maior buraco de conteúdo achado.
   Paladino precisaria de 2 (Canalizar Divindade + Curar pelo Toque, esse em formato de "pool").
   Generalizar essa estrutura pra lista é pré-requisito de vários itens "média".
2. **O dicionário `resources` de `featuresByLevel` só é exposto no preview de level-up
   (`getLevelUpPreview`), nunca na ficha persistida.** Valores como o dado atual de "Ataque
   Furtivo" não aparecem na ficha final depois de criado/subido de nível. Resolver isso destrava
   de graça vários itens "fácil" (Ataque Furtivo, Golpe Divino, Crítico Brutal, Matador de
   Inimigos, Artes Marciais).
3. **Estilo de Luta do Paladino e do Ranger é a maior vitória fácil isolada**: `calcArmorClass`/
   `buildWeaponActions` já são agnósticos de classe (só olham a string `fightingStyle`) — falta
   só configurar `fightingStyleChoice` nessas duas classes pra Arqueria/Defesa/Duelo funcionarem
   de graça, igual já funciona pro Guerreiro.
4. **`MONK_CHI_ABILITIES` é o padrão certo pra reaproveitar** em qualquer classe com "pool de
   pontos + habilidades ativáveis" (Feiticeiro/Pontos de Feitiçaria, Guerreiro Mestre de
   Batalha/dados de superioridade) — mesma forma de dado, só troca o nome do recurso.

## Resumo executivo

| Categoria | Aprox. contagem | Observação |
|---|---|---|
| **Fácil** | ~30 | Reaproveitam padrões já construídos (dado extra tipo Ataque Furtivo, CA sem armadura de subclasse, CD fixa, HP por nível, extensão de proficiência de resistência, meia-proficiência, Estilo de Luta pro Paladino/Ranger) |
| **Média** | ~55 | Predominam: novos recursos rastreáveis, novas telas de escolha (ferramentas, manobras, invocações, metamágica), deslocamento de voo |
| **Difícil/reativa** | ~55 | Reações a dano/ataque, gatilhos de "matar/reduzir a 0 PV"/"iniciativa com recurso zerado", efeitos que alteram o resultado de uma magia conjurada |
| **Narrativa** | ~90 | Maioria absoluta — vantagem/desvantagem/resistência/imunidade sem número, que a ficha não modela |
| **Fora de escopo (decisão já tomada)** | ~20 | Ver convenção 6 acima |

## Ordem sugerida de implementação (incremental, fácil → média)

1. **Expor `resources` na ficha persistida** (não só no preview) — destrava Ataque Furtivo, Golpe
   Divino, Crítico Brutal, Matador de Inimigos, Artes Marciais de uma vez.
2. **Estilo de Luta pro Paladino e Ranger** — praticamente grátis, reaproveita 100% do código.
3. **Talento Duro** — plugue direto em `hpBonusPerLevel`, parâmetro já existe.
4. **Aura de Proteção do Paladino (bônus a si mesmo)** e **Mente Escorregadia do Ladino (nv15)**
   — extensões pequenas de `buildAttributeBlocks`.
5. **Resiliência Dracônica** (Feiticeiro, Linhagem Dracônica) — reaproveita `calcArmorClass`/
   `hpBonusPerLevel`.
6. **CDs fixas informativas** (Presença Intimidante do Bárbaro, Tranquilidade do Monge, Abjurar
   Inimigo do Paladino, Encantamento Hipnotizante do Mago, Golpe Divino/Radiação do
   Amanhecer/Preservar a Vida do Clérigo).
7. **Generalizar `TRACKABLE_RESOURCES` pra lista** (pré-requisito), depois por classe: Guerreiro
   (Retomar Fôlego/Surto de Ação/Indomável), Bardo (Inspiração Bárdica), Paladino (Canalizar
   Divindade + Curar pelo Toque), Feiticeiro (Pontos de Feitiçaria), Mago/Druida (Recuperação
   Arcana/Natural), Bruxo (Arcana Mística/Mestre Místico).
8. **Palma Vibrante e Artes Sombrias do Monge** — encaixam direto em `MONK_CHI_ABILITIES`.
9. **Novas telas de escolha** (talento Resiliente, Afiar Habilidades, Estudioso da Guerra,
   Ancestral Dracônico, Dádiva do Pacto do Bruxo) — reaproveitam o padrão de
   `ToolProficiencyChoice`/`FightingStyleChoice`.
10. **Catálogos grandes por último** (Invocações Místicas do Bruxo, Metamágica, Manobras do
    Mestre de Batalha) — maior escopo, cada um comparável a uma feature própria.

---

## Tabela completa por classe

### 1. Bárbaro (id 1)
*Já automatizado: Fúria (recurso), Defesa sem Armadura (CA), Movimento Rápido (nv5), Campeão
Primitivo (nv20).*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 2 | Ataque Descuidado | Narrativa | Vantagem/desvantagem só |
| 2 | Sentido de Perigo | Narrativa | Vantagem só |
| 5 | Ataque Extra | Fora de escopo | Decisão já tomada |
| 7 | Instinto Selvagem | Narrativa | Vantagem em iniciativa |
| 9/13/17 | Crítico Brutal (+1/+2/+3 dados) | **Fácil** | Dado extra por nível, tipo Ataque Furtivo |
| 11 | Fúria Implacável | Difícil/reativa | Gatilho: cair a 0 PV em fúria |
| 15 | Fúria Persistente | Narrativa | Condição de término, sem número |
| 18 | Força Indomável | Narrativa | Reinterpreta teste de Força não simulado |

**Caminho do Furioso**: Frenesi (Média), Fúria Inconsciente (Narrativa), Presença Intimidante
(Fácil, CD fixa), Retaliação (Difícil/reativa).

**Guerreiro Totêmico**: Espírito Totêmico ×3 (Narrativa), Aspecto da Besta ×3 (Narrativa, exceto
Águia/voo = Média), Andarilho Espiritual (Narrativa), Respeito da Besta ×3 (Narrativa, exceto
Águia/voo = Média).

### 2. Bardo (id 2)
*Já automatizado: Conjuração, Aptidão/Especialização (ExpertiseGrant).*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1/5/10/15 | Inspiração Bárdica (d6→d12) | **Média** | Novo `TrackableResource`, usos = mod. CAR |
| 2 | Versatilidade | **Fácil** | Meia-proficiência em perícia não-treinada |
| 2/9/13/17 | Canção do Descanso (d6→d12) | Média | Cura extra em descanso curto |
| 5 | Fonte de Inspiração | Média | Recarga em descanso curto (mesmo item acima) |
| 6 | Canção de Proteção | Difícil/reativa | Gatilho: aliado atingido |
| 10/14/18 | Segredos Mágicos | Média | Escolha cross-classe |
| 20 | Inspiração Superior | Difícil/reativa | Gatilho: iniciativa com 0 usos |

**Colégio do Conhecimento**: Proficiência Adicional 3 perícias (Média), Palavras de Interrupção
(Difícil/reativa), Magias Adicionais (Média), Perícia Inigualável (Difícil/reativa).

**Colégio da Bravura**: Proficiência Adicional fixa (**Fácil**), Inspiração em Combate
(Difícil/reativa), Ataque Extra (Fora de escopo), Magia de Batalha (Narrativa).

### 3. Bruxo (id 3)
*Já automatizado: Magia do Pacto.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 2 | Invocações Místicas | Média (escopo grande) | Catálogo novo tipo talentos |
| 3 | Dádiva do Pacto | Média | Escolha nova (Corrente/Lâmina/Grimório) |
| 11/13/15/17 | Arcana Mística | Média | Bucket cross-classe |
| 20 | Mestre Místico | Média | Recurso 1×/descanso longo |

**O Corruptor**: Bênção do Corruptor (Difícil/reativa), Sorte do Próprio Obscuro
(Difícil/reativa), Resistência Demoníaca (Narrativa), Lançar no Inferno (Média).

**A Arquifada**: Presença Feérica (Média), Névoa de Fuga (Difícil/reativa), Defesa Sedutora
(split Narrativa/Difícil), Delírio Sombrio (Média).

**O Grande Antigo**: Mente Desperta (Narrativa), Proteção Entrópica (Difícil/reativa), Escudo de
Pensamentos (split), Criar Lacaio (Narrativa).

### 4. Clérigo (id 4)
*Já automatizado: Conjuração, Canalizar Divindade (recurso), Bênção do Conhecimento
(ExpertiseGrant).*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 5/8/11/14/17 | Destruir Mortos-Vivos | Narrativa | Limiar de monstro, não do jogador |
| 10/20 | Intervenção Divina + aprimoramento | Narrativa | Cooldown por dias, fora do padrão atual |

**Domínios (padrão comum)**: Proficiência Adicional fixa nv1 (**Fácil**, 4 dos 7 domínios); CDs
fixas de Canalizar Divindade (Luz/Vida no nv2, Golpe Divino em quase todos no nv8) = **Fácil**;
resto majoritariamente Narrativa ou Difícil (depende de gatilho ou de resolver efeito de magia).

### 5. Druida (id 5)
*Já automatizado: Conjuração.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Druidico | Narrativa | Idioma |
| 2/4/8/20 | Forma Selvagem (usos) + transformação | Média (contador) / Difícil (transformação em si — falta motor de forma alternativa) |
| 18/20 | Corpo Atemporal / Magias da Besta / Arquidruida | Narrativa/Difícil/Média (split) |

**Círculo da Terra**: Truque Adicional (Média), Recuperação Natural (Média), Magias de Círculo
(Fora de escopo), Passo de Terreno (Narrativa), Proteção Natural (Narrativa), Santuário Natural
(Difícil/reativo).

**Círculo da Lua**: todas as formas de combate dependem do motor de Forma Selvagem ausente
(Difícil); Ataque Primordial (Narrativa).

### 6. Feiticeiro (id 6)
*Já automatizado: Conjuração. Magia Selvagem (d100) já é simplificação aceita.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 2 | Fonte de Magia (Pontos de Feitiçaria) | Média | Novo recurso + conversão com `slots_expended` |
| 3/10/17 | Metamágica | Média (escopo grande) | Catálogo novo, efeitos individuais majoritariamente Narrativa |
| 20 | Restauração Mística | Média | Extensão da recarga do recurso acima |

**Linhagem Dracônica**: Ancestral Dracônico/escolha (Média), Resiliência Dracônica (**Fácil**,
reaproveita `calcArmorClass`/`hpBonusPerLevel`), Afinidade Elemental (split), Asas de Dragão
(Média/voo), Presença Dracônica (Média, já usa recurso do nv2).

**Magia Selvagem**: Surto/Marés do Caos/Caos Controlado (Fora de escopo), Bombardeio de Magia
(Difícil), Dobrar a Sorte (Difícil/reativa).

### 7. Guerreiro (id 7)
*Já automatizado: Estilo de Combate (3 de 6). Ataque Extra fora de escopo.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Retomar Fôlego | Média | Guerreiro não tem NENHUM `resources` hoje — maior gap de dados |
| 2/17 | Surto de Ação | Média | Novo recurso, só contador |
| 9/13/17 | Indomável | Média | Novo recurso, rerolagem em si não simulada |

**Campeão**: Crítico Aprimorado/Superior (Narrativa), Atletismo Extraordinário (split
Fácil/Narrativa), Estilo de Combate Adicional (Média, `chosen_fighting_style` precisa virar
lista), Sobrevivente (Difícil).

**Mestre de Batalha**: Superioridade em Combate (Média, recurso + catálogo de manobras),
Estudioso da Guerra (Média), Conheça Seu Inimigo (Narrativa), Implacável (Difícil/reativa).

**Cavaleiro Arcano** (conjuração já automatizada): Vínculo com Arma (Média), Magia de Guerra
(Narrativa), Golpe Místico (Narrativa), Investida Arcana (Narrativa).

### 8. Ladino (id 8)
*Já automatizado: Especialização (ExpertiseGrant).*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Ataque Furtivo | Média | Só em `resources`, não exposto na ficha final |
| 5/7 | Esquiva Sobrenatural/Evasão | Difícil/reativa | Depende de teste de resistência |
| 11/20 | Talento Confiável/Golpe de Sorte | Difícil/reativa | Depende de rolagem não simulada |
| 15 | Mente Escorregadia | **Fácil** | Proficiência em resistência de SAB |
| 18 | Elusivo | Narrativa | Vantagem/desvantagem só |

**Ladrão**: tudo Narrativa (economia de ação/utilidade sem número).

**Assassino**: Proficiência Adicional fixa (**Fácil**), Assassinar (Narrativa, app não resolve
crítico), resto Narrativa/Difícil.

**Trapaceiro Arcano** (conjuração já automatizada): maioria Narrativa; Ladrão de Magia
(Difícil/reativo).

### 9. Mago (id 9)
*Já automatizado: Conjuração com preparo.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Recuperação Arcana | Média | Recurso 1×/descanso longo, reduz `slots_expended` |
| 18/20 | Dominar Magia/Assinatura Mágica | Média | Bucket "magia grátis" |

**Escolas de Magia** (padrão comum): "[Escola] Instruída" nv2 = Narrativa (custo de
cópia/tempo/ouro sem sistema); Encantamento Hipnotizante (**Fácil**, CD fixa); Pedra de
Transmutador (split); Prodígio da Adivinhação (Média, recurso); resto majoritariamente
Narrativa/Difícil (depende de resolver efeito de magia).

### 10. Monge (id 10)
*Já automatizado: Defesa sem Armadura, Deslocamento, Pontos de Chi + 5 habilidades ativáveis,
Alma de Diamante (resistências). Decisão tomada: Defletir Projéteis, rerolagem de Alma de
Diamante, Quatro Elementos.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Artes Marciais (dado desarmado) | Média | Precisa de "ação de ataque desarmado" sintética |
| 4/20 | Queda Lenta/Auto Aperfeiçoamento | Difícil/reativa | Gatilhos (cair, iniciativa) |
| 7 | Evasão/Mente Tranquila | split | Evasão difícil, Mente Tranquila narrativa |
| 9 | Aprimoramento de Movimento sem Armadura | **Já automatizado** | Só o texto "andar em paredes" é narrativo |
| 10/13/15 | Pureza Corporal/Idiomas/Corpo Atemporal | Narrativa | — |

**Mão Aberta**: Técnica da Mão Aberta (Difícil/reativa), Integridade Corporal (Média), Tranquilidade
(**Fácil**, CD fixa), Palma Vibrante (**Fácil**, encaixa em `MONK_CHI_ABILITIES`).

**Sombra**: Artes Sombrias (**Fácil**, encaixa em `MONK_CHI_ABILITIES`), Passo nas Sombras
(Narrativa), Técnica de Mão Oculta (Difícil/reativa), Manto de Sombras (Narrativa).

### 11. Paladino (id 11)
*Sem nenhum recurso rastreável hoje, apesar de ganhar Estilo de Luta no nv2.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Sentido Divino | Média | Novo recurso (1+mod. CAR) |
| 1 | Curar pelo Toque | Média | Recurso em "pool" (5×nível) |
| 2 | Estilo de Luta | **Fácil** | Só falta configurar `fightingStyleChoice` — calc já é agnóstica de classe |
| 2 | Destruição Divina | Difícil/reativa | Gatilho: acertar ataque |
| 6 | Aura de Proteção (a si mesmo) | **Fácil** | Extensão de `buildAttributeBlocks` |
| 6 | Aura de Proteção (a aliados) | Fora de escopo | Ficha é de 1 personagem só |
| 14 | Toque Purificador | Média | Novo recurso |

**Canalizar Divindade (comum a todos os juramentos, nv3)**: **Fácil** — extensão trivial, mesmo
padrão do Clérigo.

**Devoção**: Arma Sagrada (Média, precisa de "estado ativo"), Expulsar os Infiéis (Narrativa),
Halo Sagrado (split).

**Anciões**: Ira da Natureza/Expulsar os Ímpios (Narrativa), Sentinela Imortal
(Difícil/reativo), Campeão dos Anciões (split).

**Vingança**: Abjurar Inimigo (**Fácil**, CD fixa), Voto de Inimizade (Narrativa), Vingador
Implacável/Alma de Vingança (Difícil/reativo), Anjo Vingador (split).

### 12. Ranger — Patrulheiro (id 12)
*Sem `fightingStyleChoice` configurado apesar de ganhar Estilo de Luta no nv2. Este dataset não
modela Ataque Extra no nv5 do Ranger (diferente do PHB) — lacuna de dado, não feature a
classificar.*

| Nível | Feature | Classificação | Nota |
|---|---|---|---|
| 1 | Inimigo Favorito/Explorador Natural | Narrativa | — |
| 2 | Estilo de Luta | **Fácil** | Mesma extensão trivial do Paladino |
| 3 | Consciência Primitiva | Média | Gasta `slots_expended` já rastreado, só falta ação de UI |
| 20 | Matador de Inimigos | **Fácil** | +mod. SAB, 1×/turno, informativo (tipo Ataque Furtivo) |
| 6/8/10/14/18 | Resto | Narrativa | — |

**Conclave do Caçador**: Fora de escopo (decisão já tomada).

**Conclave da Besta**: Companheiro Animal — exige uma "segunda ficha" completa (PV/CA/ataques do
companheiro), sistema inteiro inexistente hoje (Difícil, fora de escopo funcional).

## Catálogo de Feats (`feats.ts`)

`abilityIncrease` já é aplicado automaticamente. Classificação abaixo é só do resto do efeito.

| Feat | Efeito restante | Classificação |
|---|---|---|
| Atleta | Custo de movimento reduzido | Narrativa |
| **Duro** | +2 PV/nível retroativo | **Fácil** — plugue direto em `hpBonusPerLevel` |
| Observador | Percepção passiva +5 / Investigação passiva +5 / ler lábios | split (percepção = **Fácil**; resto = Narrativa) |
| Resiliente | Proficiência em resistência à escolha | Média — falta tela de escolha |
| **Alerta** | +5 iniciativa | **Fácil** — soma direto em `initiative` |
| Alerta | Não pode ser surpreendido | Narrativa |
| Afiar Habilidades | 3 perícias/ferramentas à escolha | Média |
| Iniciado em Magia | 2 truques + 1 magia de outra classe | Média (escopo grande) |
| Duelista Defensivo | +proficiência à CA como reação | Difícil/reativa |
