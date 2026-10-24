#!/usr/bin/env bash
# SessionStart: injeta o brief do Dungeon Companion (estado atual, backlog, frescor) no contexto.
# Só age quando a sessão abre em ~/projects, na api, no web ou em ~/projects/docs.

P="$HOME/projects"
DOCS="$P/docs/dungeon-companion"
cwd=$(python3 -I -c 'import json,sys
try: print(json.load(sys.stdin).get("cwd",""))
except Exception: print("")' 2>/dev/null)
[ -z "$cwd" ] && cwd="$PWD"

case "$cwd" in
  "$P"|"$P/dungeon-companion-api"*|"$P/dungeon-companion-web"*|"$P/docs"*) ;;
  *) exit 0 ;;
esac
[ -f "$DOCS/estado-atual.md" ] || exit 0

echo "=== Brief do Dungeon Companion (hook SessionStart; docs em ~/projects/docs) ==="
[ "$cwd" = "$P" ] && echo "(Sessão aberta em ~/projects: este brief só vale se a tarefa for do Dungeon Companion.)"
echo

# Frescor: commits anotados no estado-atual × HEAD real dos repos
line=$(grep -m1 'Últimos commits' "$DOCS/estado-atual.md")
for repo in api web; do
  dir="$P/dungeon-companion-$repo"
  [ -d "$dir/.git" ] || continue
  noted=$(printf '%s' "$line" | grep -oE "$repo \`[0-9a-f]{7,}\`" | head -1 | grep -oE '[0-9a-f]{7,}')
  head=$(git -C "$dir" rev-parse --short HEAD 2>/dev/null)
  if [ -n "$noted" ] && ! git -C "$dir" merge-base --is-ancestor HEAD "$noted" 2>/dev/null; then
    echo "AVISO: estado-atual.md registra $repo \`$noted\`, mas o HEAD é \`$head\`. Commits não registrados:"
    git -C "$dir" log --oneline "$noted..HEAD" 2>/dev/null | head -10 | sed 's/^/  - /'
  fi
  dirty=$(git -C "$dir" status --porcelain 2>/dev/null | wc -l)
  [ "$dirty" -gt 0 ] && echo "AVISO: $repo tem $dirty arquivo(s) com mudança sem commit."
done
ddirty=$(git -C "$P/docs" status --porcelain 2>/dev/null | wc -l)
[ "$ddirty" -gt 0 ] && echo "AVISO: ~/projects/docs tem $ddirty arquivo(s) sem commit."
echo

echo "--- estado-atual.md ---"
sed '1{/^---$/!q};1,/^---$/{/^---$/!d;/^---$/d}' "$DOCS/estado-atual.md" | sed '/^resumo:\|^tipo:\|^status:\|^atualizado:/d'
echo
echo "--- backlog.md (só os títulos; abrir o arquivo para os itens) ---"
grep -E '^## ' "$DOCS/backlog.md" | while read -r h; do
  sec=${h#\#\# }
  n=$(awk -v s="$h" '$0==s{f=1;next} /^## /{f=0} f && /^- \[ \]/{c++} END{print c+0}' "$DOCS/backlog.md")
  echo "- $sec ($n)"
done
echo
echo "Mais contexto quando a tarefa pedir: decisoes.md, gotchas.md, conceitos/. Ao fim de uma entrega: /fechar-entrega."
