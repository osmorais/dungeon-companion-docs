# Dungeon Companion — Status e Notas de Continuação (2026-09-10)

Documento de continuidade pra retomar o trabalho em outra sessão. Cobre o que foi feito numa
sessão longa de desenvolvimento, decisões de arquitetura tomadas e o que ficou pendente. Não é
uma spec original (o projeto já existia antes) — é um "onde paramos".

## Os dois repositórios

- `~/projects/dungeon-companion-api` — LoopBack 4 (Node), Postgres via driver `postgres` (não é
  ORM). Ver `CLAUDE.md` do repo pra comandos/arquitetura de camadas (Controller → Service →
  Repository → PostgresDatasource).
- `~/projects/dungeon-companion-web` — Angular 21 (Signals + RxJS). Ver `CLAUDE.md` do repo.

Deploy: backend no **Render** (`git push` dispara o deploy), frontend na **Hostinger**
(Git-based auto-deploy, "Build command"/"Output directory" estilo Vercel/Netlify).

Ambos os repos estão limpos (sem uncommitted changes) e com tudo já dado `push` no momento em
que este documento foi escrito. Últimos commits **à época** (2026-09-10 — ver atualização de
2026-10-14 mais abaixo pro estado atual real):
- api: `d0a8adb` "Permite ao mestre trocar a imagem de um monstro já na sessão"
- web: `a299e47` "Muda a cor do contorno do card de monstro em destaque pra #99430a"

## O que foi construído nesta sessão (ordem cronológica, por tema)

1. **Migração de SSE pra WebSocket real** (socket.io): rooms por sessão (`session:{id}`
   público, `session:{id}:dm` só-mestre), payloads com o delta de verdade em vez de
   "notificação vazia + refetch". Auth via `socket.handshake.auth.token` (JWT do
   localStorage), com fallback pra cookie — precisou ir pro `auth` payload porque o browser
   bloqueia o cookie httpOnly como third-party em produção (domínios diferentes
   Hostinger/Render).
2. **Fluxo de ataque → dano**: rolagem de d20+bônus (ataque), e se o mestre confirmar que
   passou da CA, rola o dado de dano da arma automaticamente, tudo no mesmo modal.
3. **Mestre pode rolar dados** (`RolagemDoMestre`), público ou oculto dos jogadores
   (`roll.is_hidden`, evento `roll_added` fica DM-only quando oculto).
4. **Ações de monstro na sessão**: remover, marcar como derrotado (remove + notifica todo
   mundo), revelar/esconder (toggle switch, sem ícones).
5. **Retenção do log de rolagens**: poda pras últimas 30 por sessão a cada insert
   (`session_roll_log`). *Pendência nunca resolvida*: existia uma sessão com 139 rows (109
   acima do limite) antes dessa poda entrar — o usuário nunca confirmou se queria rodar uma
   limpeza pontual daquele excesso histórico. Não foi feita.
6. **Upload de imagem de monstro via Supabase Storage** — a feature mais estrutural da
   sessão:
   - `SupabaseStorageService` (backend): client lazy (`@supabase/supabase-js`), só
     service-role-key no servidor, `uploadImage(buffer, contentType, originalName)`.
   - Env vars necessárias: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
     `SUPABASE_STORAGE_BUCKET` (opcional, tem default). Projeto Supabase é dedicado só pro
     dungeon-companion (não compartilha com o wed-snap).
   - Bucket precisa ser **público** — já achou configurado como privado uma vez; se upload
     funcionar mas a imagem não carregar, checar `client.storage.getBucket()` /
     `updateBucket({public: true})`.
   - Upload em dois lugares agora: catálogo de monstros (`POST
     /api/monster-catalog/{id}/image`) e monstro já na sessão (`POST
     /api/game-session/monster-session/{id}/image`) — mesmo padrão de controller (multer +
     `MulterFile` local interface, sem depender de `@types/multer`, que falhava em builds
     limpos no Render — ver gotcha abaixo).
   - Frontend: botão "+ ADICIONAR IMAGEM" / "TROCAR IMAGEM" tanto no
     `monster-catalog-detail` quanto no modal de detalhe do monstro na sessão
     (`session-panel`, abre ao clicar no registro ou no botão "✎ editar").
7. **Anúncio de monstro revelado**: modal grande (quase tela cheia, depois ajustado pra
   76vh) com nome + imagem, mostrado pra **todos** na sessão — dispara tanto no toggle manual
   quanto automaticamente quando o monstro entra em combate (o backend já revela e anuncia
   quem ainda não tinha sido revelado, antes de publicar `combat_started`, então o anúncio
   aparece antes do banner "rolar iniciativa"). Evento reaproveitado: `monster_revealed`
   ganhou `image_url`.
8. **Modal de monstro derrotado** também ganhou imagem: preto-e-branco (`grayscale`) +
   overlay `assets/broken.png` por cima (depois de eu ter tentado um efeito de rachadura em
   SVG que o usuário não gostou — reverti e troquei pelo asset). Mesmo tamanho do modal de
   revelação.
9. **Imagem padrão pra monstro sem `image_url`**: `assets/monster.png`, usada como fallback
   (`image_url || DEFAULT_MONSTER_IMAGE`) em **todo lugar** que mostra imagem de monstro:
   avatar revelado, modal de anúncio, modal de derrota, modal de detalhe, bestiário
   (`/monster-catalog`, cards + thumbnails), modal de "iniciar luta".
10. **Sistema de dano/cura em lote pro PV** — substituiu completamente o stepper +/- e o
    botão "SALVAR HP":
    - Implementado primeiro só pros monstros (PV costuma ser grande, +/- de 1 em 1 é
      inviável), depois **migrado também pra jogadores e NPCs** por pedido explícito do
      usuário.
    - Padrão: campo numérico + botões DANO/CURA, aplica o delta e já salva na hora (sem
      passo intermediário de "salvar"). Métodos `apply{Player,Npc,Monster}Damage/Heal` +
      `apply{...}HpDelta` privado.
    - Permissões preservadas: jogador só edita a própria vida (ou o mestre edita qualquer
      uma); NPC e monstro são exclusivos do mestre.
11. **Layout do quadro de monstros unificado com o padrão dos NPCs**: card/linha com avatar
    circular (imagem do monstro) + info (nome, CA, PV) + ações à direita, no lugar da tabela
    antiga do desktop. Botão "editar" (✎) novo, entre "derrotar" e "remover", abre o modal de
    detalhe (mesmo onde troca a imagem).
12. **Card do monstro em destaque durante combate** (`spotlightMonster`): trocou a lista de
    miniaturas de monstros revelados por **um card só, grande** (estilo card de jogador —
    avatar 130px + nome embaixo), contorno `#99430a`. Regra de exibição:
    - Mostra por padrão o monstro de **melhor iniciativa** entre os revelados
      (`combat.participants` já vem ordenado por `initiative_total DESC` do backend).
    - Troca automaticamente pro monstro que está **na vez dele** conforme o combate avança
      (`effect()` observando `currentTurnParticipant()`).
    - **Mantém o último em destaque durante turnos de jogadores/NPCs** — só troca quando é a
      vez de outro monstro (estado guardado em `spotlightMonsterId`, não é puramente
      derivado).
    - Corrigido também um bug de layout: o painel de combate no desktop dividia a altura em
      50/50 fixo entre ordem de turnos e card do monstro, e `overflow: hidden` cortava a
      borda de baixo do card quando não cabia. Agora o card tem altura livre pelo próprio
      conteúdo e a lista de turnos ocupa o resto, rolando internamente.
13. Fixes de deploy: `outputPath` do Angular (remover subpasta `browser/` pro deploy manual
    funcionar na Hostinger), `@types/multer` falhando em build limpo no Render (ver gotcha).

## Pendências / itens explicitamente adiados

- ~~Imagem de fundo do card do jogador na sessão~~ — **resolvido** em sessão posterior (ver
  atualização de 2026-10-14 abaixo): upload de imagem de personagem, usada como fundo do
  card na sessão, da ficha e do toast de rolagem.
- **Limpeza pontual das ~109 rolagens excedentes** numa sessão específica (de antes da poda
  de retenção entrar) — usuário nunca respondeu se quer que isso seja feito. Perguntar antes
  de rodar qualquer DELETE manual no `session_roll_log`. **Ainda não resolvido** (nenhum
  commit posterior toca nisso).

## Gotchas / convenções importantes pra não repetir erros

- **Nunca commitar/dar push sem pedido explícito a cada vez.** Mesmo depois de várias
  aprovações seguidas, o usuário prefere confirmar "pode commitar e dar push" em cada
  rodada — não assumir aprovação permanente.
- **Antes de reformatar um arquivo com prettier**, usar `git stash && npx prettier --check
  <arquivo> && git stash pop` pra confirmar se o warning é débito pré-existente (não mexer)
  ou introduzido pela própria edição (aí sim rodar `--write` só naquele arquivo). Isso evita
  diffs de formatação misturados com a mudança pedida. `session-panel.component.ts/html/scss`
  têm bastante débito pré-existente — é normal aparecer warning neles.
- **Budget de CSS por componente do Angular** (`angular.json`,
  `anyComponentStyle.maximumError`) foi elevado de **24kB pra 32kB** porque
  `session-panel.component.scss` (o maior arquivo do projeto, concentra quase toda a tela de
  sessão) estourou o limite anterior com as features de imagem de monstro. Se voltar a
  estourar 32kB, considerar quebrar o componente em vez de subir o limite de novo.
- **DI do LoopBack**: `this.service(Cls, 'services.Cls')` ou `@service()` type-based em
  classes já bindadas por outro caminho duplica o binding. Convenção deste projeto: usar
  `@inject('services.NomeDaClasse')` com chave literal (ver `GameSessionController`,
  `MonsterCatalogController`) pra evitar o bug.
- **`@types/multer` não é confiável em build limpo** (falhou intermitentemente no Render,
  não localmente). Solução aplicada: `declare module 'multer'` em `src/types/multer.ts`
  (precisa ser `.ts`, não `.d.ts` — o `tsconfig.json` exclui todo `**/*.d.ts` do projeto) +
  interface `MulterFile` local no controller, sem depender do namespace `Express.Multer`.
- **Convenção de asset**: arquivos em `src/assets/*.png`, referenciados como
  `assets/nome.png` (sem barra inicial) — `assets/dm.png`, `assets/monster.png`,
  `assets/broken.png`.
- **Atribuição de commit**: sempre terminar a mensagem com
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` + linha `Claude-Session:` — isso
  é configuração de sessão, pode mudar entre sessões (conferir o system prompt vigente).
- **Sem self-testing**: o usuário testa mudanças de UI ele mesmo no browser. Verificar via
  `npm run build` (Angular faz type-check de template com `strictTemplates`), lint/prettier,
  e pra backend, build + smoke test direto quando fizer sentido (scripts Node ad-hoc, nunca
  suíte de teste automatizada pra isso).
- **`RevealedMonster`** (`{id_monster_session, name, image_url}`) é o único jeito de um
  jogador (não-mestre) saber de um monstro — o array `monsters` completo é DM-only
  (`monsters: isDm ? session.monsters : []` em `GameSessionService.getSession`). Qualquer
  campo novo que precise chegar ao jogador sobre um monstro revelado tem que ser adicionado
  ali, não só em `MonsterSession`.

---

## Atualização 2026-10-14 — resumo de várias sessões não documentadas (2026-09-11 a 2026-10-13)

Este documento ficou parado desde 2026-09-10. Entre essa data e hoje houve **muitas sessões**
de desenvolvimento (~85 commits na api, ~90 no web) que nunca foram registradas aqui. O resumo
abaixo foi **reconstruído a partir do `git log`** (mensagens de commit), não da memória de
sessão — não tenho o contexto de decisão/rationale de cada uma, só o que os commits dizem.
Detalhes mais ricos de partes específicas já existem nos outros docs desta pasta:
`dungeon-companion-levelup-plan.md` (level-up Fases 1-3), `dungeon-companion-media-progress.md`
e `dungeon-companion-mechanics-audit.md` (auditoria de automação mecânica),
`dungeon-companion-subclasses-fase2.md` (conteúdo de subclasse), `dungeon-companion-spells-progress.md`
(descrições de magia). O que segue são os temas que **não** estão cobertos em nenhum desses.

### Temas principais

1. **Level-up — Fases 1, 2 e 3 completas** (`e978ec5`/`1673241`, culminando um trabalho de
   várias sessões): rolagem de HP, ASI/talento, escolha de subclasse no nível certo de cada
   classe, exibição dos detalhes de cada opção de subclasse em collapse, paginação da escolha
   de magias por círculo, e **CA "viva"** (deixou de ficar congelada desde a criação, mesmo
   padrão já usado em deslocamento/perícia). Catálogo de talentos completo (todos do livro,
   não só o subconjunto inicial). Travas adicionadas: criação de personagem só aceita nível 1
   (level-up é o único caminho pra subir depois), preparo de magia travado durante combate.
2. **Sistema de XP**: tabela de XP por nível, gating do botão de level-up até ter XP
   suficiente, concessão de XP pelo mestre (jogadores e NPCs) com avatar no modal, progresso
   exibido na ficha.
3. **Auditoria de mecânicas — itens "Fácil" e mais "Média"**: Estilo de Luta (Paladino/Ranger),
   talento Duro, Aura de Proteção, Mente Escorregadia, Resiliência Dracônica, CDs fixas,
   talentos Alerta/Observador, habilidades de chi do Monge ativáveis (ver histórico completo
   já em `dungeon-companion-levelup-plan.md`). Generalização do "painel de poderes de classe"
   pra qualquer habilidade ativável (não só chi), com painel próprio na ficha e reaproveitado
   nas ações da sessão.
4. **Paladino — Canalizar Divindade** virou recurso ativável (igual Clérigo/Bárbaro/Monge já
   eram) — commit mais recente antes de hoje. Fix relacionado: Estilo de Luta do
   Paladino/Ranger não estava aparecendo na ficha depois de escolhido.
5. **Inventário e mercado**: inventário de itens único por sessão+jogador, modal de inventário
   no card do jogador, mercado de itens (clique abre detalhe, botão de comprar com opção de já
   debitar o PO do personagem na hora).
6. **Combate na sessão — várias melhorias incrementais** (antes da feature de hoje): mestre
   pode reordenar a ordem de iniciativa, jogador pode atrasar o próprio turno, vida temporária
   pra jogadores, duplicar monstro no quadro da sessão, editar atributos (FOR-CAR) e status
   (nome/PV/CA) de monstro direto na sessão, modal de iniciativa fecha sozinho após rolar (sem
   opção de rolar de novo), mestre é perguntado se os monstros foram derrotados ao encerrar o
   combate, bug de iniciativa congelada (não acompanhava ASI/talento Alerta) corrigido.
7. **Imagem de fundo de personagem** (jogador/NPC) — a pendência registrada na seção anterior
   como "aguardando o usuário especificar melhor" **foi implementada**: upload de imagem pro
   personagem, usada como background da ficha, do card do jogador na sessão e (escurecida) do
   toast de rolagem.
8. **Magias — fluxo na sessão**: Grimório de Magias no menu do mestre, catálogo de magias
   paginado com busca por nome, lançar magia direto do modal de detalhe, magias agrupadas por
   círculo (ficha e ações da sessão), toast de "magia lançada" (broadcast informativo).
9. **"Tom"**, o assistente mascote da criação de personagem: reage a acerto/erro de ataque na
   sessão (só aparece durante a reação), tom mais irônico/sarcástico, easter egg de atributos
   personalizados.
10. **Riqueza inicial**: rolagem de dinheiro (PO) na criação de personagem, exibição/edição na
    ficha.
11. **Card do jogador na sessão** — várias iterações só de layout/ícones dos botões (grade,
    tamanho, texto vs. ícone) até chegar no formato atual; tooltip de atributos ao passar o
    mouse no avatar, aberto entre todos os jogadores (não só o mestre). Fix de navegação: abrir
    a ficha de dentro da sessão agora volta pra sessão ao fechar, não pra lista de personagens.

### Estado no fim deste período (antes da sessão de hoje)

- api: `1494a7b` "Permite debitar PO do personagem ao comprar item no mercado"
- web: `9db3972` "Ficha aberta de dentro da sessão volta pra sessão, não pra lista"

## Sessão 2026-10-14 — Adicionar participantes a um combate já em andamento

**Commitado e enviado** (api `c409f55`, web `f2e4463`). O mestre agora pode incluir jogador,
NPC ou monstro numa luta que já começou, sem precisar encerrar e criar outra.

- **Backend**: novo `POST /api/game-session/combat/{id}/add-participants`. A validação/inserção
  de participantes que já existia em `startEncounter` foi extraída pra métodos privados
  compartilhados (`resolveParticipants`, `insertNpcAndMonsterParticipants`) — sem duplicar
  lógica entre "iniciar luta" e "adicionar ao combate em andamento". Quem entra depois cai no
  **fim da ordem de turnos atual** (`appendTurnOrder`), sem reordenar quem já estava jogando.
  Monstros novos que ainda não tinham sido revelados disparam o anúncio normal
  (`monster_revealed`) antes do evento de participantes adicionados. `submitInitiative` deixou
  de exigir status `rolling_initiative` (agora só rejeita `finished`), pra quem entra num
  combate já `active` também poder rolar iniciativa normalmente. Evento novo:
  `combat_participants_added`.
- **Frontend**: `start-fight-modal` ganhou `mode: 'start' | 'add'` + `existingParticipants`
  (filtra quem já está no combate da lista de seleção, incluindo monstros via
  `eligibleMonsters` novo — antes só players/NPCs eram filtrados). Botão **"+ ADICIONAR"** no
  painel de combate (desktop e mobile, só visível pro mestre). Jogador que entra depois vê
  **"VOCÊ ENTROU NO COMBATE!"** em vez do banner de início de batalha. Reducer passou a tratar
  `combat_participants_added` igual aos demais eventos de combate.
- Builds limpos nos dois repos antes do commit (`tsc` na api; Angular na web só com os
  warnings de budget de SCSS já pré-existentes, documentados acima, nada novo).
- Untracked encontrados no working directory do web durante a sessão
  (`src/assets/icons/*.png:Zone.Identifier`, lixo de metadado do WSL/Windows) — sumiram
  sozinhos antes do commit, não foram adicionados.

## Sessões 2026-10-14/15 — Adequação à LGPD para divulgação pública

Tudo sobre LGPD está em **`dungeon-companion-lgpd.md`** (análise, decisões do usuário, status de
cada item, commits, testes, o que falta). Docs relacionados: `dungeon-companion-incidente.md`
(plano de resposta a incidente + registro), `dungeon-companion-imagens-orfas.md` (38 imagens
órfãs que o usuário vai apagar manualmente), `dungeon-companion-lgpd-scripts/` (scripts de
verificação). Resumo:
- Os 15 itens técnicos estão feitos e enviados: listagem global de sessões removida, login Google
  exige e-mail verificado, `JWT_SECRET` obrigatório em produção, páginas `/privacidade` e
  `/termos` + aceite 18+ no cadastro, página `/conta` (editar nome, exportar, excluir conta),
  limpeza de imagens no Supabase, exclusão de sessão só pelo mestre, limite de tentativas, senha
  mínima 8, explorer/openapi fora do ar em produção, token de redefinição em hash, fonte servida
  localmente, script do Google só no login/cadastro, aviso de apelido, limpeza de tokens vencidos.
- Últimos commits do período: api `791be49`, web `26a54ef`.
- **Regra permanente** `.claude/rules/lgpd.md` nos dois repos (checklist a cada implementação +
  linha "LGPD" no resumo final).
- Fora do código, pendente: revisão jurídica, direitos autorais dos textos copiados do livro,
  conferir `[rate-limit] IP do cliente obtido via ...` nos logs do Render, apagar as órfãs.

## Sessão 2026-10-16 — Testes de criação de ficha + correção das perícias do antecedente

- Regra de LGPD (`.claude/rules/lgpd.md` + seção no `CLAUDE.md`) commitada e enviada nos dois
  repos: api `4603fb3`, web `b7755d7`.
- **Testes de criação de ponta a ponta** (api, `src/__tests__/unit/services/character-creation.unit.ts`):
  payload no formato do wizard → `createCharacter` → espelho do que seria gravado
  (`persistedFromCreation` em `fixtures.ts`) → `loadCharacter`, em todas as combinações de
  raça/sub-raça × classe/subclasse × antecedente, mais testes de cada escolha. Detalhes em
  `dungeon-companion-testes.md`. Total da API: 258 testes.
- **Bugs achados e corrigidos** (api `3c3e2c0`, enviado):
  - perícias do antecedente nunca eram gravadas como treinadas (o wizard não as manda em
    `choices.skills`) — agora `computeSkills` marca as do antecedente e as fixas da raça;
  - `normalizeSkill('Atuação')` não virava `performance` (mapa em `calculator.ts`).
- **Fichas antigas corrigidas em produção** (2026-10-16, autorizado pelo usuário): 63 de 73
  fichas estavam sem perícias do antecedente; script pontual numa transação marcou 102 linhas de
  `character_skill` como treinadas (`trained_value` = bônus de proficiência da ficha) e inseriu 6
  que não existiam (fichas #1–#3). Recontagem depois: 0 afetadas. Scripts ficaram só no
  scratchpad da sessão (não versionados).
- **Pendente**:
  - o wizard do web não mostra as perícias do antecedente como concedidas na lista;
  - lacunas vistas e não tratadas: a criação não valida quantidade de perícias/magias nem
    proficiência de armadura; Meio-Elfo sem o +1 em dois atributos à escolha; itens iniciais
    com nome fora da tabela `item` são descartados em silêncio.

## Sessão 2026-10-16 (continuação) — Magias mecânicas, fase 1

Plano e status em **`dungeon-companion-magias-mecanicas.md`**. Lançar uma magia de ataque (ou
Mísseis Mágicos) agora abre o modal de rolagem como o ataque com arma; truques passaram a ser
lançáveis. Catálogo `spell-mechanics.ts` na API (19 magias). Enviado: api `c0909e4`, web `13d9934`.
API 274 testes, web 119.

## Sessão 2026-10-16 (continuação) — Magias mecânicas, fase 2 (resistência)

Detalhes em `dungeon-companion-magias-mecanicas.md`. 47 magias de resistência com dano abrem o
modal com a CD e o dano (inteiro e de quem passa); 66 sem dano mostram a CD no toast da mesa.
Enviado: api `a9ac41b`, web `659710b`. API 283 testes, web 127. Também corrigidas no banco 4
descrições de magia (Zombaria Viciosa, Onda Troveante, Onda Destrutiva, Rajada Mística).

## Sessão 2026-10-16 (continuação) — Magias mecânicas, fase 3 (cura)

Detalhes em `dungeon-companion-magias-mecanicas.md`. 8 magias de cura abrem o modal com a rolagem
de cura (log `heal`), incluindo Discípulo da Vida e Cura Suprema do Clérigo da Vida.
Enviado: api `3eb6902`, web `bf06297`. API 288 testes, web 131.

## Sessão 2026-10-16 (continuação) — Magias mecânicas, fase 4

Detalhes em `dungeon-companion-magias-mecanicas.md`: crítico dobrando os dados, Destruições/
Bruxaria/Marca do Caçador/Manto do Cruzado somando dano no acerto, e aplicar dano/cura no alvo
(opcional, com as permissões de PV atuais). Enviado: api `4f3b155`, web `5492760`.
API 291 testes, web 153.

## Sessão 2026-10-16 (continuação) — Efeitos de tela das magias

Projétil + explosão na cor do elemento pra magia de dano, névoa verde pra cura (azul-clara pra PV
temporários); arma continua com o golpe. Só CSS, sem imagens. Detalhes no fim de
`dungeon-companion-magias-mecanicas.md`. Enviado: web `7ac13e1`. Web 178 testes.

## Sessão 2026-10-16 (continuação) — Perícias do antecedente no wizard

- API: `/api/character-options` devolve em cada antecedente `skills` com o **nome da tabela
  `skill`** (antes ia a chave em inglês, ex.: "insight", que aparecia assim no wizard) e
  `skill_ids` novo.
- Web: as perícias do antecedente aparecem **já marcadas e travadas** no passo de perícias, com o
  selo "Antecedente" (as fixas da raça continuam "Raça"); não contam na escolha da classe nem
  podem ser escolhidas de novo; trocar o antecedente tira as antigas (e a especialização nelas).
  Ladino pode pôr Especialização nelas.
- Testes: api `character-options.service.unit.ts` (novo); web `character-wizard.component.spec.ts`
  (primeiro spec do wizard). Enviado: api `2126096`, web `f316a2f`. API 293, web 182.

## Sessão 2026-10-16 (continuação) — Explosão na entrada dos modais da sessão

- Componente novo `app-modal-burst` (web, só CSS pixel art): explosão atrás do painel quando ele
  aparece — `roll` (estouro dourado, toast de rolagem), `reveal` (vermelho-escuro, onda de choque
  dupla e brasas subindo, monstro revelado), `defeat` (estilhaços cinza caindo, monstro derrotado).
  Respeita o "efeitos de tela" e o "reduzir movimento".
- Os três painéis trocaram o "pop" (`roll-toast-pop`) por `modal-blast-in` (keyframe **global** em
  `styles.scss`, porque o SCSS do `session-panel` está no limite do orçamento de 32 kB — ficou em
  31,78 kB). Os outros toasts (magia lançada, pode subir de nível) continuam com o pop antigo.
- Testes: `modal-burst.component.spec.ts`. Enviado: web `976308e`. Web 186.

### Explosão também nos toasts de magia lançada e de subir de nível

Variantes novas em `app-modal-burst`: `spell` (violeta arcano, partículas em losango e anel
externo girando ao contrário) e `levelup` (verde e dourado, estrelas subindo). Agora os cinco
toasts/modais de aviso da sessão usam `modal-blast-in`; o keyframe antigo `roll-toast-pop` saiu
do SCSS do `session-panel` (ficou em 31,58 kB). Enviado: web `b03e1f5`. Web 188.

## Sessão 2026-10-16 (continuação) — Teste secreto (mestre pede, jogador rola)

- **Mestre**: botão "🔒 TESTE SECRETO" (desktop e celular) → escolhe jogadores e o teste
  (perícia ou resistência). `POST /api/game-session/{id}/secret-roll-request` (só o dono da
  sessão; valida jogadores com personagem, perícia 1–18, atributo, rótulo ≤ 60).
- **API**: pedidos em memória (`services/secret-roll-requests.ts`, 30 min, valem uma vez — reiniciar
  o servidor descarta os pendentes); evento `secret_roll_requested` vai **só pra sala do usuário
  alvo** (sala nova `session:{id}:user:{userId}` no socket, `eventTargetUserId`). A rolagem de
  resposta manda `secret_request_id`: a API confere sessão/personagem/usuário, consome o pedido e
  grava **oculta** (só o mestre recebe, mesmo mecanismo da rolagem oculta do mestre). Sem pedido
  válido → 409; jogador continua sem poder ocultar rolagem por conta própria.
- **Jogador**: aviso "O mestre pediu um teste de …" → ROLAR abre o modal com o bônus da ficha
  (perícia: total; resistência: salvaguarda), com "🔒 só você e o mestre veem" e sem rolar de novo.
  Vários pedidos ficam numa fila. Depois de recarregar a página o jogador não vê mais a própria
  rolagem secreta no log (é oculta) — só o mestre.
- Componentes novos no web (`secret-roll/`, SCSS próprio — o do `session-panel` está no limite).
- Testes: api `secret-roll-requests.unit.ts` + casos em `game-session.service.unit.ts`; web
  `secret-roll.spec.ts` + casos no modal, reducer e sessão. Enviado: api `f193bbc`, web `76b14b4`.
  API 303, web 200.

## Sessão 2026-10-16 (continuação) — Traços e habilidades mecânicos, fase 1

Plano, decisões do usuário e status em **`dungeon-companion-tracos-mecanicos.md`**. Fase 1: o
"USAR" das habilidades de classe passa a rolar/curar/mostrar CD, devolver o espaço (Criar Espaço de
Magia) e anunciar na mesa ("USOU"). Enviado: api `d8c4a16`, web `29bf359`. API 315, web 208.

## Sessão 2026-10-16 (continuação) — Traços mecânicos, fase 2 (somas no ataque)

Detalhes em `dungeon-companion-tracos-mecanicos.md`. Fúria/Arma Sagrada guardadas no personagem,
somas 1×/turno travadas pela vez do combate, crítico do Campeão, Crítico Brutal, ataque poderoso,
ataque desarmado/Rajada de Golpes. **Exige a migração `character.active_effects` em produção antes
do deploy da api** — aplicada em 2026-10-16 (autorizado; 73 fichas, coluna vazia). Enviado: api
`ddd5be7`, web `33e0a63`. API 331, web 220.

## Sessão 2026-10-16 (continuação) — Regra de registro do banco

- Regra nova na api: **`.claude/rules/banco-de-dados.md`** (referenciada no `CLAUDE.md`, mesmo
  formato das regras de LGPD e testes): estrutura → `docs/database/database.sql`; dados de
  referência (magias, perícias, armas…) → `docs/database/database_inserts.sql`; dados de usuários
  não vão pro seed (correção pontual fica no doc da sessão); autorização antes de mexer em
  produção; migração que o código novo lê roda antes do deploy; arquivos em CRLF; linha "Banco"
  no resumo final. O web não acessa o banco, não precisa da regra.
- Conferência feita: as 28 tabelas e todas as colunas de produção já estavam no `database.sql`.
  O seed estava com o texto antigo das 4 descrições de magia corrigidas hoje → atualizado com o
  texto de produção. `database.sql` tinha 5 linhas com LF puro (inseridas hoje) → normalizado pra
  CRLF.
- Script de conferência: `~/projects/docs/dungeon-companion-db-scripts/schema-diff.js` (só leitura).
- Enviado: api `9cc0f77`.

## Sessão 2026-10-16 (continuação) — Traços mecânicos, fase 3 (raça e talentos)

Detalhes em `dungeon-companion-tracos-mecanicos.md`: Arma de Sopro (habilidade de raça com
resistência e dano por nível), Resistência Implacável aplicada pela API ao zerar o PV, Sortudo do
Halfling (rolar o 1 de novo) e talento Sortudo (Pontos de Sorte). Sem migração. Enviado: api
`1d9e1b2`, web `e88a1ff`. API 341, web 227.

## Sessão 2026-10-16 (continuação) — Traços mecânicos, fase 4 (d20 e defesas)

Detalhes em `dungeon-companion-tracos-mecanicos.md`: Indomável (rolar resistência de novo),
Inspiração Bárdica entregue a um aliado e guardada no personagem dele (endpoint novo
`POST /api/game-session/{id}/bardic-inspiration`), lembretes de vantagem no d20 e defesas ao
aplicar dano (resistência por tipo, Fúria, Esquiva Sobrenatural, Evasão). Sem migração. API 347,
web 238. Enviado: api `1c39eba`, web `1f5fe40`.

## Sessão 2026-10-16 (continuação) — Correções da criação de ficha

Pendências da criação levantadas nos testes de ponta a ponta (enviado: api `c080950`, web
`ea4e1b4`; API 373, web 244):
- **Validação na API** (`character-sheet/creation-rules.ts`). Os erros viram 422; antes `build()`
  lançava `Error` comum e a criação respondia 500.
  - Perícias: cota da classe + escolhas livres da raça, sem repetir; só as da raça podem ficar
    fora da lista da classe (`CLASS_SKILL_CHOICES`, espelho de `skill-rules.ts` do web).
  - Magias: existem no banco, até o 1º círculo; truques ≤ cota da classe + truque racial; magias
    ≤ "Magias Conhecidas" / grimório (6) / 0 nas de lista cheia. **Não** confere se a magia é da
    lista da classe (a API só tem a lista das classes de lista cheia).
  - Armadura/escudo: proficiência da classe + Anão da Montanha (leve/média) + domínios de
    armadura pesada (Guerra, Natureza, Tempestade, Vida). Só na criação; trocar armadura na ficha
    (`PATCH equipment`) continua livre.
- **Meio-Elfo**: `choices.ability_bonus_choices` (2 atributos diferentes, menos CAR, +1 cada),
  obrigatório. O wizard ganhou os botões no passo da raça, limita o Meio-Elfo a 2 perícias fora
  da lista da classe e a armadura passou a considerar sub-raça e domínio.
- **Meio-Orc**: faltavam `skillProficiencies: ['intimidation']` e o traço "Ameaçador" na API (a
  Intimidação só ficava treinada porque o wizard mandava; nenhuma ficha em produção afetada).
- **Itens iniciais** (`character-sheet/starting-items.ts`): o texto do equipamento da classe e do
  antecedente quase nunca batia com o catálogo `item` e era descartado. Agora cada nome é mapeado
  para itens do catálogo: pacotes abertos, munição da arma entra; armas, armaduras, escudos e
  dinheiro ficam de fora. Os itens entram no **inventário da sessão** (`player_inventory_item`)
  quando o personagem entra numa sessão (`addPlayer`, mesma transação, soma quantidade). Decisão
  do usuário: os itens só aparecem na sessão. 23 itens novos no catálogo (ids 101–123:
  ferramentas, kits, lembranças do antecedente, itens dos pacotes) em `database_inserts.sql`.
- **Produção (2026-10-16, autorizado pelo usuário, numa transação)**: 23 itens novos na tabela
  `item` (ids 101–123, sequence acertada; total 123) e o equipamento inicial colocado no
  inventário dos 20 jogadores que já estavam em sessões: 257 linhas novas em
  `player_inventory_item` (de 7 para 264; nenhuma precisou somar quantidade). Script pontual no
  scratchpad da sessão (`starting-items-prod.js`, não versionado). As 5 fichas antigas de
  Meio-Elfo continuam sem o +1 (precisa da escolha do jogador).

## Sessão 2026-10-16 (continuação) — Pendências da criação

Enviado: api `ab596b8`, web `6354d00`. API 387, web 246.
- **Magia da lista da classe**: a API ganhou `class-spell-lists.ts` (cópia completa de
  `CLASS_SPELLS` do web, com truques, sem ids repetidos). `validateSpellChoices` recusa magia
  fora da lista ("Magia fora da lista da classe"), exceto **um** truque racial: Taumaturgia
  (Tiefling, id 333), Ilusão Menor (Gnomo da Floresta, 179) ou qualquer truque de mago (Alto
  Elfo). Os dois repositórios testam a mesma contagem/soma de ids por classe. O `CLASS_SPELLS`
  antigo de `rules.ts` (só magias com círculo das classes de lista cheia) continua como estava.
- **Armas do kit na ficha**: `STARTING_WEAPON_MAP` / `startingWeaponNames` em
  `starting-items.ts` (ex.: "Dois Machados de Mão" → Machadinha, "Bastão" → Bordão, "Clava
  (malagueta)" → Porrete). Na criação a API acrescenta essas armas às escolhidas no wizard, sem
  repetir (`findWeaponsByNames`). O endpoint de opções manda `starting_weapons` na classe e no
  antecedente; o wizard mostra essas armas marcadas e travadas com a etiqueta "KIT". Armadura do
  kit continua escolhida no wizard. Fichas antigas não mudam.
- **Decisões**: riqueza rolada + equipamento inicial continuam juntos; as 5 fichas antigas de
  Meio-Elfo ficam sem o +1.

## Sessão 2026-10-18 (continuação) — Talento Habilidoso (1.1.7)

Enviado: api `838169a`, web `cb4b879`. API 412, web 291.
- Bug: escolher o talento Habilidoso (`afiar-habilidades`) na subida de nível não abria nenhuma
  escolha — era pendência do bloco "Média" (talentos com tela de escolha) e nada era aplicado.
- **API**: `FeatRule.proficiencyChoice: {count: 3}`; `TOOL_PROFICIENCY_OPTIONS` (lista de
  ferramentas do livro) em `feats.ts`; o preview manda `feat_options[].proficiency_choice`
  (`count` + `tool_options`); `asi_or_feat` de talento aceita `skill_ids` e `tools`
  (`validateFeatProficiencies`: soma exata, sem repetir, perícia existente e ainda não treinada,
  ferramenta da lista; outro talento não aceita). Perícias viram treinadas no `applyLevelUp`
  (`featSkillIds`); perícias e ferramentas ficam no histórico (`choice_data.feat_proficiencies`,
  primeiro consumidor do mecanismo) e as ferramentas entram em
  `proficiencies_and_languages.tools` na ficha (lidas de `findChoiceData`).
- **Web**: página "PROFICIÊNCIAS DO TALENTO" no modal de subir de nível depois da Melhoria (só
  quando o talento escolhe), com perícias não treinadas e ferramentas, contador N/3; trocar de
  talento limpa; resumo lista o que foi escolhido.
- **Fichas afetadas, corrigidas em produção** (2026-10-18, escolhas e autorização do usuário,
  numa transação): Edrik Vaelor (#146) — Habilidoso: Percepção + Kit de Herbalismo + Ferramentas
  de Alquimista; e, à parte, Intuição como a perícia de Mago que faltava (tinha só 3 treinadas,
  provável sobreposição classe × antecedente na correção das perícias de 2026-10-16). Alden
  Dallking (#145) — Adestrar Animais + Percepção + Ferramentas de Ferreiro. 4 linhas de
  `character_skill` treinadas e o `choice_data` do nível do talento preenchido nas duas. As
  ferramentas só aparecem na ficha depois do deploy da api desta versão.
- Sem mudança de estrutura no banco (`choice_data` já existia).

## Sessão 2026-10-18 (continuação) — Aviso de subir de nível com vários personagens (1.1.6)

Enviado: api `b6e8d2c` (só a versão), web `cda9268`. Web 287.
- Bug: com XP pra vários personagens de uma vez, a api manda um `player_xp_granted` /
  `npc_xp_granted` com `can_level_up` por personagem, quase juntos; o toast "SUBIU DE NÍVEL" do
  painel era um só e cada evento substituía o anterior — a mesa via só um nome.
- Correção: o toast guarda `entries` (nome + avatar). Evento chegando com o aviso aberto entra
  no mesmo aviso (sem repetir o nome, mesma `key` pra não refazer a explosão) e reinicia o
  tempo; texto "THORIN, ANA E LYRA SUBIRAM DE NÍVEL!", avatares lado a lado
  (`.level-up-eligible-avatars` em `styles.scss`).

## Sessão 2026-10-18 (continuação) — Aviso de troca de vez em tela cheia (1.1.5)

Enviado: api `0ea8c9a` (só a versão), web `43cd0df`. Web 285.
- O usuário queria a troca de vez como notificação pra mesa, não só na lista de iniciativa.
  Componente novo `turn-change-toast` (SCSS próprio): overlay em tela cheia com explosão
  (`app-modal-burst` "roll"), card de quem jogou saindo pra esquerda, seta, card de quem vai
  jogar entrando com brilho, "VEZ DE <nome>" (ou "É A SUA VEZ!" pro dono do personagem) e
  "RONDA N"; some em 2,6 s (`TURN_CHANGE_TOAST_MS`) ou com clique. z-index 1050 (abaixo dos
  toasts de rolagem).
- Disparado no mesmo `afterRenderEffect` da 1.1.4 (`showTurnChangeToast`); o pulso na lista
  continua. `turnCardFor`: foto/avatar do jogador ou NPC; monstro com a imagem (mestre vê todos,
  jogador só os revelados — escondido vira "Monstro misterioso" com a imagem padrão).

## Sessão 2026-10-18 (continuação) — Animação na troca de vez do combate (1.1.4)

Enviado: api `23ea7f5` (só a versão), web `936daa6`. Web 279.
- Quando `current_turn_participant_id` muda no mesmo combate ativo (finalizar, pular, atrasar ou
  o mestre avançar — vale pra quem estiver vendo a sessão), um marcador do tamanho do card
  desliza do card do participante que jogou até o próximo na **lista de iniciativa**
  (`combat-order-item`, que existe pra jogadores, NPCs e monstros), e o card de destino pulsa.
- `session-panel/turn-transition.ts`: `shouldAnimateTurn`, `snapshotTurnOffsets` (posições
  relativas à lista, guardadas depois de cada renderização — ao atrasar a lista reordena antes
  da animação), `playTurnSlide` (Web Animations num elemento `fixed` no `<body>`; sem suporte ou
  com "reduzir movimento" só pulsa). Disparo por `afterRenderEffect` no painel; cards marcados
  com `data-turn-id`. CSS global em `styles.scss` (`.turn-slide-ghost`, `.turn-arrive`) por causa
  do limite do SCSS do painel.

## Sessão 2026-10-18 (continuação) — Aviso de conjuração longa e painel de aplicar (1.1.3)

Enviado: api `0215119` (só a versão), web `2df5b2d`. Web 274.
- **Conjuração longa em combate** (pergunta do usuário sobre Oração Curativa, 10 minutos): a tela
  de ações recebe `inCombat` (combate ativo na sessão); magia com tempo de 1 minuto ou mais
  (`isLongCastingTime`: "minuto"/"hora") mostra "⏳ 10 minutos — fora do ritmo do combate" e, ao
  lançar, pede confirmação (`confirm`) antes de gastar o espaço. É aviso, não trava (o mestre
  pode liberar). Fora do combate nada muda.
- **Painel de aplicar mais visível**: moldura colorida com brilho (vermelha no dano, verde na
  cura), título "⚔ APLICAR O DANO" / "✚ APLICAR A CURA", dica "Marque quem foi atingido",
  animação de entrada e "APLICAR EM N ALVOS" como botão principal.

## Sessão 2026-10-18 — Aplicar em vários alvos de uma vez (1.1.2)

Enviado: api `f65a8d6` (só a versão), web `c4ed2f8`. Web 271.
- O painel "Aplicar…" do modal de rolagem tinha um `<select>` de um alvo por vez. Agora lista
  os alvos com caixas de marcar (+ "TODOS"); cada linha mostra quanto o alvo recebe, com
  "PASSOU" (magia de resistência com metade) e "ESQUIVA" (Esquiva Sobrenatural) por alvo, e
  notas de resistência ao tipo e Evasão. "APLICAR EM N ALVOS" emite um `applyToTarget` por alvo
  (Evasão que passou fica 0, só registrado); alvos aplicados saem da lista.
- Cura distribuída (Preservar a Vida) continua alvo a alvo com quantidade (select).
- `amountFor`/`targetResistance`/… viraram funções por alvo (`amountForTarget`, `resistanceOf`,
  `canUncannyDodge`, `hasEvasion`); as de alvo único continuam (testes antigos inalterados).

## Sessão 2026-10-17 (continuação) — Jogador aplica dano/cura em aliados e monstros (1.1.1)

Enviado: api `99e0a58`, web `bfee048`. API 407, web 268.
- Antes: jogador só aplicava o resultado no próprio PV (regra da fase 4 das magias). Agora
  (decisão do usuário): qualquer jogador e NPC da sessão, e **dano** em monstro **revelado**.
- **API**: `POST /api/game-session/{id}/apply-amount` — o cliente manda só `id_character` (quem
  rolou), alvo, `amount` (1–9999) e `kind`; o servidor confere `canPostRollFor`, acha o alvo na
  sessão (monstro escondido = 404 pro jogador; jogador não cura monstro; PV temporário só em
  jogador), calcula com `applyHpAmount` (`src/services/hp-math.ts`) e grava. Resistência
  Implacável extraída pra `resolveRelentlessEndurance` (usada aqui e no PV do jogador). Eventos de
  PV de sempre (o de monstro continua só pro mestre) + `amount_applied` pra toda a mesa.
- **Web**: alvos do jogador = todos os jogadores (quem rolou primeiro), NPCs e monstros revelados
  (`damageOnly`, nome que a mesa vê); o modal não oferece monstro numa cura. Jogador aplica pelo
  endpoint novo; mestre continua no caminho antigo. Toast "APLICOU" reaproveita o de magia
  lançada (mesmo valor em vários alvos seguidos vira um aviso só).
- Sem mudança de banco. Versão **1.1.1** (melhoria) — pode virar 1.2.0 se o usuário preferir.

## Sessão 2026-10-17 — Imagens de referência na sessão (versão 1.1.0)

Enviado: api `f365277`, web `9236b97`. API 397, web 264.
- **Banco**: tabela nova `session_reference_image` (id, sessão com `ON DELETE CASCADE`, URL,
  legenda opcional até 120, data) + coluna `game_session.shown_reference_image_id` (FK
  `ON DELETE SET NULL`) — registradas em `database.sql`. **Migração aplicada em produção em
  2026-10-17** (autorizada pelo usuário, numa transação, antes do deploy da api); conferido no
  `information_schema` (colunas e regras das FKs) e `schema-diff.js` sem diferenças.
- **API** (só o mestre; 403 pra outros, 404 se não existe):
  `GET/POST /api/game-session/{id}/reference-images` (listar / subir multipart `image` +
  `title`), `POST /api/game-session/reference-image/{id}/show`,
  `POST /api/game-session/{id}/reference-images/hide`, `DELETE /api/game-session/reference-image/{id}`.
  Limite de 30 imagens por sessão; permissão, legenda e limite conferidos antes do upload; falha
  ao gravar descarta o arquivo. Eventos novos `reference_image_shown` / `reference_image_hidden`
  (sala da sessão inteira). `GameSessionDetail.shown_reference_image` pra quem entra depois.
- **LGPD**: URL entra em `isImageReferenced`, na limpeza ao apagar a sessão e ao apagar a imagem,
  na coleta de imagens da exclusão da conta e na exportação (`reference_images` em cada sessão
  do mestre). Política de Privacidade atualizada (seções 2 e 4, `LEGAL_LAST_UPDATED` 17/10).
- **Web**: botão "🖼 IMAGENS" do mestre (celular e desktop) abre a biblioteca
  (`reference-images-modal`: enviar com legenda, MOSTRAR, APAGAR, FECHAR PARA TODOS); a imagem
  em exibição abre em tela cheia pra todos (`reference-image-viewer`), cada um fecha só pra si
  (✕, clique fora, Esc) e o mestre fecha pra todos. Mostrar a mesma imagem de novo depois de
  fechada volta a aparecer.
- **Versão 1.1.0** (funcionalidade nova) nas notas e nos dois `package.json`.

## Sessão 2026-10-16 (continuação) — Versão do sistema e notas de versão

Enviado: api `c252e73`, web `5a6b14c`. Web 254.
- **Regra** `.claude/rules/versionamento.md` nos dois repos (referenciada nos `CLAUDE.md`):
  versão única `A.B.C` do sistema — A mudança grande (só por decisão do usuário), B
  funcionalidade nova, C correção ou funcionalidade pequena; uma entrega = uma versão (pela maior
  mudança); mudança só interna não gera versão; resumo final ganha a linha **Versão**.
- **Notas de versão** em `dungeon-companion-web/src/app/release-notes/release-notes.ts`
  (`RELEASES`, mais nova primeiro, com data `AAAA-MM-DD` e itens novidade/melhoria/correção). A
  primeira é a versão atual (`CURRENT_VERSION`) e precisa bater com o `version` do
  `package.json` dos dois repos (o do web é conferido no teste; o da api, à mão).
- **Página pública** `/novidades` (fora do `authGuard`, mesmo visual da política), link
  "NOVIDADES vX.Y.Z" no rodapé da home.
- **Versão inicial 1.0.0** (2026-10-16): resumo do que o sistema já tem. `package.json` dos dois
  repos foi de 0.0.0 / 0.0.1 pra 1.0.0.
- Teste `release-notes.spec.ts`: formato, passo único entre versões, datas em ordem, título e
  itens, `package.json`, data em português e a página renderizando todas as versões.
- **Histórico reconstruído** (pedido do usuário, web `df4e40f`): 54 versões 0.x
  (0.0.1 em 2026-09-04 → 0.34.1 em 2026-10-16) a partir dos 245 commits dos dois repos desde
  15/08 (o primeiro é de 04/09). Critério: commits api+web juntos = uma entrega; cada
  funcionalidade nova sobe B; correções/ajustes visuais do mesmo dia viram uma versão C;
  mudanças internas (CORS, build, testes, regras, seed) ficaram de fora. A 1.0.0 passou a listar
  só a página de Novidades (o resto está distribuído no histórico). Datas e agrupamentos são
  aproximados (não há registro dos deploys). Gerado por script no scratchpad (`history.py`).

## Sessão 2026-10-16 (continuação) — Falha: personagem de outro usuário na sessão

Achada durante as correções da criação: `addPlayer` e `addNpc` não checavam o dono do
`id_character`. Corrigido (api `ba62504`, 403/404, 5 testes), sem exploração em produção (0 de
20 jogadores e 0 de 9 NPCs), registrado em `dungeon-companion-incidente.md` e no item 16 de
`dungeon-companion-lgpd.md`. API 378.

## Estado atual (fim de 2026-10-18)

As seções de sessão acima estão na ordem em que foram escritas (as de 17 e 18/10 ficaram acima
das últimas de 16/10). Resumo por dia:

**2026-10-18** — versões 1.1.2 a 1.1.7:
1. **1.1.2** Aplicar dano/cura em vários alvos de uma vez (magia em área): lista com caixas,
   "PASSOU"/"ESQUIVA" por alvo, valor com resistência/Evasão, "APLICAR EM N ALVOS".
2. **1.1.3** Aviso de conjuração longa (1 minuto ou mais) durante o combate, com confirmação; painel
   de aplicar em destaque (moldura, título, botão principal).
3. **1.1.4** Animação na troca de vez na lista de iniciativa (marcador deslizando + pulso).
4. **1.1.5** Aviso de troca de vez em tela cheia pra mesa ("VEZ DE …" / "É A SUA VEZ!").
5. **1.1.6** Aviso de subir de nível junta todos os personagens aptos (antes só aparecia um).
6. **1.1.7** Talento Habilidoso escolhe 3 perícias/ferramentas na subida de nível; fichas antigas
   do Edrik (#146) e do Alden (#145) corrigidas em produção com as escolhas do usuário.
7. Dúvidas respondidas sem mudança de código: PV máximo 18 do Jeskerry (dado de vida rolado no
   nível 2), +8 de ataque do LeLeo (proficiência + DES + Arqueria), Oração Curativa (10 minutos).
8. Teste instável corrigido no `roll-modal.component.spec.ts` (20 natural virava crítico).

**2026-10-17** — versões 1.1.0 e 1.1.1:
1. **1.1.0** Imagens de referência na sessão: o mestre sobe imagens (com legenda) e mostra uma em
   tela cheia pra mesa; migração em produção; Política de Privacidade atualizada (17/10).
2. **1.1.1** Jogador aplica dano/cura em aliados, NPCs e monstros revelados (servidor calcula o
   PV, endpoint `apply-amount`), com aviso "APLICOU" pra mesa.
3. Histórico de versões reconstruído (0.0.1 a 0.34.1) a partir dos commits desde 04/09.

**2026-10-16** (detalhes nas seções acima):
1. Regra de LGPD commitada nos dois repos.
2. Testes de criação de ficha de ponta a ponta (todas as combinações) → bug das perícias do
   antecedente corrigido na api, nas 63 fichas antigas (produção) e no wizard (mostra como
   concedidas); `normalizeSkill('Atuação')` corrigido.
3. Magias mecânicas, fases 1 a 4: ataque, resistência, cura, crítico, magias que somam dano no
   ataque e aplicar dano/cura no alvo (opcional) — `dungeon-companion-magias-mecanicas.md`.
4. Efeitos de tela das magias (projétil elemental, névoa de cura).
5. Explosão na entrada dos 5 avisos da sessão (rolagem, magia, subir de nível, monstro revelado,
   monstro derrotado).
6. Teste secreto: o mestre pede, o jogador rola, só os dois veem o resultado.
7. Traços e habilidades mecânicos: plano e as 4 fases ("USAR" rola e anuncia; somas no ataque;
   raça e talentos com recurso; d20 e defesas).
8. Regra nova na api: toda mudança de banco registrada em `database.sql` / `database_inserts.sql`
   (`.claude/rules/banco-de-dados.md`).
9. Correções da criação de ficha: API valida perícias, magias e armadura (422); +1 do Meio-Elfo
   (escolha no wizard); Meio-Orc com Intimidação/Ameaçador; itens iniciais mapeados pro catálogo
   e colocados no inventário da sessão ao entrar (23 itens novos + inventário dos 20 jogadores
   já em sessão, em produção).
10. Falha de segurança corrigida: entrar na sessão / adicionar NPC com personagem de outro
    usuário (403/404), sem exploração — registrada como incidente.
11. Versão do sistema A.B.C (regra `.claude/rules/versionamento.md` nos dois repos), notas de
    versão e página pública `/novidades`; versão 1.0.0.

**Versão do sistema**: 1.1.7 (2026-10-18) — notas em `/novidades`.
**Últimos commits**: api `838169a`, web `cb4b879` (todos enviados; nada pendente nos repos).
**Testes**: api 412, web 291 — `dungeon-companion-testes.md`.
**Banco de produção alterado** (sempre com autorização do usuário, em transação):
- 2026-10-16: 102 linhas de `character_skill` marcadas como treinadas + 6 inseridas (perícias do
  antecedente das fichas antigas); 4 descrições de magia corrigidas
  (`dungeon-companion-spells-progress.md`, Atualização 3); coluna nova `character.active_effects`
  (fase 2 dos traços mecânicos); 23 itens novos no catálogo `item` + 257 linhas de equipamento
  inicial no inventário dos 20 jogadores em sessão (correções da criação de ficha).
- 2026-10-17: tabela `session_reference_image` + coluna `game_session.shown_reference_image_id`
  (imagens de referência).
- 2026-10-18: Habilidoso das fichas #146 e #145 (4 perícias treinadas + `choice_data`).
**LGPD**: Política de Privacidade mudou em 17/10 (imagens de referência) — falta o usuário decidir
se e como avisar os usuários; texto final ainda depende de revisão jurídica.

**Pendente / próximos passos** (consolidado):
- Magias: Arma Elemental; Golpe Constritor/Saraivada de Espinhos/Flecha Relampejante; crítico na
  ficha isolada (lá o ataque com arma ainda não rola dano); cura do Toque Vampírico; curas de
  valor fixo; opcional trocar o CSS dos efeitos por sprites pixel art (o usuário busca os arquivos).
- Criação de ficha: corrigida (seções "Correções da criação de ficha" e "Pendências da criação").
  Decisões do usuário: as 5 fichas antigas de Meio-Elfo ficam sem o +1; riqueza rolada **e**
  equipamento inicial continuam juntos (regra da mesa, diferente do livro).
- Traços mecânicos: o que ficou de fora das 4 fases (lembrete de vantagem não rola 2d20;
  resistências de magia/itens e monstros sem defesas automáticas; seção E continua texto) —
  `dungeon-companion-tracos-mecanicos.md`, "O que ficou de fora".
- Bloco "Média" da auditoria (`dungeon-companion-media-progress.md`): Dádiva do Pacto, talentos
  com tela de escolha que ainda faltam (Resiliente, Iniciado em Magia; o Habilidoso foi feito em
  1.1.7), Mestre de Batalha, catálogos grandes. O talento Atleta também dá +1 fixo em FOR (o
  livro deixa escolher FOR ou DES).
- Combate/sessão: opcional colocar no inventário da sessão o item dos kits escolhidos no
  Habilidoso (hoje só dá a proficiência, como no livro); opcional mostrar na ficha de onde vem o
  PV máximo (dado rolado × média por nível).
- Subclasses ainda não conferidas com o livro (`dungeon-companion-subclasses-fase2.md`).
- Antigos: ~109 rolagens excedentes numa sessão (perguntar antes de apagar); 38 imagens órfãs
  no Supabase (exclusão manual do usuário); revisão jurídica da Política/Termos; direitos
  autorais dos textos do livro; conferir o log `[rate-limit] IP do cliente obtido via ...` no
  Render.
