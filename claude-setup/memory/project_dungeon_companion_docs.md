---
name: project-dungeon-companion-docs
description: Dungeon Companion context lives in ~/projects/docs (git) — read README.md, estado-atual.md and backlog.md before any work; keep them updated after each delivery
metadata:
  type: project
---

Since 2026-10-20 the curated project knowledge is organized in `~/projects/docs/` (its own git repo, private remote github.com/osmorais/dungeon-companion-docs, branch main — never make it public: contains copyrighted book text), index at `~/projects/docs/README.md`. For dungeon-companion: `dungeon-companion/estado-atual.md` (version, commits, tests, prod DB changes), `backlog.md` (every pending item, by area), `decisoes.md` (user decisions — don't re-ask), `gotchas.md`, `conceitos/` (how each area works now), `procedimentos/`, `historico/` (frozen: old status diary, level-up plan, Média progress, spells progress — never follow "próximos passos" from there).

**Why:** the user reorganized the scattered progress docs (old `dungeon-companion-*.md` at the docs root, a 714-line status diary) after reviewing ai-memory's wiki layout; pending items were spread over 7 files and finished docs looked active.

**How to apply:** at the start of dungeon-companion work read `estado-atual.md` + `backlog.md`. After a delivery: update `estado-atual.md`, remove done items from `backlog.md`, put details in the area's `conceitos/` doc, new decisions in `decisoes.md`, new pitfalls in `gotchas.md`; never append session diaries. Rules that must hold every turn go in the repos' `CLAUDE.md` / `.claude/rules/`. The old `~/projects/dungeon-companion` repo is archived. Related: [[project-lgpd]], [[project-spell-mechanics]].

Since 2026-10-20 a global SessionStart hook (`~/.claude/hooks/dc-brief.sh`, registered in `~/.claude/settings.json`) injects `estado-atual.md`, backlog headings and a freshness check (noted commits vs api/web HEAD, uncommitted changes) when a session opens in ~/projects, the api, the web or ~/projects/docs — also after compaction. `/fechar-entrega` (`~/.claude/commands/fechar-entrega.md`) is the consolidation step after a delivery.

Since 2026-10-24 `~/projects/docs/claude-setup/` versions a copy of that machine-only setup (hook, `settings.json`, `/fechar-entrega`, this memory) with `instalar.sh` (new computer, never overwrites) and `sincronizar.sh` (~/.claude → docs); after changing any of them, run `sincronizar.sh` and commit the docs. Per-machine values (projects folder, docs folder, git identity and `gh` account for the `/abrir-prs` skill) live in `~/.claude/dungeon-companion.env` (template `claude-setup/dungeon-companion.env.example`, never committed); the hook, the skill and both scripts read it.

Since 2026-10-25 another developer can deliver through PRs (skill `/abrir-prs`, same branch name in api/web/docs); the user reviews and merges (api before web), then `/fechar-entrega` records the merge commits.
