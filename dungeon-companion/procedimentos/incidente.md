---
resumo: Plano de resposta a incidente de segurança (LGPD art. 48) + registro de incidentes.
tipo: procedimento
status: ativo
atualizado: 2026-10-31
---

# Forja Arcana — Plano de resposta a incidente de segurança

Registrado em 2026-10-15. Roteiro pra seguir se houver (ou houver suspeita de) vazamento, acesso
indevido ou perda de dados pessoais dos usuários. Ver `dungeon-companion/conceitos/lgpd.md` (item 14).

> ⚠️ Prazos e regras abaixo vêm da LGPD (art. 48), do Regulamento de Comunicação de Incidente
> (**Resolução CD/ANPD nº 15/2024**) e do regulamento de agentes de pequeno porte (**Resolução
> CD/ANPD nº 2/2022**), conforme entendidos em 2026-10. **Confirmar no site da ANPD / com
> advogado** antes de usar como referência definitiva — as resoluções podem ter sido alteradas.

## Quem é quem

- **Controlador:** Osmar de Morais Junior (pessoa física).
- **Canal do titular:** mensageiro@forjaarcana.com.
- **Operadores** (avisar/consultar conforme o caso): Hostinger (site, e-mail e, desde a 1.17.1,
  a VPS da API), Neon (banco), Supabase (imagens), Google (login). Render (API até a 1.17.0, de
  reserva até ser apagado).

## O que conta como incidente

Qualquer evento que comprometa a **confidencialidade, integridade ou disponibilidade** de dados
pessoais. Exemplos neste sistema:
- vazamento do `.env` / de alguma credencial (JWT_SECRET, senha do banco, chave do Supabase, segredo ou senha do e-mail);
- acesso indevido ao banco Neon, ao bucket do Supabase, ao painel da Hostinger ou à VPS (SSH);
- falha de código que exponha dados de um usuário a outro (ex.: o endpoint que listava todas as
  sessões, corrigido em 2026-10-14);
- perda de dados sem backup (ver `dungeon-companion/procedimentos/backups.md`).

## Passo 1 — Conter (imediatamente)

Trocar as credenciais possivelmente expostas (na VPS: `sudo nano /etc/forja-api.env` e
`sudo systemctl restart forja-api`; e no `.env` local — ver `conceitos/infraestrutura.md`):

| Credencial | Onde trocar | Efeito colateral |
|---|---|---|
| `JWT_SECRET` | `/etc/forja-api.env` | **Desloga todo mundo** (tokens antigos param de valer) — desejável se houver suspeita de token roubado |
| `PGPASSWORD` | Neon → Roles | Atualizar no `/etc/forja-api.env` antes de reiniciar |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API settings | Atualizar no `/etc/forja-api.env` |
| Senha do e-mail do site | Hostinger → e-mail | Atualizar o `smtp_pass` do `forja-mail-config.php` (Hostinger, fora do `public_html`) — desde a 1.12.1 a api não usa mais `SMTP_PASS` |
| `MAIL_RELAY_SECRET` | gerar outro (`openssl rand -hex 32`) | Pôr no `/etc/forja-api.env` **e** no `'secret'` do `forja-mail-config.php`; até os dois baterem, o e-mail de recuperação não sai. Ver `conceitos/email.md` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | painel de cada um | Hoje sem uso (IA desativada) — revogar se vazou |
| Senhas dos painéis (Neon, Supabase, Hostinger, GitHub; Render enquanto existir) | cada painel | Ativar 2FA onde não tiver |
| Chave do CI (`VPS_SSH_KEY`) | gerar outra, trocar a linha `restrict,command=...` no `authorized_keys` do `deploy` e o secret no GitHub | Só dispara deploy da `main`; deploys param até o secret novo |
| Deploy key do GitHub (`~/.ssh/github_deploy` na VPS) | GitHub → repo da api → Deploy keys | Só leitura; o deploy para até cadastrar a nova |
| Acesso SSH à VPS | revisar `~/.ssh/authorized_keys` do `deploy`; trocar a senha root e a do `deploy` | Se a VPS em si foi invadida: tratar o servidor como perdido e reinstalar pelo hPanel |

Se o problema for de código: tirar a funcionalidade do ar (reverter o commit e fazer deploy)
antes de investigar com calma.

## Passo 2 — Preservar evidências

Antes de apagar/limpar qualquer coisa, salvar: logs da api do período (`journalctl -u forja-api
--since ...` e `/var/log/nginx/access.log`), horário em que o
problema foi percebido, o que foi exposto e como foi descoberto, commits envolvidos. Anotar tudo
com data e hora.

## Passo 3 — Avaliar o risco

Responder, por escrito:
1. Quais dados foram afetados? (e-mail, nome, senha — só hash bcrypt —, personagens, imagens…)
2. Quantos usuários? Quais? (lista de e-mails, se possível)
3. Os dados ficaram acessíveis a quem, e por quanto tempo?
4. Há risco ou dano relevante aos titulares? Pesa mais: dados que permitam fraude/golpe, senhas
   (mesmo em hash), imagens de pessoas reais, dados de menores, grande volume.

Se **não** há risco/dano relevante: só registrar (Passo 5). Se **há**: comunicar (Passo 4).

## Passo 4 — Comunicar (se houver risco ou dano relevante)

**Prazo:** em até **3 dias úteis** a partir de quando se soube que o incidente afetou dados
pessoais (Res. 15/2024). Agente de pequeno porte tem o prazo **em dobro** (Res. 2/2022), exceto
quando houver potencial comprometimento à integridade física ou moral dos titulares ou à
segurança nacional — **na dúvida, usar o prazo curto**.

**À ANPD:** pelo formulário de comunicação de incidente no site da ANPD (gov.br). Informações
pedidas: descrição e natureza dos dados afetados, titulares envolvidos (quantidade), medidas
técnicas de segurança que existiam, riscos, motivo de eventual demora, medidas tomadas para
reverter/mitigar, contato do controlador.

**Aos usuários afetados:** e-mail individual (a partir de mensageiro@forjaarcana.com), em
linguagem simples. Modelo:

> **Assunto:** Aviso de segurança sobre sua conta no Forja Arcana
>
> Olá, aventureiro(a). Em [data], identificamos [o que aconteceu, em uma frase]. Os dados
> envolvidos foram: [lista]. [Sua senha não foi exposta / sua senha estava protegida por
> criptografia, mas recomendamos trocá-la.]
>
> O que já fizemos: [medidas]. O que recomendamos que você faça: [trocar a senha, desconfiar de
> e-mails pedindo dados, etc.].
>
> Dúvidas: mensageiro@forjaarcana.com. — Osmar de Morais Junior, responsável pelo Forja Arcana.

Se a senha pode ter sido afetada: além de trocar o `JWT_SECRET`, considerar forçar redefinição
de senha (hoje não existe essa funcionalidade — seria preciso implementar).

## Passo 5 — Registrar (sempre, mesmo sem comunicação)

Manter um registro de **todo** incidente (inclusive os que não foram comunicados) por pelo menos
**5 anos** (Res. 15/2024): data, descrição, dados e titulares afetados, avaliação de risco,
medidas tomadas, se e quando foi comunicado. Sugestão: uma seção por incidente no fim deste
arquivo.

## Passo 6 — Depois

Corrigir a causa, adicionar teste que pegaria o problema, atualizar `dungeon-companion/conceitos/lgpd.md`
e, se mudou algo no tratamento de dados, a Política de Privacidade.

---

## Registro de incidentes

| Data | Descrição | Dados/titulares | Risco | Comunicado? | Medidas |
|---|---|---|---|---|---|
| 2026-10-14 | Achados de auditoria antes da divulgação pública: listagem de todas as sessões com código de entrada; exclusão de sessão sem checar o dono; login Google sem checar e-mail verificado | Nomes de mestre/sessão; potencial acesso a sessões de outros | Sem evidência de exploração; base de usuários pequena e pré-lançamento | Não (avaliado sem risco relevante — **confirmar com advogado**) | Corrigido (api `ef6e72a`, `1dd808f`); ver `dungeon-companion/conceitos/lgpd.md` |
| 2026-10-16 | Entrar numa sessão (`addPlayer`) ou adicionar NPC (`addNpc`) não checava se o personagem (`id_character`, sequencial) pertencia a quem o trazia — daria pra ver nome/classe/PV/imagem de um personagem alheio e agir por ele na sessão | Dados de jogo e imagem do personagem de outro usuário | Sem evidência de exploração: conferido em produção (só leitura), 0 de 20 jogadores e 0 de 9 NPCs com personagem de outro dono | Não (sem exploração — **confirmar com advogado**) | Corrigido (api `ba62504`): 403 se o personagem não é do usuário, 404 se não existe; testes; ver item 16 de `dungeon-companion/conceitos/lgpd.md` |
