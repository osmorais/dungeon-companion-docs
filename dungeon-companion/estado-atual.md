---
resumo: Onde o Dungeon Companion (Forja Arcana) está agora — versão, commits, testes, produção. Ler primeiro.
tipo: estado
status: ativo
atualizado: 2026-10-20
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

- **Versão do sistema**: 1.3.2 (2026-10-21, topo da sessão sem quadro, página única no desktop, barras de rolagem do tema) — notas em `/novidades`
  (`dungeon-companion-web/src/app/release-notes/release-notes.ts`).
- **Últimos commits**: api `33a8f6c`, web `b599cbd` (versão 1.3.2) — todos enviados. No web fica
  de fora, de propósito, `public/dragon-sprite-old.png` (cópia local do sprite antigo; não
  commitar — tudo em `public/` vai pro ar).
- **Testes**: api 422 (`npm run test:unit`), web 347 (`npm run test:run`) —
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
| Quadro do Mestre (gaveta lateral só do mestre: rolagens ocultas, grupo, anotações, descanso, dano em área, apagar sessão) | 4 fases feitas (1.2.0); aba de expandir/recolher à esquerda (1.2.1 desktop, 1.2.2 celular) | [`conceitos/quadro-do-mestre.md`](conceitos/quadro-do-mestre.md) |
| Criação de ficha | validada na API (422), perícias/armas/itens do kit corrigidos | [`historico/diario-2026-09-10_a_2026-10-18.md`](historico/diario-2026-09-10_a_2026-10-18.md) |

## Mudanças feitas direto no banco de produção

Sempre com autorização do usuário, numa transação. Mais antigas: ver o diário.

- **2026-10-16**: 102 linhas de `character_skill` marcadas como treinadas + 6 inseridas (perícias
  do antecedente das fichas antigas); 4 descrições de magia corrigidas; coluna
  `character.active_effects`; 23 itens novos no catálogo `item` (ids 101–123) + 257 linhas de
  equipamento inicial no inventário dos 20 jogadores em sessão.
- **2026-10-17**: tabela `session_reference_image` + coluna `game_session.shown_reference_image_id`.
- **2026-10-18**: talento Habilidoso das fichas #146 e #145 (4 perícias treinadas + `choice_data`).
- **2026-10-20**: coluna `game_session.dm_notes` (TEXT, nula) — anotações do Quadro do Mestre (1.2.0). Rodado antes do deploy da api, autorizado pelo usuário; 16 sessões, todas com `dm_notes` nulo.

## LGPD

A Política de Privacidade mudou em 17/10 (imagens de referência) e em 20/10 (preferência de tema
no armazenamento local, versão 1.3.0). **Falta o usuário decidir** se e como avisar os usuários. O texto final ainda depende de revisão jurídica. Ver
[`conceitos/lgpd.md`](conceitos/lgpd.md).
