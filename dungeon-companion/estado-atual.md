---
resumo: Onde o Dungeon Companion (Forja Arcana) está agora — versão, commits, testes, produção. Ler primeiro.
tipo: estado
status: ativo
atualizado: 2026-10-22
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

- **Versão do sistema**: 1.7.4 (2026-10-22, gaveta abre na sua vez, barra de XP leva à subida de nível, avatar nas barras) — notas em `/novidades`
  (`dungeon-companion-web/src/app/release-notes/release-notes.ts`).
- **Últimos commits**: api `4ccb980`, web `fc71b00` (versão 1.7.4) — todos enviados. No web fica
  de fora, de propósito, `public/dragon-sprite-old.png` (cópia local do sprite antigo; não
  commitar — tudo em `public/` vai pro ar).
- **Testes**: api 455 (`npm run test:unit`), web 509 (`npm run test:run`) —
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
| Cartas (magias e armas) e aviso de lançamento/ataque | magias em cartas (1.4.0), aviso único da mesa com as cartas (1.5.0), armas em cartas (1.6.0), ataque com arma no aviso (1.6.1), dano/cura aplicado dentro do aviso (1.7.1), aviso sincronizado pra todos com a rolagem dentro dele pra quem lança, quebra ao errar e saída de vitória (1.7.2) | [`conceitos/cartas.md`](conceitos/cartas.md) |
| Avatar (personalizador e camadas de imagem) | abas com miniaturas (1.6.9), 8 penteados novos (1.6.9), tons de pele por raça (1.6.10); faltam barbas, roupas, chapéus e rostos | [`conceitos/avatar.md`](conceitos/avatar.md) |
| Ranking global (feitos das mesas) | 12 categorias, contagem desde a 1.7.0, em lista (1.7.1), opção de sair em /conta | [`conceitos/ranking.md`](conceitos/ranking.md) |
| Card do personagem na sessão (molduras, barra de XP e de vida) | molduras dos dois temas no card, nos avisos e nos toasts; barra de XP; DANO/CURA do próprio PV na gaveta de ações (1.7.1), com animação, CURA TOTAL e DANO TOTAL (1.7.3); gaveta abre sozinha na vez do jogador, barra de XP clicável pra subir de nível, avatar com anel nas barras das gavetas (1.7.4) | [`conceitos/molduras.md`](conceitos/molduras.md) |
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

## LGPD

A Política de Privacidade mudou em 17/10 (imagens de referência), em 20/10 (preferência de tema
no armazenamento local, versão 1.3.0) em 22/10 (preferência do Tom, versão 1.6.8) e de novo em 22/10 (ranking global, versão 1.7.0: o que aparece pra todos e a opção de sair). **Falta o usuário decidir** se e como avisar os usuários. O texto final ainda depende de revisão jurídica. Ver
[`conceitos/lgpd.md`](conceitos/lgpd.md).
