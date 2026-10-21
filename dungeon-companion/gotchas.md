---
resumo: Armadilhas técnicas do Dungeon Companion que já custaram tempo — conferir antes de mexer na área.
tipo: gotchas
status: ativo
atualizado: 2026-10-20
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

## Banco

- `docs/database/database.sql` e `database_inserts.sql` usam **CRLF**: editar preservando (não
  usar `sed -i`; em Python, `open(p, newline='')` na leitura **e** na escrita — o `open()` padrão
  converte o arquivo inteiro pra LF e o diff vira 700+ linhas). Regra completa: `.claude/rules/banco-de-dados.md` da api.
- Migração que o código novo lê **roda antes do deploy da api**, senão a api nova quebra ao subir.
- A tabela `spell` tem uma coluna `damage` (preenchida em 114 das 361) que a API **não usa**: a
  mecânica está em `spell-mechanics.ts`.
- `character_level_history.choice_data` (JSONB) é o mecanismo genérico de escolhas do level-up
  (primeiro consumidor: talento Habilidoso).

## Web (Angular)

- **Orçamento de SCSS** (também no `CLAUDE.md` do web): `anyComponentStyle.maximumError` está em
  32 kB por causa do `session-panel.component.scss` (~31,6 kB). Componente novo da sessão ganha
  SCSS próprio. Keyframes e classes compartilhadas vão pro `styles.scss` global.
- **Prettier**: `session-panel.component.ts/html/scss` têm débito antigo. Antes de formatar,
  confirmar com `git stash` se o aviso já existia (também no `CLAUDE.md`).
- **Temas de cor** (1.3.0): `ThemeService` põe `data-theme` (`fantasia` | `sombrio`) no `<html>` e
  guarda em `localStorage` (`dc.theme`). `styles.scss` tem o `:root` (fantasia) e o
  `:root[data-theme='sombrio']`, que só troca variáveis. **Cor nova de interface usa variável**
  (`--bg-color`, `--panel-bg`, `--accent-color`, `--border-color`, `--btn-color(-hover)`,
  `--label-title-color`, `--text-color`, `--text-soft`, `--sheet-label-color`, `--gold-color`) —
  hex fixo não muda com o tema. Ficam fixas de propósito: efeitos de tela cheia (dano, magia,
  modal-burst), cores com significado (vermelho de erro, verde de cura, barra de PV) e as cores
  de avatar.
- **Sessão desktop em página única** (1.3.2): `.container` tem `height: calc(100vh - 48px)` (os
  48px são o `padding-bottom` do body, reservado pro rodapé global) e é coluna flex: topo
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
- **Layout mobile**: o `body` usa `display: flex; justify-content: center`, então o container
  mobile precisa de `width: 100vw` (não `100%`). Padrão completo: `/mobilize-screen`.
- **`Zone.Identifier`**: arquivos `*:Zone.Identifier` aparecem no working directory (metadado do
  WSL/Windows). Não commitar.
- Tabelas duplicadas entre web e api (espaços de magia, armaduras, listas de magia por classe,
  perícias por classe) têm testes nos dois lados com os mesmos valores: mudou um, muda o outro.

## Sessão em tempo real / permissões

- Socket.io autentica por `socket.handshake.auth.token` (JWT do localStorage), com fallback pro
  cookie: o navegador bloqueia o cookie httpOnly como third-party em produção (Hostinger × Render
  são domínios diferentes).
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

## Conteúdo do livro

- `referencias/livro.txt` tem colunas embaralhadas (texto de uma magia aparece no lugar de
  outra). Usar `referencias/magias.txt` (extração limpa, ordem alfabética) para magias.
- Descrição de magia corrigida no banco também é corrigida no `database_inserts.sql` (alterar a
  linha do INSERT, não acrescentar UPDATE).
