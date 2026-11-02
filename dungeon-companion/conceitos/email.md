---
resumo: E-mail de recuperação de senha — desde a 1.17.3 a api envia direto pelo SMTP da Hostinger (nodemailer), da VPS; antes (1.12.1–1.17.2) passava por um script PHP no site. Configuração, erros e como testar.
tipo: conceito
status: ativo
atualizado: 2026-11-01
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
2. `EmailService.sendPasswordReset(email, token)` (`src/services/email.service.ts`):
   - lê a configuração **a cada envio** (sem fallback pra conta: sem `SMTP_USER`/`SMTP_PASS`
     falha antes de conectar);
   - conecta em `SMTP_HOST`:`SMTP_PORT` (padrão `smtp.hostinger.com`:465, SSL; outra porta usa
     STARTTLS), com timeout de 15 s pra conectar, cumprimentar e cada leitura;
   - monta o link `FRONTEND_URL` (padrão `https://forjaarcana.com`) + `/reset-password?token=…` e
     o HTML de `src/services/email-templates/password-reset.template.ts` (o mesmo modelo de
     sempre, com o logo `forja_arcana.png` do site);
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
