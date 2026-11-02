---
resumo: E-mail de recuperação de senha — desde a 1.17.3 a api envia direto pelo SMTP da Hostinger (nodemailer), da VPS; antes (1.12.1–1.17.2) passava por um script PHP no site. Modelo (cores do site, nome de usuário, proteção do modo escuro), configuração, erros e como testar.
tipo: conceito
status: ativo
atualizado: 2026-11-02
---

# Dungeon Companion — E-mail (recuperação de senha)

Único e-mail que o sistema manda.

## Histórico curto

| Versões | Como saía | Por quê |
|---|---|---|
| até 1.12.0 | api → SMTP da Hostinger (`nodemailer`) | — |
| 1.12.1 – 1.17.2 | api → HTTPS assinado → script PHP no site (`public/mail/recuperar-senha.php`) → SMTP | o Render bloqueia as portas de e-mail (25/465/587) |
| **desde 1.17.3** (2026-11-02) | api → SMTP da Hostinger (`nodemailer`), da VPS | a VPS ([`infraestrutura.md`](infraestrutura.md)) deixa sair a 465/587; pedido do usuário |

Saíram na 1.17.3: o script PHP (web), o `forja-mail-config.php` da Hostinger, a assinatura HMAC e
o `MAIL_RELAY_SECRET`/`MAIL_RELAY_URL`.

## Fluxo

1. `POST /auth/forgot-password` (`auth.controller.ts`): limites de tentativa por IP e por e-mail,
   gera o token e guarda só o hash (ver [`lgpd.md`](lgpd.md)).
2. `EmailService.sendPasswordReset(email, token)` (`src/services/email.service.ts`), com
   `nodemailer` 10 (desde 2026-11-02; os tipos vêm do próprio pacote, sem `@types/nodemailer`):
   - lê a configuração **a cada envio** (sem fallback pra conta: sem `SMTP_USER`/`SMTP_PASS`
     falha antes de conectar);
   - conecta em `SMTP_HOST`:`SMTP_PORT` (padrão `smtp.hostinger.com`:465, SSL; outra porta usa
     STARTTLS), com timeout de 15 s pra conectar, cumprimentar e cada leitura;
   - monta o link `FRONTEND_URL` (padrão `https://forjaarcana.com`) + `/reset-password?token=…` e
     o HTML de `src/services/email-templates/password-reset.template.ts` (ver "Modelo" abaixo);
   - o nome de usuário vem do `AuthService.forgotPassword` (que devolve `{token, username}` ou
     `null`); conta sem nome escolhido é saudada como "aventureiro";
   - remetente `SMTP_FROM` (padrão: o próprio `SMTP_USER`), assunto
     "🗝️ Redefinição de Senha - Forja Arcana".
3. Falha no envio: o serviço joga um erro **só com os códigos** do nodemailer (ex.:
   `Envio do e-mail falhou (EAUTH 535)`), porque a mensagem original pode trazer o endereço
   (destinatário recusado).
4. A api responde **sempre a mesma mensagem**, com ou sem conta e com ou sem falha (um erro só
   quando a conta existe revelaria quem tem conta). A falha vai pro log da api:
   `[auth] e-mail de recuperação não enviado: <motivo>`.

Testes: `src/__tests__/unit/services/email.service.unit.ts` (transporte substituído por stub em
`EmailService.createTransport`).

## Modelo do e-mail (1.17.4)

- Cores do tema **FANTASIA** do site (`styles.scss` do web): fundo `#1d0a0a`, painel `#40190b`
  com borda `#99430a` e sombra preta, botão `#6b1616` com texto `#ffaa00`, destaques em dourado
  `#ccaa44`, texto creme `#efeeeb`. Fonte `Courier New` (a Press Start 2P do site não carrega
  em e-mail sem servidor de fontes de terceiro).
- Saudação: "Saudações, **<nome de usuário>**." O nome (e o link) passam por `escapeHtml`.
- **Modo escuro do celular**: até a 1.17.3 alguns apps invertiam o e-mail escuro e o fundo ficava
  branco. O modelo se declara só escuro e tem uma proteção por família de app:
  - `<meta name="color-scheme" content="dark">` + `supported-color-schemes` e o mesmo no CSS
    (Apple Mail / iOS não mexem);
  - todo fundo também como `background-image: linear-gradient(cor, cor)` e `bgcolor` (o Gmail
    inverte a cor de fundo, não a imagem);
  - texto dentro de `.gm-screen` > `.gm-diff` com `mix-blend-mode` (regra `u + .body`, que só
    casa no Gmail): desfaz a inversão do texto;
  - regras `[data-ogsc]`/`[data-ogsb]` reaplicam as cores no Outlook.
  Testado no **Gmail** com o celular no modo escuro (2026-11-02): fundo escuro e texto legível.
  Nenhum app garante 100%: se algum ainda clarear, anotar qual app e versão.
- Testes: `email.service.unit.ts` confere saudação com e sem nome, escape e as proteções.
- Pra ver o HTML sem mandar e-mail (api compilada): `node -e "const
  {passwordResetTemplate}=require('./dist/services/email-templates/password-reset.template');
  require('fs').writeFileSync('preview.html', passwordResetTemplate('https://forjaarcana.com/reset-password?token=x','https://forjaarcana.com/forja_arcana.png','gorak'))"`
  e abrir o `preview.html` no navegador.

## Configuração

No `/etc/forja-api.env` da VPS (e no `.env` local, se for testar envio de verdade):

| Variável | Obrigatória | Valor |
|---|---|---|
| `SMTP_USER` | sim | a conta de e-mail do site que envia |
| `SMTP_PASS` | sim | a senha dessa conta (hPanel → E-mails) |
| `SMTP_HOST` | não | `smtp.hostinger.com` |
| `SMTP_PORT` | não | `465` |
| `SMTP_FROM` | não | ex.: `Forja Arcana <mensageiro@forjaarcana.com>` |
| `FRONTEND_URL` | não | `https://forjaarcana.com` (base do link e do logo) |

Trocar a senha do e-mail: mudar no hPanel, depois `SMTP_PASS` no `/etc/forja-api.env` e
`sudo systemctl restart forja-api`. Entre um e outro, o e-mail não sai.

## Testar

- Pelo site: "Esqueci minha senha" com uma conta sua; o e-mail chega em segundos.
- Ao mesmo tempo, na VPS: `journalctl -u forja-api -f`. Sem linha `[auth] e-mail de recuperação
  não enviado` = enviou. Com ela, o código diz o motivo:

| Código | Causa provável |
|---|---|
| `EAUTH 535` | usuário ou senha do SMTP errados |
| `ETIMEDOUT` / `ESOCKET` / `ECONNECTION` | porta de saída bloqueada ou servidor fora (testar a porta, abaixo) |
| `EENVELOPE 550` | destinatário recusado (endereço inexistente) |
| `SMTP_USER/SMTP_PASS não configurados` | variável faltando no `/etc/forja-api.env` |

- Testar a saída da porta na VPS (sem mandar e-mail):
  `for p in 465 587; do timeout 5 bash -c "</dev/tcp/smtp.hostinger.com/$p" && echo "$p aberta" || echo "$p bloqueada"; done`
  (as duas abertas em 2026-10-31).
