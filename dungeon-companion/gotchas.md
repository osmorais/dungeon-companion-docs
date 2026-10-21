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
- **Overlay de carregamento × skeleton** (1.2.3): o `loadingInterceptor` mostra o dragão em toda
  requisição sem `SKIP_LOADING_OVERLAY` (e o `hide()` segura 2 s). A sessão chama
  `LoadingOverlayService.suppressHttp()` no construtor e libera no `ngOnDestroy`: enquanto aberta,
  nenhuma requisição mostra o dragão — inclusive as de modais com `CharacterService` etc. Tela
  nova dentro da sessão precisa do próprio skeleton (`.skeleton` / `.skeleton--circle` /
  `.skeleton-stack` no `styles.scss`, `app-skeleton-rows` em `src/app/skeleton/`) e de estado de
  "salvando" no botão, porque o dragão não cobre mais a espera. Navegação e `show()` explícito
  continuam mostrando o dragão.
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
