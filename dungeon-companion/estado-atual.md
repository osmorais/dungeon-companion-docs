---
resumo: Onde o Dungeon Companion (Forja Arcana) está agora — versão, commits, testes, produção. Ler primeiro.
tipo: estado
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Estado atual

Ler este arquivo e o [`backlog.md`](backlog.md) antes de começar qualquer trabalho. O histórico
detalhado de cada sessão fica em [`historico/`](historico/) e só precisa ser lido quando o
assunto exigir.

**Ao terminar uma entrega**, atualizar este arquivo (versão, commits, testes, mudança em
produção) e o `backlog.md`. Detalhe de implementação vai pro doc de conceito da área
(`conceitos/`), não aqui. Diário de sessão não é mais mantido.

## Os dois repositórios

- `~/projects/dungeon-companion-api` — LoopBack 4 (Node), Postgres (Neon) via driver `postgres`
  (sem ORM). Deploy no **Render** (`git push` dispara).
- `~/projects/dungeon-companion-web` — Angular 21 (Signals + RxJS). Deploy na **Hostinger**
  (auto-deploy pelo Git). Domínio público: `forjaarcana.com`.
- Imagens no **Supabase Storage** (projeto próprio, bucket público `monster-images`).
- `~/projects/dungeon-companion` é o repositório antigo (monorepo de abril/2026) — **arquivado**,
  não usar.

## Versão e commits

- **Versão do sistema**: 1.17.0 (2026-10-31, selo de dano/cura nas cartas de magia: base no
  catálogo, do personagem na ficha — [`conceitos/cartas.md`](conceitos/cartas.md)); antes, 1.16.2 (2026-10-30, cartas dos grimórios com os 4 números legíveis e
  alcance "Pessoal"/"Toque" — [`conceitos/cartas.md`](conceitos/cartas.md)); antes, 1.16.1 (mesmo dia, os mesmos filtros no grimório do Quadro do Mestre —
  [`conceitos/quadro-do-mestre.md`](conceitos/quadro-do-mestre.md)); antes, 1.16.0 (mesmo dia, grimório de magias com o layout do catalogar
  monstros e filtros por círculo, escola, classe, função, elemento, alcance, concentração, ação
  bônus e reação; descrição da Vidência corrigida —
  [`conceitos/cartas.md`](conceitos/cartas.md)); antes, 1.15.1 (2026-10-28, encerrar combate pergunta pelos monstros que sobraram,
  carta do monstro na pergunta de derrota, ficha do monstro fecha ao rolar e multiataque em
  sequência na tela de lançamento com o selo "MULTIATAQUE k/N"); antes, 1.15.0 (mesmo dia, XP do combate no fim da luta: derrotar só confirma
  e soma o XP do monstro no combate, encerrar mostra o total e distribuir é opcional, aviso ao
  mestre quando um monstro chega a 0 PV —
  [`conceitos/monstros.md`](conceitos/monstros.md)); antes, 1.14.1 (2026-10-27, Tom sem o símbolo no avental, nas 9 poses —
  [`procedimentos/artes-tom.md`](procedimentos/artes-tom.md)); antes, 1.14.0 (mesmo dia, bestiário em cartas com filtros: detalhe e
  catalogar com a cara da gaveta do monstro, ações em cartas, filtros por ND/tipo/tamanho/
  lendários/voadores, 8 cartas por página, selo PERIGOSO — PR #8 do Carlos com commits nossos,
  merge em 2026-10-27); antes, 1.13.3 (2026-10-27, login e cadastro com visual renovado — feita por outro
  desenvolvedor, Carlos `kaduce2009@hotmail.com`, PR #7, com um commit nosso por cima); antes,
  1.13.2 (2026-10-26, ações do monstro em cartas na gaveta, moldura
  própria da carta do monstro no SOMBRIO, fundo por tema na tela de lançamento e nos avisos, alvos
  só com monstros revelados); antes, 1.13.1 (mesmo dia, cards de NPC e de monstro da mesa com
  moldura, anel, barra de vida, fundo próprio e botões maiores); 1.13.0 (2026-10-25, monstros com carta no combate: ação do monstro na
  tela de lançamento, carrossel dos revelados, carta na troca de vez e ficha do monstro na gaveta);
  antes, 1.12.1 (mesmo dia, e-mail de recuperação de senha de volta, enviado
  pelo script do site na Hostinger — o Render bloqueia SMTP); antes, 1.12.0 (mesmo dia, menu de seções da tela inicial no celular e no tablet;
  com a 1.11.1, ajuste visual da tela inicial — as duas feitas por outro desenvolvedor, Carlos
  `kaduce2009@hotmail.com`, PR #6, com dois commits nossos por cima); antes, 1.11.0 (mesmo dia,
  ações de monstro mecânicas pro mestre e carta do monstro na revelação, no painel de combate e na
  derrota); 1.10.0 (2026-10-24, catalogar
  monstro a partir do bestiário do livro, sem a dnd5eapi — feita por outro desenvolvedor e entregue
  por PR, merge em 2026-10-25); 1.9.0 (mesmo dia, nome de usuário único; antes, 1.8.3:
  moldura nova dos cards no tema SOMBRIO; 1.8.2: SAIR leva pro login e código de mesa de exemplo
  `XXXXX`; 1.8.1: sessão expirada volta pra tela inicial, tela inicial renovada e fundo padrão no
  card) — notas em `/novidades`
  (`dungeon-companion-web/src/app/release-notes/release-notes.ts`). A 1.8.0 (2026-10-23, tela
  inicial pra visitantes) foi feita por outro desenvolvedor (web `ec8f7c6`, autor
  `eduardopontesmorais@gmail.com`).
- **Últimos commits**: api `c316ab5` e web `bead301` (1.17.0), push direto na `main` em
  2026-10-31, api antes do web, sem migração. Antes: api `1222542` (só a versão) e web `dcb2a58` (1.16.2), push direto na `main`
  em 2026-10-30, api antes do web, sem migração. Antes: api `746b110` (só a versão) e web `749d766` (1.16.1), push direto na `main`
  em 2026-10-30, api antes do web, sem migração. Antes: api `c64408b` (1.16.0: versão e a Vidência no seed) e web `03c710c`
  (1.16.0), push direto na `main` em 2026-10-30, api antes do web, sem migração (a Vidência foi
  corrigida no banco antes, ver abaixo); o GitHub avisou de novo da regra de PR ignorada. Antes:
  api `65b8bd1` e web `c725ab9` (1.15.1, sem migração), push direto na `main` em 2026-10-28, api
  antes do web. Antes: api `3200b21` e web `b513c4e` (1.15.0), push direto na `main` em
  2026-10-28, api antes do web, com a coluna `combat_encounter.defeated_xp` criada antes (ver
  abaixo). Antes: web `db89d5b` e api `af2e9a7` (1.14.1; na api só a versão), push direto
  na `main` em 2026-10-27, api antes do web — o GitHub avisou que a regra "mudança só por pull
  request" da `main` foi ignorada pela conta (ver backlog). Antes: api `968ea90` (1.14.0: a lista do livro traz tendência, PV, CA, lendário
  e voa; push na `main` em 2026-10-27, antes do web). Web `6578150` (merge do PR #8
  `redesign/monster-catalog-cards`, com os nossos `1adaad4` — ajustes do code review — e `470afe7`
  — detalhe, catalogar e filtros), em 2026-10-27; sem migração. Antes: web `2897436` (merge do PR #7, com o nosso `7e44e63` — ajustes do review)
  e, por cima, `a0d3bad` (data da 1.13.3 nas notas); api `91cf4db` (só sobe a versão pra 1.13.3).
  `a0d3bad` e `91cf4db` com push em 2026-10-27. Antes: api `dec6603` e web `26a05e5` (1.13.2), antes api `f57e109` e web `219d1ef`
  (1.13.1) — na `main`, com push em 2026-10-26, sem migração; docs `96e93ec` (artes). Antes: api `0f36654` e web `d146f46` (1.13.0, na `main`, push em 2026-10-25, api
  antes do web; sem migração). Antes: api `b60cdb5` e web `c390035` (1.12.1; antes deles,
  web `a2f107a` — teste temporário de PHP, removido no `c390035`). Antes: web `3121763` (merge do PR #6, 1.11.1 `85db724` e 1.12.0 `eb62c0c` do
  Carlos + nossos `72a0a43` e `02b5d2c`) e, por cima, `f7ab00b` (nota da correção da vitrine nas
  notas da 1.12.0); api `46e399e` (só sobe a versão pra 1.12.0). Antes: api `bf7ac7e` e web `b7c7720` (1.11.0, push em 2026-10-25, api antes do web; as
  duas migrações rodaram em produção antes), docs `5ccfa25`. Antes: api
  `1b1c62d` (merge do PR #3, versão 1.10.0 `395e250`), web `4c0d64b` (merge do PR #5, versão
  1.10.0 `a628317`), docs pelo PR #1. Na api, da 1.8.0 à 1.8.3 só sobe o
  número da versão. No web há dois commits soltos (`33bab41` cria e `a00fad9`
  apaga um `x.txt`), sem efeito. No web fica
  de fora, de propósito, `public/dragon-sprite-old.png` (cópia local do sprite antigo; não
  commitar — tudo em `public/` vai pro ar).
- **PRs**: nenhum aberto (o #8 entrou na 1.14.0 e o #7 na 1.13.3, ambos em 2026-10-27).
- **Testes**: api 527 (`npm run test:unit`), web 782 (`npm run test:run`) — na 1.17.0 —
  [`conceitos/testes.md`](conceitos/testes.md).

## Áreas e onde está cada uma

| Área | Estado | Doc |
|---|---|---|
| Magias mecânicas (ataque, resistência, cura, crítico, aplicar no alvo, efeitos de tela) | fases 1–4 feitas | [`conceitos/magias-mecanicas.md`](conceitos/magias-mecanicas.md) |
| Traços e habilidades mecânicos | fases 1–4 feitas | [`conceitos/tracos-mecanicos.md`](conceitos/tracos-mecanicos.md) |
| Level-up (HP rolado, ASI/talento, subclasse, magias novas, XP) | fases 1–3 feitas; multiclasse não começada | [`historico/levelup-plan.md`](historico/levelup-plan.md) |
| Auditoria de automação mecânica (classe por classe) | "Fácil" feito, "Média" quase todo | [`conceitos/auditoria-mecanicas.md`](conceitos/auditoria-mecanicas.md) |
| Subclasses (conteúdo do livro) | gravado em `rules.ts`; alguns pontos sem conferência | [`conceitos/subclasses.md`](conceitos/subclasses.md) |
| Descrições de magia (361) | auditadas contra o livro | [`historico/spells-progress.md`](historico/spells-progress.md) |
| LGPD | 16 itens técnicos feitos; faltam itens fora do código | [`conceitos/lgpd.md`](conceitos/lgpd.md) |
| Quadro do Mestre (gaveta só do mestre: rolagens ocultas, grupo, anotações, descanso, dano em área, apagar sessão) | 4 fases feitas (1.2.0); gaveta de baixo com barra fixa na base, no celular (1.3.16) e no desktop (1.3.17) | [`conceitos/quadro-do-mestre.md`](conceitos/quadro-do-mestre.md) |
| Cartas (magias e armas) e aviso de lançamento/ataque | magias em cartas (1.4.0), aviso único da mesa com as cartas (1.5.0), armas em cartas (1.6.0), ataque com arma no aviso (1.6.1), dano/cura aplicado dentro do aviso (1.7.1), aviso sincronizado pra todos com a rolagem dentro dele pra quem lança, quebra ao errar e saída de vitória (1.7.2); carta do monstro: aviso de revelação, destaque no painel de combate e explosão na derrota (1.11.0); carrossel dos monstros revelados, carta do monstro na troca de vez e carta da ação de monstro na tela de lançamento, descrição na carta pequena (1.13.0); moldura própria da carta do monstro no SOMBRIO e fundo por tema (altar/tapete) na tela de lançamento e nos avisos (1.13.2) | [`conceitos/cartas.md`](conceitos/cartas.md) |
| Avatar (personalizador e camadas de imagem) | abas com miniaturas (1.6.9), 8 penteados novos (1.6.9), tons de pele por raça (1.6.10); faltam barbas, roupas, chapéus e rostos | [`conceitos/avatar.md`](conceitos/avatar.md) |
| Ranking global (feitos das mesas) | 12 categorias, contagem desde a 1.7.0, em lista (1.7.1), opção de sair em /conta | [`conceitos/ranking.md`](conceitos/ranking.md) |
| Card do personagem na sessão (molduras, barra de XP e de vida) | molduras dos dois temas no card, nos avisos e nos toasts; barra de XP; DANO/CURA do próprio PV na gaveta de ações (1.7.1), com animação, CURA TOTAL e DANO TOTAL (1.7.3); gaveta abre sozinha na vez do jogador, barra de XP clicável pra subir de nível, avatar com anel nas barras das gavetas (1.7.4); fundo padrão de masmorra pra quem não tem imagem (1.8.1); moldura nova no tema SOMBRIO, com corte por tema (1.8.3); linhas de NPC e de monstro com a moldura, o anel, a barra de vida, fundo próprio (taverna/covil) e botões com ícone (1.13.1) | [`conceitos/molduras.md`](conceitos/molduras.md) |
| Nome de usuário (único; mesa e ranking) | cadastro, escolha no primeiro acesso (contas antigas e Google), troca em Minha Conta, mesa/listas/ranking com o nome atual (1.9.0); login e cadastro com visual renovado, e-mail como identificador do gerenciador de senhas (1.13.3) | [`conceitos/nome-de-usuario.md`](conceitos/nome-de-usuario.md) |
| Tela inicial pública (`/` pra visitantes) | página com seções, vitrine de cartas e card de exemplo (1.8.0); sessão expirada cai nela, barra do topo fixa, card de exemplo igual ao da mesa, sem citar D&D 5e (1.8.1); SAIR leva pro login e código de exemplo `XXXXX` (1.8.2); dado do card sem cobrir o "AO VIVO" (1.11.1); menu de seções no celular e no tablet, vitrine sem passar por cima da barra (1.12.0) | [`conceitos/tela-inicial.md`](conceitos/tela-inicial.md) |
| E-mail (recuperação de senha) | api chama por HTTPS o script PHP do site (Hostinger), assinado; o script envia pelo SMTP de lá (1.12.1) | [`conceitos/email.md`](conceitos/email.md) |
| Monstros (bestiário do livro) | tabela `monster` com as 428 fichas do Manual dos Monstros em português, ataques/dano/CD estruturados, em produção (2026-10-24); catalogar (tela e "+ adicionar" da sessão) lê a tabela, sem a dnd5eapi (1.10.0); ações mecânicas na ficha da mesa, só do mestre (ataque, resistência, dano, testes, usos, recarga, multiataque, lendárias, reação, covil, defesas e sentidos) e descrição (lore) dos 428 (1.11.0); ficha do monstro na gaveta de baixo, no lugar do modal, e ação do monstro na tela de lançamento (1.13.0); ações do monstro em cartas (baralho e mão) na gaveta (1.13.2); derrotar com confirmação, aviso de 0 PV ao mestre e XP acumulado do combate, distribuído (opcional) ao encerrar (1.15.0); encerrar pergunta pelos monstros que sobraram, ficha fecha ao rolar, multiataque em sequência na tela de lançamento (1.15.1); bestiário do mestre, catalogar e detalhe em cartas, com a ficha da gaveta (só leitura), filtros e páginas de 8, selo PERIGOSO no ND 5+; fichas antigas da dnd5eapi fora de uso (1.14.0, PR #8) | [`conceitos/monstros.md`](conceitos/monstros.md) |
| Grimório de magias (`/spell-catalog`) | layout do catalogar monstros, cartas em páginas de 8, filtros por círculo, escola, classe, função, elemento, alcance, concentração, ação bônus e reação; função e elemento das 361 magias classificados à mão (1.16.0); mesmos filtros no grimório do Quadro do Mestre (1.16.1); selo de dano/cura nas cartas (1.17.0) | [`conceitos/cartas.md`](conceitos/cartas.md) |
| Criação de ficha | validada na API (422), perícias/armas/itens do kit corrigidos; barra de progresso e cartas nas etapas de magia/arma (1.6.7); painéis no celular e Tom com OK/desativar (1.6.8) | [`historico/diario-2026-09-10_a_2026-10-18.md`](historico/diario-2026-09-10_a_2026-10-18.md) |

## Mudanças feitas direto no banco de produção

Sempre com autorização do usuário, numa transação. Mais antigas: ver o diário.

- **2026-10-16**: 102 linhas de `character_skill` marcadas como treinadas + 6 inseridas (perícias
  do antecedente das fichas antigas); 4 descrições de magia corrigidas; coluna
  `character.active_effects`; 23 itens novos no catálogo `item` (ids 101–123) + 257 linhas de
  equipamento inicial no inventário dos 20 jogadores em sessão.
- **2026-10-17**: tabela `session_reference_image` + coluna `game_session.shown_reference_image_id`.
- **2026-10-18**: talento Habilidoso das fichas #146 e #145 (4 perícias treinadas + `choice_data`).
- **2026-10-20**: coluna `game_session.dm_notes` (TEXT, nula) — anotações do Quadro do Mestre (1.2.0). Rodado antes do deploy da api, autorizado pelo usuário; 16 sessões, todas com `dm_notes` nulo.
- **2026-10-22**: tabela `character_session_stats` (ranking, 1.7.0) + índice por personagem + coluna `users.show_in_ranking` (BOOLEAN, padrão TRUE). Uma transação, antes do deploy da api, autorizado pelo usuário; 41 usuários com `true`, tabela vazia. Gravação e leitura testadas no banco numa transação desfeita (0 linhas depois).
- **2026-10-24**: coluna `users.username` (VARCHAR(20), nula) + índice único
  `users_username_lower_key` em `LOWER(username)` (1.9.0), e `users.full_name` apagado nas **41**
  contas que tinham (nome de exibição antigo, que nas contas Google era o nome real; coluna
  mantida, sempre nula). Uma transação, antes do deploy da api, autorizado pelo usuário; 42
  usuários, nenhum com nome de usuário ainda (todos escolhem no próximo acesso). `schema-diff`
  vazio depois.
- **2026-10-24**: tabela `monster` (bestiário de referência) + **428** fichas do Manual dos
  Monstros. Uma transação, autorizado pelo usuário; lida pelo catálogo a partir da 1.10.0. 428 linhas,
  428 slugs; `schema-diff` vazio depois. O teste da sequência consumiu o id 429 (buraco sem
  efeito). → [`conceitos/monstros.md`](conceitos/monstros.md)
- **2026-10-25**: coluna `monster_session.action_state` (JSONB, nula) — usos das ações do monstro
  na mesa (1.11.0). Uma transação, antes do deploy da api, autorizado pelo usuário; 1 monstro em
  mesa, com a coluna nula. `schema-diff` vazio depois.
- **2026-10-25**: coluna `monster.lore` (TEXT) + descrição dos **428** monstros do bestiário
  (1.11.0). Uma transação que só confirmava com 428 linhas atualizadas e 428 preenchidas,
  autorizado pelo usuário, antes do deploy da api. `schema-diff` vazio depois. No seed, a
  descrição fica na própria linha do INSERT de `monster`.
- **2026-10-28**: coluna `combat_encounter.defeated_xp` (INTEGER, não nula, padrão 0) — XP
  acumulado dos monstros derrotados no combate (1.15.0). Uma transação, antes do deploy da api,
  autorizado pelo usuário; 66 combates, nenhum em andamento, todos com 0. `schema-diff` vazio
  depois.
- **2026-10-30**: descrição da magia **Vidência** (`spell.id_spell` 354), que estava com o texto
  de Vínculo Protetor, trocada pelo texto do `referencias/magias.txt` (tabela de modificadores
  em texto corrido; três erros de OCR corrigidos). Uma transação que só confirmava com 1 linha,
  autorizado pelo usuário. Seed da api (`docs/database/database_inserts.sql`) com o mesmo texto.

## LGPD

A Política de Privacidade mudou em 17/10 (imagens de referência), em 20/10 (preferência de tema
no armazenamento local, versão 1.3.0) em 22/10 (preferência do Tom, versão 1.6.8) e de novo em 22/10 (ranking global, versão 1.7.0: o que aparece pra todos e a opção de sair) e em 24/10 (nome de usuário, versão 1.9.0: público na mesa e no ranking; o nome da conta Google deixou de ser guardado). **Falta o usuário decidir** se e como avisar os usuários. O texto final ainda depende de revisão jurídica. Ver
[`conceitos/lgpd.md`](conceitos/lgpd.md).
