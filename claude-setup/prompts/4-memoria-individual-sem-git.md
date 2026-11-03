---
resumo: Prompt independente pra montar num projeto da empresa a lógica de memória do Claude Code (docs curados individuais fora do git, hook de início de sessão, /fechar-entrega e memória enxuta), sem escrever nada nos repositórios de código.
tipo: procedimento
status: ativo
atualizado: 2026-11-03
---

# Memória do Claude Code num projeto da empresa (docs individuais, sem git)

Este prompt monta, para uma pessoa só, um sistema que faz o Claude Code lembrar do projeto entre
uma sessão e outra:

- uma pasta de **docs curados** (estado atual, pendências, decisões, armadilhas, como cada parte
  funciona), que é sua e fica **fora do git e fora dos repositórios**;
- um **hook** que, ao abrir o Claude Code, mostra o resumo desses docs e avisa quando há commits
  que ainda não foram registrados;
- um comando **/fechar-entrega**, que ao fim de cada tarefa atualiza os docs, guarda uma cópia de
  segurança e anota o que mudou;
- a **memória automática** do Claude apontando para os docs.

Nada é escrito nos repositórios de código: nem `CLAUDE.md`, nem `.claude/`, nem `.gitignore`.
Assim nada disso corre o risco de ser commitado no projeto. Tudo fica na pasta dos docs e em
`~/.claude/` (a pasta pessoal do Claude Code no seu computador).

**Como usar:** abra o Claude Code na pasta onde você costuma trabalhar no projeto, cole o bloco
abaixo e preencha os `<...>` (ou deixe em branco que o Claude pergunta). Ele mostra o plano antes
de criar qualquer coisa.

````markdown
Quero montar um sistema de memória e documentação para você (Claude Code) que sobreviva entre
sessões. Projeto: <NOME>. Repositórios de código: <LISTA, com a pasta de cada um>. Pasta onde
abro o Claude Code: <PASTA DE TRABALHO>. Pasta dos docs: <PASTA, ex.: ~/docs-<projeto>>.

Regra principal: os repositórios de código são do time e NADA deste sistema pode ser escrito
dentro deles. Não crie nem altere CLAUDE.md, .claude/, .gitignore, .git/info/exclude ou qualquer
outro arquivo dos repositórios, nem proponha fazer isso. Nos repositórios você só lê (código, git
log, git status). Tudo o que for criado fica na pasta dos docs ou em ~/.claude/. A pasta dos docs
NÃO pode ficar dentro de um repositório git: se a que eu indiquei estiver, me avise antes de
continuar.

Antes de criar qualquer coisa, me mostre o plano (pastas, arquivos, o que vai em cada um) e
espere eu aprovar. Escreva tudo em <IDIOMA>.

## Princípios

1. Três camadas, cada uma com um papel:
   - Regras que já existem nos repositórios (CLAUDE.md, .claude/rules/): são do time. Você lê e
     segue, mas não edita.
   - Docs (pasta individual, sem git): conhecimento curado e durável, a fonte de verdade entre
     sessões.
   - Memória automática do Claude (~/.claude/projects/<pasta>/memory/): só ponteiros para os docs
     e minhas preferências de como trabalhar. Nunca duplica o que está nos docs, no código ou no
     git. Regra minha que precisa valer em todo turno também vai para cá (como feedback).
2. Sem diário de sessão: ao terminar uma entrega, o que mudou é consolidado nos docs certos. Como
   não há git nos docs, cada fechamento soma uma linha no CHANGELOG.md e guarda uma cópia de
   segurança antes de alterar.
3. Ler só o necessário: estado atual e backlog primeiro; os outros docs só quando a tarefa tocar
   a área.
4. Nada sensível nos docs nem na memória: nunca senhas, tokens, chaves, connection strings ou
   dados pessoais de clientes e colegas. Anote onde a informação está (cofre de senhas, variável
   de ambiente, sistema interno), nunca o valor.
5. Commit e push no código só com pedido explícito, a cada vez. Mudança em ambiente compartilhado
   (banco, infraestrutura, produção) só com autorização e registrada nos docs.

## Estrutura dos docs

    README.md              índice: tabela com cada doc (link, tipo, resumo de uma linha), os
                           tipos e as regras de manutenção
    estado-atual.md        versão, últimos commits de cada repo, nº de testes, mudanças feitas
                           direto em ambientes compartilhados (o quê, onde, quando, quem
                           autorizou) e tabela "área → estado → doc". LER PRIMEIRO.
    backlog.md             tudo o que falta, num lugar só, em seções por área, "- [ ]".
                           Item concluído é REMOVIDO.
    decisoes.md            decisões (minhas, do time ou de quem pediu), por seção:
                           "- **AAAA-MM-DD** — decisão (quem). → doc". Revertida: ~~riscar~~ e
                           escrever a nova abaixo.
    gotchas.md             armadilhas técnicas que custaram tempo, por área
    CHANGELOG.md           uma linha por /fechar-entrega: "- **AAAA-MM-DD** — o que mudou nos
                           docs (docs tocados)". Faz o papel do histórico do git.
    conceitos/             um doc por área: como funciona HOJE (implementação, endpoints,
                           commits), mantido atualizado
    procedimentos/         passo a passo (rodar local, deploy, acessos, incidente...)
    historico/             docs encerrados, congelados: não editar, não seguir "próximos passos"
    .backups/              cópias de segurança feitas pelo /fechar-entrega (não indexar)

Cabeçalho de todo doc:

    ---
    resumo: uma frase
    tipo: estado | backlog | decisoes | gotchas | conceito | procedimento | historico
    status: ativo | encerrado
    atualizado: AAAA-MM-DD
    ---

Regras de manutenção (no README):
- Entrega concluída: atualizar estado-atual, remover o item do backlog, registrar o detalhe no doc
  de conceito da área (criar e indexar se a área não tiver) e somar a linha no CHANGELOG.md.
- Decisão → decisoes.md; armadilha → gotchas.md.
- Doc encerrado → historico/ com status: encerrado.
- Atualizar "atualizado" de todo doc alterado e conferir que todo link citado existe.

## Hook de início de sessão (SessionStart)

Script bash em ~/.claude/hooks/<projeto>-brief.sh, ligado no ~/.claude/settings.json com
matcher "startup|resume|clear|compact" e timeout curto (até 15 s), que imprime um resumo no
contexto. Se o settings.json já existir, junte o bloco "hooks" ao que está lá, sem apagar nada.
1. Só age se a sessão abriu na pasta de trabalho, num dos repositórios ou nos docs (lê o "cwd" do
   JSON que o Claude Code manda na entrada padrão). Fora disso, sai calado. Se a pasta de
   trabalho for compartilhada com outros projetos, avisa que o brief só vale para tarefas deste.
2. Frescor: compara os commits anotados em "Últimos commits" do estado-atual com o HEAD de cada
   repositório; se houver commits não registrados, avisa e lista até 10. Avisa também arquivos
   sem commit nos repositórios. Nos repositórios, só comandos de leitura do git.
3. Imprime o estado-atual (sem o cabeçalho) e só os títulos das seções do backlog com a contagem
   de "- [ ]" de cada uma.
4. Fecha com: "Mais contexto quando a tarefa pedir: decisoes.md, gotchas.md, conceitos/. Ao fim
   de uma entrega: /fechar-entrega."
As pastas vêm de ~/.claude/<projeto>.env (WORK_DIR, DOCS_DIR, REPOS, com padrões), nunca fixas
no script. Se o estado-atual não existir, sai calado. Lê o JSON com python3 -I (ou jq, se
python3 não existir) e nunca quebra a sessão: qualquer erro, sai com código 0.

## Comando /fechar-entrega (~/.claude/commands/fechar-entrega.md)

O comando fica em ~/.claude/commands/, nunca no .claude/ de um repositório.
1. Levantar: ler estado-atual e backlog; em cada repo, git log --oneline <commit anotado>..HEAD e
   git status; versão atual; nº de testes só se a entrega mexeu em testes (rodar a suíte e usar o
   número real, nunca inventar); reler a conversa: entregue, decidido, o que deu errado, o que
   ficou para depois, mudanças em ambientes compartilhados.
2. Se nada mudou desde a última atualização, dizer isso e parar (sem backup nem changelog).
3. Cópia de segurança antes de alterar: compactar a pasta dos docs (sem a .backups/) em
   .backups/docs-AAAA-MM-DD-HHMM.tar.gz e manter só as 10 mais recentes.
4. Atualizar pela tabela "o quê → onde": versão/commits/testes e mudança em ambiente compartilhado
   → estado-atual; concluído → remover do backlog; pendência nova → backlog; decisão →
   decisoes; armadilha → gotchas; como funciona → conceitos/; uma linha no CHANGELOG.md.
5. Conferir links e que nada sensível entrou nos docs; mostrar o resumo do que mudou em cada doc
   (comparando com a cópia de segurança, ex.: diff -ru) e os pontos principais.
6. Nunca escrever nos repositórios, nem fazer commit ou push.

## Memória automática

Um fato por arquivo, com frontmatter (name, description, type: user | feedback | project |
reference) e um MEMORY.md com uma linha por memória. Criar no mínimo:
- projeto: "antes de qualquer trabalho em <projeto>, ler <docs>/README.md, estado-atual.md e
  backlog.md; os docs são individuais e fora do git; nada de memória ou docs é escrito dentro
  dos repositórios";
- feedback: as preferências de trabalho que eu já tiver dito, com o porquê e como aplicar.
A memória vale para sessões abertas na pasta de trabalho (o Claude Code troca "/" e "." do
caminho por "-" no nome da pasta). Se eu abrir sessões direto dentro de um repositório, crie a
mesma memória de projeto na pasta de memória dele também (ela fica em ~/.claude/, não no
repositório).

## Para começar

Explore os repositórios (só leitura) para preencher o primeiro estado-atual (versão, último
commit de cada repo, testes), o backlog (TODOs e pendências encontradas, perguntando o que é
real) e os primeiros docs de conceito das áreas principais. No fim, confira com git status que
nenhum repositório ganhou arquivo novo ou alterado por causa disto e me diga como conferir o
resto: o brief aparece na primeira mensagem de uma sessão nova, /fechar-entrega aparece nos
comandos e /memory mostra a memória.
````
