# WedSnap — Status e Notas de Deploy (2026-07-30)

Este documento complementa o `wed-snap-context.md` (spec original) com o estado **atual** do projeto depois da implementação e do deploy em produção. Onde este documento diverge do `wed-snap-context.md`, este é o que vale — a stack e a arquitetura mudaram desde a spec inicial.

## Status

Site em produção, funcionando, em **https://casamentolarissaeosmar.com.br** — hospedado na **Hostinger** (produto "Web App", deploy via GitHub, fluxo parecido com Vercel/Railway). Repositório: `github.com:osmorais/wed-snap.git`. Casamento de Larissa & Osmar em **15.08.26**.

## Arquitetura atual (mudou em relação à spec original)

A spec original previa backend Express separado, hospedado no Render. Isso **mudou**: para reduzir custo (evitar manter dois hosts pagos) e simplificar o deploy, o backend foi migrado inteiramente para dentro do Next.js, como Route Handlers. Não existe mais `/api` (Express) no repositório.

- **`/apps/web`** — Next.js único (App Router, Turbopack, React 19), contém front-end **e** back-end. Rotas de API em `src/app/api/*`.
- **`/packages/shared`** — tipos TypeScript compartilhados (`Photo`, `Challenge`).
- **Sem model `User`/autenticação** — continua como na spec original: acesso via QR code, nome do convidado é só um campo (`guestName`) na foto.

**Camadas de dados** (`apps/web/src/lib/`):
- `prisma.ts` — singleton do Prisma Client.
- `supabase-storage.ts` — client do Supabase Storage, instanciado sob demanda (lazy — ver gotcha #4 abaixo).
- `photos.ts` — `getPhotos()`, chamado direto pelos Server Components (sem round-trip HTTP pra própria API).

**Rotas de API:** `GET/POST /api/photos` (upload via `multipart/form-data`, parseado nativamente por `request.formData()`, sem `multer`), `GET /api/challenges`, `GET /api/health`.

**Banco/Storage:** Supabase (projeto `defxpymdqxrcbwpymmir`, região `sa-east-1`). Bucket de Storage `wedding-photos` (público). Schema Prisma em `apps/web/prisma/schema.prisma` — models `Photo` e `Challenge`, sem pasta de migrations (schema aplicado via `prisma db push`).

## Gotchas de deploy na Hostinger

Descobertos com bastante esforço de debug durante o primeiro deploy. Consultar antes de mexer em configuração de build/deploy de novo:

1. **`output: "standalone"`** no `next.config.ts` é obrigatório — sem isso o build depende do `node_modules` hoisted do monorepo, que não existe isolado no servidor.

2. **A Hostinger copia só o conteúdo de "Root Directory" (`apps/web`)** pra pasta onde ela roda o app (`nodejs/`), deixando pra trás o `node_modules` que o Next.js gera "vizinho" de `apps/web` (por causa do hoisting do npm workspaces). Corrigido em `apps/web/scripts/prepare-standalone.sh` (roda automaticamente via `postbuild`): copia o `node_modules` completo pra dentro de `apps/web` e corrige links simbólicos quebrados que pacotes com binário nativo (ex. Prisma) criam dentro do próprio `.next` apontando pro `node_modules` vizinho.

3. **`packages/shared/dist` não é commitado no git.** O build da Hostinger roda com o diretório de trabalho já dentro de `apps/web`, então o script `"build"` do `apps/web/package.json` é `npm --prefix ../../packages/shared run build && next build` — compila o shared primeiro, via caminho relativo.

4. **Nunca instanciar clients (Prisma, Supabase) no topo do módulo de uma rota.** O Next.js executa o módulo durante o build ("Collecting page data"), e se as variáveis de ambiente não estiverem disponíveis nesse momento (a Hostinger não injeta env vars no build, só no runtime), o build quebra. Por isso `getSupabaseStorage()` é lazy.

5. **Páginas com estado/dados dinâmicos precisam de `export const dynamic = 'force-dynamic'`.** Sem isso, o Next.js pré-renderiza como estático e o CDN da Hostinger cacheia a resposta de navegação (RSC) por **1 ano** (`cache-control: s-maxage=31536000`), causando telas travadas/desatualizadas depois de redeploys. Já aplicado em `gallery/page.tsx`, `feed/page.tsx` e `upload/layout.tsx` (cobre todo o fluxo de upload).

6. **O botão "Import .env" do painel de variáveis de ambiente da Hostinger tem um bug**: ele apaga os caracteres `:` dos valores (`postgresql://...` virava `postgresqlpostgres...`). Sempre inserir as variáveis manualmente.

7. **Variáveis de ambiente necessárias na Hostinger:** `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`.

8. **Configuração do painel:** Root Directory = `apps/web`; Build command = `npm run build`; Output directory = `.next`; Framework = Next.js (auto-detectado ao importar do GitHub).

## Identidade visual

- **Paleta:** fundo branco, texto marrom-carvão (`#2B211D`), terracota alaranjado (`#D97A46`) como cor de assinatura em acentos.
- **Tipografia:** Cormorant Garamond (serifada itálica) em títulos/logo, Inter no corpo, Caveat (manuscrita) só no nome do convidado sob cada foto — elemento de assinatura do produto (mural de recados, não feed genérico).
- **Logo/wordmark** "Larissa & Osmar · 15.08.26": fixo e pequeno no topo de todas as telas, exceto na landing (`/`), onde aparece grande e centralizado no hero.

## Funcionalidades construídas (além da spec original)

- **Galeria** (`/gallery`, grid, mais antigas → mais novas) e **Feed** (`/feed`, estilo Instagram, mais recentes primeiro) como duas abas separadas — não estava na spec original, foi pedido depois.
- Tela de sucesso após publicar (evita um bug de race condition onde resetar o estado do fluxo antes de navegar mandava de volta pro início).
- Botão "Cancelar" na tela de nome, pra quem clicou por engano no ícone da câmera.
- Lightbox (modal) ao clicar numa foto, compartilhado entre galeria e feed.
- Tempo relativo ("há X minutos") em cada foto.
