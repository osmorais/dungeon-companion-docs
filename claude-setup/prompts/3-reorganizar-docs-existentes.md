---
resumo: Prompt genérico pra reorganizar documentos que já existem (READMEs, anotações, planos, diários) na estrutura de docs curados, sem perder conteúdo e com plano aprovado antes.
tipo: procedimento
status: ativo
atualizado: 2026-10-29
---

# Prompt 3 — Reorganizar documentos existentes nessa estrutura

Colar numa sessão do Claude Code com acesso aos documentos. Preencher os `<...>`. Depois de
reorganizar, o prompt 2 (`2-projeto-novo-completo.md`) monta o hook, o `/fechar-entrega` e o
`claude-setup/` pra manter a estrutura viva.

````markdown
Tenho documentos de um projeto espalhados e quero reorganizá-los numa estrutura de docs curados
que você (Claude Code) vai usar como memória entre sessões. Os documentos estão em
<PASTAS/ARQUIVOS>. O destino é <PASTA DE DESTINO (ex.: um repositório git de docs)>. Escreva os
docs novos em <IDIOMA>. Não apague nem altere nada nos originais: trabalhe numa cópia (ou numa
branch nova, se for git) e só mexa no destino depois que eu aprovar o plano.

## Estrutura de destino

    README.md              índice: tabela com cada doc (link, tipo, resumo de uma linha), os
                           tipos e as regras de manutenção
    <projeto>/
      estado-atual.md      onde estamos: versão, últimos commits, testes, mudanças em produção,
                           tabela "área → estado → doc"
      backlog.md           tudo o que falta, num lugar só, por área, itens "- [ ]"
      decisoes.md          decisões do usuário: "- **AAAA-MM-DD** — decisão. → doc"
      gotchas.md           armadilhas técnicas, por área
      conceitos/           como cada área funciona HOJE, um doc por área
      procedimentos/       passo a passo
      historico/           o que é registro do passado (diários, planos concluídos, auditorias
                           feitas): congelado, não editado
      referencias/         material bruto de consulta (textos, exportações, PDFs convertidos)

Cabeçalho de todo doc:

    ---
    resumo: uma frase
    tipo: estado | backlog | decisoes | gotchas | conceito | procedimento | historico
    status: ativo | encerrado
    atualizado: AAAA-MM-DD
    ---

## Como fazer

1. Inventário: listar todos os documentos com tamanho, data da última mudança (git log ou data do
   arquivo) e uma frase do que contém.
2. Classificar cada documento, ou cada trecho, quando um documento mistura coisas, num tipo:
   - "como funciona hoje" → conceito da área;
   - "o que falta / TODO / próximos passos" ainda válido → item do backlog;
   - "o usuário decidiu / ficou combinado" → decisão (com a data que der para descobrir);
   - "cuidado com / isso quebrou porque" → gotcha;
   - "passo a passo" → procedimento;
   - "o que aconteceu em tal dia / plano já executado" → historico (inteiro, sem reescrever);
   - números e versões atuais → estado-atual.
3. Plano para eu aprovar, numa tabela: origem → destino(s) → o que acontece (mover inteiro,
   dividir, juntar com outro, extrair itens, arquivar em historico/). Apontar também:
   - contradições entre documentos (qual parece valer e por quê) — para eu decidir;
   - itens de backlog que parecem já feitos — conferir no código ou no git antes de remover e me
     mostrar a evidência;
   - informação que parece velha, sem data ou sem fonte;
   - regras que deveriam valer em todo turno (ir para o CLAUDE.md ou .claude/rules/ dos
     repositórios) — só propor, não mover.
4. Depois do meu ok, executar:
   - nenhum conteúdo é perdido: o que não couber num doc ativo vai para historico/ ou
     referencias/;
   - conceitos são reescritos curtos e no presente ("como funciona"), sem narrativa de sessão; o
     histórico do porquê fica em decisoes.md ou historico/;
   - backlog sem duplicatas, agrupado por área, só com o que ainda falta;
   - toda decisão e todo gotcha com data quando houver;
   - cabeçalho em todos os docs, README com o índice completo;
   - corrigir os links internos para os caminhos novos e conferir que todos existem.
5. No fim: tabela "documento antigo → onde foi parar", a lista do que ficou pendente de decisão
   minha e o resultado da conferência de links. Não commitar sem eu pedir.

Depois de reorganizar, se eu quiser, monte também o hook de início de sessão, o /fechar-entrega
e a pasta claude-setup/ para manter essa estrutura viva (me pergunte antes).
````
