---
resumo: Conteúdo mecânico das subclasses extraído do livro, gravado em rules.ts (SUBCLASSES), com nível de confiança.
tipo: conceito
status: ativo (pontos não confirmados no backlog)
atualizado: 2026-09-10
---

# Dungeon Companion — Subclasses (Fase 2): registro do conteúdo coletado

Este documento registra o conteúdo mecânico de subclasse extraído das fotos do livro (PHB)
que foram enviadas ao longo desta sessão, classe por classe, e que já está gravado em
`dungeon-companion-api/src/services/character-sheet/rules.ts` (`SUBCLASSES`).

**Por que esse arquivo existe**: a conversa em que essas imagens foram processadas ficou muito
longa, e o conteúdo das imagens em si não fica garantido no contexto de sessões futuras (o
sistema comprime conversas longas, e imagens são as primeiras coisas descartadas nesse
processo). Esse `.md` é a versão legível e persistente do que foi extraído — o código em
`rules.ts` continua sendo a fonte de verdade (é o que a aplicação de fato usa), mas este
arquivo serve de referência humana e de registro do que ainda não foi confirmado.

Ver também `dungeon-companion/historico/levelup-plan.md` (seção "Fase 2 — pendências futuras") pras
simplificações deliberadas (sub-sistemas complexos demais pra modelar nesta fase, como a
tabela de Surto de Magia Selvagem do Feiticeiro).

## Legenda de confiança

- ✅ **Confirmado** — você conferiu contra o livro e validou.
- ⚠️ **Não conferido** — extraído da foto complementado por conhecimento próprio de D&D 5e
  (SRD/PHB "oficial"), sem confirmação sua. Pode ter pequenas divergências da edição/tradução
  do seu livro específico.

---

## Guerreiro — Arquétipo Marcial (nível 3) ⚠️

### Campeão
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Crítico Aprimorado | Seus ataques com arma adquirem uma margem de acerto crítico de 19 e 20 nas jogadas de ataque. |
| 7 | Atletismo Extraordinário | Adiciona metade do bônus de proficiência (arredondado pra cima) em testes de Força/Destreza/Constituição sem proficiência. Salto longo com corrida aumenta em 0,3m × mod. de Força. |
| 10 | Estilo de Combate Adicional | Pode escolher um segundo Estilo de Combate da classe. |
| 15 | Crítico Superior | Margem de acerto crítico vira 18-20. |
| 18 | Sobrevivente | No início de cada turno, recupera 5 + mod. de Constituição em PV, se estiver com metade da vida ou menos e não com 0 PV. |

### Mestre de Batalha
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Superioridade em Combate | 3 manobras conhecidas, 4 dados de superioridade (d8). CD = 8 + bônus de proficiência + mod. de Força ou Destreza. |
| 3 | Estudioso da Guerra | Proficiência com uma ferramenta de artesão à escolha. |
| 7 | Conheça Seu Inimigo | Observando 1 min. fora de combate, aprende como as capacidades de uma criatura se comparam às suas. |
| 7 | Mais Manobras e Dados | +2 manobras (5 total), +1 dado (5 dados). |
| 10 | Superioridade em Combate Aprimorada | Dados viram d10. |
| 15 | Mais Manobras e Dados | +2 manobras (7 total), +1 dado (6 dados). |
| 15 | Implacável | Se rolar iniciativa sem dados de superioridade, recupera 1. |
| 18 | Superioridade em Combate Aprimorada (d12) | Dados viram d12. |

*(Progressão de manobras/dados confirmada por você — ✅.)*

### Cavaleiro Arcano (terço-conjurador — INT, lista de Mago, só Evocação/Abjuração)
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Conjuração | Amplia conhecimento em magias, focada em Evocação/Abjuração. |
| 3 | Vínculo com Arma | Ritual de vínculo com até 2 armas; invoca a arma pra mão como ação bônus. |
| 7 | Magia de Guerra | Ao conjurar um truque com a ação, pode atacar com arma como ação bônus. |
| 10 | Golpe Místico | Ao acertar com arma, alvo tem desvantagem no próximo teste de resistência contra magia sua. |
| 15 | Investida Arcana | Ao usar Surto de Ação, pode se teleportar até 9m. |
| 18 | Magia de Guerra Aprimorada | Mesmo que Magia de Guerra, mas com qualquer magia (não só truque). |

Truques/Magias Conhecidas por nível (3-20): `2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4` (truques) /
`3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,12,13,14` (magias). Espaços de magia: tabela padrão de
terço-conjurador (`THIRD_CASTER_SLOTS`), igual à do Trapaceiro Arcano.

⚠️ **Ponto de menor confiança**: o mapeamento nível→feature (Golpe Místico no 10º, Investida
Arcana no 15º, Magia de Guerra no 7º/Aprimorada no 18º) veio de uma leitura mais densa de
coluna dupla na foto.

---

## Bárbaro — Caminho Primitivo (nível 3) ✅

### Caminho do Furioso
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Frenesi | Ao entrar em fúria, pode fazer 1 ataque corpo-a-corpo extra como ação bônus em cada turno seguinte. Sofre 1 nível de exaustão quando a fúria acaba. |
| 6 | Fúria Inconsciente | Imune a ficar amedrontado/enfeitiçado durante a fúria. |
| 10 | Presença Intimidante | Ação pra amedrontar uma criatura a até 9m (teste de Sabedoria, CD 8+prof.+CAR). |
| 14 | Retaliação | Reação pra atacar corpo-a-corpo quem te causou dano a até 1,5m. |

### Guerreiro Totêmico (3 variantes — Urso / Águia / Lobo, modeladas como 3 subclasses separadas)
| Nível | Urso | Águia | Lobo |
|---|---|---|---|
| 3 | Resistência a todo dano exceto psíquico em fúria | Desvantagem em ataques de oportunidade contra você + Disparada como ação bônus em fúria (sem armadura pesada) | Aliados têm vantagem em ataques corpo-a-corpo contra hostis a até 1,5m de você em fúria |
| 6 | Capacidade de carga dobrada; não derruba itens ao cair | Visão aguçada (1,6km, detalhes mínimos) | Rastreia em passo rápido normalmente; furtivo mesmo em passo normal |
| 10 | Andarilho Espiritual (ritual+transe pra visão do espírito totêmico — igual nas 3) | idem | idem |
| 14 | Comunicação com bestas em fúria; hostis com menos PV que você sofrem penalidade de ataque contra outros alvos | Comunicação com bestas em fúria; ganha deslocamento de voo igual ao seu (sem carga/armadura pesada) | Comunicação com bestas em fúria; ação bônus pra derrubar criatura Grande ou menor ao acertá-la em fúria |

---

## Ladino — Arquétipo de Ladino (nível 3) ✅

### Ladrão
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Mãos Rápidas | Ação bônus da Ação Ardilosa pra Usar Objeto extra, Prestidigitação, ferramentas de ladrão à distância, etc. |
| 3 | Andarilho de Telhados | Escalar sem custo extra de movimento; salto aumenta com mod. de Destreza. |
| 9 | Furtividade Suprema | Vantagem em Destreza (Furtividade) se não mover mais que metade do deslocamento no turno. |
| 13 | Usar Instrumento Mágico | Pode usar qualquer item mágico restrito a classe/raça. |
| 17 | Reflexos de Ladrão | Age duas vezes no primeiro turno de combate. |

### Assassino
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Proficiência Adicional | Kit de disfarce + kit de venenos. |
| 3 | Assassinar | Vantagem contra quem não agiu ainda; crítico automático contra surpreendidos. |
| 9 | Especialização em Infiltração | Cria identidade falsa (7 dias, 25po). |
| 13 | Impostor | Imita fala/escrita/comportamento após 3h de estudo. |
| 17 | Golpe Letal | Ataque surpresa: CON DC 8+prof.+DES ou dano dobrado. |

### Trapaceiro Arcano (terço-conjurador — INT, lista de Mago, só Ilusão/Encantamento) ✅
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Conjuração | Foco em Ilusão/Encantamento; aprende Mãos Mágicas de graça (não conta no total). |
| 3 | Mãos Mágicas Malabaristas | Mão espectral invisível, pega/guarda objetos, usa ferramentas de ladrão à distância, controle a 9m. |
| 9 | Trapaceiro Versátil | Ação bônus: vantagem de ataque contra criatura a 1,5m da mão espectral. |
| 13 | Ladrão de Magia | Reação pra roubar o conhecimento de uma magia conjurada contra você. |

Truques Conhecidos (3-20): `3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4`. Magias Conhecidas:
`3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,12,13,13`. Espaços de magia: `THIRD_CASTER_SLOTS` (mesma
tabela do Cavaleiro Arcano).

---

## Monge — Tradição Monástica (nível 3) — não confirmado explicitamente, mas leitura direta das páginas

### Caminho da Mão Aberta
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Técnica da Mão Aberta | Ao acertar com Rajada de Golpes: derruba (DES), empurra 4,5m (FOR) ou impede reações. |
| 6 | Integridade Corporal | Ação pra curar 3×nível de monge em PV; 1×/descanso longo. |
| 11 | Tranquilidade | Efeito de santuário ao fim de descanso longo. |
| 17 | Palma Vibrante | Vibrações letais (3 pontos de chi) — CON DC ou cai a 0 PV; senão 10d10 de dano. |

### Caminho da Sombra
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Artes Sombrias | 2 pontos de chi: trevas/visão no escuro/passos sem rastro/silêncio. Ilusão menor à vontade. |
| 6 | Passo nas Sombras | Teleporte 18m entre áreas de penumbra/escuridão + vantagem no próximo ataque. |
| 11 | Técnica de Mão Oculta | 1 ponto de chi ao acertar Rajada de Golpes: impõe escuridão adjacente ao alvo. |
| 17 | Manto de Sombras | Ação pra ficar invisível em penumbra/escuridão. |

### Caminho dos Quatro Elementos ⚠️ (simplificado — ver pendências futuras)
| Nível | Característica |
|---|---|
| 3 | Discípulo dos Elementos — aprende 2 disciplinas elementais (não modeladas individualmente). |
| 6, 11, 17 | Nova Disciplina Elemental — aprende mais uma (ou substitui). |

---

## Bruxo — Patrono Sobrenatural (nível 1, escolhido na criação) ⚠️

### O Corruptor
| Nível | Característica | Descrição |
|---|---|---|
| 1 | Bênção do Corruptor | PV temp. = nível de bruxo + mod. CAR ao reduzir hostil a 0 PV. |
| 6 | Sorte do Próprio Obscuro | +1d10 num teste/resistência, depois de ver o d20. |
| 10 | Resistência Demoníaca | Escolhe um tipo de dano por descanso longo pra ter resistência. |
| 14 | Lançar no Inferno | Ataque/magia manda a criatura pro inferno; 10d10 de dano. |

### A Arquifada
| Nível | Característica | Descrição |
|---|---|---|
| 1 | Presença Feérica | Ação: área de 3m enfeitiça/amedronta (SAB DC). |
| 6 | Névoa de Fuga | Reação ao sofrer dano: teleporte 18m + invisibilidade. |
| 10 | Defesa Sedutora | Imune a enfeitiçar; pode devolver a tentativa. |
| 14 | Delírio Sombrio | Ação: enfeitiça/amedronta e incapacita por 1 min (SAB DC). |

### O Grande Antigo
| Nível | Característica | Descrição |
|---|---|---|
| 1 | Mente Desperta | Telepatia a 9m. |
| 6 | Proteção Entrópica | Reação: desvantagem no ataque contra você; se errar, vantagem no seu próximo ataque. |
| 10 | Escudo de Pensamentos | Imune a telepatia alheia; resistência a dano psíquico + reflete. |
| 14 | Criar Lacaio | Ação: enfeitiça humanoide incapacitado permanentemente, com vínculo telepático. |

**Ponto de menor confiança**: a página misturava as 4 características de cada patrono com
invocações específicas de patrono no mesmo layout — precisei separar por conhecimento próprio
de D&D cruzado com os cabeçalhos das fotos.

---

## Clérigo — Domínio Divino (nível 1, escolhido na criação) — leitura direta das páginas, alta confiança

Todos os domínios seguem o padrão de níveis 1/2/6/8/17 (Golpe Divino aparece em quase todos no
nível 8, evoluindo de 1d8 pra 2d8 no 14º nível — mencionado como nota de texto, sem entrada
própria no nível 14).

| Domínio | Nível 1 | Nível 2 (Canalizar Divindade) | Nível 6 | Nível 8 | Nível 17 |
|---|---|---|---|---|---|
| **Conhecimento** | Bênção do Conhecimento (2 idiomas + 2 perícias com prof. dobrada) | Conhecimento das Eras (proficiência temporária) | Ler Pensamentos | Conjuração Poderosa (mod. SAB no dano de truque) | Visões do Passado |
| **Enganação** | Bênção do Trapaceiro (vantagem em Furtividade pra outra criatura) | Invocar Duplicidade (ilusão de si mesmo) | Manto de Sombras (invisibilidade em penumbra) | Golpe Divino | Duplicidade Aprimorada (2 duplicatas) |
| **Guerra** | Proficiência Adicional + Sacerdote da Guerra (ataque como ação bônus, ×mod. SAB/dia) | Golpe Dirigido (+10 numa jogada de ataque) | Bênção do Deus da Guerra (+10 pra aliado) | Golpe Divino | Avatar da Batalha (resistência a dano físico não-mágico) |
| **Luz** | Labareda Protetora (reação: desvantagem no ataque + cegueira) | Radiação do Amanhecer (2d10+nível de dano radiante em área) | Labareda Aprimorada (estende o alcance da Labareda) | Golpe Divino (radiante) | Coroa de Luz |
| **Natureza** | Proficiência Adicional + Acólito da Natureza (truque de druida + perícia) | Encantar Animais e Plantas | Amortecer Elementos (resistência via reação) | Golpe Divino (ácido/frio/fogo/elétrico/trovão à escolha) | Senhor da Natureza |
| **Tempestade** | Proficiência Adicional + Ira da Tormenta (2d8 reação) | Ira da Tempestade Destruidora (dano máximo) | Golpe de Relâmpago (empurra) | Golpe Divino (elétrico/trovão) | Filho da Tormenta (resistência + voo) |
| **Vida** | Proficiência Adicional + Discípulo da Vida (cura extra) | Preservar a Vida (5×nível em PV pra distribuir) | Curandeiro Abençoado (cura a si mesmo também) | Golpe Divino (radiante) | Cura Suprema (máximo em vez de rolar) |

⚠️ **Ponto de menor confiança**: "Labareda Aprimorada" (Luz, nível 6) pode ser um acréscimo de
errata/reimpressão mais recente do PHB, não do texto original de 2014 — se o seu livro é uma
edição mais nova, está correto deixar como está.

---

## Feiticeiro — Origem de Feitiçaria (nível 1, escolhido na criação) — leitura direta, alta confiança

### Linhagem Dracônica
| Nível | Característica | Descrição |
|---|---|---|
| 1 | Ancestral Dracônico | Escolhe tipo de dragão (define tipo de dano); aprende Dracônico. |
| 1 | Resiliência Dracônica | +1 PV máx./nível; CA = 13+DES sem armadura. |
| 6 | Afinidade Elemental | +mod. CAR no dano do tipo do ancestral; 1 ponto de feitiçaria = resistência 1h. |
| 14 | Asas de Dragão | Ação bônus: asas, voo igual ao deslocamento. |
| 18 | Presença Dracônica | 5 pontos de feitiçaria: aura de admiração/temor 18m. |

### Magia Selvagem
| Nível | Característica | Descrição |
|---|---|---|
| 1 | Surto de Magia Selvagem | 1 em d20 após conjurar → rola na tabela d100 (não modelada). |
| 1 | Marés do Caos | Vantagem 1×/descanso longo, com risco de surto depois. |
| 6 | Caos Controlado | Rola 2× na tabela de surto, escolhe o resultado. |
| 14 | Bombardeio de Magia | Dano máximo num dado → rola de novo e soma. |
| 18 | Dobrar a Sorte | 2 pontos de feitiçaria: 1d4 de bônus/penalidade na jogada de outra criatura. |

---

## Bardo — Colégio de Bardo (nível 3) — leitura direta, alta confiança

### Colégio do Conhecimento
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Proficiência Adicional | 3 perícias à escolha. |
| 3 | Palavras de Interrupção | Reação: gasta dado de Inspiração pra subtrair de uma jogada hostil. |
| 6 | Magias Adicionais | 2 magias de qualquer classe (círculo ≤ metade do nível de bardo). |
| 14 | Perícia Inigualável | Gasta dado de Inspiração pra somar num teste de habilidade próprio. |

### Colégio da Bravura
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Proficiência Adicional | Armadura média, escudos, armas marciais. |
| 3 | Inspiração em Combate | Dado de Inspiração soma em dano ou CA (reação). |
| 6 | Ataque Extra | Ataca 2× na ação de Atacar. |
| 14 | Magia de Batalha | Ação bônus de ataque ao conjurar magia de bardo. |

---

## Druida — Círculo Druídico (nível 2) — leitura direta, alta confiança

### Círculo da Terra
| Nível | Característica | Descrição |
|---|---|---|
| 2 | Truque Adicional | +1 truque de druida. |
| 2 | Recuperação Natural | Recupera espaços de magia (≤ metade do nível, nenhum de 6º+) num descanso curto. |
| 3 | Magias de Círculo ⚠️ | Escolha de terreno concede magias extras nos níveis 3/5/7/9 — **não modelado por terreno** (ver pendências futuras). |
| 6 | Passo de Terreno | Terreno difícil sem custo extra; imune a plantas com espinhos. |
| 10 | Proteção Natural | Imune a veneno/doença; não pode ser envenenado/amedrontado por elementais/fadas. |
| 14 | Santuário Natural | Criaturas do mundo natural hesitam em atacar (SAB DC). |

### Círculo da Lua
| Nível | Característica | Descrição |
|---|---|---|
| 2 | Forma Selvagem de Combate | Forma Selvagem como ação bônus (ND≤1); cura com espaço de magia em forma de besta. |
| 6 | Ataque Primordial | Ataques em forma de besta contam como mágicos. |
| 10 | Forma Selvagem de Elemental | 2 usos de Forma Selvagem = vira elemental. |
| 14 | Mil Formas | Alterar-se de graça. |

---

## Mago — Tradição Arcana (nível 2) — 7 escolas de leitura direta (alta confiança) + Necromancia/Transmutação com pontos ⚠️

Todas seguem o padrão: nível 2 = "[Escola] Instruída" (metade do custo/tempo pra copiar magia
da escola) + 1ª feature própria; depois 6/10/14.

| Escola | Nível 2 (feature própria) | Nível 6 | Nível 10 | Nível 14 |
|---|---|---|---|---|
| **Abjuração** | Escudo Arcano (PV temp. = 2×nível+INT ao conjurar abjuração) | Proteção Projetada (transfere o escudo a outra criatura) | Abjuração Aprimorada (+prof. em contramágica/dissipar) | Resistência à Magia |
| **Adivinhação** | Prodígio (2d20 de "dados de prodígio" por descanso longo) | Especialista em Adivinhação (recupera espaço menor) | O Terceiro Olho (benefícios de visão à escolha) | Prodígio Maior (3d20 em vez de 2) |
| **Conjuração** | Conjuração Menor (cria objeto não-mágico) | Transposição Benigna (teleporte/troca de lugar 9m) | Conjuração Focada (+30 PV em criaturas invocadas) | Invocações Resistentes (concentração não quebra por dano) |
| **Encantamento** | Encantamento Hipnotizante (enfeitiça com o olhar) | Encanto Instintivo (redireciona ataque contra você) | Dividir Encantamento (2º alvo) | Alterar Memórias |
| **Evocação** | Esculpir Magias (poupa aliados da área) | Magia Potente (truques causam metade no sucesso) | Evocação Potencializada (+mod. INT no dano) | Sobrecarga (dano máximo, com risco) |
| **Ilusão** | Ilusão Menor Aprimorada (som+imagem juntos) | Ilusões Moldáveis | Eu Ilusório (reação: ataque erra automaticamente) | Realidade Ilusória (objeto vira real por 1 min) |
| **Necromancia** ⚠️ | Colheita Sinistra (cura ao matar com magia) | Escravos Mortos-Vivos (+1 morto-vivo, +PV/dano) | Acostumado à Morte-Vida (resistência a dano necrótico) | Comandar Mortos-Vivos |
| **Transmutação** ⚠️ | Pedra de Transmutador (benefício mágico portátil) | Metamorfo (alterar-se de graça) | Alquimia Menor (transforma objeto) | Mestre Transmutador |

⚠️ **Pontos de menor confiança**: a ordem 6º/10º de Necromancia (qual vem primeiro entre
Escravos Mortos-Vivos e Acostumado à Morte-Vida) e o nível exato de Alquimia Menor
(Transmutação) — reconstruídos com apoio do meu conhecimento de D&D, não 100% da leitura da
imagem.

**Escola de Conjuração** foi adicionada depois, numa segunda leva de páginas — leitura direta,
alta confiança.

---

## Paladino — Juramento Sagrado (nível 3) ⚠️

Todos seguem o padrão: nível 3 = 2 opções de Canalizar Divindade; depois 7/15/20.

### Juramento de Devoção
| Nível | Característica |
|---|---|
| 3 | Canalizar Divindade: Arma Sagrada / Expulsar os Infiéis |
| 7 | Aura de Devoção (imunidade a enfeitiçar em área, você consciente) |
| 15 | Pureza de Espírito (imune a enfeitiçar; proteção telepática) |
| 20 | Halo Sagrado |

### Juramento dos Anciões
| Nível | Característica |
|---|---|
| 3 | Canalizar Divindade: Ira da Natureza / Expulsar os Ímpios |
| 7 | Aura dos Anciões (resistência a dano de magia em área) |
| 15 | Sentinela Imortal (cai a 1 PV em vez de 0; imune a envelhecer) |
| 20 | Campeão dos Anciões |

### Juramento de Vingança
| Nível | Característica |
|---|---|
| 3 | Canalizar Divindade: Voto de Inimizade / Abjurar Inimigo |
| 7 | Vingador Implacável |
| 15 | Alma de Vingança (reação de ataque contra alvo do Voto) |
| 20 | Anjo Vingador |

⚠️ **Pontos de menor confiança**: texto exato das opções de Canalizar Divindade dos 3
juramentos, "Vingador Implacável" (não identificado claramente na foto — descrito por
conhecimento oficial da característica: mover metade do deslocamento após acerto de ataque de
oportunidade sem provocar reação) e "Campeão dos Anciões" (também mais reconstruído que lido).

---

## Ranger (Patrulheiro) — Conclave (nível 3) — parcialmente reconstruído

### Conclave do Caçador ⚠️ (escolhas internas viraram texto — ver pendências futuras)
| Nível | Característica |
|---|---|
| 3 | Presa do Caçador — escolha entre Matador de Colossos / Matador de Gigantes / Destruidor de Hordas |
| 7 | Táticas Defensivas — escolha entre Escapar da Horda / Defesa Contra Múltiplos Ataques / Vontade de Aço |
| 11 | Ataques Múltiplos — escolha entre Saraivada / Ataque Giratório |
| 15 | Defesa Superior de Caçador — escolha entre Esquiva Sobrenatural / Resistir à Maré |

### Conclave da Besta
| Nível | Característica | Descrição |
|---|---|---|
| 3 | Companheiro Animal | Ganha fera companheira (ND≤1/4), usa seu bônus de proficiência. |
| 7 | Vínculo com o Companheiro | Comanda ações (Disparar/Desengajar/Esquivar/Ajudar) como ação bônus. |
| 11 | Ataques Múltiplos do Companheiro | Companheiro ataca 2× quando comandado. |
| 15 | Companheiro Compartilhado | Magias que afetam só você também afetam o companheiro (9m). |

---

## Resumo de pontos ainda não confirmados por você

- Guerreiro — Cavaleiro Arcano (mapeamento nível→feature: Golpe Místico/Investida
  Arcana/Magia de Guerra).
- Mago — ordem 6º/10º de Necromancia; nível exato de Alquimia Menor (Transmutação).
- Bruxo — as 4 características de cada um dos 3 patronos.
- Paladino — opções de Canalizar Divindade dos 3 juramentos; "Vingador Implacável" (7º,
  Vingança); "Campeão dos Anciões" (20º, Anciões).
- Ranger — nomes/efeitos exatos das opções de escolha do Conclave do Caçador.

Se quiser fechar algum desses, é só reenviar as páginas específicas daquela classe/subclasse.
