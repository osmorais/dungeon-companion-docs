---
name: project-spell-mechanics
description: "Magias mecânicas do dungeon-companion (catálogo spell-mechanics.ts, modal de rolagem, efeitos de tela) — ler o doc antes de mexer em magias"
metadata:
  node_type: memory
  type: project
  originSessionId: d45e820f-d40d-4236-8888-0daf01842c6e
  modified: 2026-10-16T16:36:06.564Z
---

O dungeon-companion tem um catálogo de mecânica de magias no código da api (`src/services/character-sheet/spell-mechanics.ts`), não no banco: ataque, resistência, cura, magias que somam dano no ataque, crítico, aplicar no alvo e efeitos de tela por elemento — fases 1 a 4 e efeitos enviados em 2026-10-16.

**Why:** a tabela `spell` só guarda texto (a coluna `damage` existe mas não é usada); o usuário decidiu manter a regra no código, conferida com o livro (`docs/dungeon-companion/referencias/magias.txt`), e que aplicar dano/cura no alvo é opcional seguindo as permissões de PV atuais.

**How to apply:** antes de qualquer mudança em magias, ler `~/projects/docs/dungeon-companion/conceitos/magias-mecanicas.md` (status, decisões, o que ficou de fora) e `dungeon-companion/historico/spells-progress.md` (descrições). Números seguem o livro traduzido mesmo quando diverge do original em inglês. Ver também [[project-lgpd]].
