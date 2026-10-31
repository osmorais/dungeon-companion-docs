---
resumo: Manual da VPS da api — acessar, ver se está saudável e atualizada, logs, mapa dos arquivos (quem chama quem), rotinas, troubleshooting e como remontar do zero.
tipo: procedimento
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Manual do servidor da api (VPS)

O porquê de cada escolha e o desenho geral estão em
[`../conceitos/infraestrutura.md`](../conceitos/infraestrutura.md). Este doc é o "como fazer":
comandos prontos pra copiar. Montado em 2026-10-31 (1.17.1).

Convenção dos blocos de comando:
- **WSL** = terminal do seu computador (prompt `osmor@DESKTOP-...$`).
- **VPS** = dentro do servidor, já conectado (prompt `deploy@srv2113657:~$`).

Olhar o prompt antes de rodar qualquer coisa: muita confusão vem de rodar no terminal errado.

---

## 1. Mapa rápido

| O quê | Onde |
|---|---|
| Servidor | Hostinger VPS KVM 1, Ubuntu 26.04, IP `187.41.108.179`, hostname `srv2113657` |
| Endereço público da api | `https://api.forjaarcana.com` |
| Usuário de acesso | `deploy` (root bloqueado pela rede) |
| Código da api | `/srv/api` (clone do GitHub, branch `main`) |
| Variáveis (segredos) | `/etc/forja-api.env` (root, `600`) |
| Serviço da api | `forja-api` (`/etc/systemd/system/forja-api.service`) |
| Proxy / HTTPS | nginx: `/etc/nginx/sites-available/api.forjaarcana.com` |
| Deploy automático | GitHub Actions (`.github/workflows/deploy.yml` no repo da api) → `/usr/local/bin/forja-deploy` |
| Painel | hPanel → VPS (console de emergência, firewall do painel, backups semanais) |
| DNS | hPanel → Domínios → forjaarcana.com → DNS → registro A `api` |

Senhas no gerenciador de senhas do usuário: **senha root** (só pro console do hPanel), **senha do
`deploy`** (pedida pelo `sudo`), **passphrase da chave SSH** e **backup da chave privada**.

---

## 2. Acessar o servidor

**WSL:**
```bash
ssh deploy@187.41.108.179
```

- Pede a **passphrase da chave** (`Enter passphrase for key '/home/osmor/.ssh/id_ed25519'`):
  destrava a chave no seu computador, não é senha do servidor.
- Pra não digitar a cada conexão, no terminal do WSL:
  ```bash
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519
  ```
  Vale até fechar aquele terminal.
- Se aparecer `deploy@187.41.108.179's password:`, **algo está errado** (o login por senha está
  desligado no servidor). Ver troubleshooting.

**Virar administrador (dentro da VPS):**
- um comando: `sudo <comando>` (pede a senha do `deploy`; fica lembrada ~15 min);
- vários: `sudo -i` (prompt vira `root@...#`), `exit` pra voltar.

**Rodar um comando sem entrar (WSL):**
```bash
ssh deploy@187.41.108.179 'systemctl is-active forja-api'
```

**Emergência** (chave perdida, WSL apagado, SSH quebrado): hPanel → VPS → **Browser terminal**,
login `root` + senha root. Esse console não passa pelo SSH nem pelo firewall.

**Restaurar a chave num computador novo (WSL):**
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
nano ~/.ssh/id_ed25519        # colar o backup do gerenciador de senhas; Ctrl+O, Enter, Ctrl+X
chmod 600 ~/.ssh/id_ed25519
```

---

## 3. O servidor está saudável?

### Verificação rápida (de fora, WSL)

```bash
curl -s https://api.forjaarcana.com/ping; echo
```
Esperado: JSON com `"greeting":"Hello from LoopBack"`. Testa DNS → firewall → nginx → HTTPS → api.

Teste que também passa pelo **banco** (só leitura):
```bash
curl -s "https://api.forjaarcana.com/auth/username-available?username=teste_saude_xyz"; echo
```
Esperado: `{"username":"teste_saude_xyz","available":true,...}`. Se o `/ping` responde e este não,
o problema é a conexão com o Neon.

### Verificação completa (VPS)

```bash
systemctl is-active forja-api nginx            # os dois: active
systemctl --failed --no-pager                  # esperado: 0 loaded units listed
curl -s http://127.0.0.1:3000/ping; echo       # a api direto, sem nginx
uptime                                         # load average < 1.0 é folga (1 vCPU)
free -h                                        # coluna available: memória livre de verdade
df -h /                                        # Use% abaixo de ~80%
sudo ufw status                                # Status: active, 22/80/443
sudo certbot certificates                      # VALID: N days (renova sozinho com < 30)
ls /var/run/reboot-required 2>/dev/null && echo "PRECISA REINICIAR" || echo "sem reinício pendente"
```

Referência de um servidor normal (2026-10-31): api ~110 MB de RAM, 3,4 GB disponíveis, disco ~3%.

---

## 4. Logs

| O que | Comando (VPS) |
|---|---|
| **api**: últimas linhas | `journalctl -u forja-api -n 50 --no-pager` |
| **api**: ao vivo | `journalctl -u forja-api -f` (sair: Ctrl+C) |
| **api**: período | `journalctl -u forja-api --since "2026-10-31 14:00" --until "2026-10-31 15:00"` |
| **api**: só erros | `journalctl -u forja-api -p err -n 50 --no-pager` |
| api: desde o último boot | `journalctl -u forja-api -b --no-pager` |
| **nginx**: acessos | `sudo tail -n 50 /var/log/nginx/access.log` |
| **nginx**: erros (502, upstream) | `sudo tail -n 50 /var/log/nginx/error.log` |
| SSH (quem entrou / tentou) | `sudo journalctl -u ssh -n 50 --no-pager` |
| Firewall (bloqueios) | `sudo journalctl -k --grep UFW -n 20 --no-pager` |
| Certificado (emissão/renovação) | `sudo tail -n 50 /var/log/letsencrypt/letsencrypt.log` |
| Atualizações automáticas | `sudo tail -n 50 /var/log/unattended-upgrades/unattended-upgrades.log` |
| Sistema inteiro | `sudo journalctl -n 100 --no-pager` |
| Espaço usado pelos logs | `journalctl --disk-usage` |

- Os horários do servidor estão em **UTC** (3 horas à frente de Brasília).
- Sem `sudo`, o `deploy` vê os logs da api mas não os do sistema (aviso "Hint: You are currently
  not seeing messages from other users"). Pra ver tudo sem `sudo`: `sudo usermod -aG adm deploy`
  e entrar de novo.
- **Deploys**: github.com/osmorais/dungeon-companion-api → aba **Actions** → "Deploy API". O
  passo "Deploy na VPS" mostra a saída do `forja-deploy`.
- Linha esperada uma vez por boot da api: `[rate-limit] IP do cliente obtido via x-forwarded-for
  (último)`. Se vier `cf-connecting-ip` ou "conexão direta", o nginx não está repassando os headers
  como deveria (ver seção 6).

---

## 5. O servidor está atualizado?

### Sistema (Ubuntu)

```bash
apt list --upgradable 2>/dev/null          # o que tem atualização (vazio = em dia)
sudo apt update && sudo apt upgrade -y      # atualizar tudo
ls /var/run/reboot-required 2>/dev/null && cat /var/run/reboot-required.pkgs
```

- O `unattended-upgrades` instala sozinho **só as correções de segurança do Ubuntu**, todo dia.
  Conferir que segue ligado: `cat /etc/apt/apt.conf.d/20auto-upgrades` (dois `"1"`).
- Ele **não reinicia** o servidor. Atualização de kernel deixa o aviso
  `/var/run/reboot-required`: reiniciar num horário sem mesa jogando (`sudo reboot`; a api e o
  nginx voltam sozinhos; conferir com `uptime` e o `/ping`).
- O **Node** vem do repositório do NodeSource, que o automático não cobre: rodar o
  `apt upgrade` uma vez por mês. Depois de atualizar o Node: `sudo systemctl restart forja-api`.

### Node

```bash
node -v                        # 24.x
```
Trocar de versão grande (ex.: 26): rodar o `setup_26.x` do NodeSource (seção 9.6), `sudo apt
install -y nodejs`, `forja-deploy` (recompila) e conferir. Mudar também o `node-version` do
`deploy.yml` e o `Dockerfile`.

### Código da api

```bash
cd /srv/api && git log --oneline -1        # commit rodando agora
git -C /srv/api fetch -q && git -C /srv/api status -sb | head -1   # "behind N" = falta deploy
```
Comparar com o último commit da `main` no GitHub e com a versão em `https://forjaarcana.com/novidades`.

### Certificado

`sudo certbot certificates` mostra a validade. Renovação automática pelo `certbot.timer`
(`systemctl list-timers | grep certbot`). Testar: `sudo certbot renew --dry-run`.

---

## 6. Mapa dos arquivos — quem chama quem

### Caminho de uma requisição

```
Navegador (forjaarcana.com)
  │  https://api.forjaarcana.com/...        (DNS: registro A api → 187.41.108.179)
  ▼
ufw (firewall)            libera 443 (e 80 só pra redirect/renovação)
  ▼
nginx                     /etc/nginx/sites-enabled/api.forjaarcana.com  (atalho)
  │  HTTPS com /etc/letsencrypt/live/api.forjaarcana.com/*.pem
  │  apaga CF-Connecting-IP, põe X-Forwarded-For = IP real, repassa WebSocket
  ▼
127.0.0.1:3000            api (Node), processo do serviço forja-api
  │  variáveis de /etc/forja-api.env (entregues pelo systemd)
  ▼
Neon (Postgres) · Supabase (imagens) · script de e-mail no site (Hostinger)
```

### Caminho de um deploy

```
git push na main (repo da api)
  ▼
GitHub Actions: .github/workflows/deploy.yml
  ├─ job test: npm ci + npm run test:unit
  └─ job deploy: ssh deploy@187.41.108.179  (chave = secret VPS_SSH_KEY,
                                             identidade do servidor = secret VPS_KNOWN_HOSTS)
        ▼
     /home/deploy/.ssh/authorized_keys: a linha da chave do CI força
     command="/usr/local/bin/forja-deploy" (qualquer outro comando é ignorado)
        ▼
     /usr/local/bin/forja-deploy
        ├─ git fetch + reset --hard origin/main em /srv/api
        │     (usa ~/.ssh/config → ~/.ssh/github_deploy, deploy key só leitura)
        ├─ npm ci  → prepare → tsc → /srv/api/dist
        ├─ sudo systemctl restart forja-api   (liberado sem senha por /etc/sudoers.d/forja-deploy)
        └─ espera o /ping (até 20 s): ok → "deploy ok"; senão log + erro
```

### Arquivos, um por um

| Arquivo / pasta | Dono, permissão | Pra que serve | Quem usa |
|---|---|---|---|
| `/srv/api/` | deploy | Clone do repo da api. `dist/` é o JavaScript compilado que roda | `forja-deploy` atualiza; `forja-api` executa |
| `/srv/api/dist/index.js` | deploy | Ponto de entrada da api | `ExecStart` do serviço |
| `/etc/forja-api.env` | root, `600` | Variáveis: `NODE_ENV`, `PORT`, `HOST=127.0.0.1`, `CORS_ORIGIN`, `JWT_SECRET`, `PG*`, `ENDPOINT_ID`, `SUPABASE_*`, `MAIL_RELAY_SECRET`, `GOOGLE_CLIENT_ID`, `SMTP_*` (pra volta do e-mail) | systemd lê (como root) e entrega à api |
| `/etc/systemd/system/forja-api.service` | root | Define o serviço da api (usuário, pasta, variáveis, reinício, proteções) | systemd |
| `/etc/systemd/system/multi-user.target.wants/forja-api.service` | root | Atalho criado pelo `enable`: liga a api no boot | systemd |
| `/etc/nginx/nginx.conf` | root | Configuração geral do nginx. Mudamos só `server_tokens off` | nginx |
| `/etc/nginx/sites-available/api.forjaarcana.com` | root | O site da api: proxy, WebSocket, limite de upload, headers de IP, HTTPS (parte do certbot) | nginx, via atalho em `sites-enabled/` |
| `/etc/nginx/sites-enabled/api.forjaarcana.com` | root | Atalho que **liga** o site acima. O `default` foi removido daqui | nginx |
| `/etc/letsencrypt/live/api.forjaarcana.com/` | root | Certificado (`fullchain.pem`) e chave (`privkey.pem`) atuais | nginx |
| `/etc/letsencrypt/renewal/api.forjaarcana.com.conf` | root | Como renovar (plugin nginx) | `certbot.timer` |
| `/usr/local/bin/forja-deploy` | root, `755` | Script de deploy. Root é dono: o `deploy` executa mas não altera | chave do CI; você à mão |
| `/etc/sudoers.d/forja-deploy` | root, `440` | `deploy` pode `systemctl restart forja-api` sem senha (só isso) | `sudo`, dentro do `forja-deploy` |
| `/etc/ssh/sshd_config.d/00-forja.conf` | root | Sem root e sem senha no SSH | sshd (lido antes do `50-cloud-init.conf`) |
| `/home/deploy/.ssh/authorized_keys` | deploy, `600` | Chaves que entram como `deploy`: a sua (livre) e a do CI (presa ao `forja-deploy`) | sshd |
| `/home/deploy/.ssh/github_deploy` (+`.pub`) | deploy, `600` | Deploy key: lê o repo da api no GitHub | `git fetch` |
| `/home/deploy/.ssh/config` | deploy, `600` | `Host github.com` → usa a `github_deploy` | ssh/git |
| `/home/deploy/.ssh/known_hosts` | deploy | Identidade do GitHub, conferida pelo fingerprint | ssh/git |
| `/etc/apt/apt.conf.d/20auto-upgrades` | root | Liga o `unattended-upgrades` diário | apt |
| `/etc/apt/sources.list.d/nodesource.*` | root | Repositório do Node 24 | apt |
| `/etc/ufw/` | root | Regras do firewall (não editar à mão; usar `ufw`) | ufw |

**Fora do servidor:**

| Onde | O quê |
|---|---|
| GitHub → repo da api → Settings → Secrets → Actions | `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS` |
| GitHub → repo da api → Settings → Deploy keys | "VPS Hostinger" (só leitura) |
| Repo da api | `.github/workflows/deploy.yml` |
| Repo do web | `src/environments/environment.prod.ts` → `apiUrl: 'https://api.forjaarcana.com'` |
| WSL | `~/.ssh/id_ed25519` (sua chave, com passphrase), `~/.ssh/forja_ci.pub` (só a pública do CI, pra identificar a linha no `authorized_keys`) |
| hPanel | DNS do `api`, VPS (console, backups semanais), CDN do site (otimização de imagem **desligada**) |

---

## 7. Rotinas

| Tarefa | Como |
|---|---|
| Deploy normal | `git push` na `main` da api (do seu terminal, por causa da passphrase). Acompanhar em Actions |
| Deploy sem push | GitHub → Actions → Deploy API → **Run workflow**; ou na VPS: `forja-deploy` |
| Reiniciar a api | `sudo systemctl restart forja-api` |
| Parar / ligar | `sudo systemctl stop forja-api` / `start` |
| Mudar uma variável | `sudo nano /etc/forja-api.env` → `sudo systemctl restart forja-api` |
| Ver os nomes das variáveis (sem valores) | `sudo cut -d= -f1 /etc/forja-api.env \| grep -v '^$'` |
| Mudar o nginx | editar o arquivo → `sudo nginx -t && sudo systemctl reload nginx` |
| Mudar o SSH | editar → `sudo sshd -t` → `sudo systemctl reload ssh` → testar num **segundo** terminal antes de fechar o primeiro |
| Mudar o sudoers | **sempre** `sudo visudo -cf <arquivo>` antes; erro ali quebra o `sudo` |
| Reiniciar o servidor | `sudo reboot`, esperar ~1 min, `ssh` de novo, `uptime` e `/ping` |
| Desfazer um deploy ruim | O certo: `git revert <commit>` + push (o `forja-deploy` sempre vai pra `origin/main`). Emergência na VPS: `cd /srv/api && git reset --hard <commit-bom> && npm ci && sudo systemctl restart forja-api` (o próximo push sobrescreve) |
| Voltar o site pro Render (enquanto existir) | web: `apiUrl` de volta pra `https://dungeon-companion-api.onrender.com`, push |
| Pausar o deploy automático | GitHub → Actions → Deploy API → "..." → Disable workflow |
| Revogar a chave do CI | apagar a linha `restrict,command=...` do `~/.ssh/authorized_keys` do `deploy` (`nano`) |

---

## 8. Troubleshooting

### O site não carrega dados / "erro de conexão"

1. De fora: `curl -s https://api.forjaarcana.com/ping`.
   - **Sem resposta / timeout**: servidor fora ou firewall. hPanel → VPS: está ligada? Pelo
     console: `sudo ufw status`, `systemctl status nginx`.
   - **`502 Bad Gateway`**: o nginx está ok, a **api está fora**. `systemctl status forja-api` e
     `journalctl -u forja-api -n 50`. Normalmente é erro no boot da api (variável faltando,
     build quebrado). `Restart=always` tenta de 5 em 5 s.
   - **Erro de certificado**: `sudo certbot certificates`; se venceu, `sudo certbot renew` e ver
     o log da Let's Encrypt (porta 80 bloqueada? DNS mudou?).
2. `/ping` ok mas a tela não carrega: abrir F12 → Network/Console no navegador.
   - **Erro de CORS**: `CORS_ORIGIN` no `/etc/forja-api.env` precisa ter exatamente
     `https://forjaarcana.com,https://www.forjaarcana.com` (sem `/` no fim).
   - Chamadas indo pra `onrender.com`: o site publicado é antigo (cache da CDN ou deploy da
     Hostinger não rodou).
3. `/ping` ok e o teste do `username-available` falha: banco. Log da api; conferir `PG*` e
   `ENDPOINT_ID`; ver se o Neon está no ar / fora da cota do plano grátis.

### Sessão em tempo real não atualiza

- Log do navegador mostrando WebSocket falhando: conferir no arquivo do nginx as linhas `Upgrade`,
  `Connection $connection_upgrade` e `proxy_http_version 1.1` (e o bloco `map` no topo).
- Depois de todo restart/deploy, o estado em memória da mesa zera: quem estava na mesa recarrega.

### Upload de imagem dá erro 413

`client_max_body_size 12m` sumiu do nginx (ex.: o arquivo foi recriado). Repor e recarregar.

### Rate-limit bloqueando todo mundo ao mesmo tempo

O IP do cliente está saindo igual pra todos. Ver a linha `[rate-limit] IP do cliente obtido via`
no log e as linhas `X-Forwarded-For $remote_addr` / `CF-Connecting-IP ""` do nginx.

### GitHub Action vermelha

| Onde falhou | Causa provável | O que fazer |
|---|---|---|
| job `test` | teste quebrado de verdade, ou o teste instável do bcrypt (backlog) | rodar `npm run test:unit` local; se for o instável, **Re-run** |
| "Deploy na VPS": `Host key verification failed` | identidade do servidor mudou (VPS reinstalada) ou secret errado | conferir `ssh-keygen -F 187.41.108.179` no WSL e atualizar `VPS_KNOWN_HOSTS` |
| `Permission denied (publickey)` | secret `VPS_SSH_KEY` errado, ou a linha do CI saiu do `authorized_keys` | refazer a chave do CI (seção 9.11) |
| saída do `npm ci` com erro | dependência / build | rodar `forja-deploy` na VPS pra ver; a versão antiga continua no ar (o script para antes do restart) |
| "a API não respondeu ao /ping" | a versão nova não sobe | o log vem junto; corrigir e dar push, ou desfazer (seção 7) |
| `git fetch` falhou | deploy key removida no GitHub | recadastrar a `.pub` da `github_deploy` (seção 9.7) |

### SSH

- **Pede passphrase**: normal, é a da sua chave (ver seção 2).
- **Pede `password:`**: o servidor não aceitou a chave e caiu pra senha (que está desligada, então
  vai falhar). Conferir se está usando a chave certa: `ssh -v deploy@187.41.108.179` mostra quais
  chaves foram tentadas.
- **`Permission denied (publickey)`** com a sua chave: permissões em `/home/deploy/.ssh`
  (`700` na pasta, `600` no `authorized_keys`, dono `deploy`) — conferir pelo console do hPanel.
- **`Connection refused` logo depois de `reboot`**: o servidor ainda está ligando; esperar.
- **Trancado do lado de fora**: console do hPanel (seção 2).
- `ssh root@...` dá `Permission denied`: **é o esperado**.

### Disco ou memória

- `df -h /` alto: `sudo journalctl --vacuum-size=200M` (logs), `sudo apt autoremove --purge`,
  `sudo apt clean`; ver o que cresce com `sudo du -sh /var/log/* /srv/* | sort -h`.
- Memória: `free -h`; `systemctl status forja-api` mostra quanto a api usa. Se crescer sem parar
  (vazamento), o restart resolve na hora; investigar depois.

### Comando com `sed` "não fez nada"

O `sed` não avisa quando o texto procurado não existe. Antes: `grep -n 'texto' arquivo`; depois:
o mesmo `grep` pra conferir (foi o que pegou o `server_tokens build` do Ubuntu 26.04).

### Imagens do site borradas

CDN da Hostinger com otimização de imagem ligada — ver [`../gotchas.md`](../gotchas.md) (seção
Deploy / infraestrutura). Não é a VPS.

---

## 9. Como foi montado (pra refazer do zero)

Na ordem em que foi feito em 2026-10-31. Se a VPS for reinstalada, seguir daqui.

### 9.1 Contratação (hPanel)

KVM 1, 24 meses, Ubuntu 26.04 LTS sem painel. Senha root gerada e guardada. Chave SSH pública do
WSL (`cat ~/.ssh/id_ed25519.pub`) cadastrada. Sem Monarx, sem backup diário pago, sem Docker
manager. Sem o domínio grátis (já existia o `forjaarcana.com`).

### 9.2 Primeira entrada e atualização (como root)

```bash
ssh root@187.41.108.179          # só nesta primeira vez
apt update && apt upgrade -y
ls /var/run/reboot-required && reboot
```
Conferir o automático: `systemctl status unattended-upgrades` e
`cat /etc/apt/apt.conf.d/20auto-upgrades` (dois `"1"`).

### 9.3 Usuário `deploy`

```bash
adduser deploy                               # senha no gerenciador; demais campos vazios
usermod -aG sudo deploy                      # -a: sem ele, tiraria dos outros grupos
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```
Testar num segundo terminal: `ssh deploy@187.41.108.179`, `whoami`, `sudo whoami` (→ `root`).

### 9.4 Fechar o SSH (já como `deploy`)

```bash
ls /etc/ssh/sshd_config.d/                   # 50-cloud-init.conf, 60-cloudimg-settings.conf
sudo tee /etc/ssh/sshd_config.d/00-forja.conf > /dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
EOF
sudo sshd -t
sudo systemctl reload ssh
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauthentication|kbdinteractive'   # três "no"
```
Testar de fora antes de fechar a sessão: `ssh root@...` e
`ssh -o PubkeyAuthentication=no deploy@...` devem dar `Permission denied (publickey)`.

### 9.5 Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw show added                          # conferir OpenSSH ANTES de ligar
sudo ufw enable
sudo ufw status verbose
```

### 9.6 DNS, nginx, certbot e Node

DNS no hPanel: tipo **A**, nome `api`, valor `187.41.108.179`, TTL 300. Conferir:
`getent hosts api.forjaarcana.com`.

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh
less nodesource_setup.sh                     # ler antes de rodar como root
sudo bash nodesource_setup.sh
sudo apt install -y nodejs
node -v
```

### 9.7 Código da api

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N "" -C "vps-forja-deploy"
cat ~/.ssh/github_deploy.pub                 # GitHub → repo da api → Settings → Deploy keys (sem write)
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T git@github.com                        # conferir: SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU
sudo mkdir -p /srv/api && sudo chown deploy:deploy /srv/api
git clone git@github.com:osmorais/dungeon-companion-api.git /srv/api
cd /srv/api && npm ci && ls -la dist/index.js
```

### 9.8 Variáveis

```bash
sudo install -m 600 -o root -g root /dev/null /etc/forja-api.env
sudo nano /etc/forja-api.env
```
Conteúdo: os valores do Render (ou do gerenciador de senhas) mais `NODE_ENV=production`,
`PORT=3000`, `HOST=127.0.0.1`. Lista de nomes na seção 6. Nunca colar valores em conversa.

### 9.9 Serviço

```bash
sudo tee /etc/systemd/system/forja-api.service > /dev/null <<'EOF'
[Unit]
Description=Forja Arcana API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/srv/api
EnvironmentFile=/etc/forja-api.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now forja-api
curl -s http://127.0.0.1:3000/ping; echo
```

### 9.10 nginx do site e HTTPS

```bash
sudo tee /etc/nginx/sites-available/api.forjaarcana.com > /dev/null <<'EOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.forjaarcana.com;

    server_tokens off;
    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 120s;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header CF-Connecting-IP "";
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/api.forjaarcana.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.forjaarcana.com  # e-mail, aceitar termos; ele cria o 443 e o redirect
sudo sed -i 's/server_tokens build;/server_tokens off;/' /etc/nginx/nginx.conf
grep -n server_tokens /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run
```
Depois do certbot, o arquivo ganha `listen 443 ssl`, os caminhos de `/etc/letsencrypt/...` e um
segundo bloco `server` só com o redirect da 80 (linhas `# managed by Certbot`).

### 9.11 Deploy automático

Na VPS:
```bash
sudo tee /usr/local/bin/forja-deploy > /dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

cd /srv/api
git fetch --quiet origin main
git reset --hard origin/main
npm ci --no-audit --no-fund

sudo /usr/bin/systemctl restart forja-api

for i in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:3000/ping > /dev/null 2>&1; then
    echo "deploy ok: $(git log --oneline -1)"
    exit 0
  fi
  sleep 1
done

echo "a API não respondeu ao /ping depois do restart" >&2
journalctl -u forja-api -n 30 --no-pager >&2
exit 1
EOF
sudo chmod 755 /usr/local/bin/forja-deploy
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart forja-api' | sudo tee /etc/sudoers.d/forja-deploy > /dev/null
sudo chmod 440 /etc/sudoers.d/forja-deploy
sudo visudo -cf /etc/sudoers.d/forja-deploy
forja-deploy
```

No **WSL** (não na VPS — a privada do CI não deve existir no servidor):
```bash
ssh-keygen -t ed25519 -f ~/.ssh/forja_ci -N "" -C "github-actions-forja"
echo "restrict,command=\"/usr/local/bin/forja-deploy\" $(cat ~/.ssh/forja_ci.pub)" | ssh deploy@187.41.108.179 'cat >> ~/.ssh/authorized_keys'
ssh -o IdentitiesOnly=yes -i ~/.ssh/forja_ci deploy@187.41.108.179 whoami   # roda o deploy, não o whoami
ssh-keygen -F 187.41.108.179 | grep -v '^#'   # → secret VPS_KNOWN_HOSTS
cat ~/.ssh/forja_ci                           # → secret VPS_SSH_KEY
rm ~/.ssh/forja_ci                            # depois de salvar o secret
```
GitHub → repo da api → Settings → Secrets and variables → Actions: `VPS_SSH_KEY` e
`VPS_KNOWN_HOSTS`. O workflow está no repo (`.github/workflows/deploy.yml`, commit `1c7c518`).

### 9.12 Virada

Push da **api** primeiro (Action verde, `git log` na VPS mostra o commit novo), depois o **web**
com o `apiUrl` novo. Testar: login (e-mail e Google), abrir ficha, mesa em dois navegadores,
upload de imagem > 1 MB, esqueci minha senha, F12 → Network mostrando `api.forjaarcana.com`.
