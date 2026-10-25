# Docs do Dungeon Companion

Conhecimento curado do Dungeon Companion (Forja Arcana), versionado em git
(`github.com/osmorais/dungeon-companion-docs`, **privado**). É a fonte de verdade
durável entre sessões (a memória do Claude só aponta pra cá).

**Como usar**: comece pelo `estado-atual.md` e pelo `backlog.md` do projeto. Os demais docs são
abertos só quando a tarefa toca a área. Cada doc começa com um cabeçalho
(`resumo`/`tipo`/`status`/`atualizado`).

**Tipos**: `estado` (onde estamos), `backlog` (o que falta), `decisoes` (o que o usuário decidiu),
`gotchas` (armadilhas), `conceito` (como funciona hoje, mantido atualizado), `procedimento` (passo
a passo), `historico` (congelado: registro do que aconteceu; não editar, não seguir "próximos
passos" de lá).

## Dungeon Companion (Forja Arcana)

| Doc | Tipo | Resumo |
|---|---|---|
| [`estado-atual.md`](dungeon-companion/estado-atual.md) | estado | Versão, commits, testes, mudanças em produção. **Ler primeiro.** |
| [`backlog.md`](dungeon-companion/backlog.md) | backlog | Todas as pendências, por área |
| [`decisoes.md`](dungeon-companion/decisoes.md) | decisoes | Decisões do usuário (regras, escopo, privacidade) |
| [`gotchas.md`](dungeon-companion/gotchas.md) | gotchas | Armadilhas técnicas por área |
| [`conceitos/magias-mecanicas.md`](dungeon-companion/conceitos/magias-mecanicas.md) | conceito | Catálogo `spell-mechanics.ts`, modal de rolagem, aplicar no alvo, efeitos de tela |
| [`conceitos/tracos-mecanicos.md`](dungeon-companion/conceitos/tracos-mecanicos.md) | conceito | Habilidades ativáveis, somas no ataque, d20 e defesas |
| [`conceitos/lgpd.md`](dungeon-companion/conceitos/lgpd.md) | conceito | Adequação à LGPD: status de cada item, cookies, scripts |
| [`conceitos/testes.md`](dungeon-companion/conceitos/testes.md) | conceito | Suítes unitárias da api e do web: como rodar, cobertura |
| [`conceitos/auditoria-mecanicas.md`](dungeon-companion/conceitos/auditoria-mecanicas.md) | conceito | Classificação feature a feature (12 classes + talentos) por dificuldade de automação |
| [`conceitos/quadro-do-mestre.md`](dungeon-companion/conceitos/quadro-do-mestre.md) | conceito | Quadro do Mestre (1.2.0): seções da gaveta, descanso do grupo, dano em área, anotações, apagar sessão; gavetas de baixo no celular (1.3.16); ordem por uso e grimório do mestre (1.6.6) |
| [`conceitos/cartas.md`](dungeon-companion/conceitos/cartas.md) | conceito | Cartas de magia (1.4.0) e de arma (1.6.0), e aviso de lançamento de magia com as cartas (1.5.0) |
| [`conceitos/avatar.md`](dungeon-companion/conceitos/avatar.md) | conceito | Avatar em camadas: personalizador em abas (1.6.9), penteados novos, tons de pele por raça (1.6.10), como acrescentar opções |
| [`conceitos/ranking.md`](dungeon-companion/conceitos/ranking.md) | conceito | Ranking global (1.7.0): o que conta, tabela de estatísticas, endpoint, tela e privacidade |
| [`conceitos/molduras.md`](dungeon-companion/conceitos/molduras.md) | conceito | Molduras do card (anel, barras de XP e vida), barra de XP e DANO/CURA na gaveta (1.7.1) |
| [`conceitos/nome-de-usuario.md`](dungeon-companion/conceitos/nome-de-usuario.md) | conceito | Nome de usuário único (1.9.0): regras, sugestões, API, escolha no primeiro acesso, mesa e ranking |
| [`conceitos/tela-inicial.md`](dungeon-companion/conceitos/tela-inicial.md) | conceito | Tela inicial pública (1.8.0): rotas e sessão expirada, seções, card de exemplo, barra fixa (1.8.1) |
| [`conceitos/monstros.md`](dungeon-companion/conceitos/monstros.md) | conceito | Bestiário do livro: tabela `monster` (428 fichas), formato do JSON, como foi gerado, correções |
| [`conceitos/email.md`](dungeon-companion/conceitos/email.md) | conceito | E-mail de recuperação de senha (1.12.1): api → script PHP no site (Hostinger), assinatura, configuração fora do git, como testar |
| [`conceitos/subclasses.md`](dungeon-companion/conceitos/subclasses.md) | conceito | Conteúdo de subclasse extraído do livro, com nível de confiança |
| [`procedimentos/backups.md`](dungeon-companion/procedimentos/backups.md) | procedimento | Backups do repositório e como fazer rollback |
| [`procedimentos/incidente.md`](dungeon-companion/procedimentos/incidente.md) | procedimento | Plano de resposta a incidente de segurança + registro |
| [`procedimentos/artes-cartas.md`](dungeon-companion/procedimentos/artes-cartas.md) | procedimento | Prompts do ChatGPT pras artes das cartas de magia e de arma, e onde salvar |
| [`procedimentos/artes-monstros.md`](dungeon-companion/procedimentos/artes-monstros.md) | procedimento | Prompts do ChatGPT pras imagens dos monstros do bestiário (medalhão em pixel art), em levas pelos mais usados |
| [`historico/diario-2026-09-10_a_2026-10-18.md`](dungeon-companion/historico/diario-2026-09-10_a_2026-10-18.md) | historico | Diário de sessões (antigo `status.md`) |
| [`historico/levelup-plan.md`](dungeon-companion/historico/levelup-plan.md) | historico | Plano e implementação do level-up (fases 1–3) |
| [`historico/media-progress.md`](dungeon-companion/historico/media-progress.md) | historico | Implementação do bloco "Média" da auditoria, onda a onda |
| [`historico/spells-progress.md`](dungeon-companion/historico/spells-progress.md) | historico | Auditoria das 361 descrições de magia contra o livro |
| [`historico/imagens-orfas-2026-10-14.md`](dungeon-companion/historico/imagens-orfas-2026-10-14.md) | historico | Lista das 38 imagens órfãs no Supabase |

Artes originais (PNG gerados no ChatGPT, grandes demais pro repositório web) em
[`artes/`](dungeon-companion/artes/) — ver `procedimentos/artes-cartas.md`.

Configuração do Claude Code que mora fora dos repositórios (hook do brief, `/fechar-entrega`,
`settings.json`, memória) e como instalar em outro computador:
[`claude-setup/LEIA-ME.md`](claude-setup/LEIA-ME.md).

Outros: [`scripts/`](dungeon-companion/scripts/) (Node, rodar de dentro de
`dungeon-companion-api` depois de `npm run build`; leem o `.env` de produção) e
[`referencias/`](dungeon-companion/referencias/) (`livro.txt`, `magias.txt`: texto do Livro do
Jogador; usar `magias.txt` para magias; `monstros.txt`: OCR do Manual dos Monstros, já importado
pra tabela `monster`).

## Manutenção

- Entrega concluída: atualizar `estado-atual.md`, tirar o item do `backlog.md` e registrar
  detalhes no doc de conceito da área. Decisão nova vai pro `decisoes.md`, armadilha nova pro
  `gotchas.md`.
- Regra que precisa valer em todo turno vai pro `CLAUDE.md` ou `.claude/rules/` do repo, não aqui.
- Doc encerrado vai pra `historico/` com o cabeçalho `status: encerrado`.
- Commitar este repositório depois de mudanças relevantes.
