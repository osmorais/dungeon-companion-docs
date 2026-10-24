---
name: abrir-prs
description: Sobe uma entrega do Dungeon Companion como PRs — cria a mesma branch na api, no web e no docs, commita só os arquivos da entrega como ddpzin, sobe as branches e abre um PR pra main em cada repo (sem merge). Usar quando o usuário pedir "abre os PRs", "sobe numa branch", "cria a branch e o PR" ou rodar /abrir-prs. Não faz commit nem push na main.
---

# Abrir PRs da entrega (api, web e docs)

Repositórios em `C:/dd/ForjaArcana/` (remotos `github.com/osmorais/*`):
`dungeon-companion-api`, `dungeon-companion-web`, `dungeon-companion-docs`.
Projeto pessoal: **nada da MarketUP** (nem identidade git, nem conta do `gh`, nem skills/esteiras).
Contexto extra do usuário (opcional): $ARGUMENTS

Rodar esta skill já é o pedido explícito de commit + push da branch + PR, **só para a entrega
atual**. Push na `main`, merge e force-push nunca entram, mesmo que pareça conveniente.

## 1. Conferir antes de mexer

- Para cada repo: `git status --short`, `git branch --show-current` e `git fetch origin`.
  Repo sem mudança fica de fora (diga qual). Repo fora da `main` ou atrás de `origin/main`:
  parar e perguntar.
- Testes e versão: a entrega já tem que ter passado por `npm run test:unit` (api) e
  `npm run test:run` (web), e por `/fechar-entrega` (docs atualizados). Se não houver sinal disso
  nesta conversa, rodar os testes; se falharem, parar.
- Identidade git **local** em cada repo que vai ter commit:
  `git config user.name ddpzin` e `git config user.email eduardopontesmorais@gmail.com`
  (o global da máquina é o da MarketUP — nunca commitar com ele).

## 2. Branch e commits

- Nome da branch: o mesmo nos três repos, `feat/<versão>-<tema-curto>` (ex.:
  `feat/1.10.0-bestiario`); correção sem funcionalidade nova: `fix/<versão>-<tema>`; mudança
  sem versão (só docs/regras): `chore/<tema>`. Versão = topo de `RELEASES` em
  `dungeon-companion-web/src/app/release-notes/release-notes.ts`.
- `git switch -c <branch>` a partir da `main` atualizada.
- **Stage por caminho**, nunca `git add -A`/`.`: só os arquivos da entrega. Ficam sempre de fora:
  `.env*`, `public/dragon-sprite-old.png` (web), `dist/`, `dist-test/`, arquivos soltos de teste.
  Mostrar o `git status --short` depois do stage e conferir.
- Mensagem no padrão dos repos (português): título `Versão A.B.C: <destaque>` (ou frase curta
  sem versão), corpo com tópicos do que mudou, e no fim a linha de coautoria que o sistema
  indicar para commits (`Co-Authored-By: ...`).

## 3. Subir as branches

- `git push -u origin <branch>` em cada repo. Nunca `--force`, nunca `main`.
- **403 / "Permission ... denied to ddpzin"**: a conta não tem escrita no repo. Parar, não tentar
  outra credencial nem outra conta por conta própria, e dizer ao usuário que ele precisa dar
  acesso de escrita ao ddpzin em `osmorais/<repo>` (Settings → Collaborators) — ou decidir outro
  caminho (fork). As branches e commits ficam locais até lá.
- Não ler, listar nem extrair tokens/credenciais (credential manager, `gh auth token` etc.).

## 4. Abrir os PRs

- Conta do `gh`: **ddpzin**. Conferir com `gh auth status`:
  - se ddpzin não aparecer, parar e pedir ao usuário: `! gh auth login` (entrar com ddpzin);
  - anotar a conta ativa antes, `gh auth switch --user ddpzin`, e no fim **voltar** pra conta que
    estava ativa (`gh auth switch --user <anterior>`), mesmo se algo falhar no meio.
- `gh pr create --repo osmorais/<repo> --base main --head <branch> --title "<título do commit>"
  --body-file <arquivo no scratchpad>` em cada repo. Sem `--draft`, salvo pedido.
- Corpo do PR (português, curto):
  - **O que muda** (tópicos);
  - **Testes** (contagem que saiu do `npm run ...`; nunca inventar);
  - **Versão**, **Banco** (o que mudou e se já rodou em produção) e **LGPD**, como no resumo
    final das regras do repo;
  - **Deploy**: ordem quando importar (ex.: api antes do web; migração antes da api);
  - **PRs relacionados**: links dos PRs irmãos (abrir os três, depois `gh pr edit --body-file`
    pra completar os links);
  - última linha: a de atribuição que o sistema indicar para PRs.
- Nunca `gh pr merge`.

## 5. Fechar

- Mostrar ao usuário os links dos PRs e o que ficou de fora (repo sem mudança, arquivo não
  commitado).
- Deixar cada repo na branch nova (não voltar pra `main` nem apagar branch).
- Registrar no `estado-atual.md` (seção "Versão e commits") que a entrega está em PR, com a branch
  e os links — isso também vai num commit na branch do docs (mesmo PR) se o PR do docs ainda não
  foi aberto; se já foi, commitar na branch e dar push de novo.
