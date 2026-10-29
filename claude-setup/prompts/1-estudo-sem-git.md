---
resumo: Prompt genérico pra uma conversa de estudo/análise (ex.: POC) sem git, só coletando informações, com a memória numa pasta portátil (zip) pra outra pessoa continuar no Claude dela.
tipo: procedimento
status: ativo
atualizado: 2026-10-29
---

# Prompt 1 — Estudo ou análise sem git (só coletar informações)

Colar numa sessão do Claude Code aberta na pasta do estudo. Preencher os `<...>` (ou deixar o
Claude perguntar). A memória fica em `memoria/` dentro da pasta, e não na memória automática do
Claude, que é escondida e presa ao computador: assim dá pra mandar tudo num `.zip`
(`/exportar-memoria`) e a outra pessoa junta com a dela (`/importar-memoria`). No claude.ai (sem
Claude Code), a alternativa é subir os arquivos de `memoria/` como conhecimento de um Projeto,
atualizando à mão.

````markdown
Vou estudar/analisar <ASSUNTO OU POC> com você. Tudo o que formos entendendo precisa ficar salvo
de um jeito que eu possa compactar e mandar para outra pessoa, que vai continuar com a mesma
memória no Claude dela. Por isso a memória NÃO fica na memória automática do Claude (ela é
escondida e presa a este computador): fica em arquivos dentro desta pasta. Não há git. O material
de partida está em <ONDE ESTÁ: arquivos, pastas, links; ou "ainda não há material">. Antes de
criar qualquer coisa, me mostre o plano e espere eu aprovar. Escreva tudo em <IDIOMA>.

## Princípios

1. A pasta memoria/ é a fonte de verdade. A memória automática do Claude só pode guardar
   preferências pessoais de quem usa (como prefere as respostas), nunca conteúdo do estudo.
2. Nada de diário de conversa: o que foi entendido é consolidado no arquivo certo, curto e
   atualizado. O que ficou velho é corrigido no lugar, não acumulado.
3. Fato × hipótese: todo conceito diz a fonte (arquivo, trecho, link, pessoa) e o nível de
   confiança. Nunca registrar como confirmado algo que não foi conferido.
4. Ler só o necessário: começar pelo índice, pelo estado do estudo e pelas perguntas em aberto;
   os conceitos são abertos quando o assunto pedir.
5. Tudo em caminhos relativos a esta pasta, nada que dependa deste computador.

## Estrutura

    CLAUDE.md                  instruções que o Claude Code carrega em toda conversa aberta aqui
    .claude/commands/          comandos (vão junto no zip)
    memoria/
      INDICE.md                uma linha por arquivo: link + resumo de uma frase. Ler primeiro.
      estado.md                objetivo, o que já foi visto, o que falta, próximos passos
      perguntas-em-aberto.md   dúvidas sem resposta, "- [ ]", com quem/onde pode responder.
                               Respondida: sai daqui e vira conceito ou conclusão.
      conclusoes.md            conclusões e decisões, uma por linha:
                               "- **AAAA-MM-DD** — conclusão (quem). → conceito"
                               Revista: riscar com ~~...~~ e escrever a nova logo abaixo.
      riscos-e-hipoteses.md    premissas, riscos e hipóteses ainda não validadas
      glossario.md             termos e siglas, uma linha cada
      conceitos/               um arquivo por conceito entendido: o que é, como funciona, por
                               que importa, limites, exemplos. Mantido atualizado.
      fontes.md                material consultado: o que é, onde está, o que se tirou dali
      CHANGELOG.md             uma linha por salvamento: data, quem, o que mudou

Todo arquivo de memoria/ começa com:

    ---
    resumo: uma frase
    tipo: estado | perguntas | conclusoes | riscos | glossario | conceito | fontes
    confianca: confirmado | parcial | hipotese    (nos conceitos)
    fontes: onde foi conferido                     (nos conceitos)
    atualizado: AAAA-MM-DD
    autor: <quem atualizou por último>
    ---

## CLAUDE.md (raiz), curto

- "No começo de toda conversa, ler memoria/INDICE.md, memoria/estado.md e
  memoria/perguntas-em-aberto.md antes de responder."
- "Quando um conceito for entendido, uma pergunta respondida ou uma conclusão tirada, propor o
  registro na hora (arquivo e texto) e salvar depois que eu confirmar."
- "Nunca guardar conteúdo do estudo na memória automática do Claude; só em memoria/."
- As regras de fato × hipótese e o cabeçalho acima.

## Comandos (.claude/commands/)

- /salvar-memoria: consolidar o que a conversa produziu. Reler a conversa; atualizar estado.md;
  criar ou atualizar conceitos; tirar perguntas respondidas; registrar conclusões, riscos, termos
  e fontes; atualizar "atualizado" e "autor"; refazer o INDICE.md; somar uma linha no
  CHANGELOG.md; conferir que todo link existe; mostrar um resumo do que mudou.
- /exportar-memoria: gerar memoria-<assunto>-AAAA-MM-DD-<autor>.zip só com CLAUDE.md,
  .claude/commands/ e memoria/, pronto para enviar.
- /importar-memoria <arquivo.zip>: descompactar numa pasta temporária e JUNTAR com a memoria/
  local, sem sobrescrever às cegas:
  - arquivo que só existe de um lado: entra;
  - arquivo dos dois lados: se só um mudou, fica o mais novo; se os dois mudaram, juntar e, se
    houver contradição, perguntar qual vale (ou registrar como pergunta em aberto);
  - juntar os CHANGELOG.md e refazer o INDICE.md;
  - mostrar o que entrou, o que foi juntado e o que precisou de decisão.

## Para começar

Se houver material, explore e preencha o primeiro estado.md, o glossario.md e o fontes.md, e liste
as perguntas em aberto. Depois me pergunte por onde quero começar.
````
