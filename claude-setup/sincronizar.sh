#!/usr/bin/env bash
# Copia a configuração do Claude DESTA máquina pra cá (claude-setup/), pra versionar no git.
# Rodar depois de mudar o hook, o /fechar-entrega, o settings.json ou a memória.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PROJECTS="${PROJECTS_DIR:-$HOME/projects}"
# O Claude Code nomeia a pasta do projeto trocando / e . do caminho por -.
MEM="$HOME/.claude/projects/$(printf '%s' "$PROJECTS" | sed 's#[/.]#-#g')/memory"

cp "$HOME/.claude/hooks/dc-brief.sh" "$HERE/hooks/"
cp "$HOME/.claude/commands/fechar-entrega.md" "$HERE/commands/"
cp "$HOME/.claude/settings.json" "$HERE/settings.json"
rm -f "$HERE"/memory/*.md
cp "$MEM"/*.md "$HERE/memory/"
echo "Copiado de ~/.claude para $HERE. Confira com: git -C \"$HERE/..\" status"
