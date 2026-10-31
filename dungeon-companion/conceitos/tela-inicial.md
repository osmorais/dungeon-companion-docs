---
resumo: Tela inicial pública (/ pra visitantes, 1.8.0): rotas, seções, card de exemplo, vitrine de cartas, o fluxo de sessão expirada (1.8.1) e o menu de seções no celular (1.12.0).
tipo: conceito
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Tela inicial (visitantes)

Página pública que explica o site e leva ao cadastro/login. Entrou na **1.8.0** (web `ec8f7c6`,
feita por outro desenvolvedor) e foi ajustada na **1.8.1** (web `d82da91` e `f2ccd64`).

## Rotas

- `/` tem duas rotas em `src/app/app.routes.ts`: a Home com `canMatch: [loggedInMatch]` e, logo
  depois, a tela inicial (`landing/`). Recusar no `canMatch` não redireciona: o roteador só tenta
  a rota seguinte. A ordem Home → tela inicial é travada em `app.routes.spec.ts`.
- `loggedInMatch` (`src/app/guards/auth.guard.ts`): logado → Home; sem token → tela inicial; token
  salvo → confirma no `/auth/me` com `loadCurrentUser(null)`.
- **Sessão expirada (1.8.1, `d82da91`)**: o `loadCurrentUser()` limpava a sessão com o destino
  padrão `/login`, e essa navegação no meio do `canMatch` levava a pessoa pro login. Agora:
  - `AuthService.clearSession(null)` só limpa, sem navegar;
  - `loadCurrentUser(redirectTo = '/login')` repassa o destino pro `clearSession`;
  - o `loggedInMatch` passa `null` (401 ou erro do servidor → tela inicial);
  - o `authGuard` das rotas protegidas continua mandando pro login.
  Testes com o `AuthService` real e `HttpTestingController` em `auth.guard.spec.ts`.
- **SAIR (1.8.2, `3bf5f79`)**: `logout()` → `clearSession('/login')`. Na 1.8.0 ia pra `/`, mas
  quem saía da Home já estava em `/`: o roteador ignora navegação pra mesma URL e a Home ficava
  na tela. O `clearSession` agora só aceita `'/login'` ou `null`.
- A tela não chama a API. (Até a 1.17.1 o aviso de servidor acordando, `app-server-wakeup`, fazia
  `fetch /ping` em qualquer página; saiu na 1.17.2 com a api na VPS.)

## Página (`src/app/landing/`)

- `landing.component.*`: barra do topo (logo, menu das seções `LANDING_SECTIONS`, ENTRAR e CRIAR
  CONTA — no celular só ENTRAR), abertura (logo grande, título, texto, card de exemplo, d20 e
  Tom), seções JOGADORES, MESTRES (painel do mestre ilustrativo, com o código de mesa `XXXXX`
  desde a 1.8.2 — um código que não pode existir), CARTAS, extras, COMO FUNCIONA, chamada final
  (Tom forjando) e rodapé (privacidade, termos, novidades, versão).
- `landing-cards.component.*` + `landing-cards.ts`: vitrine das cartas de magia e arma em
  carrossel circular (passa sozinho a cada 5 s; para com mouse/foco em cima, ao trocar de carta ou
  de baralho, e com "reduzir movimento").
- Fontes: Press Start 2P nos títulos e botões, VT323 no texto corrido, as duas servidas pelo
  próprio site (`@fontsource`, ver `lgpd.md`, item 8).
- Barra do topo **fixa ao rolar** (1.8.1): `position: sticky` na `.lp-topbar`; o `.landing` usa
  `overflow-x: clip` (com `hidden` o sticky parava de funcionar — ver `gotchas.md`). Altura em
  `--lp-topbar-h` (88 px, 68 px no celular), usada também no `scroll-margin-top` das seções.

## Card de exemplo (1.8.1)

- Monta à mão o visual do card da sessão: anel padrão do avatar (`.avatar-ring-wrap` +
  `.avatar-ring`, 112 px), nome, classe/raça, atributos, barra de XP **em cima** e de vida embaixo,
  fundo padrão do card (`--character-card-bg`, ver `molduras.md`).
- Personagem: **Gorak Dente-Solto**, Bárbaro meio-orc, sem cabelo e sem barba, com a pele do
  desenho original (`assets/avatar/race/base_half_orc.png`, passada no `basePath` do
  `app-avatar-display` — esse tom não existe no personalizador). O painel do mestre usa o mesmo
  nome.
- Tom à direita do card, espelhado (`scaleX(-1)`), com o balão em cima.
- Texto pra visitante sem citar a marca D&D (decisão em `decisoes.md`).

## Menu no celular (1.11.1 e 1.12.0, PR #6, merge `3121763`)

Feito por outro desenvolvedor (Carlos; 1.11.1 `85db724`, 1.12.0 `eb62c0c`), com dois commits
nossos por cima depois do review (`72a0a43`, `02b5d2c`). Também: o CRIAR CONTA do topo some no
celular de verdade (`.lp-hide-mobile` dentro do `@media`), ENTRAR com 44 px de altura e a seção
"Para toda a companhia" na grade de 4 colunas.

- **Menu de seções abaixo de 1024 px**: botão de três barras (vira X). É o **mesmo** `.lp-nav` do
  desktop, com a classe `is-open`, que vira um painel abaixo da barra, com fundo sólido. Acima de
  1024 px volta a ser a barra horizontal. Fecha ao escolher uma seção, com Esc, tocando fora da
  barra e ao alargar a janela (`MENU_BREAKPOINT_PX` no `.ts`, igual ao `@media` do SCSS).
- **Dado "CRÍTICO!"** preso ao card (`.lp-sample-wrap`): pendurado pra fora no desktop, dentro do
  canto do card no celular; o card encolhe em telas muito estreitas.
- **Vitrine de cartas** com `isolation: isolate` (ver `gotchas.md`, "Web"): a carta da vez não
  passa mais por cima da barra do topo.

