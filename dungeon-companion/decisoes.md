---
resumo: Decisões do usuário sobre regras, escopo e produto — o que já foi decidido e não deve ser reperguntado.
tipo: decisoes
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Decisões

Uma linha por decisão: data, decisão e o doc com o contexto. Consolidado em 2026-10-20 a partir
dos docs de cada área. Decisão nova entra aqui. Se uma decisão for revertida, riscar
(`~~...~~`) e anotar a nova logo abaixo, em vez de apagar.

Regras de processo (testes, versão, banco, LGPD, commit) não ficam aqui: estão nos `CLAUDE.md` e
`.claude/rules/` dos repos.

## Produto e regras do jogo

- **2026-10-31** — Dano da magia num **selo na arte** da carta (não numa linha do pergaminho).
  Catálogo e criação de ficha mostram o valor base do livro; ficha e mesa, o do personagem. As 26
  magias de dano sem mecânica ganham o dano só pra exibir; cura também aparece. → `conceitos/cartas.md`

- **2026-10-30** — Grimório de magias com o layout do catalogar monstros. Filtros principais:
  círculo, escola e classe; secundários: função (efeito da magia), elemento e alcance. Lista de
  funções e elementos aprovada pelo usuário; a classificação das 361 magias fica no código
  (`spell-tags.ts`), não no banco, e é feita à mão. → `conceitos/cartas.md`

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
- **2026-10-21** — Ficha de personagem no padrão visual (1.3.14). **Celular**: cabeçalho ← +
  "FICHA", card do personagem com a moldura dos cards da sessão e a **imagem de fundo dentro do
  card** (não mais na página inteira; oferecido voltar), conteúdo em seções/cards/caixas do padrão
  `.m-*`, tocar na perícia rola o teste. **Abas em linhas de 4, sem rolar pro lado** (o usuário
  achou arrastar pouco intuitivo). **Desktop**: topo das listagens (← VOLTAR + nome grande), card
  com moldura reunindo retrato, PV, CA, iniciativa, movimento, bônus de proficiência, percepção
  passiva e XP; ROLAR DADO e IMPRIMIR na linha das abas; sem o VOLTAR do rodapé; quadros
  (fieldset) da sessão mantidos. **Truques e círculos de magia começam fechados.** Usuário
  classificou como melhoria (C). → `gotchas.md`, "Web"
- **2026-10-21** — Dinheiro da ficha fica **no card do personagem** (1.3.15), junto do PV e da XP,
  com edição no lugar (celular: linha abaixo do PV; desktop: coluna da experiência). Saiu da aba
  ARMAS / quadro de equipamento. Oferecido pôr junto do equipamento (✎ da CA) se preferir.
- **2026-10-21** — Menu inicial **numa tela só** (1.3.9): SOU JOGADOR / SOU MESTRE à esquerda e as
  opções do escolhido abrem **à direita** (no celular, logo abaixo, em sanfona); sem tela de
  VOLTAR. **Grimório de Magias fora dos papéis** ("PARA TODOS"), porque mestre e jogador usam.
- **2026-10-21** — Sessão desktop (1.3.11): **largura fixa** (1440 px), mas os cards dos aventureiros
  **acompanham a altura** da tela (esticam no quadro; avatar por `vh`); até 6 cabem em 1080p.
  Cards de personagem com **moldura pixel art por tema** (gerada pelo usuário).
- **2026-10-21** — Avisos em tela cheia da sessão com **moldura por tema** (1.3.13); a **troca de
  vez mostra o card inteiro** do personagem (como na sessão), não só o avatar; monstro só com imagem
  e nome (jogador não vê PV de monstro).
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
- ~~**2026-10-20** — Quadro do Mestre abre por uma **aba de expandir/recolher à esquerda**, igual no
  desktop e no celular (sem ✕ nem botão no cabeçalho).~~ Mudou no celular na 1.3.16 e no desktop
  na 1.3.17 (abaixo): gaveta de baixo nos dois. → `conceitos/quadro-do-mestre.md`
- **2026-10-21** — Sessão no celular (1.3.16): **Quadro do Mestre como gaveta de baixo**, aberta por
  uma barra larga **fixa na base** da tela (fica à vista rolando a página); o jogador ganha a
  gaveta **AÇÕES DE PERSONAGEM** no mesmo formato (ações, finalizar/atrasar, ficha, itens), e esses
  botões saem do card dele (o mestre mantém os botões nos cards). Botões das duas gavetas maiores.
  **TEMA/SAIR no topo da página e sem ficar fixo** (só na sessão no celular). **Quadros vazios não
  aparecem** (combate sem luta, NPCs, monstros, rolagens) e **rolagens começam recolhidas**.
  Escolhas minhas, oferecidas ao usuário: AVENTUREIROS continua visível mesmo vazio; rodapé no
  topo só na sessão; versão como melhoria (1.3.16, não 1.4.0). → `conceitos/quadro-do-mestre.md`
- **2026-10-21** — Gavetas também no desktop (1.3.17): Quadro do Mestre e AÇÕES DE PERSONAGEM pela
  **mesma gaveta de baixo do celular** (a gaveta lateral do mestre acabou), **na largura dos quadros
  da sessão** (não a tela toda) e acima do rodapé. No desktop o jogador também perde os botões do
  próprio card. **Modais de ações e de inventário abrem como gaveta** (celular e desktop). A barra
  recolhida precisa **parecer clicável**: puxador, seta animada e "TOQUE PARA ABRIR". O rodapé no
  desktop continua embaixo. Versão como melhoria (1.3.17). → `conceitos/quadro-do-mestre.md`
- **2026-10-21** — Barra das gavetas **sem a alça (puxador)** em cima (1.3.19, "não curti"); ficam a
  seta animada e o "TOQUE PARA ABRIR". → `conceitos/quadro-do-mestre.md`
- **2026-10-21** — **Magias em cartas** de card game (1.4.0, funcionalidade nova): moldura por tema e
  ilustração **por escola** (não por magia), geradas pelo usuário no ChatGPT, sem texto na imagem (o
  site escreve). Cartas no grimório da sessão (com botão **CARTAS | LISTA**, sem guardar a escolha),
  no Grimório de Magias e na **ficha também em grade**. Os detalhes de magia viraram **carta em tela
  cheia**. Na sessão, preservar a leitura: carta mini legível, botões embaixo da carta. Originais PNG
  **no repositório de docs**, só o script no web. → `conceitos/cartas.md`
- **2026-10-21** — **Cartas de arma**: **uma arte por arma** (não por grupo), 37 + desarmado, em 3
  folhas no ChatGPT; mesma moldura das magias. Implementar depois das magias. → `conceitos/cartas.md`
- **2026-10-22** — **Lançamento de magia com aviso único** (1.5.0): a mesa só vê no fim da atuação de
  quem lança — ataque e depois o dano **no mesmo aviso**, ou direto o dano, ou direto as cartas sem
  dados; card do personagem + carta com **animação de carta real** (jogada e virando) + rolagens.
  Quem lança vê o mesmo que a mesa e, embaixo, as próprias decisões. **Só magias** (não habilidades
  de classe; armas quando houver as cartas de arma). Aviso some **8 s** depois do fim; magia de
  resistência **só mostra a CD** (o mestre resolve, como antes). Versão 1.5.0. Na carta em tela cheia,
  valores longos sem corte e descrição expansível (LER TUDO). → `conceitos/cartas.md`
- **2026-10-22** — **Armas em cartas** (1.6.0, funcionalidade nova): mesma carta das magias, arte por
  arma, ATACAR embaixo de cada carta na gaveta de ações e na ficha, tela cheia no lugar do modal da
  arma. Categoria simples/marcial guardada no web pelo nome (escolha minha, sem coluna nova no
  banco). → `conceitos/cartas.md`
- **2026-10-22** — **Ataque com arma no aviso da mesa** (1.6.1, melhoria): mesmo aviso único do
  lançamento de magia, com a carta da arma. Habilidades de classe continuam fora (opcional no
  backlog). → `conceitos/cartas.md`
- **2026-10-22** — **Quadro do Mestre por ordem de uso** (1.6.6): o que o mestre mais usa no jogo
  aparece primeiro; e um **GRIMÓRIO com todas as magias e busca** no quadro (como o das ações, mas
  com o catálogo inteiro). Ordem escolhida por mim (combate, dados e magias, grupo, área, cena,
  rolagens ocultas, depois organização). → `conceitos/quadro-do-mestre.md`
- **2026-10-22** — **Baralho e mão** na gaveta de ações (1.6.5): armas e magias prontas como
  baralhos; tocar abre a mão em tela cheia, em carrossel, como a "mão" de card games (Yu-Gi-Oh).
  Clique fora de botão/carta fecha a mão. Botões ATACAR/LANÇAR da mão com mais impacto visual.
  Escolhas minhas: magias da mão = prontas (truques + preparadas), sem PREPARAR na mão; ficha
  continua em grade. → `conceitos/cartas.md`
- **2026-10-22** — **Tom fora da sessão no celular** (1.6.4); no desktop continua. As reações seguem
  calculadas (`tomState`), só não são desenhadas (`@if (!isMobile() && …)` no session-panel).
- **2026-10-22** — No aviso de magia/ataque a carta aparece **primeiro virada pra baixo** e vira; o
  resultado das rolagens ganha **mais impacto visual** (1.6.2: dados rolando, total grande com
  clarão, carimbo, tremida no dano). → `conceitos/cartas.md`
- **2026-10-21** — TEMA/SAIR **no topo de todas as telas, no celular e no desktop** (1.3.18; antes
  só na sessão do celular), rolando com a página. Substitui o "rodapé no topo só na sessão" da
  1.3.16 e o "rodapé no desktop continua embaixo" da 1.3.17. → `gotchas.md`, "Web"
- **2026-10-21** — Gaveta de ações (1.3.18): **sem a tela intermediária** — a barra AÇÕES DE
  PERSONAGEM abre direto as ações, com as **informações e ações principais em destaque** no topo
  (PV, CA, CD/ATQ de magia, dados de vida; finalizar/atrasar, rolar dado, ficha, itens). Nada pode
  **mudar de lugar** ao abrir uma magia ou habilidade (colunas fixas: combate | magias | testes e
  descanso). Magias num **GRIMÓRIO próprio** (segunda tela da gaveta), com abas por círculo, cards
  maiores, lançar e preparar; **card inteiro abre a descrição**; card que dá pra preparar **não
  pode parecer bloqueado**, e o PREPARAR reage ao mouse quando dá pra preparar; cards no **estilo
  das linhas de resistência/perícia/arma**. **Navegação de volta** às ações a partir do grimório,
  da rolagem e da ficha. Escolha minha, oferecida: depois de executar uma rolagem a gaveta fecha
  (pra mostrar o resultado), como antes. → `conceitos/quadro-do-mestre.md`
- ~~**2026-10-20** — Dentro da sessão, carregamento é por **skeleton** no formato do conteúdo, não
  pelo overlay do dragão (1.2.3). O dragão continua fora da sessão e na troca de página.~~
- **2026-10-20** — Skeleton no **site todo** (1.3.1): o overlay que bloqueava a tela acabou. Durante
  o carregamento **um** dragão atravessa a tela em altura/sentido/tamanho sorteados, sem bloquear.
  Dentro da sessão o dragão continua desligado (escolha de implementação, oferecida ao usuário
  pra ligar). Cada tema tem o próprio sprite: dragão vermelho (fantasia) e **dracolich** (sombrio),
  gerados pelo usuário. → `gotchas.md`, "Web (Angular)"
- **2026-10-20** — Dois temas de cor: **FANTASIA** (o visual original, ~~padrão~~) e **SOMBRIO**, com
  base nas cores escolhidas pelo usuário: fundo `#1C0B0B`, painel `#40251A`, destaque `#D8A33E`
  (a primeira proposta, em cinza, ficou "monótona"). As artes de fundo continuam visíveis no
  Sombrio, só um pouco escurecidas (o usuário achou escuro demais com brilho 35%). Troca no botão
  TEMA do rodapé, guardada no navegador. → `gotchas.md`, "Web (Angular)"
- **2026-10-22** — O **SOMBRIO é o tema padrão** (1.7.5); quem já tinha escolhido o FANTASIA
  continua nele. → `gotchas.md`, "Web (Angular)"
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
- **2026-10-22** — Criação de personagem com barra de progresso e as cartas de magia/arma nas
  etapas de escolha; no celular, em painéis no padrão do site (1.6.7–1.6.8).
- **2026-10-22** — O Tom (assistente da criação) tem OK pra fechar a fala e um botão pra desativar
  a ajuda, lembrado no navegador (1.6.8). → `conceitos/lgpd.md`
- **2026-10-22** — Personalizador de avatar sem lista de seleção: abas com miniaturas, mantendo o
  estilo do site (1.6.9). Novas opções de avatar vêm de folhas que o usuário gera no ChatGPT;
  ordem combinada: cabelos (feito) → barbas → roupas → chapéus → rostos. → `conceitos/avatar.md`
- **2026-10-22** — Cor de pele muda só a pele (não escurecer olhos/boca) e cada raça tem tons da
  sua lore: elfo lunar/drow, anão e gnomo cinza-pedra, meio-orc verde/cinza, tiefling
  vermelho/carmesim/roxo/azul, draconato nas 10 linhagens de dragão (1.6.10). → `conceitos/avatar.md`
- **2026-10-22** — Ranking **global** (todos os usuários veem), com avatar e nome do personagem, o
  **nome de jogador da mesa** (não o nome da conta, que pode vir do Google) e o nome da sessão;
  sair do ranking em /conta (1.7.0). → `conceitos/ranking.md`
- **2026-10-22** — Dano e cura **rolados** contam no ranking mesmo sem aplicar no alvo ("passou do
  teste de ataque, pode contar"); golpe final e dano sofrido continuam no aplicado. → `conceitos/ranking.md`
- **2026-10-22** — Ranking em **lista** (1º ao 10º), sem pódio (1.7.1). → `conceitos/ranking.md`
- **2026-10-22** — Dano/cura aplicado dentro de um lançamento aparece **no aviso do lançamento**, sem
  o aviso "APLICOU" por cima (1.7.1). → `conceitos/cartas.md`
- **2026-10-22** — DANO/CURA no próprio PV saiu do card e foi pra **gaveta de ações**; o mestre
  continua com os dos cards. Nível do card virou **barra de XP** (dourada ao poder subir), e card,
  avisos e toasts ganharam molduras (anel do avatar, barras) geradas pelo usuário (1.7.1).
  → `conceitos/molduras.md`
- **2026-10-22** — Lançamento **sincronizado**: o aviso aparece ao mesmo tempo pra todos e os dados
  são revelados no mesmo instante; a rolagem (vantagem, acertou?, dano, aplicar) fica dentro do
  aviso **só pra quem lança**, sem título nem dados repetidos; errou → o aviso se quebra; concluiu
  → saída de vitória (1.7.2). → `conceitos/cartas.md`
- **2026-10-22** — Títulos dos avisos (rolagem, monstro derrotado/revelado) no dourado do tema, não
  no vermelho escuro (1.7.2).
- **2026-10-22** — DANO/CURA no próprio PV pela gaveta toca a animação e fecha a gaveta; botões
  CURA TOTAL e DANO TOTAL (1.7.3). → `conceitos/molduras.md`
- **2026-10-22** — Na vez do jogador a gaveta de ações abre sozinha, com foco nas ações de turno
  mas tudo liberado; a barra de XP brilhando leva à subida de nível (só o dono); avatar com anel
  nas barras das gavetas, mestre com a imagem padrão (1.7.4). → `conceitos/molduras.md`
- **2026-10-24** — Tela inicial: o texto pra visitante não cita D&D 5e ("RPG de fantasia",
  "calculados automaticamente"); o aviso de marca do item 7 dos Termos fica até nova decisão.
  → `conceitos/tela-inicial.md`
- **2026-10-24** — Tela inicial: barra do topo sempre visível ao rolar, com ENTRAR e CRIAR CONTA
  como botões (o usuário recusou menu suspenso); logo maior e logo grande na abertura; Tom maior.
  → `conceitos/tela-inicial.md`
- **2026-10-24** — Card de exemplo da tela inicial igual ao da mesa (anel do avatar, XP em cima e
  vida embaixo), com **Gorak Dente-Solto**, bárbaro meio-orc sem cabelo e barba, pele do desenho
  original; Tom espelhado à direita do card com o balão. A cópia do Quadro do Mestre real na tela
  inicial foi descartada. → `conceitos/tela-inicial.md`
- **2026-10-24** — SAIR leva pro **login**, não pra tela inicial (como era na 1.8.0) (1.8.2).
  → `conceitos/tela-inicial.md`
- **2026-10-24** — Moldura nova dos cards no tema SOMBRIO (caveiras e dourado, arte do usuário);
  o FANTASIA continua com a dele (1.8.3). → `conceitos/molduras.md`
- **2026-10-24** — Fundo padrão do card do personagem (parede de masmorra com tochas), o mesmo nos
  dois temas, pra quem não tem imagem própria. → `conceitos/molduras.md`
- **2026-10-24** — **Nome de usuário** único no lugar do nome do herói (cadastro) e dos nomes de
  jogador/mestre digitados na sessão: letras sem acento, números, `_` e `-`, 3–20 caracteres, único
  sem diferenciar maiúsculas, com sugestões quando em uso. Mesa (jogador e mestre) e ranking mostram
  o nome de usuário; dá pra trocar em Minha Conta. Contas antigas e do Google escolhem no próximo
  acesso (não é gerado automaticamente). (1.9.0) → `conceitos/nome-de-usuario.md`
- **2026-10-24** — Monstros do livro em **tabela de referência própria** (`monster`), não em
  `monster_catalog` com `user_id` nulo; `monster_catalog` continua sendo o bestiário de cada
  mestre. Depois, a dnd5eapi sai e as ações de monstro viram mecânicas na sessão (só o mestre
  controla). → `conceitos/monstros.md`
- **2026-10-24** — Quando o Manual dos Monstros em português diverge do original (habilidade que
  falta, número errado), **vale o original**; o texto fica em português. → `conceitos/monstros.md`
- **2026-10-25** — Ações de monstro mecânicas em **três fases** (rolar e aplicar; usos e vez do
  monstro; lendárias, reações e covil), **todas antes do commit**, numa versão só (1.11.0). Monstro
  antigo da dnd5eapi fica só em texto, com aviso pra catalogar de novo. → `conceitos/monstros.md`
- **2026-10-25** — Monstro escondido rola **oculto por padrão**; revelado, público; o mestre troca
  em cada rolagem. → `conceitos/monstros.md`
- **2026-10-25** — **Carta do monstro** no aviso de revelação (no estilo do lançamento, carta maior,
  mesmo verso das cartas), no painel de combate e explodindo na derrota. A carta mostra **só tipo e
  tamanho** (medalhão "?"), sem números de combate, porque vai pra mesa inteira. → `conceitos/cartas.md`
- **2026-10-25** — Descrição (lore) dos **428** monstros, **inspirada no livro mas com texto
  próprio**. → `conceitos/monstros.md`
- **2026-10-25** — Imagem padrão de monstro nova (cena com vários monstros, arte do usuário) **no
  site todo**, não só na carta. Aviso de revelação fica **30 s** (pra ler a descrição) e o de
  derrota 8 s. → `conceitos/cartas.md`
- **2026-10-25** — Review do PR #7 (login/cadastro): bloqueiam o merge o **envio duplo** no login e o
  **preenchimento automático** de senha; ficam também SCSS duplicado, canto decorativo fixo, versão
  só no web, notas sem o cadastro e `autofocus`. Os pontos de **layout** (cadastro no celular
  baixo, botão do Google em 320 px) foram testados no iPhone SE e **dispensados**, e o da animação
  sem movimento reduzido também ficou de fora. Sugestão: entrar com e-mail **ou** nome de usuário.
  → `backlog.md`
- **2026-10-25** — E-mail de recuperação de senha enviado por um **script PHP no próprio site**
  (Hostinger, mesmo servidor do e-mail), chamado pela api por HTTPS com assinatura — e não pelo
  plano pago do Render nem por um serviço de e-mail por API (terceiro novo). → `conceitos/email.md`

- **2026-10-25** — Ação do monstro na **tela de lançamento**, com a carta do monstro agindo e a
  **carta da ação com os números** (ataque, dano, CD — os dados já mostram). Rolagem de monstro
  **escondido fica só com o mestre**: nada vai pra mesa. → `conceitos/monstros.md`
- **2026-10-25** — Monstros revelados num **carrossel** no painel de combate, que vai pro monstro
  da vez; carta do monstro também na **troca de vez**; a carta do monstro **sempre com a
  descrição**. → `conceitos/cartas.md`
- **2026-10-25** — Ficha do monstro na **gaveta de baixo**, no visual da gaveta dos personagens, no
  lugar do modal; o mestre abre tocando na carta do monstro; na gaveta, revelar/esconder e
  derrotar. → `conceitos/monstros.md`

- **2026-10-26** — Cards de NPC e de monstro da mesa com as **molduras dos cards dos personagens**
  (moldura, anel, barra de vida), **fundo próprio** (taverna pros NPCs, covil pros monstros) e os
  mesmos **botões com ícone e legenda**. → `conceitos/molduras.md`
- **2026-10-26** — Ações do monstro como **cartas** na gaveta (baralho que abre a mão), como as
  armas dos jogadores. → `conceitos/monstros.md`
- **2026-10-26** — Carta do monstro com **moldura própria** no SOMBRIO, com uma caveira **no lugar
  do medalhão** (o "?" não era necessário); a carta da ação continua com a moldura comum
  (medalhão do bônus/CD). → `conceitos/cartas.md`
- **2026-10-26** — Fundo por tema na tela de lançamento e nos avisos (altar no SOMBRIO, tapete no
  FANTASIA), **retrato no celular e quadrado no desktop**; nos avisos de rolagem, habilidade e
  nível, só quando o personagem não tem foto. → `conceitos/cartas.md`
- **2026-10-26** — Ao aplicar dano/cura (rolagem e dano em área), **só monstros revelados**, também
  pro mestre (antes o mestre via todos). → `conceitos/monstros.md`

- **2026-10-27** — No login e no cadastro, o **e-mail** é o identificador pro gerenciador de senhas
  (`autocomplete="username"` no campo de e-mail das duas telas; o nome de usuário do cadastro é
  `nickname`). Entrar com o nome de usuário fica como opcional no backlog. → `conceitos/nome-de-usuario.md`
- **2026-10-27** — Fichas antigas da **dnd5eapi** deixam de ser usadas: só os monstros do nosso
  bestiário (tabela `monster`). O tratamento delas no web ficou **comentado**, não apagado.
  → `conceitos/monstros.md`
- **2026-10-27** — Bestiário (catálogo do mestre) e tela de catalogar em **cartas**, 8 por página,
  com filtros (nome, faixa de ND, tipo, tamanho, lendários, voadores, ordenação); no celular os
  filtros recolhem. Detalhe e ficha de catalogar com a cara da gaveta do monstro, ações em cartas.
  Monstro de **ND 5+** brilha em **vermelho** com o selo **PERIGOSO**. → `conceitos/monstros.md`
- **2026-10-27** — O Tom perde a **estrela de 6 pontas** do avental (avental liso), nas 9 poses.
  → `procedimentos/artes-tom.md`
- **2026-10-28** — XP de monstro **só no fim do combate**: derrotar não abre mais a distribuição;
  o XP dos derrotados no combate acumula e, ao encerrar, o mestre vê o total e **escolhe** se
  distribui (opcional). Monstro que chega a **0 PV** gera uma pergunta ao mestre se foi
  derrotado. → `conceitos/monstros.md`
- **2026-10-28** — Encerrar combate com monstros ainda nele **pergunta de cada um** se foi
  derrotado (sim = fluxo normal de derrota) antes da pergunta do XP. Rolou pela ficha (mestre ou
  jogador), a **gaveta fecha**; no **multiataque**, os ataques vão em sequência na tela de
  lançamento com o selo "MULTIATAQUE k/N" pra mesa, e a ficha fecha no último. → `conceitos/monstros.md`

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
- **2026-10-24** — Nome de exibição (`users.full_name`) deixou de ser coletado e foi **apagado** em
  produção (41 contas); o nome da conta Google não é mais guardado. → `conceitos/nome-de-usuario.md`
- **2026-10-16** — Versionamento: subir **A** só por decisão do usuário. → regra
  `versionamento.md` do web

## Como trabalhar

- **2026-09-05** — O usuário testa a UI ele mesmo; não abrir browser/Playwright pra verificar.
  Checagens baratas (build, lint, testes unitários) continuam.
- Commit e push **só com pedido explícito a cada vez**, mesmo depois de várias aprovações
  seguidas.
- **2026-10-25** — Configuração do Claude por máquina (pasta dos repositórios, pasta dos docs,
  identidade dos commits e conta do `gh` da skill `/abrir-prs`) fica em
  `~/.claude/dungeon-companion.env`, fora do git; nada fixo no hook, na skill nem nos scripts.
  → `claude-setup/LEIA-ME.md`
- **2026-10-31** — A api sai do Render grátis (servidor dormindo) pra uma **VPS KVM 1 da
  Hostinger** (24 meses), em vez do Render pago (US$ 7/mês) ou da AWS (R$ 70–275/mês): mesmo
  fornecedor e domínio do site, 4 GB, SMTP liberado; o usuário aceita cuidar do servidor e quis
  aprender fazendo. Ubuntu 26.04, Node pelo NodeSource (não nvm), systemd (não pm2), sem Docker,
  sem backup diário pago e sem o scanner Monarx. → `conceitos/infraestrutura.md`
- **2026-10-31** — A migração entrou na mesma versão (1.17.1) da correção das três magias, que
  ainda não tinha commit. → `estado-atual.md`
- **2026-10-31** — As `SMTP_*` ficam no `/etc/forja-api.env`: o usuário quer voltar o envio de
  e-mail pra api, agora que a VPS não bloqueia SMTP (substituirá a decisão de 2026-10-25 quando
  for feito). → `backlog.md`
