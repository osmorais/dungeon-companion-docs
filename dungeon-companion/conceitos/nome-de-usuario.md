---
resumo: Nome de usuário único (1.9.0): regras, sugestões, cadastro, Google, escolha no primeiro acesso, mesa e ranking.
tipo: conceito
status: ativo
atualizado: 2026-10-27
---

# Dungeon Companion — Nome de usuário

Cada conta tem um nome de usuário **único**, que é o nome com que a pessoa aparece na mesa (como
jogador e como mestre) e no ranking. Substituiu o "NOME DO HERÓI" opcional do cadastro
(`users.full_name`) e os nomes digitados ao entrar/criar sessão (`player_session.player_name`,
`game_session.dm_name`). Entrou na **1.9.0** (api `844482b`, web `f7ca9e5`).

## Regras

- Letras sem acento, números, `_` e `-`, de 3 a 20 caracteres.
- Único **sem diferenciar maiúsculas** (Gorak = gorak), guardado como a pessoa digitou.
- Fonte: `dungeon-companion-api/src/services/username.ts`; cópia no web em
  `src/app/auth/username.ts` (mudou um, muda o outro).
- **Sugestões** (`usernameCandidates`): a base limpa (sem acento, espaço → `_`, sem símbolos,
  cortada em 20) e a base com números no fim; o `UsernameService` descarta as que estão em uso e
  devolve até 3.

## Banco

- `users.username VARCHAR(20)` (nulo = ainda não escolheu) + índice único
  `users_username_lower_key ON users (LOWER(username))`. Rodou em produção em 2026-10-24.
- `users.full_name` não é mais coletado; os 41 valores foram apagados em produção (coluna mantida,
  sempre nula). Ver `estado-atual.md`, mudanças no banco.

## API

- `UsernameService` (`src/services/username.service.ts`): `check` (formato + em uso +
  sugestões), `assertAvailable` (422 formato / 409 em uso), `setUsername` (corrida no índice único,
  erro `23505`, vira 409). O 409 leva as sugestões em `details.suggestions` (o
  strong-error-handler devolve `details` nos 4xx).
- `GET /auth/username-available?username=` — pública (o cadastro pergunta antes de existir conta),
  limite `usernameCheckIp` (120 / 15 min por IP).
- `POST /auth/signup` — `username` obrigatório (saiu `full_name`).
- `POST /auth/google` — conta nova **não guarda o nome da conta Google**; nasce com `username`
  nulo.
- `GET /auth/me` — agora lê do banco e devolve `{id, email, username}`.
- `PATCH /api/account` — aceita `username` (troca, mesmas regras; o nome atual da própria pessoa
  conta como livre). `GET /api/account` devolve `username`.
- Sessão: `createSession` e `addPlayer` ignoram `dm_name`/`player_name` do corpo e gravam o nome de
  usuário (`GameSessionRepository.findUsername`); conta sem nome → 422.
- Leitura: detalhe da sessão, listas de sessões e ranking usam `COALESCE(u.username, <nome
  gravado>)` — troca de nome aparece em todo lugar; sessões antigas de quem ainda não escolheu
  continuam com o nome digitado.

## Web

- `app-username-status` (`src/app/auth/username-status/`): fica embaixo do campo (o `<input>` é da
  tela). Confere na API 400 ms depois da última tecla, mostra erro de formato, "É O SEU NOME
  ATUAL", sugestões clicáveis e a dica de apelido. Sem resposta (rede, 429) não trava — a API
  confere ao gravar. `showTaken()` mostra as sugestões de um 409 recebido ao gravar.
- Cadastro (`signup`): campo NOME DE USUÁRIO obrigatório.
- **Escolha no primeiro acesso**: rota `/nome-de-usuario` (`ChooseUsernameComponent`).
  `authGuard` e `loggedInMatch` mandam pra lá quem está logado com `needsUsername()`
  (`AuthService`); `chooseUsernameGuard` só deixa entrar quem precisa (os outros vão pra Home,
  deslogado pro login). Vale pra conta antiga e pra conta nova do Google.
- Entrar/criar sessão: saíram os campos de nome; a tela mostra "Você entra/mestra como …".
- Minha Conta: NOME DE USUÁRIO no lugar do NOME DE EXIBIÇÃO.

## Login e cadastro renovados (1.13.3, PR #7, merge `2897436`)

Feito por outro desenvolvedor (Carlos), com um commit nosso por cima depois do review
(`7e44e63`).

- Visual "quadro de missão" (cantos, sombra, legend), logo, campos com relevo, caixa de erro com
  "!" e botão com efeito de pressionar, compartilhados pelas duas telas num bloco do
  `styles.scss` **sob `.auth-retro`** (classe nos contêineres do login e do cadastro). Os nomes
  das classes (`title-panel`, `auth-panel`, `form-group`, `error-msg`, `full-btn`…) também são
  usados por outras telas — sem o escopo, o visual vazava pra elas (ver `gotchas.md`). O canto de
  cima acompanha o tamanho da legend por `--auth-corner-top`.
- **Gerenciador de senhas**: o e-mail é o identificador nas duas telas (`autocomplete="username"`
  no campo de e-mail; no cadastro, o nome de usuário é `nickname`) — antes o cadastro salvava o
  nome de usuário e o navegador o punha no campo de e-mail do login.
- Travas de envio duplo (Enter repetido) e de Google em paralelo no login e no cadastro; Enter no
  e-mail do login vai pra senha; foco no e-mail ao abrir só com mouse/teclado (`pointer: fine`),
  pra não abrir o teclado por cima do logo em tela de toque.

## Ordem de deploy

Migração no banco → api → web. Com o web antes da api, o cadastro mandaria `username` pra api
antiga (ignorado) e a conta ficaria sem nome e sem como gravar um.
