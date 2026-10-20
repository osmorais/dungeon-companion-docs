# Progresso: ajuste das descrições de magias contra o livro.txt

## ATUALIZAÇÃO 3 (2026-10-16) — 4 descrições corrigidas + mecânica estruturada

Durante a implementação das magias mecânicas (`dungeon-companion-magias-mecanicas.md`), 4
descrições do banco divergiam do `magias.txt` e foram corrigidas direto em produção (autorizado
pelo usuário): **Zombaria Viciosa** (dizia resistência de Carisma → Sabedoria), **Onda
Troveante** (faltava o "+1d8 por círculo"), **Rajada Mística** (faltavam os feixes extras nos
níveis 5/11/17) e **Onda Destrutiva** ("5d5" → 5d6 — o próprio livro imprimiu 5d5, erro de
impressão). Também corrigido o "Se obtive" da Onda Troveante.

Observações pra quem mexer em magias de novo:
- A tabela `spell` tem uma coluna **`damage`** (ex.: `1d10`, `8d6`, `1d4+1`) preenchida em 114 das
  361 magias, que a API **não usa**. A mecânica (ataque/resistência/cura/dados por círculo) fica
  no catálogo `spell-mechanics.ts` da api.
- A **Destruição Banidora** no livro traduzido é 5d6 (o original em inglês é 5d10); o catálogo
  segue o livro.

## ATUALIZAÇÃO 2 — gap sistêmico de "Em Níveis Superiores" (72 magias)

O usuário reportou, na ficha da Ultred Nekrutman (clériga), que magias de 1° círculo que
podem ser conjuradas com espaço de 2° círculo não diziam o que muda ao fazer isso
(ex: Curar Ferimentos, Infligir Ferimentos, Palavra Curativa, Bênção).

Causa: mesmo depois da auditoria completa (361/361), várias descrições que já pareciam
"corretas" (mecânica base certa) ainda eram versões antigas/resumidas que **cortavam o
parágrafo final "Em Níveis Superiores..."**, mesmo quando o livro tem esse parágrafo.

Fiz uma varredura comparando TODAS as 361 descrições do banco contra `docs/magias.txt`:
72 magias tinham o parágrafo "Em Níveis Superiores" no livro mas não no banco. Apliquei o
texto completo do `magias.txt` pras 72 (lista: Ajuda, Amizade Animal, Animar Mortos, Arma
Elemental, Arma Espiritual, Arma Mágica, Armadura de Agathys, Assassino Fantasmagórico,
Banimento, Bola de Fogo, Braços de Hadar, Bruxaria, Bênção, Cegueira/Surdez, Coluna de
Chamas, Comando, Confusão, Conjurar Animais, Contramágica, Convocar Relâmpagos, Cordão de
Flechas, Criar ou Destruir Água, Criação, Curar Ferimentos, Curar Ferimentos em Massa,
Círculo Mágico, Círculo da Morte, Despedaçar, Destruição Lancinante, Dominar Besta,
Dominar Monstro, Enfeitiçar Pessoa, Esfera Flamejante, Esquentar Metal, Glifo de
Vigilância, Golpe Constritor, Heroísmo, Imagem Maior, Imobilizar Pessoa, Infligir
Ferimentos, Invisibilidade, Leque Cromático, Lâmina Flamejante, Malogro, Marca da
Punição, Marca do Caçador, Mensageiro Animal, Missão, Muralha de Fogo, Muralha de Gelo,
Mãos Flamejantes, Mísseis Mágicos, Nuvem de Adagas, Névoa Obscurecente, Orbe Cromática,
Palavra Curativa, Passos Longos, Perdição, Raio Adoecente, Raio Ardente, Raio Guiador,
Raio Lunar, Raio de Bruxa, Relâmpago, Repreensão Infernal, Rogar Maldição, Saraivada de
Espinhos, Sono, Sussurros Dissonantes, Toque Vampírico, Vitalidade Falsa, Voo).

Confirmei também dois nomes-do-banco que não bateram por diferença de grafia
("Destruição Troveante" vs. "Destruição Trovejante" no livro; "Vínculo Protetor" só não
casou no parser por causa de um "–10" colado no nome) — nenhum dos dois tem parágrafo de
Em Níveis Superiores no livro, então não precisavam de ajuste.

Verificado na ficha da Ultred: Bênção, Curar Ferimentos, Infligir Ferimentos e Palavra
Curativa agora mostram o parágrafo de nível superior. Truques (Chama Sagrada) e Zona da
Verdade (2° círculo, sem escala) continuam sem o parágrafo, corretamente — não existe no
livro pra essas magias.

## ATUALIZAÇÃO FINAL — auditoria concluída (361/361)

O usuário encontrou um segundo arquivo, `docs/magias.txt`, com o mesmo capítulo de
magias mas **extraído de forma limpa**: ordem alfabética, uma coluna só, sem
contaminação/interleaving. Isso resolveu de vez o problema descrito abaixo (o
`livro.txt` continua com colunas embaralhadas, mas `magias.txt` não tem esse problema).

Escrevi um parser Python (`/tmp/.../scratchpad/parse_magias4.py`, não versionado) que
lê `docs/magias.txt` e separa cada magia em nome + ficha técnica + descrição (usando a
linha "Duração:" como fronteira entre ficha técnica e prosa). Ele achou 360 das 361
magias automaticamente por nome exato (a exceção, "Antipatia/Simpatia", foi só um bug
de regex por causa da barra "/", corrigido).

Com isso, apliquei todas as ~123 descrições que ainda estavam pendentes (listadas na
seção "Próximos passos" abaixo, que agora está obsoleta) diretamente do texto do
`magias.txt`, incluindo todos os casos antes marcados com `*` (contaminados no
`livro.txt`) — no `magias.txt` nenhum deles teve problema de contaminação: Caminhar no
Vento, Corrente de Relâmpagos, Desintegrar, Proibição, Sugestão em Massa, Dedo da
Morte, Forma Etérea, Projetar Imagem, Simulacro, Santuário Particular de Mordenkainen,
Pele de Árvore — todos resolvidos com o texto certo desta vez.

Nota: "Piscar" no meu levantamento de pendências correspondia à magia "Piskar" no
banco (nome com erro de digitação/OCR original, não alterado — só a `description`
foi corrigida).

Também revisei as ~10 descrições restantes que eram curtas (mas não estavam na lista
de pendências) e expandi 6 delas que estavam resumidas demais em relação ao texto
oficial: Alarme, Cura Completa, Cura Completa em Massa, Ilusão Programada, Luz,
Nevasca. As outras 4 (Estabilizar, Passos Longos, Salto, Passo Nebuloso) já batiam
com o livro apesar de curtas — são magias genuinamente simples.

**Resultado: as 361 magias do banco têm agora descrição conferida e corrigida contra
o livro.** Nenhuma commitada (é dado, não código, mesma convenção de sempre).

---

## Contexto (histórico — problema original, ver atualização acima)

O usuário pediu pra conferir as descrições das ~361 magias do banco (tabela `spell`)
contra o texto oficial do livro (`docs/livro.txt`, capítulo 11 "MAGIAS", linhas
~12856–18425) e corrigir onde estiver errado.

**Problema descoberto**: esse capítulo do livro foi extraído de um PDF em duas colunas,
e o texto saiu com as colunas embaralhadas linha a linha (nome de uma magia na coluna
esquerda, ficha técnica de outra bem diferente na direita, na mesma linha física). Um
script de extração automática só consegue casar ~223 das 361 magias com segurança — o
resto vem com nomes/textos trocados. **Não é seguro reescrever as 361 descrições de
forma automática.**

**Decisão combinada com o usuário**: ajustar aos poucos, por classe/nível, lendo o
texto manualmente (mais confiável que o script) — começando pelos truques e magias de
1º círculo (as mais usadas).

**Descoberta importante**: esta edição do livro usa nomes de magia **diferentes** dos
que já estão no banco, em vários casos (provavelmente uma tradução oficial diferente da
usada originalmente pra popular o banco). Não renomeei nada no banco (risco de quebrar
outras referências) — só usei o nome do livro pra *localizar* a magia certa e corrigir
sua `description`. Mapeamento nome-banco → nome-no-livro encontrado até agora:
- Ataque Certeiro → Golpe Certeiro
- Consertar → Reparar
- Druidismo → Arte Druídica
- Espirro Ácido → Bolha Ácida
- Globos de Luz → Luzes Dançantes
- Rajada Mística → Raio Místico
- Toque Arrepiante → Toque Necrótico
- Zombaria Viciosa → Zombaria Perversa
- Área Escorregadia → Graxa
- Auxílio Divino → Favor Divino
- Braços de Hadar → aparece como "Braços de Radar" no livro (OCR trocou Hadar por Radar — a descrição já foi escrita com o nome correto, Hadar)
- Escudo Arcano → Escudo (a magia "Shield")
- Identificação → Identificar
- Disco Flutuante de Tenser → "Disco Flutuante de Tenser" mesmo, só estava com o texto embaralhado
- Riso Histérico de Tasha → Gargalhada Nefasta de Tasha
- Purificar Alimentos → Purificar Alimentos e Bebidas

## Estabilidade atual (o que já foi commitado/aplicado)

Todas as mudanças abaixo já foram aplicadas **direto no banco de produção** (não é
código, é dado — não há commit/push associado):

1. **Correções estruturais confirmadas** (nível/escola errados, cruzando o texto do
   livro com as regras oficiais de 5e): Metamorfose (nível 4→9), Falar com Plantas
   (escola Adivinhação→Transmutação), Muralha de Pedra (Conjuração→Evocação), Telepatia
   (Adivinhação→Evocação).
2. **Truques (nível 0) — 24 de 27 com descrição corrigida/completada**: Ataque
   Certeiro, Bordão Místico, Chama Sagrada, Chicote de Espinhos, Amizade, Criar Chamas,
   Ilusão Menor, Globos de Luz, Mãos Mágicas, Mensagem, Prestidigitação, Proteção
   contra Lâminas, Raio de Fogo (corrigido também um provável erro de OCR do livro:
   "+1d6" → "+1d10" por nível, confirmado pelo parêntese "(2d10)" do próprio texto),
   Raio de Gelo, Rajada de Veneno, Rajada Mística, Resistência, Taumaturgia, Toque
   Chocante, Consertar, Druidismo, Toque Arrepiante, Espirro Ácido, Zombaria Viciosa.
3. **Pendente**: **Orientação** (Guidance) — não localizei a entrada no livro nesta
   passada (buscas por várias frases-chave não bateram; pode estar com OCR muito
   corrompido nesse trecho). Descrição no banco não foi tocada.
4. **Magias de 1º círculo — 60 de 62 com descrição corrigida/completada.** Só faltam:
   **Névoa Obscurecente** (Fog Cloud — não localizada no livro nesta sessão, várias
   buscas por frases-chave não bateram) e **Orientação** (Guidance, é truque/nível 0,
   ver item 3 acima).
   - Resolvidas as duas suspeitas de duplicata/mapeamento: "Constrição" = Emaranhar
     (Entangle, não é duplicata de "Golpe Constritor" — são magias diferentes,
     confirmado lendo os dois); "Bruxaria" = Danação no livro (mecânica de Hex
     confirmada: 1d6 dano necrótico extra por acerto + desvantagem em um atributo
     escolhido).
   - Mais nomes-do-livro diferentes do banco encontrados nesta leva: Marca do
     Caçador→Marca do Predador, Passos Longos→Passos Largos, Raio Adoecente→Raio
     Nauseante, Repreensão Infernal→Repreensão Diabólica, Recuo Acelerado→Retirada
     Acelerada, Onda Troveante→Onda Trovejante (OCR: "Ünda"), Orbe Cromática→Orbe
     Cromático (OCR: "Ürbe"), Vitalidade Falsa→Vitalidade Vazia, Constrição→Emaranhar,
     Bruxaria→Danação, Destruição Lancinante→Destruição Cauterizante, Destruição
     Troveante→Destruição Estrondosa.

5. **Magias de 2º círculo — 50 de 59 com descrição corrigida/completada**: Acalmar
   Emoções, Ajuda, Alterar-se, Arma Espiritual, Arma Mágica, Arrombar, Augúrio,
   Aumentar/Reduzir, Aura Mágica de Nystul, Boca Encantada, Cativar, Cegueira/Surdez,
   Chama Contínua, Convocar Montaria, Cordão de Flechas, Coroa da Loucura, Crescer
   Espinhos, Despedaçar, Detectar Pensamentos, Encontrar Armadilhas, Escuridão,
   Esfera Flamejante, Esquentar Metal, Imobilizar Pessoa, Invisibilidade, Levitação,
   Localizar Animais ou Plantas, Localizar Objeto, Lufada de Vento, Lâmina
   Flamejante, Marca da Punição, Mensageiro Animal, Nuvem de Adagas, Passo
   Nebuloso, Passos Sem Pegadas, Proteção contra Veneno, Raio Ardente, Raio Lunar,
   Raio do Enfraquecimento, Reflexos, Repouso Tranquilo, Restauração Menor,
   Silêncio, Sugestão, Tranca Arcana, Truque de Corda, Ver o Invisível, Visão no
   Escuro, Vínculo Protetor, Zona da Verdade.
   - "Truque de Corda" = "Corda Extradimensional" no livro (Rope Trick).
   - "Vínculo Protetor" aparece como "Vínculo de Proteção" no livro.

6. **Magias de 3º círculo — 38 de 50 com descrição corrigida/completada**: Ampliar
   Plantas, Andar na Água, Animar Mortos, Arma Elemental, Aura de Vitalidade, Bola
   de Fogo, Círculo Mágico, Clarividência, Conjurar Animais, Conjurar Rajada,
   Contramágica, Convocar Relâmpagos, Criar Alimentos, Dificultar Detecção,
   Enviar Mensagem, Falar com os Mortos, Falar com Plantas, Forma Gasosa, Glifo de
   Vigilância, Idiomas, Imagem Maior, Lentidão, Luz do Dia, Manto do Cruzado, Medo,
   Mesclar-se às Rochas, Muralha de Vento, Névoa Fétida, Padrão Hipnótico, Proteção
   contra Energia, Relâmpago (corrigido dano de 3d6→8d6, confirmado por
   conhecimento das regras — Fireball e Lightning Bolt são ambas 8d6 base),
   Remover Maldição, Respirar na Água, Revivificar, Rogar Maldição, Sinal de
   Esperança, Toque Vampírico, Voo.
   - "Conjurar Animais" = "Invocar Animais" no livro; "Falar com os Mortos" =
     "Falar com Mortos"; "Glifo de Vigilância" = "Glifo de Proteção"; "Idiomas" =
     "Línguas"; "Andar na Água" = "Caminhar sobre as Águas"; "Criar Alimentos" =
     "Criar Comida e Água"; "Névoa Fétida" = "Nuvem Fétida"; "Ampliar Plantas" =
     "Crescimento de Plantas"; "Conjurar Rajada" = "Invocar Barragem".
   - Bônus: achei também a **Névoa Obscurecente** (Fog Cloud, 1º círculo) que
     tinha ficado pendente da leva anterior — já corrigida.

7. **Magias de 4º círculo — 21 de 35 com descrição corrigida/completada**: Arca
   Secreta de Leomund, Assassino Fantasmagórico, Aura de Pureza, Banimento, Cão
   Fiel de Mordenkainen, Confusão, Destruição Estonteante, Esfera Resiliente de
   Otiluke, Fabricar, Inseto Gigante, Invisibilidade Maior, Localizar Criatura,
   Malogro, Metamorfose (só a descrição — nível já corrigido antes, ver item 1),
   Moldar Rochas, Movimentação Livre, Muralha de Fogo, Porta Dimensional,
   Tentáculos Negros de Evard, Terreno Alucinógeno, Proteção contra a Morte.
   - "Destruição Estonteante" = "Destruição Atordoante" no livro (Staggering
     Smite).

8. **Magias de 5º círculo — 11 de 42 com descrição corrigida/completada**: Círculo
   de Poder, Coluna de Chamas, Consagrar, Contato Extraplanar, Criação, Criar
   Passagem, Curar Ferimentos em Massa, Despertar, Missão, Reviver os Mortos,
   Similaridade.
   - Bônus: achei também o corpo de **Dominar Besta** (4º círculo, item pendente
     da leva anterior) na mesma região de texto — já corrigido.

9. **Magias de 6º círculo — 7 de 32 com descrição corrigida/completada**: Banquete
   de Heróis, Barreira de Lâminas, Contingência, Círculo da Morte, Muralha de
   Gelo, Raio Solar, Visão da Verdade.
   - **Correção importante**: "Curar Ferimentos em Massa" (5º círculo, Mass Cure
     Wounds) tinha recebido por engano, na leva do 5º círculo, o texto de "Cura
     Completa em Massa" (9º círculo, Mass Heal — "restaura até 700 pontos de
     vida..."). Corrigido agora para o texto certo (6 criaturas, 3d8 + modificador
     de conjuração). "Cura Completa em Massa" (9º círculo) nunca foi tocada e seu
     resumo curto original já estava correto, não precisou de ajuste.

10. **Magias de 7º círculo — 6 de 20 com descrição corrigida/completada**: Espada
    de Mordenkainen, Inverter a Gravidade, Tempestade de Fogo, Rajada Prismática,
    Regeneração, Ressurreição.

11. **Magias de 8º círculo — 6 de 18 com descrição corrigida/completada**: Explosão
    Solar, Limpar a Mente, Telepatia, Semiplano, Dominar Monstro, e a magia de 2º
    círculo **Teia** (achada por acidente nesta leva — resolve pendência antiga).
    - "Semiplano" resolve a contaminação que antes eu tinha atribuído (errado) a
      "Santuário Particular de Mordenkainen" — o texto da porta de sombras era
      desta magia, não daquela.
12. **Magias de 9º círculo — 5 de 17 com descrição corrigida/completada**: Chuva de
    Meteoros, Desejo, Projeção Astral, Ressurreição Verdadeira. Mais dois bônus
    achados nesta leva: **Teletransporte por Árvores** (6º círculo) e **Velocidade**
    (3º círculo, Haste) — ambos resolvem pendências de levas anteriores.
    - "Cura Completa em Massa" (9º) já estava correta desde o início, confirmado,
      sem necessidade de ajuste.

## Estado final desta rodada (todos os círculos de truque a 9º já foram
percorridos ao menos uma vez)

Contagem aproximada de descrições já reescritas/corrigidas por nível (pode haver
pequena imprecisão, já que alguns resumos originais também eram longos):
truques ~24/27, 1º ~56/62, 2º ~50/59, 3º ~40/50, 4º ~21/35, 5º ~11/42, 6º ~8/32,
7º ~6/20, 8º ~7/18, 9º ~6/17. **Total aproximado: ~230 de 361 magias do banco.**

O restante (principalmente magias de 5º círculo em diante) ficou pra trás
principalmente por causa da contaminação de colunas ficar mais severa nessas
páginas do livro — muitos cabeçalhos foram achados mas o corpo do texto vizinho
pertencia a outra magia, e não arrisquei aplicar texto errado.

## Próximos passos (ainda não feitos)

- **Resto das magias de 4º círculo (13 de 35)** — não localizadas ainda: Adivinhação,
  Aura de Vida, Compulsão (achei um texto na posição do cabeçalho mas pertencia a
  Comando — não apliquei), Conjurar Elementais Menores, Conjurar Seres da Floresta,
  Controlar a Água, Escudo de Fogo, Guardião da Fé, Olho Arcano,
  Pele de Pedra, Santuário Particular de Mordenkainen (achei um texto na posição do
  cabeçalho, mas o efeito descrito — uma porta para um semiplano — não bate com a
  mecânica real dessa magia; não apliquei, provável contaminação), Tempestade de
  Gelo, Vinha Esmagadora.
- **Resto das magias de 7º círculo (14 de 20)** — não localizadas, ou contaminadas
  (marcado com *): Bola de Fogo Controlável, Conjurar Celestial, Dedo da Morte*
  (texto pertencia a Desejo), Forma Etérea* (texto pertencia a Fogo das Fadas),
  Isolamento, Mansão Magnífica de Mordenkainen, Miragem, Palavra Divina, Prisão
  de Energia, Projetar Imagem* (texto pertencia a Projeção Astral), Símbolo
  (achei as opções de efeito — Insanidade, Medo, Morte — mas não o início da
  descrição), Simulacro* (texto pertencia a Disfarçar-se), Teletransporte,
  Viagem Planar.
- **Resto das magias de 6º círculo (25 de 32)** — não localizadas, ou localizadas
  mas com texto contaminado por outra magia na mesma posição (marcado com *):
  Aliado Planar, Ataque Visual, Caminhar no Vento*, Carne para Pedra, Conjurar
  Fada, Corrente de Relâmpagos*, Criar Mortos-Vivos, Dança Irresistível de Otto,
  Desintegrar* (achei texto mas pertencia a Despertar), Doença Plena, Encontrar o
  Caminho, Esfera Congelante de Otiluke, Globo de Invulnerabilidade (achei o
  início, falta o resto), Invocação Instantânea de Drawmij, Mover Terra, Muralha
  de Espinhos*, Palavra de Recordação, Portal Arcano, Proibição* (texto
  pertencia a Projeção Astral), Proteger Fortaleza, Recipiente Arcano, Sugestão
  em Massa* (texto pertencia a Taumaturgia), Teletransporte por Árvores.
- **Resto das magias de 5º círculo (31 de 42)** — não localizadas ainda: Aljava
  Veloz, Âncora Planar, Animar Objetos, Caminhar em Árvores, Cone de Frio,
  Conhecimento Lendário, Conjurar Elemental, Conjurar Saraivada, Comunhão,
  Comunhão com a Natureza, Círculo de Teletransporte, Cúpula Antivida, Despistar,
  Destruição Banidora, Dissipar o Bem e Mal, Dominar Pessoa, Imobilizar Monstro,
  Ligação Telepática de Rary, Modificar Memória, Muralha de Energia, Muralha de
  Pedra (a escola já foi corrigida antes — Conjuração→Evocação — só falta a
  descrição), Mão de Bigby, Névoa Mortal, Onda Destrutiva, Praga, Praga de Insetos
  (achei o início, "Um enxame de gafanhotos vorazes preenche uma esfera com raio
  de 6 metros...", mas não a continuação exata com o dano), Reencarnação,
  Restauração Maior, Sonho, Telecinésia, Vidência.

- **Resto das magias de 2º círculo (9 de 59)** — não localizadas no livro apesar de
  várias tentativas de busca por nome alternativo e por trechos de efeito: Aprimorar
  Habilidade (Enhance Ability), Flecha Ácida de Melf (Melf's Acid Arrow), Força
  Fantasmagórica (Phantasmal Force), Nublar (Blur), Oração Curativa (Prayer of
  Healing), Patas de Aranha (Spider Climb), Pele de Árvore (Barkskin — achei um
  texto na posição certa mas o efeito descrito não batia com a mecânica real de
  Barkskin, parece contaminação de outra magia; não apliquei), Sentido Bestial
  (Beast Sense), Teia (Web).
- **Resto das magias de 3º círculo (12 de 50)** — não localizadas ainda: Destruição
  Cegante (Blinding Smite), Espíritos Guardiões (Spirit Guardians), Flecha
  Relampejante (Lightning Arrow), Fome de Hadar (Hunger of Hadar), Forjar Morte,
  Montaria Fantasmagórica (Phantom Steed), Palavra Curativa em Massa (Mass Healing
  Word), Pequena Cabana de Leomund (Tiny Hut — achei o cabeçalho/stat block mas
  não o corpo do texto), Piskar/Piscar (Blink — mesma coisa, só stat block),
  Velocidade (Haste), Dissipar Magia (o texto na posição do cabeçalho pertencia a
  outra magia, Dominar Pessoa/Monstro).
- **Orientação** (Guidance, truque) — ainda não localizada.
- **4º círculo em diante** — ainda nada feito, mesma lógica de leitura manual aos
  poucos.
- Script de extração automática (`extract_spells2.py`, no mesmo diretório de
  scratchpad, não versionado) pode ajudar a *localizar* candidatos mais rápido, mas
  todo resultado dele precisa ser conferido manualmente antes de aplicar — não é
  confiável sozinho.
