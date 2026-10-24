---
resumo: Configuração do Claude Code fora dos repositórios (hook do brief, /fechar-entrega, settings, memória) e como instalar em outro computador.
tipo: procedimento
status: ativo
atualizado: 2026-10-24
---

# Configuração do Claude Code (fora dos repositórios)

As regras de cada repositório (`CLAUDE.md`, `.claude/rules/`, `.claude/commands/` da api e do web)
já vão junto com o `git clone`. Esta pasta guarda o que mora **só em `~/.claude/`** e se perderia
ao trocar de computador:

| Arquivo aqui | Vai para | Pra que serve |
|---|---|---|
| `hooks/dc-brief.sh` | `~/.claude/hooks/dc-brief.sh` | Hook de início de sessão: resumo do `estado-atual.md`, títulos do backlog e avisos de commits não registrados / mudanças sem commit |
| `settings.json` | `~/.claude/settings.json` | Liga o hook (`SessionStart`) e os plugins `frontend-design` e `feature-dev` |
| `commands/fechar-entrega.md` | `~/.claude/commands/fechar-entrega.md` | Comando `/fechar-entrega` |
| `memory/*.md` | `~/.claude/projects/<pasta do projeto>/memory/` | Memória do Claude (não testar a UI no navegador; ler os docs, o doc de LGPD e o de magias antes de mexer) |

## Instalar num computador novo

1. Pré-requisitos: Claude Code, `git`, `bash` e `python3` (o hook usa Python pra ler o JSON da
   sessão). No Windows, usar o WSL.
2. Clonar os três repositórios **na mesma pasta** (o hook procura em `~/projects/`):
   ```bash
   mkdir -p ~/projects && cd ~/projects
   git clone git@github.com:osmorais/dungeon-companion-api.git
   git clone git@github.com:osmorais/dungeon-companion-web.git
   git clone git@github.com:osmorais/dungeon-companion-docs.git docs
   ```
   Pasta diferente de `~/projects`: trocar `P="$HOME/projects"` no topo de `hooks/dc-brief.sh` e
   rodar o instalador com `PROJECTS_DIR=/outra/pasta`.
3. Rodar o instalador:
   ```bash
   ~/projects/docs/claude-setup/instalar.sh
   ```
   Ele copia o hook, o comando e a memória **sem sobrescrever** arquivos que já existam (avisa
   quais pulou). O `settings.json` só é copiado se ainda não existir; se já existir, juntar à mão
   o bloco `"hooks"` (e `"enabledPlugins"`) daqui no de lá.
4. Plugins: se não vierem ativos, instalar `frontend-design` e `feature-dev` pelo `/plugin` do
   Claude Code (marketplace `claude-plugins-official`).
5. Conferir: abrir o Claude Code em `~/projects` — a primeira mensagem deve ter o "Brief do
   Dungeon Companion". `/fechar-entrega` deve aparecer na lista de comandos. `/memory` mostra a
   memória.
6. Arquivos de fora do git que ainda precisam ser trazidos à mão: o `.env` da api (credenciais do
   banco e dos serviços — nunca versionar) e, se quiser, `public/dragon-sprite-old.png` do web.

**Pasta da memória:** o Claude Code nomeia a pasta trocando `/` e `.` do caminho de trabalho por
`-` (`/home/osmor/projects` → `-home-osmor-projects`). Com outro usuário ou outro caminho o nome
muda — o instalador calcula a partir de `PROJECTS_DIR` (padrão `~/projects`). A memória vale pra
sessões abertas **nessa pasta**; sessão aberta direto dentro da api ou do web usa outra pasta de
memória (por isso o hook e o `CLAUDE.md` de cada repo apontam pros docs também).

## Manter atualizado

Esta pasta é uma **cópia**. Depois de mudar o hook, o `/fechar-entrega`, o `settings.json` ou a
memória nesta máquina:

```bash
~/projects/docs/claude-setup/sincronizar.sh   # copia ~/.claude → claude-setup/
git -C ~/projects/docs status                 # conferir e commitar
```

O `/fechar-entrega` lembra de rodar isso quando a configuração mudou.
