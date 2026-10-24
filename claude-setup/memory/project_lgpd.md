---
name: project-lgpd
description: LGPD compliance work on dungeon-companion (Forja Arcana) — docs/dungeon-companion/conceitos/lgpd.md is the source of truth before any privacy/data change
metadata:
  type: project
---

Dungeon Companion (public name "Forja Arcana", forjaarcana.com) went through a full LGPD adequacy pass on 2026-10-14/15 before public launch. All 15 technical items are done; read `~/projects/docs/dungeon-companion/conceitos/lgpd.md` before touching personal data, auth, storage, or the privacy/terms pages. Incident plan: `dungeon-companion/procedimentos/incidente.md`.

**Why:** the user (pessoa física, controlador of the data) is preparing to publicize the system; the privacy policy makes promises (export, deletion, image cleanup) the code must keep.

**How to apply:** both repos have `.claude/rules/lgpd.md` — run its checklist on every implementation and add a "LGPD" line to the final summary. Remaining non-code items are tracked in `~/projects/docs/dungeon-companion/backlog.md` ("Ações do usuário"). Related: [[project-dungeon-companion-docs]].
