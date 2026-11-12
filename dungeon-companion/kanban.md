---
resumo: Cards criados no kanban do Monday (2026-11-05) — o que cada um cobre, decisões já tomadas, dúvidas em aberto e itens do backlog que absorve.
tipo: backlog
status: ativo
atualizado: 2026-11-12
---

# Dungeon Companion — Cards no kanban (Monday)

Em 2026-11-05 o usuário passou a organizar as tarefas num **quadro kanban no Monday**. Os cards
abaixo foram escritos com o Claude e registrados lá pelo usuário; a **descrição completa** (escopo,
critérios de aceite, sugestões) está no card do Monday, que é a fonte de verdade do andamento.
Aqui fica o resumo pra consulta entre sessões: o que cada card cobre, o que já foi decidido e o que
ficou em aberto.

- Item do `backlog.md` coberto por um card ganhou a marca **(card: Nome)**. Ao concluir um card,
  tirar daqui e do backlog, como qualquer entrega.
- As dúvidas listadas são do card: **perguntar ao usuário** antes de começar, não decidir sozinho.
- Card nenhum foi começado ainda.

## Funcionalidades sociais e de conta

### 1. Adicionar amigos
**Entregue na 1.18.0**, com tela própria em `/amigos` no lugar da gaveta e já com convite pra mesa e bloqueio: [`conceitos/amigos.md`](conceitos/amigos.md).

Convites por nome de usuário (busca exata/prefixo, sem listar todos), aceitar/recusar/cancelar,
desfazer amizade, badge de convites, status online só pra amigos, **gaveta lateral** aberta pelo
header. Tabela `friendships` (`requester_id`, `addressee_id`, `status`). "Online" = atividade
recente (o `last_access_at` grava 1×/hora, não serve sozinho); presença pelo socket.
- LGPD: status online e "visto por último" são dados novos (Política, `conceitos/lgpd.md`), opção
  de ocultar, amizades na exportação e na exclusão.
- Fora: chat, convite pra mesa, bloquear (vão pros cards de mensagens).

### 2. Minha Conta
Acesso visível (avatar do usuário no header com menu), avatar do usuário (reaproveita o
`avatar-customizer`) **ou** foto (Supabase, mesmos formatos da 1.17.6), perfil (bio, estatísticas,
vitrine de personagens), tela em seções Perfil / Conta / Privacidade e dados.
- Hoje o único acesso é o link no rodapé da Home, junto de Privacidade e Termos.
- LGPD: foto/bio/estatísticas públicas são dados novos; foto apagada ao trocar e na exclusão;
  menores de idade (item 9 da adequação); denúncia de foto.
- Dúvidas: foto e avatar juntos ou só um na v1; perfil visível pra amigos ou todos; estatísticas
  aqui ou card próprio; moderação de foto agora.
- Sugestão de quebra: header + reorganização / avatar-foto / perfil com estatísticas.

### 3. Mensagens (chat entre amigos)
Chat 1 para 1 só entre amigos, aberto pela gaveta de amigos; não lidas, histórico paginado,
bloquear, denunciar, rate limit, texto sempre como texto (XSS).
- **Decidido (2026-11-05)**: tempo real por **WebSocket**; criptografia **em trânsito (WSS) e em
  repouso** (AES-256-GCM na api, IV por mensagem, chave só na VPS, versão da chave gravada, conteúdo
  nunca nos logs); **E2E fica fora** (card futuro, se pedido); retenção de **12 meses** com job
  diário; usuário apaga as próprias mensagens (pros dois lados) e a conversa (só pro lado dele);
  exclusão da conta apaga o que ela enviou e o outro lado vê "usuário removido". Ver `decisoes.md`.
- A Política deve dizer "criptografado no servidor", nunca "ponta a ponta"; a equipe só lê
  mensagem **denunciada**.
- Tabelas sugeridas: `conversations`, `messages` (`content_encrypted`, `iv`, `key_version`,
  `read_at`, `deleted_at`), `blocks`, `reports`.
- A sessão já tem socket.io (`session-socket.gateway.ts`): reaproveitar em vez de criar outro.
- Dúvidas: idade mínima pro chat; quem cuida das denúncias e em quanto tempo.

### 4. Sussurros e mensagens na sessão
**Sussurro**: mestre → um ou mais jogadores (só eles veem; jogador pode responder só pro mestre),
atalho no Quadro do Mestre e no card do jogador. **Chat da mesa** (todos, com "fora do
personagem") e **privada entre jogadores** da mesma sessão (não precisa ser amigo).
- Base: socket.io da sessão; o `eventTargetUserId` (teste secreto) hoje aceita **um** alvo — precisa
  de lista de alvos. Histórico pela API ao reconectar; no modo polling, aparece no refetch.
- Mesma criptografia do card 3; mensagens apagadas **com a sessão** ou em 12 meses (o que vier
  primeiro). Tabelas sugeridas `session_messages` (`kind`: table/whisper/private) e
  `session_message_recipients`.
- Painel recolhível com abas Mesa / Sussurros / Privadas, sem cobrir cartas e avisos do combate.
- Dúvidas: mestre vê as privadas entre jogadores (padrão sugerido: não); jogador inicia privada com
  o mestre; mensagens de quem sai da sessão; histórico visível pra quem entra depois.
- Sugestão: fazer **antes** do card 3 (a sessão já tem o socket) e deixar a base reaproveitável.

## Telas

### 5. Melhorar tela de criar nova sessão
Redesenho completo (`session-create`), voltar no topo à esquerda, NPCs com avatar e moldura do card
de personagem, **seleção de monstros** com as cartas de monstro (hoje "Em breve..."; a api já aceita
`monsters` no `POST /api/game-session`, o web manda `[]`), quantidade por monstro, resumo antes de
salvar.
- Sugestões: gerar o código da sessão sozinho (hoje botão GERAR CÓDIGO, `Math.random` no front);
  prévia do nível do encontro; etapas estilo wizard.
- Dúvidas: só catálogo do usuário ou bestiário inteiro; limite de monstros; quantidade nesta
  tarefa; editar nome/jogadores depois.
- **Relacionado**: item "Decidir o papel do catálogo do mestre" (seção Monstros do backlog) — decidir
  junto, porque muda de onde a tela tira os monstros.

### 6. Melhorar tela "Entrar em uma aventura"
Redesenho (`session-join`) usando a **listagem de personagens do desktop** como referência (avatar,
imagem de fundo padrão/customizada, `framed-card`), voltar no topo, campo de código mais marcante
(colar, maiúsculas), manter as mensagens de erro atuais.
- Sugestões: prévia da sessão pelo código (precisa de endpoint novo), entrar por link
  (`/join?code=`).
- Dúvidas: mesmo personagem em duas sessões; prévia visível pra quem tem o código.

### 7. Tutorial guiado com o Tom
3 partes depois do cadastro: **1** criação de personagem (reescrever as falas do Tom pra ensinar),
**2** sessão (criar, pôr o personagem, todas as funcionalidades), **3** catálogo de monstros e
grimório. **4 ilustrações grandes** do Tom (abertura, fim da 1, fim da 2, encerramento).
Spotlight (driver.js ou Shepherd.js, MIT; **não** Intro.js, licença comercial), progresso salvo na
conta (`users.tutorial_progress` ou tabela), refazer depois, convite discreto pra usuários antigos.
O `TomService` de hoje guarda ligado/desligado no `localStorage`.
- Dúvida principal: na parte 2 o usuário seria mestre e jogador ao mesmo tempo — sugestão de
  **sessão de treino** (monstro "Boneco de Palha", apagada no fim).
- Outras: quem faz as ilustrações; incluir funcionalidades ainda em outros cards.
- Sugestão de quebra: motor + abertura + parte 1 / parte 2 / parte 3; ilustrações em paralelo.

### 8. Login com e-mail ou nome de usuário
Campo "E-mail ou nome de usuário"; tem `@` → e-mail, senão `LOWER(username)` (o nome não aceita
`@`). Mesma mensagem de erro em tudo, mesmo tempo de resposta (hash falso), rate limit, conta só
Google com erro genérico, conta sem nome de usuário só por e-mail. Manter `autocomplete="username"`.
- Dúvida: "esqueci minha senha" também aceita o nome de usuário.

## Jogo e regras

### 9. Resistências, imunidades e vulnerabilidades no dano
Defesas dos **monstros** (converter o texto do bestiário em lista estruturada, casos "não mágicos",
"não prateadas"), imunidade 0 / resistência metade / vulnerabilidade dobro, dano com **dois tipos**
calculado por parte, resistências de **magia** (Proteção contra Energia, Pele de Pedra) e de
**itens**, **dano em área** do Quadro do Mestre por alvo, cálculo visível e mestre pode ignorar.
Mantém o que já existe (raça, Fúria, Esquiva Sobrenatural, Evasão).
- Pendente no card: a lista de magias que dão resistência tem um item com "?" — levantar a lista
  certa no `conceitos/magias-mecanicas.md`.
- Dúvidas: jogador vê defesas do monstro revelado; padrão quando não se sabe se a arma é mágica;
  itens nesta tarefa.

### 10. Mecânicas de classe restantes (bloco "Média")
Mestre de Batalha (dados de superioridade no padrão `ChiAbility`, manobras escolhidas como lista,
Implacável, Estudioso da Guerra), Cavaleiro Arcano (Vínculo com Arma), Bruxo (Dádiva do Pacto —
coluna `chosen_pact_boon` já em produção — e Arcana Mística com uso por magia), talentos Resiliente,
Iniciado em Magia e Atleta (FOR ou DES) via `choice_data`. Personagens existentes escolhem depois.
- Dúvidas: manobras com efeito aqui ou no catálogo; arma do pacto como carta própria.
- Fora: catálogos grandes (Invocações Místicas, Metamágica, Manobras com efeito) — cards próprios.

### 11. Automação de traços (o que restou)
Vantagem condicional **automática** quando a rolagem sabe o contexto (magia, ação de monstro, teste
secreto com contexto marcado pelo mestre), lembrete + botão "rolar com vantagem" sem contexto;
**Indomável** só aparece se a resistência falhou quando a CD é conhecida; da seção E: Ataque Extra
(contador), Ação Ardilosa, Forma Selvagem (besta do bestiário), Companheiro Animal, visão no escuro.
- Dúvidas: quais itens da seção E entram de fato; Forma Selvagem com bestiário inteiro ou lista
  curta; companheiro como NPC ou parte do card do ranger.

### 12. Magias com mecânica pendente
Arma Elemental (primeiro efeito que mexe no **bônus de ataque**), Golpe Constritor, Saraivada de
Espinhos, Flecha Relampejante, cura do Toque Vampírico, curas fixas (Cura Completa, Cura Completa
em Massa, Palavra de Poder Curar), Armadura de Agathys, opcionais da fase 1 (Flecha Ácida, Raio de
Bruxa, Raio Adoecente, Orbe Cromática), crítico na ficha isolada, selo de dano com o valor do
personagem, filtro de ritual. Propõe um **motor de efeitos ativos por turno** reaproveitável.
- Os números das magias no card vieram de conhecimento geral: **conferir com as descrições do
  site** (`referencias/magias.txt`) antes de implementar.
- Dúvidas: dano por turno aplicado sozinho ou lembrete; opcionais da fase 1; ritual em coluna ou
  lista no código.

### 13. Avatar: barbas, roupas e chapéus/elmos
Barbas novas (4 cores), roupas fora da classe (masculina e feminina, aba "Da classe" / "Outras"),
**camada nova de chapéu** acima do cabelo (`hat` no `AvatarPreset`, aba CHAPÉU), conflito com
cabelo volumoso e elmo fechado, encaixe em orelhas/chifres/draconato, pele oliva do meio-orc.
Presets antigos sem `hat` continuam funcionando. Folhas geradas pelo usuário no ChatGPT.
- Dúvidas: quais peças na primeira leva; elmo fechado esconde barba/rosto; barba no feminino.
- Fora: rostos (refazer as 18 bases).

### 14. Artes dos monstros mais comuns
As 36 artes das 3 levas de `procedimentos/artes-monstros.md` (gerar é com o usuário) e a entrega no
web. **Levas 1 e 2 (24 artes) publicadas na 1.23.0** (2026-11-12), com a ordem imagem do mestre →
arte do slug → `monster.png` em todos os lugares do monstro. Falta a leva 3: gerar, pôr o WebP em
`src/assets/monsters/` e o slug em `MONSTER_ART_SLUGS`.
- O card tinha uma seção "Monstros antigos" (slug em inglês da dnd5eapi): **tirar**, pela decisão de
  2026-11-05 — esses monstros não recebem adequação.
- Dúvidas: criaturas "de D&D" da leva 3 antes da decisão de direitos autorais; código aqui ou card
  separado depois da leva 1.

## Infra e operação

### 15. Painel de administração e monitoramento
Papel de admin (não existe hoje: `users.is_admin` ou lista na env), `/admin` protegido na API,
log de auditoria, uso (online, sessões em andamento, ativos, cadastros), saúde (versão/commit,
uptime, memória/CPU, Neon, Supabase, e-mail, certificado), `/health` público mínimo além do `/ping`.
Estudo de monitoramento a documentar: uptime externo (UptimeRobot/Better Stack), Sentry, Netdata ou
Grafana Cloud, alertas.
- **LGPD**: a Política diz que o `last_access_at` é só pra contar ativos em números gerais e o
  script nunca lista quem — **listar quem está jogando muda a finalidade** (base legal, Política,
  auditoria). Alternativa v1: só números e sessões sem nomes. Ferramentas externas são operadores
  com transferência internacional (sem dado pessoal nos eventos).
- Dúvidas: quem são os admins; lista nominal na v1; destino dos alertas; orçamento.
- Sugestão de quebra: monitoramento e alertas (rápido) / painel.

### 16. Ambiente de homologação (HML) com deploy via GitHub Actions
Branch `homolog` nos dois repos; API `forja-api-hml` na **mesma VPS** (porta 3001, `/srv/api-hml`,
`/etc/forja-api-hml.env`, `MemoryMax`/`CPUQuota`), `hml-api.forjaarcana.com` com nginx (WebSocket)
e certbot; web `hml.forjaarcana.com` com `environment.hml.ts` e faixa "HOMOLOGAÇÃO"; workflow
`deploy-hml.yml` com chave própria restrita a `forja-deploy-hml`; web passa a ter workflow no
GitHub Actions; GitHub Environments; banco em branch do Neon com **seed** (nunca cópia de produção
sem anonimizar); Supabase, e-mail, Google OAuth, IA e segredos próprios; basic auth e `noindex`;
cookie de HML sem valer em produção.
- Recomendação dada: mesma VPS, site de HML no nginx da VPS.
- Dúvidas: mesma VPS ou separada; site de HML na Hostinger ou na VPS; quem acessa; nome da branch.
- Relacionado: item "Decidir: regra de PR na `main`" (Ações do usuário) entra no fluxo de branches.
