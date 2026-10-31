---
resumo: E-mail de recuperação de senha (1.12.1): a api chama por HTTPS um script PHP no site (Hostinger), que envia pelo SMTP de lá — assinatura, configuração fora do git e como testar.
tipo: conceito
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — E-mail (recuperação de senha)

> **2026-10-31**: a api saiu do Render pra uma VPS ([`infraestrutura.md`](infraestrutura.md)), que
> deixa sair SMTP (465/587). O usuário quer voltar o envio pra api — está no backlog. Até lá, vale
> o que está abaixo.

Único e-mail que o sistema manda. Até a 1.12.0 a api enviava direto pelo SMTP da Hostinger
(`nodemailer`), mas o **Render bloqueia as portas de e-mail** (25/465/587) e o "esqueci minha
senha" parou de chegar. Desde a **1.12.1** (api `b60cdb5`, web `c390035`, 2026-10-25) o envio é
feito pelo próprio site, que roda na Hostinger, no mesmo servidor do e-mail. Decisão do usuário:
script na Hostinger, em vez do plano pago do Render ou de um serviço de e-mail por API (terceiro
novo).

## Fluxo

1. `POST /auth/forgot-password` (api): limites de tentativa por IP e por e-mail, gera o token,
   guarda só o hash (como antes, ver `lgpd.md`).
2. `EmailService.sendPasswordReset` (api) chama `https://forjaarcana.com/mail/recuperar-senha.php`
   (`MAIL_RELAY_URL` troca o endereço) com `{email, token}` e os cabeçalhos:
   - `X-Forja-Timestamp`: segundos (Unix);
   - `X-Forja-Signature`: HMAC-SHA256 hex de `"<timestamp>.<corpo>"` com `MAIL_RELAY_SECRET`
     (`signRelayRequest`). Timeout de 15 s.
3. `public/mail/recuperar-senha.php` (web, publicado junto com o site — tudo em `public/` vai pro
   ar): só POST (405), assinatura certa e com até 5 minutos (401), e-mail válido e token de 64
   hex (400). Monta o link (`frontend_url` + `/reset-password?token=…`) e o HTML (o mesmo modelo
   de antes, que saiu da api) e envia por um cliente SMTP mínimo (SSL na 465, AUTH LOGIN, corpo
   em base64), sem dependência. Respostas: `{"ok":true}` ou `{"error": "method" | "config" |
   "signature" | "input" | "smtp"}` (502 no `smtp`).
4. O script **só sabe mandar esse e-mail**: com o segredo vazado, ainda não serve pra mandar
   conteúdo qualquer. Não grava nem registra o endereço (o `error_log` leva só o motivo técnico).
5. A api responde **sempre a mesma mensagem**, mesmo quando o envio falha — antes, um 500 só
   pra conta existente revelava quem tem conta. A falha vai pro log da api (era o Render; hoje `journalctl -u forja-api`)
   (`[auth] e-mail de recuperação não enviado: <motivo>`), sem o endereço.

## Configuração (fora do git)

- **api** (`/etc/forja-api.env` na VPS desde a 1.17.1; antes, no Render): `MAIL_RELAY_SECRET`
  (sem fallback: sem ele a api falha antes de chamar o script).
  `.env` local da api tem o mesmo valor. As variáveis `SMTP_*` não são mais usadas.
- **Hostinger**: `forja-mail-config.php` na pasta que **contém** o `public_html`
  (`domains/forjaarcana.com/`, a do aviso `DO_NOT_UPLOAD_HERE` — arquivos ali não são servidos
  pelo site, mas o PHP lê). O script procura em `dirname(__DIR__, 2)`. Formato:

  ```php
  <?php
  return [
      'secret' => '<o mesmo MAIL_RELAY_SECRET da api>',
      'smtp_host' => 'smtp.hostinger.com',
      'smtp_port' => 465,
      'smtp_user' => '<conta de e-mail do site>',
      'smtp_pass' => '<senha dessa conta>',
      'from' => '<conta de e-mail do site>',
      'frontend_url' => 'https://forjaarcana.com',
  ];
  ```
- Trocar o segredo: gerar um novo (`openssl rand -hex 32`), pôr na api (`/etc/forja-api.env` + `sudo systemctl restart forja-api`) e no arquivo da
  Hostinger, e redeploy da api. Entre um e outro, a recuperação de senha não envia.

## Testar sem mandar e-mail

Um GET dá 405; POST sem assinatura, 401; POST assinado com token inválido, **400 `input`** —
confirma que a configuração foi lida e o segredo bate. `500 config` = o script não achou o
arquivo (lugar ou nome errado). Qualquer endereço inexistente no site responde 200 com a página
do Angular, então um 200 em `forjaarcana.com/forja-mail-config.php` não quer dizer que o arquivo
está exposto (conferido em 2026-10-25: devolve a página, não o arquivo).
