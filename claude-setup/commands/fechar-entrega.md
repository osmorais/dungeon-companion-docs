---
description: Fecha uma entrega do Dungeon Companion — atualiza estado-atual, backlog, decisões e gotchas em ~/projects/docs
---

Consolide nos docs do Dungeon Companion (`~/projects/docs/dungeon-companion/`) o que foi feito
desde a última atualização. É a única forma de registro: não escreva diário de sessão.
Contexto extra do usuário (opcional): $ARGUMENTS

## 1. Levantar o que mudou

- Leia `estado-atual.md` e `backlog.md`.
- Para api e web (`~/projects/dungeon-companion-api` e `-web`): `git log --oneline <commit anotado em "Últimos commits">..HEAD` e `git status --short`.
- Versão atual: topo de `RELEASES` em `dungeon-companion-web/src/app/release-notes/release-notes.ts`.
- Contagem de testes: só se a entrega mexeu em testes. Rode `npm run test:unit` (api) e
  `npm run test:run` (web) e use o número que sair; nunca invente.
- Releia esta conversa: o que foi entregue, o que o usuário decidiu, o que deu errado e o que
  ficou para depois, incluindo mudanças feitas direto no banco de produção.

## 2. Atualizar os docs

| O quê | Onde |
|---|---|
| Versão, últimos commits (api e web), testes | `estado-atual.md`, seção "Versão e commits" |
| Mudança feita direto no banco de produção (o quê, quantas linhas, quando, quem autorizou) | `estado-atual.md`, "Mudanças feitas direto no banco de produção" |
| Estado de uma área (tabela "Áreas") | `estado-atual.md` |
| Item concluído | **remover** do `backlog.md` |
| Pendência nova, limitação aceita, ideia adiada | `backlog.md`, na seção da área, com `- [ ]` |
| Decisão do usuário (regra, escopo, produto) | `decisoes.md`: `- **AAAA-MM-DD** — decisão. → doc` |
| Armadilha técnica que custou tempo | `gotchas.md`, na seção da área |
| Como uma funcionalidade funciona (detalhe de implementação, endpoints, commits) | doc da área em `conceitos/`; crie um novo se a área não tiver doc e adicione no `README.md` |
| Regra que precisa valer em todo turno | proponha ao usuário levar para o `CLAUDE.md` ou `.claude/rules/` do repo, sem editar por conta própria |

Regras:
- Atualize o campo `atualizado:` do cabeçalho de cada doc que mudou.
- Não edite nada em `historico/` (é congelado).
- Decisão revertida: risque com `~~...~~` e escreva a nova logo abaixo.
- Português simples e direto, no mesmo estilo dos docs existentes.
- Se nada mudou desde a última atualização, diga isso e pare.

## 3. Conferir e reportar

- Links: todo caminho citado nos docs alterados precisa existir.
- Mostre ao usuário um resumo curto do que mudou em cada doc (`git -C ~/projects/docs diff --stat`
  e os pontos principais).
- Se nesta conversa mudou o hook, o `settings.json`, este comando ou a memória do Claude, rode
  `~/projects/docs/claude-setup/sincronizar.sh` pra atualizar a cópia versionada nos docs.
- **Não faça commit nem push** sem pedido explícito. Ao final, pergunte se pode commitar e dar
  push em `~/projects/docs` (remoto privado `dungeon-companion-docs`).
