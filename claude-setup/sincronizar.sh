#!/usr/bin/env bash
# Copia a configuração do Claude DESTA máquina pra cá (claude-setup/), pra versionar no git.
# Rodar depois de mudar o hook, o /fechar-entrega, a skill abrir-prs, o settings.json ou a memória.
# O ~/.claude/dungeon-companion.env (pastas, identidade, conta do gh) é pessoal e NÃO é copiado.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CONF="$HOME/.claude/dungeon-companion.env"
PROJECTS_ARG="${PROJECTS_DIR:-}"
# shellcheck disable=SC1090
[ -f "$CONF" ] && . "$CONF"
PROJECTS="${PROJECTS_ARG:-${PROJECTS_DIR:-$HOME/projects}}"
# O Claude Code nomeia a pasta do projeto trocando / e . do caminho por -.
MEM="$HOME/.claude/projects/$(printf '%s' "$PROJECTS" | sed 's#[/.]#-#g')/memory"

cp "$HOME/.claude/hooks/dc-brief.sh" "$HERE/hooks/"
cp "$HOME/.claude/commands/fechar-entrega.md" "$HERE/commands/"
# A skill pode não estar instalada nesta máquina: sem ela, mantém a cópia que já está aqui.
if [ -f "$HOME/.claude/skills/abrir-prs/SKILL.md" ]; then
  mkdir -p "$HERE/skills/abrir-prs"
  cp "$HOME/.claude/skills/abrir-prs/SKILL.md" "$HERE/skills/abrir-prs/"
else
  echo "aviso: ~/.claude/skills/abrir-prs não existe aqui — cópia do repositório mantida."
fi
cp "$HOME/.claude/settings.json" "$HERE/settings.json"
rm -f "$HERE"/memory/*.md
cp "$MEM"/*.md "$HERE/memory/"
echo "Copiado de ~/.claude para $HERE. Confira com: git -C \"$HERE/..\" status"
