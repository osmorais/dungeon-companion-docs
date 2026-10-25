#!/usr/bin/env bash
# Instala a configuração do Claude deste repositório num computador novo.
# Não sobrescreve arquivo que já existe; o settings.json nunca é copiado por cima — ver LEIA-ME.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CONF="$HOME/.claude/dungeon-companion.env"

# Copia só se o destino ainda não existe (avisa quando pula).
copy_new() {
  local dest="$2/$(basename "$1")"
  if [ -e "$dest" ]; then echo "já existe, mantido: $dest"; else cp "$1" "$dest"; fi
}

# Configuração por máquina (pasta dos repos, identidade dos commits, conta do gh): cria a partir do
# modelo se ainda não existir. PROJECTS_DIR passado na linha de comando vale mais que o arquivo.
mkdir -p "$HOME/.claude"
if [ ! -e "$CONF" ]; then
  cp "$HERE/dungeon-companion.env.example" "$CONF"
  echo "Criado $CONF — preencha GIT_USER_NAME, GIT_USER_EMAIL e GH_USER (e as pastas, se diferentes)."
fi
PROJECTS_ARG="${PROJECTS_DIR:-}"
# shellcheck disable=SC1090
. "$CONF"
PROJECTS="${PROJECTS_ARG:-${PROJECTS_DIR:-$HOME/projects}}"
MEM="$HOME/.claude/projects/$(printf '%s' "$PROJECTS" | sed 's#[/.]#-#g')/memory"

mkdir -p "$HOME/.claude/hooks" "$HOME/.claude/commands" "$HOME/.claude/skills/abrir-prs" "$MEM"
copy_new "$HERE/hooks/dc-brief.sh" "$HOME/.claude/hooks"
chmod +x "$HOME/.claude/hooks/dc-brief.sh"
copy_new "$HERE/commands/fechar-entrega.md" "$HOME/.claude/commands"
copy_new "$HERE/skills/abrir-prs/SKILL.md" "$HOME/.claude/skills/abrir-prs"
for f in "$HERE"/memory/*.md; do copy_new "$f" "$MEM"; done

if [ -f "$HOME/.claude/settings.json" ]; then
  echo "AVISO: ~/.claude/settings.json já existe e NÃO foi alterado."
  echo "       Junte à mão o bloco \"hooks\" (e os plugins) de $HERE/settings.json — ver LEIA-ME.md."
else
  cp "$HERE/settings.json" "$HOME/.claude/settings.json"
  echo "settings.json instalado."
fi
echo "Memória em: $MEM"
echo "Pronto. Abra uma sessão do Claude Code em $PROJECTS pra conferir o brief."
