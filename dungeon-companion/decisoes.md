---
resumo: Decisões do usuário sobre regras, escopo e produto — o que já foi decidido e não deve ser reperguntado.
tipo: decisoes
status: ativo
atualizado: 2026-10-20
---

# Dungeon Companion — Decisões

Uma linha por decisão: data, decisão e o doc com o contexto. Consolidado em 2026-10-20 a partir
dos docs de cada área. Decisão nova entra aqui. Se uma decisão for revertida, riscar
(`~~...~~`) e anotar a nova logo abaixo, em vez de apagar.

Regras de processo (testes, versão, banco, LGPD, commit) não ficam aqui: estão nos `CLAUDE.md` e
`.claude/rules/` dos repos.

## Produto e regras do jogo

- **2026-09-10** — Level-up em fases: classe única primeiro, depois subclasse, depois
  multiclasse. HP **rolado** (não média). ASI **ou** talento. Revisão antes de confirmar. Sem IA,
  100% determinístico. → `historico/levelup-plan.md`
- **2026-09-10** — Criação de personagem é sempre nível 1 e classe única; multiclasse só pelo
  level-up, a partir do nível total 2. → `historico/levelup-plan.md`
- **2026-09-10** — O conteúdo de cada classe é confirmado com o usuário classe por classe, contra
  o livro, antes de ser gravado. → `historico/levelup-plan.md`
- **2026-09-12** — Implementar o bloco "Média" da auditoria **exceto deslocamento de voo**.
  → `historico/media-progress.md`
- **2026-09-12** — Recargas que variam por nível (Fonte de Inspiração, Restauração Feiticeira)
  **não são modeladas**: o recurso recarrega em descanso curto ou longo, fixo por classe.
  → `historico/media-progress.md`
- **2026-09-12** — "Recuperar espaços de magia" (Recuperação Arcana/Natural, Mestre Místico)
  rastreia só se o uso já foi gasto; qual espaço volta é manual. → `historico/media-progress.md`
- **2026-10-16** — Mecânica das magias fica **no código** (`spell-mechanics.ts`), não em colunas
  do banco. → `conceitos/magias-mecanicas.md`
- **2026-10-16** — Aplicar dano/cura no alvo é **opcional** e segue as permissões de PV.
  → `conceitos/magias-mecanicas.md`
- **2026-10-16** — Números seguem o **livro traduzido**, mesmo quando diverge do original em
  inglês (ex.: Destruição Banidora 5d6). Erro de impressão óbvio é corrigido (Onda Destrutiva
  5d5 → 5d6). → `historico/spells-progress.md`
- **2026-10-16** — Efeitos ativos (Fúria, Arma Sagrada…) ficam **guardados no personagem** até
  acabar; desligam no fim do combate. → `conceitos/tracos-mecanicos.md`
- **2026-10-16** — Somas de 1×/turno (Ataque Furtivo, Golpe Divino…) são **travadas pela vez do
  combate**. → `conceitos/tracos-mecanicos.md`
- **2026-10-16** — Inspiração Bárdica recebida fica **guardada** no personagem até ser usada.
  → `conceitos/tracos-mecanicos.md`
- **2026-10-16** — Itens iniciais do kit só aparecem no **inventário da sessão** (entram quando o
  personagem entra numa sessão). → diário, "Correções da criação de ficha"
- **2026-10-16** — Riqueza rolada **e** equipamento inicial continuam juntos (regra da mesa,
  diferente do livro). → diário, "Pendências da criação"
- **2026-10-16** — As 5 fichas antigas de Meio-Elfo ficam **sem o +1** (precisaria da escolha do
  jogador). → diário, "Pendências da criação"
- **2026-10-16** — Validação de armadura só na criação; trocar armadura na ficha continua livre.
  → diário, "Correções da criação de ficha"
- **2026-10-21** — Identidade visual mobile (1.3.5): listagens usam **os cards da Home, soltos sobre
  o fundo, sem quadro em volta** (escolhido entre "quadro + cards" e "só quadros da sessão").
  Cabeçalho ← + título igual em todas as telas. ~~Formulários e a tela da sessão mantêm os quadros
  com legenda.~~ → `gotchas.md`, "Web"
- **2026-10-21** — Menu inicial **numa tela só** (1.3.9): SOU JOGADOR / SOU MESTRE à esquerda e as
  opções do escolhido abrem **à direita** (no celular, logo abaixo, em sanfona); sem tela de
  VOLTAR. **Grimório de Magias fora dos papéis** ("PARA TODOS"), porque mestre e jogador usam.
- **2026-10-21** — Sessão desktop (1.3.11): **largura fixa** (1440 px), mas os cards dos aventureiros
  **acompanham a altura** da tela (esticam no quadro; avatar por `vh`); até 6 cabem em 1080p.
  Cards de personagem com **moldura pixel art por tema** (gerada pelo usuário).
- **2026-10-21** — Preparar magia é permitido **até o personagem rolar a iniciativa** (1.3.11) — a
  pergunta "Deseja selecionar suas magias preparadas?" aparece com a luta já criada. Depois de
  rolar, travado. → `conceitos/magias-mecanicas.md` não muda (regra de combate)
- **2026-10-21** — Menu inicial **sem o título "Bem-vindo, aventureiro"** e **cabendo na tela, sem
  rolar** (1.3.10): altura da tela menos o rodapé, logo limitada pela altura, cards compactos.
- **2026-10-21** — Listagens desktop no **tamanho da sessão** (1.3.7): mesmo contêiner e topo da
  sessão, itens em grade de cards. Lista de personagens com avatar, fundo, PV, CA, INI, PP,
  atributos e XP (da ficha calculada de cada um). Sem linha clara (borda padrão de fieldset) em
  volta das opções. Usuário classificou como **melhoria** (1.3.7, não 1.4.0). → `gotchas.md`, "Web"
- **2026-10-21** — Formulários mobile no mesmo padrão (1.3.6): criar sessão, entrar em aventura e
  catalogar monstro **sem quadros** — seções com título, campos e escolhas em cards, botão largo
  no fim. A tela da sessão mantém os quadros. Login/cadastro/senha, wizard e conta ficaram de fora
  (oferecido ao usuário). → `gotchas.md`, "Web"
- **2026-10-21** — Revelar e combate andam juntos nos dois sentidos: entrar na luta revela o
  monstro, e **revelar com combate em andamento coloca o monstro na luta** (como o "+ ADICIONAR";
  1.3.4). Esconder durante o combate **não** tira da luta (oferecido ao usuário, sem pedido).
  → `gotchas.md`, "Sessão em tempo real"
- **2026-10-17** — Jogador aplica dano/cura em qualquer jogador e NPC da sessão, e **dano** em
  monstro **revelado** (não cura monstro). → diário, versão 1.1.1
- **2026-10-18** — Conjuração longa (1 minuto ou mais) em combate é **aviso com confirmação**, não
  trava (o mestre pode liberar). → diário, versão 1.1.3
- **2026-10-20** — Funções do mestre na sessão ficam num **Quadro do Mestre em gaveta lateral**
  (não aba nem modal), entregue em 4 fases na ordem: reorganizar o que existe → rolagens ocultas
  e visão do grupo → descanso do grupo e dano em área → anotações e apagar sessão. As 4 fases
  saíram juntas como **1.2.0**. → `conceitos/quadro-do-mestre.md`
- **2026-10-20** — Quadro do Mestre abre por uma **aba de expandir/recolher à esquerda**, igual no
  desktop e no celular (sem ✕ nem botão no cabeçalho). → `conceitos/quadro-do-mestre.md`
- ~~**2026-10-20** — Dentro da sessão, carregamento é por **skeleton** no formato do conteúdo, não
  pelo overlay do dragão (1.2.3). O dragão continua fora da sessão e na troca de página.~~
- **2026-10-20** — Skeleton no **site todo** (1.3.1): o overlay que bloqueava a tela acabou. Durante
  o carregamento **um** dragão atravessa a tela em altura/sentido/tamanho sorteados, sem bloquear.
  Dentro da sessão o dragão continua desligado (escolha de implementação, oferecida ao usuário
  pra ligar). Cada tema tem o próprio sprite: dragão vermelho (fantasia) e **dracolich** (sombrio),
  gerados pelo usuário. → `gotchas.md`, "Web (Angular)"
- **2026-10-20** — Dois temas de cor: **FANTASIA** (o visual original, padrão) e **SOMBRIO**, com
  base nas cores escolhidas pelo usuário: fundo `#1C0B0B`, painel `#40251A`, destaque `#D8A33E`
  (a primeira proposta, em cinza, ficou "monótona"). As artes de fundo continuam visíveis no
  Sombrio, só um pouco escurecidas (o usuário achou escuro demais com brilho 35%). Troca no botão
  TEMA do rodapé, guardada no navegador. → `gotchas.md`, "Web (Angular)"
- **2026-10-21** — Tela da sessão (1.3.2): nome, mestre, código e jogadores no **topo da página,
  sem quadro**; botões POLLING, EFEITOS e ATUALIZAR **saem da tela** (o mestre mantém polling e
  efeitos no Quadro do Mestre; jogador fica sem os dois — oferecido devolver efeitos em outro
  lugar). No desktop a sessão cabe **numa tela só, sem rolar a página**, com os quadros alinhados
  e rolagem por dentro. Cards dos aventureiros todos do mesmo tamanho. → `gotchas.md`, "Web"
- **2026-10-21** — Barras de rolagem no estilo do tema no site todo. → `gotchas.md`, "Web"
- **2026-10-21** — Sem emojis no site (1.3.3): ícones em **pixel art** gerados pelo usuário no
  ChatGPT (duas folhas 4×4), inclusive refazendo AÇÕES/FICHA/ITENS no mesmo estilo. Símbolos da
  fonte (✕ ← → ▶ ▲ ▼ ✓ ★ ✎ ✦ ✚ ↻) continuam como texto. → `gotchas.md`, "Web"
- **2026-10-20** — Bruxo recupera os espaços de Magia de Pacto no descanso curto (correção pedida
  junto com o Quadro do Mestre). → `conceitos/quadro-do-mestre.md`

## Privacidade e segurança

- **2026-10-14** — Dados ficam até o usuário excluir a conta (sem expiração de conta inativa).
  → `conceitos/lgpd.md`
- **2026-10-14** — Riscos aceitos: enumeração de e-mail e revogação de JWT. → `conceitos/lgpd.md`
- **2026-10-14** — Troca de e-mail da conta continua por e-mail (não pela página `/conta`).
  → `conceitos/lgpd.md`
- **2026-10-14** — A IA (Anthropic/OpenAI) está **desativada**. Reativar conta como terceiro novo
  (atualizar a Política). → `conceitos/lgpd.md`
- **2026-10-15** — Sem banner de cookies enquanto só existir o cookie de autenticação e
  preferências locais; analytics/pixel passa a exigir banner. → `conceitos/lgpd.md`
- **2026-10-16** — Versionamento: subir **A** só por decisão do usuário. → regra
  `versionamento.md` do web

## Como trabalhar

- **2026-09-05** — O usuário testa a UI ele mesmo; não abrir browser/Playwright pra verificar.
  Checagens baratas (build, lint, testes unitários) continuam.
- Commit e push **só com pedido explícito a cada vez**, mesmo depois de várias aprovações
  seguidas.
