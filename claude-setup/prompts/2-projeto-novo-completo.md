---
resumo: Prompt genérico pra montar num projeto novo de software toda a lógica de memória — repositório de docs curados, hook de início de sessão, /fechar-entrega, memória enxuta e claude-setup portátil.
tipo: procedimento
status: ativo
atualizado: 2026-10-29
---

# Prompt 2 — Projeto novo com toda a lógica (docs, hook, fechar entrega)

Colar numa sessão do Claude Code aberta na pasta de trabalho do projeto novo. Preencher os `<...>`
(ou deixar o Claude perguntar). Com um repositório só, os docs podem ficar numa pasta `docs/`
dentro dele; sem versão nem produção, tirar esses campos do estado-atual (mas manter os commits,
que alimentam o aviso de frescor do hook).

````markdown
Quero montar neste projeto um sistema de memória e documentação para você (Claude Code) que
sobreviva entre sessões e entre computadores. Projeto: <NOME>. Repositórios de código:
<LISTA, com a pasta de cada um>. Pasta onde abro o Claude Code: <PASTA DE TRABALHO>. Onde
ficarão os docs: <REPOSITÓRIO GIT SEPARADO (recomendado) ou PASTA docs/ DENTRO DO REPO>.
Antes de criar qualquer coisa, me mostre o plano (pastas, arquivos, o que vai em cada um) e
espere eu aprovar. Escreva tudo em <IDIOMA>.

## Princípios

1. Três camadas, cada uma com um papel:
   - Regras de cada repositório (CLAUDE.md e .claude/rules/): o que precisa valer em TODO turno
     (comandos, convenções, "nunca faça X"). Vão junto com o git clone.
   - Docs (git): conhecimento curado e durável, a fonte de verdade entre sessões.
   - Memória automática do Claude (~/.claude/projects/<pasta>/memory/): só ponteiros para os docs
     e preferências do usuário sobre como trabalhar. Nunca duplica o que está nos docs, no código
     ou no git.
2. Sem diário de sessão: ao terminar uma entrega, o que mudou é consolidado nos docs certos; o
   histórico fica no git.
3. Ler só o necessário: estado atual e backlog primeiro; os outros docs só quando a tarefa tocar
   a área.
4. Commit e push só com pedido explícito, a cada vez. Mudança em produção (banco, infraestrutura)
   só com autorização e registrada.

## Estrutura dos docs

    README.md              índice: tabela com cada doc (link, tipo, resumo de uma linha), os
                           tipos e as regras de manutenção
    <projeto>/
      estado-atual.md      versão, últimos commits de cada repo, nº de testes, mudanças feitas
                           direto em produção (o quê, quantas linhas, quando, quem autorizou) e
                           tabela "área → estado → doc". LER PRIMEIRO.
      backlog.md           tudo o que falta, num lugar só, em seções por área, "- [ ]".
                           Item concluído é REMOVIDO.
      decisoes.md          decisões do usuário (regra, escopo, produto), por seção:
                           "- **AAAA-MM-DD** — decisão. → doc". Revertida: ~~riscar~~ e escrever
                           a nova abaixo.
      gotchas.md           armadilhas técnicas que custaram tempo, por área
      conceitos/           um doc por área: como funciona HOJE (implementação, endpoints, commits),
                           mantido atualizado
      procedimentos/       passo a passo (instalar, backup, incidente, deploy, gerar artes...)
      historico/           docs encerrados, congelados: não editar, não seguir "próximos passos"
      scripts/             scripts reaproveitáveis
    claude-setup/          cópia versionada do que mora só em ~/.claude

Cabeçalho de todo doc:

    ---
    resumo: uma frase
    tipo: estado | backlog | decisoes | gotchas | conceito | procedimento | historico
    status: ativo | encerrado
    atualizado: AAAA-MM-DD
    ---

Regras de manutenção (no README):
- Entrega concluída: atualizar estado-atual, remover o item do backlog, registrar o detalhe no doc
  de conceito da área (criar e indexar se a área não tiver).
- Decisão → decisoes.md; armadilha → gotchas.md.
- Regra que precisa valer em todo turno → CLAUDE.md ou .claude/rules/ do repositório (propor ao
  usuário, não editar sozinho).
- Doc encerrado → historico/ com status: encerrado.
- Atualizar "atualizado" de todo doc alterado e conferir que todo link citado existe.

## Hook de início de sessão (SessionStart)

Script bash em ~/.claude/hooks/<projeto>-brief.sh, ligado no ~/.claude/settings.json com
matcher "startup|resume|clear|compact", timeout curto, que imprime um resumo no contexto:
1. Só age se a sessão abriu na pasta de trabalho, num dos repositórios ou nos docs (lê o "cwd" do
   JSON que o Claude Code manda na entrada padrão). Fora disso, sai calado.
2. Frescor: compara os commits anotados em "Últimos commits" do estado-atual com o HEAD de cada
   repositório; se houver commits não registrados, avisa e lista até 10. Avisa também arquivos
   sem commit nos repositórios e nos docs.
3. Imprime o estado-atual (sem o cabeçalho) e só os títulos das seções do backlog com a contagem
   de "- [ ]" de cada uma.
4. Fecha com: "Mais contexto quando a tarefa pedir: decisoes.md, gotchas.md, conceitos/. Ao fim
   de uma entrega: /fechar-entrega."
As pastas vêm de ~/.claude/<projeto>.env (PROJECTS_DIR, DOCS_DIR, com padrões), nunca fixas.

## Comando /fechar-entrega (~/.claude/commands/fechar-entrega.md)

1. Levantar: ler estado-atual e backlog; em cada repo, git log --oneline <commit anotado>..HEAD e
   git status; versão atual; nº de testes só se a entrega mexeu em testes (rodar a suíte e usar o
   número real, nunca inventar); reler a conversa: entregue, decidido, o que deu errado, o que
   ficou para depois, mudanças em produção.
2. Atualizar pela tabela "o quê → onde": versão/commits/testes e mudança em produção →
   estado-atual; concluído → remover do backlog; pendência nova → backlog; decisão → decisoes;
   armadilha → gotchas; como funciona → conceitos/.
3. Conferir links, mostrar o resumo (git diff --stat e pontos principais); se a configuração do
   Claude mudou, rodar o sincronizar.sh. Não commitar: perguntar se pode commitar e dar push nos
   docs.

## Memória automática

Um fato por arquivo, com frontmatter (name, description, type: user | feedback | project |
reference) e um MEMORY.md com uma linha por memória. Criar no mínimo:
- projeto: "antes de qualquer trabalho em <projeto>, ler <docs>/README.md, estado-atual.md e
  backlog.md";
- feedback: as preferências de trabalho que eu já tiver dito, com o porquê e como aplicar.

## claude-setup/ (trocar de computador)

- Cópias do hook, do settings.json, do /fechar-entrega, de skills próprias e da memória.
- <projeto>.env.example: modelo da configuração por máquina (pastas, identidade de commit). O
  .env real nunca vai para o git.
- instalar.sh: copia para ~/.claude sem sobrescrever o que já existe (avisa o que pulou), cria o
  .env a partir do modelo e calcula a pasta da memória a partir da pasta de trabalho (o Claude
  Code troca "/" e "." do caminho por "-").
- sincronizar.sh: o inverso (~/.claude → claude-setup/), depois de mudar hook, comando, settings
  ou memória.
- LEIA-ME.md: tabela "arquivo aqui → vai para → para que serve", passos de instalação e como
  conferir (o brief aparece na primeira mensagem; /fechar-entrega aparece nos comandos).

## Ligar os repositórios aos docs

No CLAUDE.md de cada repositório, seção "Contexto do projeto": "estado, pendências, decisões e
armadilhas ficam em <caminho dos docs>; antes de começar uma tarefa, ler estado-atual.md e
backlog.md; ao terminar uma entrega, atualizar os dois (/fechar-entrega)."

## Para começar

Explore os repositórios para preencher o primeiro estado-atual (versão, último commit de cada
repo, testes), o backlog (TODOs e pendências encontradas, perguntando o que é real) e os
primeiros docs de conceito das áreas principais.
````
