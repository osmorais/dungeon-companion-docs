---
resumo: Adequação à LGPD: 16 itens técnicos feitos, decisões, cookies, scripts de verificação e o que falta fora do código.
tipo: conceito
status: ativo
atualizado: 2026-10-20
---

# Dungeon Companion — Adequação à LGPD (uso público)

Registrado em 2026-10-14. O usuário quer divulgar o sistema publicamente. Esta é a análise dos
dois repositórios (`dungeon-companion-api` e `dungeon-companion-web`) do ponto de vista da LGPD
(Lei 13.709/2018), com o status de cada item. **É levantamento técnico, não parecer jurídico** —
a política de privacidade/termos finais devem passar por alguém da área antes da divulgação.

Ver `dungeon-companion/estado-atual.md` pro contexto geral do projeto.

## Ponto de partida — dados pessoais tratados hoje

Superfície pequena, nenhum dado sensível (art. 5º, II):

| Dado | Onde | Observação |
|---|---|---|
| E-mail | `users.email` | Obrigatório, login e redefinição de senha |
| Senha | `users.password_hash` | bcrypt custo 12 (ok). Nulo pra conta só-Google |
| Nome | `users.full_name` | Opcional no cadastro ("NOME DO HERÓI") — pode ser nome real |
| Google ID | `users.google_id` | Login com Google |
| Token de redefinição | `users.reset_token` / `reset_token_expires` | Guardado em texto puro (ver item 10) |
| Nomes livres | `character.player_name`, `player_session.player_name`, `game_session.dm_name` | Texto livre, visível pra mesa — usuário pode digitar nome real |
| Imagens | Supabase Storage (bucket público) | Personagem, monstro e imagem de referência da sessão (`session_reference_image`, desde 2026-10-17) — usuário pode subir foto real, inclusive de terceiros |
| Legenda da imagem de referência | `session_reference_image.title` | Opcional, até 120 caracteres, texto livre visível pra mesa (aviso no formulário) |
| Anotações do mestre | `game_session.dm_notes` | Desde a 1.2.0 (Quadro do Mestre). Texto livre até 10.000 caracteres, só o dono da sessão lê/grava (`GET/PUT /api/game-session/{id}/dm-notes`), nunca vai no detalhe da sessão. Pode citar pessoas reais. Sai na exportação (`sessions_as_dm[].dm_notes`) e some com a sessão/conta (cascata). Coberto pela política ("anotações", "sessões de jogo") — sem mudança no texto |
| Rolagens/ações | `session_roll_log` etc. | Já podado pras últimas 30 por sessão |

Pontos positivos já existentes: coleta mínima, nome opcional, bcrypt, "esqueci a senha" não
revela se o e-mail existe, nenhum analytics/rastreador, único cookie é o de autenticação
(httpOnly, estritamente necessário), `ON DELETE CASCADE` de `users` pra `character`,
`game_session` e `player_session`. A geração de personagem por IA (Anthropic/OpenAI) está
**desativada** (comentada em `character.controller.ts`) — nenhum dado vai pra provedor de IA hoje.

## Status geral

| # | Item | Prioridade | Status |
|---|---|---|---|
| 1 | Listagem global de sessões expunha códigos de entrada | 🔴 | ✅ Feito |
| 2 | Login Google sem checar `email_verified` | 🔴 | ✅ Feito |
| 3 | `JWT_SECRET` com fallback público | 🔴 | ✅ Feito |
| 4 | Política de privacidade e termos de uso | 🔴 | ✅ Feito (web `1997589`) — falta revisão jurídica |
| 5 | Excluir conta / exportar dados / corrigir dados | 🔴 | ✅ Feito (api `1dd808f`, web `c5f8752`) — troca de e-mail segue por e-mail |
| 6 | Imagens órfãs e públicas no Supabase | 🔴 | ✅ Feito (api `1dd808f`) — 38 órfãs antigas: exclusão manual pelo usuário (`dungeon-companion/historico/imagens-orfas-2026-10-14.md`) |
| 7 | Transferência internacional / operadores | 🟡 | ✅ Coberto na política |
| 8 | Recursos do Google carregados em todas as páginas | 🟡 | ✅ Feito (api `791be49`, web `26a54ef`) |
| 9 | Menores de idade | 🟡 | ✅ Declaração 18+ no cadastro |
| 10 | Segurança básica (rate limit, senha, explorer, etc.) | 🟡 | ✅ Feito (api `132b08f`, web `6edb2bb`) — enumeração de e-mail e revogação de JWT: riscos aceitos |
| 11 | Canal do titular | 🟡 | ✅ E-mail na política |
| 12 | Retenção de dados | 🟢 | ✅ Feito (api `791be49`, web `26a54ef`) |
| 13 | Aviso sobre nomes livres | 🟢 | ✅ Feito (api `791be49`, web `26a54ef`) |
| 14 | Plano de resposta a incidente | 🟢 | ✅ `dungeon-companion/procedimentos/incidente.md` (confirmar prazos com advogado) |
| 15 | `DELETE /api/game-session/{id}` sem checagem de dono | 🔴 | ✅ Corrigido (api `1dd808f`) |
| 16 | Entrar na sessão / adicionar NPC com personagem de outro usuário (sem checagem de dono do `id_character`) | 🟡 | ✅ Corrigido em 2026-10-16 (api `ba62504`, `assertOwnsCharacter` em `GameSessionService`); sem exploração em produção — ver registro em `dungeon-companion/procedimentos/incidente.md` |

---

## ✅ Concluído — 2026-10-14

Commitado e enviado **pelo próprio usuário**: api `ef6e72a`, web `361d986` (ambos com a mensagem
"primeiros ajustes relacionados a proteção de dados"). Builds limpos nos dois repos; os erros de
lint e avisos de prettier que aparecem nos arquivos tocados já existiam antes (débito
pré-existente, não introduzido).

### 1. Listagem global de sessões (art. 46 — segurança)
- **Problema**: `GET /api/game-session` (`GameSessionRepository.findPaged`) devolvia as sessões
  de **todos** os usuários com `session_code` e `dm_name` pra qualquer usuário logado. Como o
  código basta pra entrar (`findSessionByCode` em `POST /api/game-session/player`), qualquer
  pessoa cadastrada podia entrar em qualquer mesa e ver nomes, imagens e rolagens.
- **Correção**: endpoint removido, junto com `GameSessionService.listSessions` e
  `GameSessionRepository.findPaged` (api) e `GameSessionService.getSessions` (web, sem uso).
- O web não usava esse endpoint: a tela `/sessions` (`session-list`) já chama
  `/api/game-session/my-sessions?role=dm`, e `/my-sessions` chama o mesmo endpoint sem filtro de
  papel. Nenhuma mudança visível pro usuário.

### 2. Login Google sem `email_verified` (art. 46)
- **Problema**: `AuthService.googleAuth` vinculava a conta Google a uma conta local existente só
  por igualdade de e-mail (`linkGoogleAccount`), sem checar se o Google verificou aquele e-mail
  — risco de tomada de conta.
- **Correção**: recusa (`401`, "O e-mail desta conta Google não está verificado") se
  `payload.email_verified !== true`, antes de qualquer vínculo ou criação. Também impede
  "reservar" um e-mail alheio criando conta nova via Google.

### 3. `JWT_SECRET` com fallback público (art. 46)
- **Problema**: `auth.service.ts` e `strategies/jwt.util.ts` tinham, cada um, o fallback
  `'changeme-set-JWT_SECRET-in-env'` — sem a env var, qualquer um conseguiria assinar tokens.
- **Correção**: fonte única em `src/strategies/jwt.util.ts`:
  - `getJwtSecret()` — lido sob demanda (não no load do módulo, pra não depender da ordem do
    dotenv). Em `NODE_ENV=production` sem a variável, lança erro. Fora de produção usa um segredo
    local de dev.
  - `assertJwtSecretConfigured()` — chamado no início de `main()` (`src/index.ts`): produção sem
    `JWT_SECRET` **não sobe**; dev só loga um aviso.
  - `AuthService.generateToken`/`verifyToken` passaram a usar `getJwtSecret()`/`verifyJwtToken`.
- Smoke test no código compilado: produção sem secret → erro; dev sem secret → assina/verifica
  com aviso; produção com secret → ok.
- O usuário confirmou que o Render **já tinha** `JWT_SECRET` definido — ninguém foi deslogado.
  O `.env` local **não tem** `JWT_SECRET` (por isso o fallback de dev).
- `NODE_ENV=production` está definido no Render (deduzido: o cookie de auth com
  `SameSite=None; Secure` só funciona em produção graças a isso).

---

## ✅ Concluído — 2026-10-14 (itens 4, 7, 9, 11) — web `1997589`

Decisões do usuário: controlador **pessoa física, Osmar de Morais Junior**; contato
**mensageiro@forjaarcana.com**; idade mínima **18 anos**; retenção **até o usuário excluir a
conta** (sem expiração por inatividade).

Web (nenhuma mudança no backend):
- `src/app/legal/legal-info.ts` — fonte única de controlador, e-mail, idade mínima, data de
  atualização (`LEGAL_LAST_UPDATED` — **atualizar ao mudar o texto**) e rotas.
- `src/app/legal/legal-page.component.*` — página pública com os dois textos (escolhido por
  `data.doc` da rota). Corpo em fonte do sistema (a pixelada é ilegível em texto longo).
  Rotas `/privacidade` e `/termos` em `app.routes.ts`, **sem** `authGuard`.
- Cadastro (`auth/signup`): checkbox obrigatória "Declaro ter 18 anos ou mais e concordo com os
  Termos de Uso e a Política de Privacidade" (links abrem em nova aba). Sem ela: `submit()` e o
  callback do Google mostram erro, e o botão do Google fica travado (`google-btn-wrapper--locked`,
  `pointer-events: none`).
- Login (`auth/login`): aviso "Ao entrar, você declara ter 18 anos ou mais e concorda com..." —
  o botão do Google no login também cria conta nova, por isso o aviso.
- Home: links PRIVACIDADE / TERMOS DE USO no rodapé do painel (mobile e desktop).
- Testes novos: `legal-info.spec.ts`, `legal-page.component.spec.ts`,
  `signup.component.spec.ts` (66 testes passando no total).

**Não feito (de propósito)**: registrar no banco a data do aceite (`terms_accepted_at`) — exigiria
migração; considerar junto com o item 5. O aceite também não é pedido de novo pra contas antigas.

**Promessas da política que dependiam de trabalho manual**: resolvidas pelos itens 5 e 6 (ver
abaixo) — só a troca de e-mail continua por e-mail.

## ✅ Concluído — 2026-10-14 (itens 5, 6 e 15) — api `1dd808f`, web `c5f8752`

### Item 5 — Direitos do titular (página "Minha Conta")
API — `AccountController` (`src/controllers/account.controller.ts`) + `AccountService` +
`AccountRepository` + `models/account-types.ts`:
- `GET /api/account` — perfil (`email`, `full_name`, `has_password`, `google_linked`), sem hash.
- `PATCH /api/account` — `full_name` (aparado, vazio → `null`, máx. 255).
- `GET /api/account/export` — JSON com perfil, **fichas completas** (`loadCharacter` de cada
  personagem do usuário, inclui NPCs), sessões como mestre (com monstros, **sem** dados dos outros
  jogadores), participações como jogador (com inventário), catálogo de monstros e rolagens dos
  personagens dele.
- `POST /api/account/delete` (POST, não DELETE com corpo) — exige `confirm_email` igual ao da
  conta (sem diferenciar maiúsculas/espaços) e, se a conta tiver senha, `password` correta. Conta
  só-Google: só o e-mail. Erros de confirmação são **422** (401 fora de `/auth/` desloga no
  frontend). Limpa o cookie.
- Exclusão em transação: apaga antes as rolagens dos personagens do usuário (o FK
  `session_roll_log.id_character` é `SET NULL` e o `actor_name` sobreviveria em sessões de
  outros mestres) e depois `DELETE FROM users` — o resto vai em cascata (conferido no banco real
  via `information_schema` em 2026-10-14: todo FK pra `users` é `CASCADE`). Depois do commit,
  limpa as imagens da conta no storage.
- Troca de e-mail **não** foi implementada (exigiria verificação do novo e-mail) — a página e a
  política orientam a pedir por e-mail.

Web — página `/conta` (`src/app/account/`, com `authGuard`), link "MINHA CONTA" no rodapé da
home: dados da conta + editar nome, "BAIXAR DADOS" (download `forja-arcana-meus-dados-AAAA-MM-DD.json`),
"EXCLUIR CONTA" (e-mail + senha se tiver + checkbox de ciência; ao concluir, `clearSession()` →
login). Política e termos atualizados pra apontar pra página (exclusão/exportação/correção de
nome deixam de ser manuais).

**Teste ponta a ponta com contas descartáveis (2026-10-14, banco e storage de produção, API
local na porta 3999)** — 25/25 verificações OK: duas contas de teste (A jogador/mestre, B mestre);
personagem criado pela API + um personagem "quebrado" (sem classe) inserido direto; troca de
imagem apaga a antiga; nome do arquivo só UUID; A entra e rola dado na mesa de B; outro usuário
recebe 403 ao tentar excluir a sessão de A; perfil sem hash; nome corrigido; exportação com ficha
completa + o quebrado com aviso, sessões, participação, catálogo e rolagens, sem dados de B;
exclusão recusa e-mail/senha errados (422); depois da exclusão nada de A sobra no banco, a rolagem
de A na mesa de B some, a sessão de B continua, as 3 imagens de A saem do storage e o token antigo
recebe 404; B se exclui pela API. Conferido depois: 0 usuários/personagens/sessões de teste e 0
arquivos de teste no storage.

**Bug achado pelo teste e corrigido**: um personagem com dado incompleto (ex.: sem classe) fazia
`loadCharacter` lançar e derrubava a exportação inteira (500). Agora ele entra no arquivo com os
dados básicos (`id_character`, `name`, `level`) + `aviso` (`EXPORT_SHEET_WARNING`), e o resto é
exportado normalmente (teste unitário novo cobre isso; `findCharacterIds` virou `findCharacters`).

### Item 6 — Imagens no Supabase
- `SupabaseStorageService.uploadImage(buffer, contentType)` — nome agora é **só UUID + extensão**
  (pelo content-type); o `originalName` saiu da assinatura e dos 3 controllers.
- `SupabaseStorageService.deleteImage(url)` + helpers puros `storagePathFromPublicUrl` /
  `extensionForContentType` (URL de fora do bucket é ignorada).
- `ImageReferenceRepository.isImageReferenced(url)` — a mesma URL pode estar em `character`,
  `monster_catalog` e `monster_session` (monstro herda a imagem do catálogo; duplicar copia).
- `ImageCleanupService.deleteIfUnreferenced(urls)` — só apaga se ninguém mais referencia; nunca
  lança (falha só vai pro log). Chamado **depois** da alteração no banco em: trocar imagem de
  personagem / catálogo / monstro na sessão; excluir personagem; remover do catálogo; remover
  monstro da sessão; excluir sessão; excluir conta; e troca de imagem de monstro **recusada**
  (o upload acontece antes da checagem de permissão).
- **Exceção proposital**: derrotar monstro (`defeatMonster`) não limpa — o modal de derrota de
  todos os jogadores carrega a URL logo depois do evento. Fica órfã se não for do catálogo.
- **Órfãs antigas** (levantamento só leitura em 2026-10-14): bucket `monster-images` com 46
  arquivos, 8 referenciados, **38 órfãos (61 MB)**. O usuário vai apagar manualmente — lista em
  `dungeon-companion/historico/imagens-orfas-2026-10-14.md`.
  Script de levantamento ficou no scratchpad da sessão (não versionado): lista o bucket e compara
  com as `image_url` das 3 tabelas.

### Item 15 — Exclusão de sessão sem checagem de dono (achado durante o item 6)
`DELETE /api/game-session/{id}` apagava qualquer sessão pra qualquer usuário logado (qualquer
jogador da mesa conhece o id). Agora `GameSessionRepository.deleteOwnedSession(id, userId)` —
só o mestre (403 pros outros). O web não usa esse endpoint.

Testes (API, 200 passando): `image-cleanup.service.unit.ts` (inclui helpers do storage),
`account.service.unit.ts`, `monster-catalog.service.unit.ts` (novos); casos novos em
`character-sheet.service.unit.ts` e `game-session.service.unit.ts` (construtores ganharam o
`ImageCleanupService`). Web (76 passando): `account.component.spec.ts`.

## ✅ Concluído — 2026-10-14 (item 10) — api `132b08f`, web `6edb2bb`

- **Limite de tentativas** — `RateLimitService` (`src/services/rate-limit.service.ts`), em
  memória, janela fixa (uma instância só no Render; reiniciar zera). Resposta **429** com
  "Muitas tentativas. Tente de novo em N minutos." (o error handler do LoopBack não repassa
  `Retry-After`, por isso o tempo vai na mensagem). Limites (`RATE_LIMITS`):
  login 20/15min por IP + **10/15min por e-mail**; cadastro 5/h por IP; esqueci a senha 5/h por IP
  + 3/h por e-mail; redefinir senha 10/15min por IP; Google 30/15min por IP; excluir conta
  5/15min por usuário (a confirmação pede senha).
- **IP do cliente** (`clientIp`): `cf-connecting-ip` → último item do `x-forwarded-for` → IP da
  conexão. O servidor loga **uma vez** `[rate-limit] IP do cliente obtido via ...` —
  **conferir nos logs do Render depois do deploy**: se aparecer "conexão direta", o IP seria o
  do proxy (igual pra todos) e os limites por IP precisariam ser revistos. Os limites por
  e-mail/usuário não dependem disso.
- **Senha mínima 8** (`PASSWORD_MIN_LENGTH`) no cadastro e na redefinição (backend: schema;
  web: `newPasswordError` em `auth/auth-errors.ts` + rótulos "MÍN. 8 CARACTERES"). Contas antigas
  com 6–7 caracteres continuam entrando (login não valida tamanho).
- **Explorer/OpenAPI fora do ar em produção**: `RestExplorerComponent` só fora de produção
  (`application.ts`) e, em `index.ts`, `apiExplorer.disabled` (sem isso o LoopBack redireciona
  `/explorer` pro explorer hospedado em explorer.loopback.io) + `openApiSpec.disabled`.
  Verificado em modo produção local: `/explorer`, `/explorer/` e `/openapi.json` → 404.
- **Token de redefinição só como hash** — `hashResetToken` (SHA-256; o token já é 32 bytes
  aleatórios) em `AuthService`; o banco guarda o hash e a busca/consumo é pelo hash. Links de
  redefinição emitidos **antes** do deploy deixam de funcionar (valem 1h mesmo).
- **Mensagens de erro da API no web**: `apiErrorMessage` lê `{error: {message}}` do LoopBack —
  antes login/cadastro/esqueci/redefinir liam `err.error.message` e sempre caíam na mensagem
  genérica (o 429 não apareceria).
- Smoke test local (modo produção): 10× login errado pro mesmo e-mail → 401, 11ª → 429; cadastro
  com senha de 7 caracteres → 422.
- **Não feito (riscos aceitos)**: enumeração de e-mail no cadastro ("E-mail já cadastrado" —
  resolver exigiria fluxo de verificação de e-mail; o limite de cadastro por IP reduz o abuso);
  revogação de JWT no logout (token vale 8h; mitigado pelo cookie httpOnly + curta duração).
- Testes: API 214 (`rate-limit.service.unit.ts`, `auth.service.unit.ts` novos); web 83
  (`auth/auth-errors.spec.ts` novo, casos novos em `signup.component.spec.ts`).

## ✅ Concluído — 2026-10-15 (itens 8, 12, 13, 14) — api `791be49`, web `26a54ef`

- **Item 8 — Google fora das páginas comuns:**
  - Fonte "Press Start 2P" servida pelo próprio site: pacote `@fontsource/press-start-2p@5.2.7`
    (OFL-1.1, versão fixa), CSS `latin-400` + `latin-ext-400` em `angular.json → styles`; removidos
    o `@import` do Google Fonts em `styles.scss` e os `<link>` do `index.html`. O build gera os
    `.woff2` em `media/`.
  - Script de login do Google (`accounts.google.com/gsi/client`) saiu do `index.html`;
    `GoogleIdentityService.load()` (`src/app/services/google-identity.service.ts`) injeta o script
    só quando login/cadastro abrem (uma vez só; em falha, remove e permite tentar de novo; a tela
    continua funcionando só com e-mail/senha). De quebra resolve a corrida antiga do `async` no
    `index.html`. `googleEnabled` virou signal (app zoneless).
  - `index.html` com `lang="pt-BR"`.
  - Política de Privacidade (seção 4) atualizada: Google só nas telas de entrar/criar conta;
    `LEGAL_LAST_UPDATED` → 15 de outubro de 2026.
- **Item 12 — Retenção:** decisão do usuário: dados mantidos até a exclusão da conta (sem expirar
  por inatividade). Tokens de redefinição vencidos são apagados
  (`UserRepository.clearExpiredResetTokens`) no início de cada "esqueci a senha".
- **Item 13 — Nomes livres:** aviso "Prefira um apelido: este nome aparece para todos da mesa."
  (classe global `.name-privacy-hint` em `styles.scss`, pra não pesar o CSS dos componentes) nos
  campos de nome do mestre (`session-create`, placeholder "Seu apelido de mestre") e de nome do
  jogador (`session-join`). O `full_name` da conta não aparece pra outros usuários, então não
  recebeu aviso.
- **Item 14 — Incidente:** `dungeon-companion/procedimentos/incidente.md` — conter (tabela de credenciais pra
  trocar), preservar evidências, avaliar risco, comunicar ANPD/titulares (3 dias úteis pela Res.
  15/2024; em dobro pra agente de pequeno porte, Res. 2/2022 — **confirmar**), registrar por 5
  anos, modelo de e-mail aos usuários, e registro dos achados da auditoria de 2026-10-14.
- Testes: API 215 (limpeza de tokens vencidos em `auth.service.unit.ts`); web 86
  (`google-identity.service.spec.ts` novo).

## Análise original de cada item (2026-10-14) — ver status na tabela do topo

### 4. Política de privacidade e termos de uso (arts. 6º, 9º)
Não existe nenhuma rota pública pra isso, e o cadastro (`auth/signup`) não informa nada. Item
mais básico pra uso público. A política precisa cobrir:
- quais dados são coletados (tabela acima) e pra quê;
- base legal: **execução de contrato** (conta, personagens, sessões) e **legítimo interesse**
  (segurança) bastam — não precisa de consentimento pro essencial;
- com quem são compartilhados (item 7) e transferência internacional;
- por quanto tempo ficam guardados (item 12);
- como o titular exerce os direitos (item 5) e canal de contato (item 11);
- cookies: só o de autenticação (item "cookies" abaixo);
- menores (item 9).

Implementação sugerida no web: rotas públicas `/privacidade` e `/termos` (fora do `authGuard`,
como `login`/`signup`), links no rodapé/telas de auth e o texto "Ao criar a conta você concorda
com os Termos e a Política de Privacidade" no cadastro (mobile e desktop) e no botão do Google.

### 5. Direitos do titular (art. 18)
- **Excluir conta**: não existe endpoint pra apagar o usuário. Barato: `DELETE FROM users` já
  cascateia pra personagens/sessões/participações (conferir as demais tabelas filhas, ex.:
  inventário, histórico de nível, `npc_session`, `monster_session` — e as imagens, item 6).
  Pedir confirmação forte na UI (digitar e-mail/senha).
- **Exportar dados** ("baixar meus dados"): JSON com conta, personagens e sessões.
- **Corrigir dados**: hoje não dá pra editar nome nem e-mail da conta.
- `/auth/me` só devolve `id` e `email` (do token) — uma tela "Minha conta" precisaria de um
  endpoint que leia `full_name` do banco.

### 6. Imagens no Supabase Storage
- `SupabaseStorageService` (api) só tem `uploadImage` — **não remove nada**. Trocar a imagem de
  personagem/monstro ou excluir o personagem/sessão deixa o arquivo antigo acessível pra sempre
  pela URL pública (bucket público).
- Nome do arquivo é `${randomUUID()}-${originalName}` — o nome original pode conter o nome real
  da pessoa. Trocar por só UUID + extensão.
- Implementar `removeImage(publicUrl)` e chamar ao trocar imagem
  (`POST /api/character-sheet/{id}/image`, `POST /api/monster-catalog/{id}/image`,
  `POST /api/game-session/monster-session/{id}/image`) e ao excluir personagem/monstro/conta.
- Avaliar limpeza dos arquivos já órfãos (comparar listagem do bucket com as `image_url` do
  banco) — **perguntar antes de apagar qualquer coisa em produção**.

### 7. Transferência internacional e operadores (art. 33)
Precisam constar na política:
- **Render** — servidor da API (EUA);
- **Neon** — Postgres;
- **Supabase** — imagens (confirmar a região do projeto);
- **Google** — login (Google Identity Services) e Google Fonts;
- **Hostinger** — hospedagem do site e envio de e-mail (SMTP);
- **Anthropic/OpenAI** — só se a geração por IA for reativada (chaves continuam no `.env`).

### 8. Recursos do Google em todas as páginas
`src/index.html` (web) carrega `https://accounts.google.com/gsi/client` e o Google Fonts
("Press Start 2P") em **todas** as páginas, inclusive antes do login — o IP do visitante vai pro
Google. Opções: hospedar a fonte localmente (`src/assets`) e carregar o script do Google só nas
telas de login/cadastro; ou só declarar na política.

### 9. Menores de idade (art. 14; ECA Digital — Lei 15.211/2025)
App de D&D atrai adolescentes. Dados de crianças (< 12 anos) exigem consentimento específico de
um dos pais; a Lei 15.211/2025 traz obrigações extras pra serviços digitais acessíveis por
menores. Mínimo: declaração de idade no cadastro (ex.: "tenho 18 anos ou mais, ou autorização do
responsável") + seção na política. **Confirmar o alcance com advogado.**

### 10. Segurança básica (art. 46)
- **Rate limit** em `/auth/login`, `/auth/signup` e `/auth/forgot-password` — hoje não há
  nenhum (força bruta, envio de e-mail em massa).
- **Senha mínima** de 6 → 8+ (schema dos endpoints `signup` e `reset-password` + validação no
  web).
- **`/explorer`** (REST Explorer do LoopBack, `application.ts`) exposto em produção — desligar
  quando `NODE_ENV=production`.
- **Reset token** em texto puro no banco — guardar só o hash (SHA-256) e comparar pelo hash.
- **Enumeração de e-mail**: signup responde "E-mail já cadastrado" (o forgot-password já
  esconde). Menor.
- JWT em `localStorage` por 8h, sem revogação no logout — aceitável, mas um XSS roubaria o
  token. Registrar como risco conhecido.
- `console.error` com objetos de erro inteiros (`session-socket.gateway.ts`) — conferir se não
  vaza dado pessoal nos logs do Render. Menor.

### 11. Canal do titular (art. 41)
Agente de pequeno porte (Resolução CD/ANPD nº 2/2022) é dispensado de nomear encarregado (DPO),
mas **não** de oferecer canal de comunicação. Definir um e-mail de contato pra pedidos de
privacidade e publicar na política.

### 12. Retenção
Definir e documentar: o que acontece com contas inativas, sessões antigas, e limpeza periódica
de tokens de redefinição expirados. O log de rolagens já é limitado a 30 por sessão.
Pendência antiga relacionada: ~109 rolagens excedentes numa sessão específica (ver
`dungeon-companion/historico/diario-2026-09-10_a_2026-10-18.md`) — perguntar antes de rodar qualquer DELETE.

### 13. Nomes livres
`player_name`, `dm_name` e `full_name` são texto livre e ficam visíveis pra mesa. Um aviso nos
formulários ("use um apelido — esse nome fica visível pros outros jogadores") resolve. A
exposição geral já foi fechada pelo item 1.

### 14. Plano de incidente (art. 48)
Processo, não código: ter anotado como comunicar a ANPD e os usuários afetados em caso de
vazamento (prazo, canal, conteúdo da comunicação).

### Cookies
Só existe o cookie de autenticação (`token`, httpOnly, estritamente necessário) + o JWT no
`localStorage`. **Não precisa de banner de consentimento** — basta citar na política. Se um dia
entrar analytics/pixel, aí passa a precisar.

**2026-10-15 — efeitos de tela:** novo item no `localStorage`, `dc.screen-effects` (`on`/`off`),
preferência de ligar/desligar o impacto de dano na sessão. Não é dado pessoal nem rastreamento e
não vai pro servidor; continua sem precisar de banner. Seção 6 da Política atualizada (data
`LEGAL_LAST_UPDATED` já era 15/10/2026). Web `b034838`.

## Regra permanente para novas implementações

Desde 2026-10-15 os dois repositórios têm `.claude/rules/lgpd.md` (referenciado no `CLAUDE.md`):
checklist de LGPD a cada implementação, com dado novo, permissões, exclusão/exportação da conta,
imagens, terceiros, segurança, retenção e necessidade de atualizar a Política/Termos, mais uma
linha "LGPD" obrigatória no resumo final.

## Scripts de verificação (`dungeon-companion/scripts/lgpd/`)

Scripts Node ad-hoc usados nas sessões (não versionados nos repos). Rodar **de dentro de
`dungeon-companion-api`** depois de `npm run build`, ex.:
`node ~/projects/docs/dungeon-companion/scripts/lgpd/orphans-list.js`. Leem o `.env` (banco e
Supabase de **produção**).
- `fks.js` — só leitura: lista todas as FKs (com regra de `ON DELETE`) e colunas de imagem/usuário.
  Usar ao criar tabela nova pra conferir a cascata da exclusão de conta.
- `orphans-list.js` — só leitura: lista em JSON os arquivos do bucket que nenhuma `image_url`
  referencia. Usar pra conferir se as órfãs foram apagadas.
- `lgpd-e2e.js` — **escreve em produção**: cria 2 contas descartáveis
  (`lgpd-teste-<timestamp>-*@teste.invalid`), testa permissões/exportação/exclusão/imagens e apaga
  tudo no fim (com rede de segurança no `finally`). Precisa da API local rodando em
  `PORT=3999 node .` e de `npm run test:unit` já executado (usa `dist-test/.../fixtures.js`).
  **Pedir autorização ao usuário antes de rodar.**

## O que ainda falta (fora do código)

Todos os 15 itens técnicos estão implementados. Restam:
1. **Revisão jurídica** da Política de Privacidade, dos Termos de Uso e dos prazos do plano de
   incidente.
2. **Direitos autorais** (não é LGPD, mas é risco pra divulgação): descrições de magias e várias
   subclasses vieram do Livro do Jogador em português (`livro.txt`/`magias.txt`), que é protegido —
   só o SRD é de uso livre.
3. Depois do deploy do item 10: conferir nos logs do Render a linha
   `[rate-limit] IP do cliente obtido via ...` (não pode ser "conexão direta").
4. Apagar as 38 imagens órfãs antigas (`dungeon-companion/historico/imagens-orfas-2026-10-14.md`).
