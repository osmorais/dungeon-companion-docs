---
resumo: Armadilhas técnicas do Dungeon Companion que já custaram tempo — conferir antes de mexer na área.
tipo: gotchas
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Gotchas

Armadilhas por área. As que valem em quase toda tarefa estão nos `CLAUDE.md` dos repos, e aqui
só aparece o ponteiro. Consolidado em 2026-10-20 a partir do diário e dos docs de progresso.

## API (LoopBack)

- **Injeção de dependência** (também no `CLAUDE.md` da api): quatro services são registrados à
  mão em `application.ts` com `this.service(Cls, 'services.Cls')`: `AiAgentService`,
  `CharacterSheetService`, `CharacterOptionsService` e `GameSessionService`. O booter também
  registra tudo que está em `services/`, então essas quatro classes ficam com **dois bindings**.
  `@service(Cls)` procura o binding pela classe e quebra com binding duplicado. Por isso esses
  quatro são injetados com `@inject('services.NomeDaClasse')` (chave literal). Os demais services
  só têm o binding do booter e usam `@service(Cls)`. Service novo: não registrar à mão, usar
  `@service()`. **Os testes unitários não pegam o erro** (constroem o service com `new`): a api só
  quebra ao subir. Na 1.2.0 o `GameSessionService` recebeu o `CharacterSheetService` com
  `@service` e só foi pego na revisão antes do deploy. Pra conferir, subir a app e resolver o
  binding: `app.boot()` + `app.get('services.GameSessionService')` (não precisa de requisição).
- **`@types/multer`** falha em build limpo no Render (não localmente). Solução: `declare module
  'multer'` em `src/types/multer.ts` (`.ts`, não `.d.ts`: o `tsconfig` exclui `**/*.d.ts`) +
  interface `MulterFile` local no controller.
- **Pedidos de teste secreto** ficam em memória (`services/secret-roll-requests.ts`, 30 min):
  reiniciar o servidor descarta os pendentes.
- **Erro de validação usa 422, não 401**: 401 fora de `/auth/` desloga o usuário no frontend.
- **bcrypt (custo 12) em teste unitário estoura o timeout de 2 s** quando a máquina está carregada
  (~1 s por hash): testes que passam por `signup`/`resetPassword` fazem
  `sinon.stub(service, 'hashPassword').resolves('hash')` (`auth.service.unit.ts`, 1.9.0).
- **`npm run test:unit | grep passing && git commit` commita com teste falhando**: o `&&` olha o
  status do `grep`, não do mocha (aconteceu na 1.9.0 — a api subiu com um teste instável). Conferir
  o código de saída do próprio comando de teste (`if npm run test:unit > log; then …`).

## Banco

- **postgres.js: `${sql(keys)}` logo depois de `INSERT INTO tabela (...,`** vira lista de **valores**
  (`UNDEFINED_VALUE`), não de colunas. Montar as colunas uma a uma (`keys.map(k => sql\`${sql(k)}\`)`
  juntadas). Os testes unitários (banco simulado) não pegam: testar a SQL nova no banco real numa
  transação desfeita (achado no ranking, 1.7.0; `GameSessionRepository.bumpStats`).

- `docs/database/database.sql` e `database_inserts.sql` usam **CRLF**: editar preservando (não
  usar `sed -i`; em Python, `open(p, newline='')` na leitura **e** na escrita — o `open()` padrão
  converte o arquivo inteiro pra LF e o diff vira 700+ linhas). Regra completa: `.claude/rules/banco-de-dados.md` da api.
- Migração que o código novo lê **roda antes do deploy da api**, senão a api nova quebra ao subir.
- A tabela `spell` tem uma coluna `damage` (preenchida em 114 das 361) que a API **não usa**: a
  mecânica está em `spell-mechanics.ts`.
- `character_level_history.choice_data` (JSONB) é o mecanismo genérico de escolhas do level-up
  (primeiro consumidor: talento Habilidoso).

## Web (Angular)

- **`clip-path: polygon(...)` precisa de vírgula entre os pontos** (`0% 0%, 30% 0%, …`): sem vírgula
  o navegador ignora em silêncio e o elemento fica inteiro — os cacos da quebra (1.7.2) viraram
  painéis inteiros girando. Há teste do formato em `cast-shatter.component.spec.ts`.
- **Modificador de classe declarado antes da classe base perde** (mesma especificidade, vale a
  ordem): `.roll-modal--cast` ficava atrás do `.roll-modal` — usar `.roll-modal.roll-modal--cast`.

- **Molduras de barra por imagem** (1.7.1): o começo do trilho fica sob os enfeites da moldura, então
  valor pequeno some (1 PV de 47) — o preenchimento tem mínimo de 7% (`FRAME_BAR_MIN_FILL`). E o
  mixin `frame-bar.geometry` estiliza `.xp-bar .fb-medal` (2 classes): regra de cor do medalhão com
  1 classe perde — escrever `.xp-bar .xp-level--filled`.

- **Avatar — cor de pele não pode ser filtro CSS** (corrigido na 1.6.10): `filter: brightness()`
  na imagem do corpo escurece tudo, inclusive o branco dos olhos. O corpo vem de
  `assets/avatar/race_skin/`, recolorido só nos pixels de pele. Tom novo = regerar com
  `scripts/avatar/skin.py`. Detalhes em [`conceitos/avatar.md`](conceitos/avatar.md).
- **Avatar — folhas do ChatGPT**: não vêm em grade de 64×64 nem com fundo transparente limpo
  (brilho semitransparente), cada peça sai numa escala diferente e às vezes com couro cabeludo
  em cor de pele (que não acompanha o tom escolhido). Recortar por componente com alfa > 128,
  tirar a pele, encaixar caixa a caixa conferindo numa prévia sobre a base, e gerar as cores pela
  paleta dos arquivos que já existem.

- **Orçamento de SCSS** (também no `CLAUDE.md` do web): `anyComponentStyle.maximumError` está em
  32 kB por causa do `session-panel.component.scss` (compilado ~29,1 kB na 1.3.16; o orçamento olha
  o CSS compilado, não o arquivo-fonte). Componente novo da sessão ganha
  SCSS próprio. Keyframes e classes compartilhadas vão pro `styles.scss` global.
- **Prettier**: `session-panel.component.ts/html/scss` têm débito antigo. Antes de formatar,
  confirmar com `git stash` se o aviso já existia (também no `CLAUDE.md`).
- **Temas de cor** (1.3.0): `ThemeService` põe `data-theme` (`fantasia` | `sombrio`) no `<html>` e
  guarda em `localStorage` (`dc.theme`). Padrão **sombrio** desde a 1.7.5: só fica no fantasia
  quem gravou `fantasia`, e o `index.html` já nasce com `data-theme="sombrio"` (sem piscar o
  fantasia; quem escolheu fantasia pode ver um instante do sombrio — evitar exigiria script inline
  no `index.html`). `styles.scss` tem o `:root` (fantasia) e o
  `:root[data-theme='sombrio']`, que só troca variáveis. **Cor nova de interface usa variável**
  (`--bg-color`, `--panel-bg`, `--accent-color`, `--border-color`, `--btn-color(-hover)`,
  `--label-title-color`, `--text-color`, `--text-soft`, `--sheet-label-color`, `--gold-color`) —
  hex fixo não muda com o tema. Ficam fixas de propósito: efeitos de tela cheia (dano, magia,
  modal-burst), cores com significado (vermelho de erro, verde de cura, barra de PV) e as cores
  de avatar.
- **Rodapé no topo** (1.3.18): TEMA/SAIR é `position: absolute; top: 0` no `app.ts` (rola com a
  página) com altura `--footer-height` (40px, no `:root`); o `body` reserva com `padding-top`.
  Tela de altura fixa (Home, sessão desktop) desconta `var(--footer-height)`, não mais 48px.
  `absolute` e não estático: com `body` flex centralizado, um rodapé no fluxo descia junto com o
  conteúdo centralizado.
- **Sessão desktop em página única** (1.3.2): `.container` tem `height: calc(100vh -
  var(--footer-height))` (rodapé global no topo desde a 1.3.18) e é coluna flex: topo
  (`.session-topbar`) + `.layout` com `flex: 1; min-height: 0`. Os quadros laterais são
  `absolute; top: 0; bottom: 0` do `.layout` — por isso o espaço de baixo fica no padding do
  `.container`, nunca no `.layout` (senão eles passam da base do quadro do meio). A coluna do
  meio rola por dentro e o último fieldset dela não tem margem e estica (`flex: 1 0 auto`), pra
  base alinhar. Quadro novo na coluna do meio herda isso; conteúdo que cresce rola dentro do
  quadro, não na página. `.players-grid` usa `grid-auto-rows: 1fr` (cards da mesma altura).
- **Páginas desktop** (1.3.7): `.page` (largura da sessão), `.page-topbar` (+ `-name`, `-meta`,
  `-back`, `-code`; a sessão usa o mesmo), `.page-toolbar`, `.d-grid`/`.d-card` (+ `-head`,
  `-icon`, `-title`, `-desc`, `-value`, `-code`, `--deletable`) no `styles.scss`; paginação, total
  e vazio reaproveitam `.m-pagination`/`.m-empty`. A lista de personagens busca a ficha de cada
  personagem da página (`getCharacterById(id, true)` em paralelo, `character-list/character-card.ts`)
  porque o endpoint de lista não traz avatar/atributos e a CA/atributos gravados ficam velhos — e
  ele é usado com 100 itens por criar/entrar em sessão, então não dá pra montar ficha lá.
- **Centralizar na vertical com rolagem** (1.3.10, Home): num contêiner com `overflow-y: auto`,
  `justify-content: center` corta o topo quando o conteúdo passa da altura (não dá pra rolar até
  ele). Usar `margin: auto 0` no filho: centraliza quando cabe e rola certo quando não cabe.
- **Rolagens na sessão** (1.3.12): rolagem nova entra numa fila de avisos em tela cheia (até 10 s
  cada). Tudo que "revela" o resultado — histórico, impacto de dano, reação do Tom — acontece no
  `playNextRollToast` (quando o aviso aparece), não no `checkForNewRolls` (quando chega). Exceção:
  rolagem do próprio jogador com o modal de ações/iniciativa aberto (sem aviso) revela na hora.
- **Moldura dos cards** (1.3.11): `.framed-card` (global) usa `border-image: var(--card-frame) 72 /
  22px round` com `border: 11px` — a imagem é desenhada com 22 px mas a faixa termina em ~12–13
  px, então só 11 px ocupam espaço; `background-clip: padding-box` impede a foto de aparecer pelas
  frestas da moldura. O componente **não** pode redefinir `border` do card (perde a moldura).
  Destaque/hover vira `box-shadow`. Originais + `process.py` em `design/frames/`.
  Avisos em tela cheia: `.framed-toast` (`--toast-frame`, `72 / 34px`, `border: 24px`); os
  componentes dos avisos também não podem definir `border`. Imagem nova: o `process.py` corta a
  margem transparente e imprime onde a faixa/canto terminam pra recalibrar.
- **Checkbox nativo e recusa** (1.3.11): o checkbox se marca sozinho no clique; se a ação for
  recusada (limite, API), `[checked]` não muda e o DOM fica marcado sem ter gravado. Passar o
  `$event` e voltar `target.checked` no erro/recusa (ver `togglePrepared`/`battleTogglePrepared`).
- **Preparo de magia × combate** (1.3.11): `CombatRepository.isCharacterPreparationLocked` só
  trava com o participante já na ordem (`initiative_total` não nulo); alimenta tanto o
  `setSpellPrepared` quanto o `in_active_combat` da ficha.
- **Ficha de personagem** (1.3.14): o SCSS da ficha define `.roll-trigger-btn`,
  `.equipment-edit-btn` e `.level-up-btn` **depois** do bloco mobile, com o mesmo peso — um
  modificador simples (`.mobile-roll-btn`) perde pra eles. Usar seletor composto
  (`.roll-trigger-btn.mobile-roll-btn`). Classes compartilhadas entre desktop e celular
  (`.spell-slots-bar`, `.spell-circle-header`, `.hit-dice-*`) ganham a cara mobile por
  `.mobile-tab-content .x`, sem mexer no desktop. O card do personagem usa `.framed-card` (não
  definir `border`). Círculos de magia: o componente guarda os **abertos** (`expandedCircles`),
  então tudo começa fechado. Fonte do SCSS ~31,8 kB, mas compilado ~24,4 kB (o orçamento olha o
  compilado).
- **Gaveta de baixo da sessão** (1.3.16/1.3.17): estilo em `bottom-drawer/bottom-drawer.scss`,
  incluído no `styleUrls` de cada componente que usa (quadro, aba do quadro, `character-drawer`,
  modais de ações e de inventário) — não no `styles.scss`, porque regra de componente ganha da
  global. **z-index baixo de propósito** (barra 140, gaveta 146): com 940 a barra ficava por cima
  do modal de ações (150) e do de rolagem (200). Modal novo da sessão que precise ficar acima da
  barra: z-index maior que 146. Espaço da barra (~58 px; sem o puxador desde a 1.3.19): celular,
  `padding-bottom` de 74 px no `.mobile-container`; desktop, `.container--drawer` (70 px).
- **Ações em colunas** (1.3.18): não usar CSS `columns` pra seções que abrem/fecham (círculo,
  habilidade) — o navegador redistribui tudo entre as colunas e a informação "pula". Usar grid
  com colunas fixas (`.pa-col`), cada seção sempre na sua.
- **Input de rota no componente**: `withComponentInputBinding` liga query params a `input()`
  (`sessionId`/`fromActions` na ficha, `reopenActions` na sessão). Nos testes sem template, dá pra
  trocar o input por uma função (`(c as any).fromActions = () => '7'`) antes de chamar o método.
- **Cartas** (1.4.0): imagens em WebP (primeiras do site). Moldura e verso **sem cortar a margem**
  transparente — as áreas da carta são % da imagem inteira, e cortar mudaria as posições. A grade
  `.card-grid` é global (`styles.scss`) porque três telas usam. Card que abre algo e tem botões
  dentro: os botões chamam `$event.stopPropagation()`.
- **Aviso de lançamento** (1.5.0): o `cast_id` das rolagens só existe no evento do socket (não no GET
  da sessão) — por isso a mesa acha as rolagens do lançamento pelo **id** no histórico. As etapas
  são mandadas em fila (promises encadeadas) e cada uma leva a situação inteira; a mesa ignora
  `open` depois de `done`. O socket entrega `roll_added` antes de `spell_cast_stage` (quem lança
  manda a etapa só depois da resposta do `/roll`).
- **Carta virando em 3D** (1.6.3): no elemento com `transform-style: preserve-3d` (o que gira), não
  animar `opacity` (nem pôr `filter`/`opacity < 1`) — o navegador achata o 3D e ignora o
  `backface-visibility`, e a face da frente cobre o verso. Surgir/sumir vai num elemento de fora; a
  face da frente leva `transform: rotateY(0deg)` pra entrar no contexto 3D.
- **Template passado pra outro componente** (1.6.5, mão): o `<ng-template>` é desenhado dentro do
  componente que recebe (`app-card-hand`), mas leva o estilo de **quem declarou** (a gaveta). Pra
  estilizar os botões só ali, envolver num wrapper com classe própria dentro do template
  (`.pa-hand-actions`) — seletor com classe do componente que recebe não casa.
- **Mudança de contrato do socket/endpoint entre api e web** (1.6.1): quando o web passa a mandar um
  campo que a api antiga recusa (ex.: `weapon` no `/spell-cast-stage`), fazer o **push da api
  primeiro** (VPS, pelo GitHub Actions; era o Render até a 1.17.0) e só depois o do web
  (Hostinger).
- **Estilo de componente × classe global** (1.3.8): regra no SCSS do componente tem o mesmo peso
  de `.d-card:hover`/`.m-card:hover` (o atributo de encapsulamento soma uma classe) e vem depois,
  então ganha. Não repetir `border-color`/`background` em modificador do card dentro do
  componente, senão o hover global some.
- **`fieldset` sem classe de quadro** não tem borda (regra global no `styles.scss`). Quadro com
  borda é sempre explícito (`.retro-panel`, `.mobile-panel`…).
- **Identidade mobile** (1.3.5): classes globais no `styles.scss` — `.m-header`/`.m-back`/`.m-title`,
  `.m-card-list` + `.m-card` (`-icon`, `-thumb`, `-body`, `-title`, `-desc`, `-arrow`, `-delete`;
  modificadores `--selected`, `--highlight`, `--disabled`, `--deletable`), `.m-pagination`/
  `.m-page-btn`/`.m-page-info`, `.m-total`, `.m-empty`. Tela mobile nova usa essas classes;
  **não redefinir cabeçalho/card/paginação no componente** — foi assim que as listas ficaram
  diferentes da Home. A Home também usa o `.m-card`. Formulários (1.3.6): `.m-section` +
  `.m-section-title` (no lugar de fieldset/legend), `.m-field`/`.m-label`/`.m-input`
  (`--code`)/`.m-hint`, escolhas em `.m-card` (`--compact`, `--selected` + ícone ✓), lista longa
  em `.m-scroll`, leitura em `.m-box`, botão `retro-btn m-submit`, erro em `.m-error`.
- **Ícones** (1.3.3): sem emoji no site. Ícone é `<img class="ui-icon" src="assets/icons/NOME.png"
  alt="" />` (classe global no `styles.scss`, 1,5em — acompanha a fonte em volta). Dentro de
  `{{ }}` não dá pra pôr `<img>`: tirar o ícone da string e usar `@if` antes da interpolação. Os
  32 ícones (96 px) saem de `design/icons/` (folhas originais + `slice.py` + README com o uso de
  cada um) — fora de `public/` e `src/assets/` porque tudo lá vai pro ar. Ícone novo: gerar no
  mesmo estilo (pixel art 16-bit, contorno #1C0B0B, paleta marrom/dourado, fundo transparente,
  folha 1024×1024 em grade 4×4, ícone centrado em cada célula) e rodar o `slice.py`.
- **Barras de rolagem** (1.3.2): globais no `styles.scss` com `::-webkit-scrollbar*` nas cores do
  tema; o `scrollbar-color` (Firefox) só entra em `@supports not selector(::-webkit-scrollbar)`,
  porque o Chrome ignora os `::-webkit-*` quando `scrollbar-color` está definido.
- **Carregamento sem overlay bloqueante** (1.3.1): o `loadingInterceptor` ainda chama
  `LoadingOverlayService.show()` em toda requisição sem `SKIP_LOADING_OVERLAY` (e o `hide()` segura
  2 s), mas o `LoadingOverlayComponent` só faz **um dragão atravessar a tela** (sem
  `pointer-events`, z-index 990, abaixo dos modais) — nada impede clique. Por isso: **toda tela
  que carrega dado precisa do próprio skeleton** (`.skeleton` / `.skeleton--circle` /
  `.skeleton-stack` no `styles.scss`, `app-skeleton-rows` em `src/app/skeleton/`) e **todo botão
  que grava precisa travar** com estado próprio ("SALVANDO...") — antes o overlay escondia o
  "nenhum encontrado" e impedia o segundo clique. Texto no topo só com `show('mensagem')`. A
  sessão chama `suppressHttp()` (sem dragão durante o jogo) e libera no `ngOnDestroy`.
- **Sprite do dragão** (`public/dragon-sprite.png` e `dragon-sprite-sombrio.png`): grade **4×4**,
  virado pra **direita**, fundo transparente, as 4 linhas formam um ciclo de 16 quadros de bater de
  asas. Vem da variável de tema `--dragon-sprite`, usada pelo `LoadingOverlayComponent`
  (`background-size: 400% 400%`) e pelo `dragon-animation` (wizard/servidor acordando, 512 px).
  Trocar a imagem mantendo a grade não exige mexer no CSS. Tudo em `public/` vai pro ar: não
  deixar cópia antiga lá dentro.
- **Assets**: `src/assets/*.png`, referenciados como `assets/nome.png` (sem barra inicial).
- **`<select [(ngModel)]>` com opções assíncronas** fica visualmente vazio: chamar
  `cdr.detectChanges()` depois de preencher as opções.
- **`overflow-x: hidden` num ancestral desliga o `position: sticky`** (vira contêiner de rolagem e
  o sticky gruda nele, não na janela). Usar `overflow-x: clip` — barra do topo da tela inicial
  (1.8.1).
- **Atalho `background:` num `.framed-card` faz a imagem passar por baixo da moldura**: o atalho
  volta `background-clip`/`background-origin` ao padrão (`border-box`) e desfaz o `padding-box` da
  `.framed-card`. Usar `background-image`, `-size`, `-position` separados (fundo padrão do card,
  1.8.1).
- **Navegar pra mesma URL não faz nada** (`onSameUrlNavigation` padrão `ignore`): o SAIR da 1.8.0
  mandava pra `/`, e quem já estava na Home (`/`) ficava nela, só sem o cabeçalho de logado. Por
  isso o SAIR vai pro `/login` (1.8.2) e o `clearSession` não aceita mais `'/'`.
- **Moldura 9-slice com corte menor que o enfeite**: o `border-image-slice` precisa cobrir o
  enfeite inteiro do canto (e a faixa toda de cada lado), senão o pedaço cortado se repete no meio
  das bordas. Medir a imagem (alfa) antes de trocar uma moldura — a do SOMBRIO da 1.8.3 precisou
  de corte por lado (`--card-frame-slice`), porque a corrente desce mais no canto de cima.
- **`clearSession()` sem argumento navega pro `/login`**: chamado dentro de guard ou `canMatch`, a
  navegação atropela a escolha da rota. Em `/` o `loggedInMatch` usa `loadCurrentUser(null)` (só
  limpa) — ver `conceitos/tela-inicial.md`. Teste que mocka o `loadCurrentUser` com `of(null)` não
  pega isso: usar o `AuthService` real com `HttpTestingController`.
- **Layout mobile**: o `body` usa `display: flex; justify-content: center`, então o container
  mobile precisa de `width: 100vw` (não `100%`). Padrão completo: `/mobilize-screen`.
- **`Zone.Identifier`**: arquivos `*:Zone.Identifier` aparecem no working directory (metadado do
  WSL/Windows). Não commitar.
- Tabelas duplicadas entre web e api (espaços de magia, armaduras, listas de magia por classe,
  perícias por classe) têm testes nos dois lados com os mesmos valores: mudou um, muda o outro.
- **z-index empatado com uma barra fixa**: na tela inicial a carta da vez da vitrine tinha
  z-index 50 (inline, `zIndex()` do carrossel), o mesmo da `.lp-topbar` sticky — empate, quem vem
  depois na página ganha, e a carta passava por cima da barra ao rolar (desde a 1.8.0, achado
  em 2026-10-25). Componente com z-index internos altos ganha `isolation: isolate` no contêiner,
  pra a ordem valer só lá dentro. Mesma família: `backdrop-filter` num filho de um elemento que
  já tem `backdrop-filter` não desfoca no Chromium — usar fundo sólido.
- **Modal de rolagem no modo lançamento não fecha sozinho**: no fim (saída de vitória ou carta
  quebrando) ele emite `rolled` e o painel some — quem abriu precisa fechar no `(rolled)`. A
  rolagem do monstro só escutava `(closed)` e a tela ficava escura, travada (1.13.0).
- **Brilho em volta de carta**: as cartas têm cantos transparentes; `box-shadow` desenha um
  retângulo em volta da caixa. Usar `filter: drop-shadow(...)`, que segue o contorno.
- O `button.retro-btn` global tem **`margin-top: 10px`** (e `float: right`): em linha flex de
  botões, zerar a margem de todos — zerar só de um deixa ele mais alto que os vizinhos (foi o
  FINALIZAR TURNO dos NPCs).
- **Animação com `transform` e `fill-mode: both`**: o valor final fica aplicado, e **qualquer**
  `transform` (até `translateY(0)`) faz o elemento virar a referência dos `position: fixed` de
  dentro. A gaveta de baixo terminava em `translateY(0)` e a mão de cartas aberta de dentro dela
  ficava presa na gaveta. Terminar a animação em `transform: none` (1.13.2).
- **Classe global com nome genérico vaza pra outras telas**: `title-panel`, `auth-panel`,
  `form-group`, `error-msg`, `full-btn`, `auth-links`, `logo-container` são usados por várias
  telas, cada uma com o próprio SCSS. Estilo compartilhado no `styles.scss` vai **sob uma classe
  de escopo** (como `.auth-retro` do login/cadastro, 1.13.3) — no PR #7 o visual novo do login
  mudou Home, sessões, Minha Conta e as outras telas de conta.

## Sessão em tempo real / permissões

- Socket.io autentica por `socket.handshake.auth.token` (JWT do localStorage), com fallback pro
  cookie: o navegador bloqueava o cookie httpOnly como third-party em produção (Hostinger × Render
  eram domínios diferentes). Desde a 1.17.1 a api é `api.forjaarcana.com`, mesmo site do
  `forjaarcana.com`; o token continua sendo o caminho principal.
- **`RevealedMonster`** (`{id_monster_session, name, image_url}`) é o único jeito de o jogador
  saber de um monstro. O array `monsters` completo é só do mestre. Campo novo de monstro pro
  jogador entra ali.
- Evento com dado restrito ao mestre entra em `DM_ONLY_EVENT_TYPES`.
- **Revelar × combate** (1.3.4): `GameSessionService.revealMonster` publica `monster_revealed` e
  depois `joinActiveCombat` chama `CombatService.addParticipants` se houver combate ativo e o
  monstro não estiver nele (gera `combat_participants_added`). A ordem importa: como o monstro já
  está revelado quando o `addParticipants` roda, o `revealMonsters` dele não acha nada novo e o
  anúncio não se repete.

## Deploy / infraestrutura

- Bucket do Supabase precisa ser **público**. Se o upload funciona mas a imagem não carrega,
  conferir `client.storage.getBucket()` / `updateBucket({public: true})`.
- Angular `outputPath` sem a subpasta `browser/`, pro deploy na Hostinger funcionar.
- O `release-notes.spec.ts` confere o `package.json` do web; o da api é conferido **à mão**.
- O **Render bloqueia SMTP** (portas 25/465/587): e-mail direto da api não sai, e o erro só
  aparece como timeout/conexão recusada. Por isso o e-mail sai por um script PHP no site
  (`conceitos/email.md`). HTTPS de saída funciona. Na VPS (1.17.1) as portas 465/587 saem.
- **VPS** (`conceitos/infraestrutura.md`):
  - **nginx aceita só 1 MB** por requisição por padrão: upload de imagem (até 10 MB na api) dá
    413. Por isso o `client_max_body_size 12m`.
  - O `clientIp` do rate-limit confia em `cf-connecting-ip`. Sem Cloudflare na frente, qualquer um
    forjaria esse header: o nginx **apaga** ele e **substitui** o `X-Forwarded-For` por
    `$remote_addr`. Trocar de proxy ou pôr Cloudflare na frente exige rever isso.
  - O `sshd` usa **a primeira** ocorrência de cada opção, lendo `sshd_config.d/` em ordem
    alfabética: a imagem traz `50-cloud-init.conf` (que libera senha), por isso o nosso é
    `00-forja.conf`. Conferir com `sudo sshd -T`.
  - O certbot cria um **segundo bloco `server`** (só o redirect da porta 80): opção posta no bloco
    original não vale pra ele. `server_tokens off` foi pro `nginx.conf`, onde o Ubuntu 26.04 traz
    `server_tokens build;` (não a linha comentada das versões antigas) — olhar o arquivo antes de
    editar com `sed`, que não avisa quando não acha nada.
  - A chave SSH do usuário tem passphrase: **push** (e SSH) pelo terminal do Claude falha com
    `Permission denied (publickey)`. O commit sai daqui, o push o usuário roda.
  - O `dotenv` loga `injected env (0) from .env` ao subir: normal, as variáveis vêm do
    `EnvironmentFile` do systemd.
- A **CDN da Hostinger** (`server: hcdn`) tinha a **otimização de imagens** ligada: reduzia pra
  1600 px e convertia pra WebP com ~2% do tamanho (fundo de 1,3 MB virava 23 KB, borrado). O
  usuário desligou em 2026-10-31 (hPanel → site → Performance → CDN) e limpou o cache (as imagens
  ficam 7 dias no cache). Se imagem do site aparecer pior que o arquivo do repo, comparar com
  `curl -sI -H 'Accept: image/webp' https://forjaarcana.com/<caminho>` (`content-type` e
  `content-length`). A api (VPS) e as imagens do Supabase não passam por essa CDN.
- A Hostinger **executa PHP** no site do web: `.php` em `public/` vai pro ar junto com o build
  (conferido em 2026-10-25). Arquivo com segredo **não** vai em `public/` (é publicado e está no
  git): fica na pasta que contém o `public_html`, a do aviso `DO_NOT_UPLOAD_HERE` (lá não é
  servido pelo site, mas o PHP lê).
- O site responde **200 com a página do Angular pra qualquer endereço** que não existe (até
  `algo.php`): um 200 não prova que um arquivo está no ar — conferir o conteúdo.
- Nesta máquina (WSL) o **`gh` não está instalado**. Pra ler ou testar um PR: `git fetch origin
  pull/N/head:pr-N` e uma worktree no scratchpad, com o `node_modules` do repo ligado por symlink
  quando o PR não muda dependência. Apagar a worktree e a branch local `pr-N` depois — o
  `/code-review` também deixa uma cópia (`prN`).

## Conteúdo do livro

- `docs/database/database_inserts.sql` da api tem fim de linha **CRLF**. Editar com Python em modo
  texto (`open(p).read()`/`write`) troca tudo pra LF e o diff pega o arquivo inteiro: ler e gravar
  em binário (`'rb'`/`'wb'`) ou usar o Edit (2026-10-30, Vidência).

- `referencias/livro.txt` tem colunas embaralhadas (texto de uma magia aparece no lugar de
  outra). Usar `referencias/magias.txt` (extração limpa, ordem alfabética) para magias.
- Descrição de magia corrigida no banco também é corrigida no `database_inserts.sql` (alterar a
  linha do INSERT, não acrescentar UPDATE).
- `referencias/monstros.txt` (OCR do Manual dos Monstros) não dá pra ler com regex: ações aparecem
  antes do cabeçalho da ficha, nomes viram "AÇÕES"/"AÇÕES LENDÁRIAS", números saem como `�`, e o
  próprio livro em PT tem erros de cópia (ações de um monstro no outro). Pra corrigir uma ficha,
  usar o seed da tabela `monster` (já limpo), não o OCR. → `conceitos/monstros.md`
