---
resumo: Onde a api roda (VPS da Hostinger desde a 1.17.1) — servidor, nginx, HTTPS, serviço systemd, variáveis, deploy automático pelo GitHub Actions, acesso e manutenção.
tipo: conceito
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Infraestrutura da api (VPS)

Até a 1.17.0 a api rodava no plano grátis do **Render**, que desligava o servidor sem uso (o
primeiro acesso esperava ele "acordar") e bloqueava SMTP. Na 1.17.1 (2026-10-31) ela foi para uma
**VPS da Hostinger**. O site continua no plano de hospedagem da Hostinger (deploy pelo Git), o
banco no Neon e as imagens no Supabase.

**Comandos do dia a dia** (acessar, saúde, logs, atualizações, mapa de arquivos, troubleshooting,
remontar do zero): [`../procedimentos/servidor-api.md`](../procedimentos/servidor-api.md).

## Por que a VPS (estudo de 2026-10-30/31)

O motivo era só a espera do Render acordando. Opções comparadas (câmbio ~R$ 5,50; preços AWS
estimados, Hostinger da tela de compra):

| Opção | Custo/mês | Resolve a espera | Observação |
|---|---|---|---|
| Render grátis (antes) | R$ 0 | não | SMTP bloqueado, cookie third-party |
| Render Starter | ~R$ 39 (US$ 7) | sim | zero manutenção, 512 MB, libera SMTP |
| **Hostinger VPS KVM 1** (escolhida) | R$ 29,99 (24 meses adiantado, ~R$ 720); renova a R$ 59,99 | sim | 4 GB, mesmo domínio e fornecedor do site, SMTP liberado; manutenção é nossa |
| Hostinger Business (plano de site) | — | — | não serve: sem WebSocket de entrada |
| AWS Lightsail só pra api | ~R$ 39–66 | sim | mesmo trabalho da VPS, menos RAM |
| AWS gerenciado (EC2 + RDS + S3 + CloudFront + SES) | R$ 140–180 (Virgínia), R$ 220–275 (São Paulo) | sim | só compensa se crescer muito ou pra aprender AWS |

Decisão em [`../decisoes.md`](../decisoes.md). Houve uma página comparativa (artifact privado
"Hospedagem da API Forja Arcana", claude.ai) feita na conversa.

## O servidor

| Item | Valor |
|---|---|
| Plano | Hostinger **VPS KVM 1** (1 vCPU, 4 GB, 50 GB NVMe), contrato de 24 meses a R$ 29,99/mês; renova a R$ 59,99/mês |
| Sistema | Ubuntu 26.04 LTS (suporte até 2031) |
| IP | `187.41.108.179` (hostname `srv2113657`) |
| Domínio | `api.forjaarcana.com` — registro **A** na zona DNS do `forjaarcana.com` no hPanel, TTL 300 |
| Node | 24, pelo repositório do **NodeSource** (`/usr/bin/node`), igual ao local e ao `Dockerfile` |

O plano de site (Business/Cloud) **não serve** pra api: não aceita conexão WebSocket de entrada
(o Socket.io da mesa quebra), corta requisição em 120 s e limita processos.

## Acesso

- SSH só com o usuário **`deploy`** e chave (`ssh deploy@187.41.108.179`). Root fica bloqueado
  pela rede: usar `sudo` (senha do `deploy`) ou `sudo -i`.
- `/etc/ssh/sshd_config.d/00-forja.conf`: `PermitRootLogin no`, `PasswordAuthentication no`,
  `KbdInteractiveAuthentication no`. O `00-` é de propósito (ver [`../gotchas.md`](../gotchas.md)).
- **Emergência** (chave perdida, SSH quebrado): hPanel → VPS → Browser terminal, login `root` com
  a senha root da contratação (no gerenciador de senhas do usuário).
- A chave pessoal do usuário (`~/.ssh/id_ed25519` do WSL) tem passphrase e backup no gerenciador
  de senhas. Por causa da passphrase, **push e SSH saem do terminal do usuário**, não do Claude.
- Firewall `ufw`: entrada bloqueada, liberadas só 22, 80 e 443 (v4 e v6). A 80 fica aberta pro
  redirect e pra renovação do certificado.
- Atualizações de segurança do Ubuntu: `unattended-upgrades` (diário). O Node vem do NodeSource,
  que o `unattended-upgrades` **não** cobre: rodar `sudo apt update && sudo apt upgrade` de vez em
  quando.

## Caminho de uma requisição

```
navegador → api.forjaarcana.com (443) → nginx → 127.0.0.1:3000 (api, serviço forja-api)
```

### nginx (`/etc/nginx/sites-available/api.forjaarcana.com`)

- `proxy_pass http://127.0.0.1:3000`, com `Upgrade`/`Connection` (bloco `map
  $http_upgrade $connection_upgrade`) e `proxy_http_version 1.1` pro **WebSocket** do Socket.io;
  `proxy_read_timeout 120s`.
- `client_max_body_size 12m`: a api aceita imagem de até 10 MB (`IMAGE_UPLOAD_MAX_BYTES`) e o
  padrão do nginx é 1 MB (daria 413).
- **IP do cliente pro rate-limit** (`rate-limit.service.ts`, função `clientIp`): o código confia
  primeiro em `cf-connecting-ip` e depois no último item de `x-forwarded-for`. Sem Cloudflare na
  frente, o nginx **apaga** o `CF-Connecting-IP` (`proxy_set_header CF-Connecting-IP ""`) e
  **substitui** o `X-Forwarded-For` por `$remote_addr`. Também repassa `Host` e
  `X-Forwarded-Proto`.
- `server_tokens off` no `/etc/nginx/nginx.conf` (vale pros dois blocos `server`).
- O site padrão do nginx foi desligado (atalho `sites-enabled/default` removido).
- Mudou a configuração: `sudo nginx -t && sudo systemctl reload nginx`.

### HTTPS

Certificado da Let's Encrypt pelo **certbot** com o plugin do nginx (`sudo certbot --nginx -d
api.forjaarcana.com`). O certbot acrescentou o bloco 443 e um bloco só de redirect na porta 80
(linhas `# managed by Certbot`). Renovação sozinha pelo `certbot.timer`; testar com `sudo certbot
renew --dry-run`.

## O serviço da api

`/etc/systemd/system/forja-api.service`: roda `/usr/bin/node dist/index.js` em `/srv/api` como
`deploy`, com `Restart=always` (volta em 5 s se cair) e `enable` (liga junto com o servidor).
Proteções: `NoNewPrivileges`, `PrivateTmp`, `ProtectSystem=full`, `ProtectHome=true`.

- Ver: `systemctl status forja-api`; logs: `journalctl -u forja-api -n 50` (ao vivo: `-f`).
- Reiniciar: `sudo systemctl restart forja-api`.
- Uma instância só: o estado em memória (rate-limit, pendências da mesa) zera a cada restart, como
  no Render.

### Variáveis (`/etc/forja-api.env`)

Dono root, permissão `600`: só o systemd lê e entrega à api (o `deploy` não lê). Os valores vieram
do Render. Além deles: `NODE_ENV=production`, `PORT=3000` e **`HOST=127.0.0.1`** (a api só escuta
dentro do servidor; o código cai em `0.0.0.0` sem isso). As `SMTP_*` continuam lá de propósito
pra volta do e-mail pela api (ver [`email.md`](email.md)). `MAIL_RELAY_URL` não está definida (o
código tem padrão). O `dotenv` do código loga `injected env (0) from .env`: normal, não há `.env`
em `/srv/api`.

Editar: `sudo nano /etc/forja-api.env` e `sudo systemctl restart forja-api`. Conferir só os
nomes: `sudo cut -d= -f1 /etc/forja-api.env`.

## Deploy automático

Push na `main` da api → workflow `.github/workflows/deploy.yml` (repo `dungeon-companion-api`, commit `1c7c518`):

1. job `test`: `npm ci` e `npm run test:unit` (Node 24). Falhou, não há deploy.
2. job `deploy`: SSH na VPS com a chave do CI. Botão "Run workflow" (`workflow_dispatch`) pra
   rodar à mão; `concurrency` faz um deploy esperar o outro.

No servidor, a chave do CI está no `~/.ssh/authorized_keys` do `deploy` com
`restrict,command="/usr/local/bin/forja-deploy"`: quem usa essa chave só dispara o deploy (pedir
outro comando é ignorado). O script (`/usr/local/bin/forja-deploy`, dono root):
`git fetch` + `git reset --hard origin/main`, `npm ci` (o `prepare` roda o build),
`sudo systemctl restart forja-api` e espera até 20 s o `/ping` responder; se não responder, mostra
o log e sai com erro (a Action fica vermelha). `/etc/sudoers.d/forja-deploy` libera **só** esse
restart sem senha.

- Secrets no GitHub (repo da api): `VPS_SSH_KEY` (privada do CI) e `VPS_KNOWN_HOSTS` (as 3 linhas
  de `ssh-keygen -F 187.41.108.179 | grep -v '^#'`, conferidas na primeira conexão).
- O código é baixado com uma **deploy key** só de leitura do repositório
  (`~/.ssh/github_deploy` no servidor, `Host github.com` no `~/.ssh/config` do `deploy`).
- Deploy à mão no servidor: `forja-deploy`.
- Ordem com o web continua: **api primeiro**, web depois.

## Virada e reserva

- Web `494d7ce` (1.17.1): `apiUrl` de produção = `https://api.forjaarcana.com` (era
  `https://dungeon-companion-api.onrender.com`). Política de Privacidade atualizada (Render sai dos
  operadores).
- O Render ficou ligado como **reserva** por alguns dias (recebe os mesmos pushes). Voltar: trocar
  o `apiUrl` de volta e dar push no web. Depois, apagar o serviço do Render (backlog).
- Na 1.17.2 saiu do web a tela "despertando o servidor" (`server-wakeup/`), que esperava o
  `/ping` do Render a cada carga do site.
- `forjaarcana.com` e `api.forjaarcana.com` agora são o mesmo *site* pro navegador: o cookie
  httpOnly deixa de ser third-party (o fallback por token no Socket.io continua funcionando).
