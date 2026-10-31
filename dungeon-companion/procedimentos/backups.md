---
resumo: Backups do repositório da api (antes da reescrita de autor) e como fazer rollback.
tipo: procedimento
status: ativo
atualizado: 2026-10-31
---

# Dungeon Companion — Backups e rollback

Registro dos backups existentes e de como usá-los pra rollback. Mantido de propósito (não apagar
sem decisão explícita do usuário) — serve tanto pra desfazer a reescrita de histórico quanto como
ponto de restauração pra outras necessidades.

## Backup 1 — `dungeon-companion-api` antes da reescrita de autor (2026-10-14)

**Local:**

```
/home/osmor/backups/dungeon-companion-api-antes-reescrita-2026-10-14.git
```

- Fica no Linux do WSL, fora de `~/projects`. Pelo Explorer do Windows:
  `\\wsl$\<distro>\home\osmor\backups\` (ou `\\wsl.localhost\<distro>\...`).
- ~728 KB. É um clone `--mirror` do GitHub (`git@github.com:osmorais/dungeon-companion-api.git`)
  feito imediatamente antes do force push — só o banco do git, sem os arquivos visíveis.

**Por que existe:** os commits do api estavam com e-mail de autor `osmorais` (inválido), então o
GitHub não os contava no gráfico de contribuições. O histórico foi reescrito com
`git filter-branch` trocando só esse e-mail por `osmorais5@gmail.com` (autor e committer); datas,
mensagens, commits de colaboradores e **conteúdo dos arquivos** ficaram idênticos — a árvore final
do `main` é a mesma antes e depois (`ed8e6ae…`). Force push feito pelo usuário nas 4 branches.

**Conteúdo (estado antigo do remoto):**

| Ref | Commit antigo | Commit novo equivalente |
|---|---|---|
| `main` | `f2d1240` | `3af1e96` |
| `develop` | `cb2d3f7` | `180f19c` |
| `056` | `ba61938` | `25e6cd6` |
| `58` | `f9d2e68` | `71252e7` |
| `refs/pull/1/head`, `refs/pull/2/head` | `ba61938`, `f9d2e68` | — (refs de PR, o GitHub não deixa reescrever; continuam apontando pros commits antigos) |

O `dungeon-companion-web` **não** foi reescrito e **não tem backup** desse tipo (não foi necessário).

---

## Como usar

### Rollback pra um ponto anterior do código (caso mais comum)

Como o conteúdo é idêntico, **normalmente não é preciso usar o backup**: todo commit antigo tem um
equivalente no histórico novo (tabela no final). Basta achar o hash novo e trabalhar no repositório
normal, por exemplo:

```bash
cd ~/projects/dungeon-companion-api
git log --oneline                        # histórico novo
git revert <hash-novo>                   # desfaz um commit específico, sem reescrever nada
git checkout <hash-novo> -- caminho/arq  # recupera um arquivo como estava naquele commit
```

### Ver/consultar o histórico antigo

```bash
git clone /home/osmor/backups/dungeon-companion-api-antes-reescrita-2026-10-14.git /tmp/api-antigo
cd /tmp/api-antigo && git log --oneline
```

### Recuperar uma branch antiga no repositório atual (sem tocar no GitHub)

```bash
cd ~/projects/dungeon-companion-api
git fetch /home/osmor/backups/dungeon-companion-api-antes-reescrita-2026-10-14.git main:backup-main-antigo
```

### Desfazer a reescrita inteira no GitHub (último recurso)

```bash
cd /home/osmor/backups/dungeon-companion-api-antes-reescrita-2026-10-14.git
git push --force --mirror git@github.com:osmorais/dungeon-companion-api.git
```

⚠️ Sobrescreve **o remoto inteiro** com o estado do backup: tudo que tiver sido commitado no api
depois de 2026-10-14 é **apagado do GitHub**. Antes de rodar: fazer um novo backup do estado atual
(`git clone --mirror` em outra pasta), conferir o que existe depois de `3af1e96`, e desligar o
deploy automático da api (GitHub Actions → workflow "Deploy API" → Disable; era o Render até a
1.17.0). Depois, cada clone local precisa de
`git fetch origin && git reset --hard origin/main`.

### Fazer um backup novo (mesmo procedimento)

```bash
mkdir -p ~/backups && cd ~/backups
git clone --mirror git@github.com:osmorais/dungeon-companion-api.git dungeon-companion-api-<motivo>-<AAAA-MM-DD>.git
```

Registrar o backup novo neste arquivo.

---

## Mapa completo de hashes do api (antigo → novo), branch `main`

Todos os 123 commits. Os commits de `develop`, `056` e `58` são todos ancestrais do `main` e estão
incluídos aqui. Hashes antigos citados em outros docs já foram trocados pelos novos.

| Data | Antigo | Novo | Mensagem |
|---|---|---|---|
| 2026-10-14 | `f2d1240` | `3af1e96` | Adiciona regra de testes para novas implementações |
| 2026-10-14 | `d7b3272` | `f7221a8` | Adiciona suíte de testes unitários e corrige atraso de turno no combate |
| 2026-10-14 | `28630c5` | `ef6e72a` | primeiros ajustes relacionados a proteção de dados |
| 2026-10-10 | `1cb2020` | `c409f55` | Permite ao mestre adicionar participantes a um combate já em andamento |
| 2026-09-26 | `85a26fc` | `1494a7b` | Permite debitar PO do personagem ao comprar item no mercado |
| 2026-09-26 | `dc991bd` | `cf971b0` | Adiciona inventário de itens único por sessão+jogador |
| 2026-09-20 | `4729a2a` | `e8ba5bb` | Adiciona Canalizar Divindade como recurso ativável do Paladino |
| 2026-09-20 | `615b0c5` | `2a6fc2f` | Corrige estilo de luta do Paladino/Ranger não aparecendo na ficha |
| 2026-09-20 | `6acd38e` | `8ebe649` | Permite ao mestre rolar iniciativa pelo jogador |
| 2026-09-20 | `69b1c6d` | `45fa343` | Adiciona duplicação de monstro na sessão |
| 2026-09-20 | `d06401a` | `66efb9f` | Libera ficha completa pra qualquer colega de sessão, não só o mestre |
| 2026-09-20 | `bb42e89` | `26d1497` | Anuncia magia lançada na sessão (evento informativo, sem persistência) |
| 2026-09-19 | `00c352b` | `9611ddf` | Trava preparo de magia durante o combate |
| 2026-09-19 | `79711f0` | `a27a071` | Upload de imagem pro personagem (jogador/NPC), pra usar como fundo do toast de rolagem |
| 2026-09-18 | `c45285a` | `3193f66` | Mestre reordena iniciativa, jogador atrasa turno, e vida temporária pros jogadores |
| 2026-09-14 | `b03258f` | `7115d3a` | Generaliza mecanismo de habilidades ativáveis pra além do Monge |
| 2026-09-13 | `a3d2e4c` | `f973434` | Corrige Clérigo/Druida/Paladino "aprendendo" magia nova no level-up |
| 2026-09-13 | `6c735d1` | `a38911f` | Adiciona endpoint de catálogo de magias paginado e com busca por nome |
| 2026-09-13 | `7a103ed` | `73d1e0f` | Adiciona descrição própria pra Expulsar Mortos-Vivos (Canalizar Divindade do Clérigo) |
| 2026-09-13 | `36e998a` | `de4e5e3` | Permite editar os atributos (FOR/DES/CON/INT/SAB/CAR) do monstro na sessão |
| 2026-09-13 | `284afa3` | `b39ebb3` | Adiciona edição de status (nome, PV, CA) de monstro na sessão |
| 2026-09-13 | `3ce7750` | `7b0705e` | Aumenta o limite de upload de imagem de 5 MB para 10 MB |
| 2026-09-12 | `bea69af` | `e6e569f` | Preenche descrição das perícias no seed do banco |
| 2026-09-12 | `84fcf34` | `06429bf` | Completa o catálogo de talentos com todos os do livro |
| 2026-09-12 | `f1e8061` | `de16e4e` | Adiciona rolagem de riqueza inicial na criação de personagem |
| 2026-09-12 | `7987b4c` | `883c710` | Generaliza recursos rastreáveis pra lista e implementa 9 ondas de itens "Média" |
| 2026-09-12 | `f46d272` | `58cbd79` | Corrige iniciativa de combate congelada (não acompanhava ASI nem talento Alerta) |
| 2026-09-12 | `f5a9ace` | `f311342` | Implementa talentos Alerta e Observador (bônus fixos de iniciativa e percepção passiva) |
| 2026-09-12 | `3953307` | `31f80eb` | Trava criação de personagem só no nível 1 por enquanto |
| 2026-09-12 | `cc1c284` | `71f0506` | Corrige gap: Estilo de Luta agora pode ser escolhido via level-up |
| 2026-09-12 | `6d25a3e` | `b5fbb2f` | Implementa itens fáceis da auditoria de mecânicas: Estilo de Luta, Duro, Aura de Proteção, Mente Escorregadia, Resiliência Dracônica e CDs fixas |
| 2026-09-12 | `b169f28` | `eec00f0` | Exibe talentos escolhidos no lugar do ASI na ficha |
| 2026-09-12 | `55dcaa0` | `1be2cc2` | Permite conceder XP a NPCs da sessão, não só jogadores |
| 2026-09-12 | `5c91e68` | `970e554` | Adiciona habilidades de chi ativáveis do Monge |
| 2026-09-11 | `6ff548d` | `00fd0a7` | Aplica bônus/escolhas de raça e classe que ficavam só em texto |
| 2026-09-11 | `6635a7e` | `6ced075` | Corrige aviso de XP suficiente pra subir de nível não disparar |
| 2026-09-10 | `b14e3c1` | `7da5490` | Implementa sistema de XP: tabela por nível, gating de level-up e concessão pelo mestre |
| 2026-09-10 | `258605b` | `a6cbb68` | Implementa efeito mecânico automático: atributo, resistência, deslocamento, especialização e recurso consumível |
| 2026-09-10 | `0384cb2` | `d6a492d` | Expõe explicações de raça/classe/antecedente no /api/character-options |
| 2026-09-10 | `4265093` | `df1f016` | Remove is_subclass_feature_level do preview do level-up (morto) |
| 2026-09-10 | `fdb7965` | `28b7312` | Inclui as features de cada opção de subclasse no preview do level-up |
| 2026-09-10 | `0bc2295` | `e978ec5` | Implementa Fase 1 completa e Fase 2 (subclasse) do level-up, e CA viva |
| 2026-09-09 | `32e35b7` | `d0a8adb` | Permite ao mestre trocar a imagem de um monstro já na sessão |
| 2026-09-09 | `7a45961` | `d7869b1` | Inclui image_url no evento monster_defeated |
| 2026-09-09 | `83f12b8` | `7369525` | Anuncia monstro revelado (nome + imagem) pra todos na sessão |
| 2026-09-09 | `af61a58` | `208e326` | Corrige falha de build no Render: @types/multer não resolvia |
| 2026-09-09 | `717198f` | `6a5d0bf` | Permite ao mestre subir uma imagem customizada de monstro |
| 2026-09-09 | `ca1dd46` | `79aa59e` | Permite ao mestre rolar dados ocultos dos jogadores |
| 2026-09-09 | `ad0c9d9` | `8115abe` | Expõe damage_modifier da arma e adiciona roll_type 'damage' |
| 2026-09-09 | `78f0abf` | `cee83b6` | Poda o histórico de rolagens pras últimas 30 por sessão |
| 2026-09-08 | `2350b9c` | `f0a4534` | Permite ao mestre marcar um monstro como derrotado |
| 2026-09-08 | `eea64d8` | `21ec3b2` | Permite ao mestre remover um monstro da sessão |
| 2026-09-08 | `f77b875` | `0f772a5` | Aceita token do payload de auth do socket.io, não só do cookie |
| 2026-09-08 | `b757a19` | `0d3d974` | Substitui SSE por socket.io na sincronização em tempo real da sessão |
| 2026-09-07 | `8994d9a` | `d76978e` | Adiciona bestiário de monstros (SRD), revelação em combate e PV de monstros/NPCs |
| 2026-09-07 | `cff167b` | `f3a807c` | Permite excluir personagem e todos os dados vinculados |
| 2026-09-05 | `a536e90` | `b073eb7` | Merge branch 'main' of github.com:osmorais/dungeon-companion-api |
| 2026-09-05 | `ce1a7c1` | `e9a7119` | Permite ao mestre gerenciar magias e descanso de personagens da sessão |
| 2026-09-05 | `321abf1` | `d2b930e` | Impede rolar iniciativa mais de uma vez pro mesmo participante |
| 2026-09-05 | `36ff890` | `a7a7859` | Implementa combate por turnos: iniciativa, ordem de ação e canal SSE |
| 2026-09-05 | `818cdfe` | `6e78663` | Separa listagem de sessões por papel (mestre vs jogador) |
| 2026-09-05 | `95586c1` | `1d5a5a8` | Implementa descanso curto e corrige o descanso longo |
| 2026-09-05 | `46b345e` | `d076256` | Adiciona ações de jogador: rolagens, log de sessão e espaços de magia |
| 2026-09-05 | `a499556` | `2bc5ac7` | Corrige cálculo de CA, vazamento de proficiências e acuidade |
| 2026-09-04 | `29ad781` | `52b8040` | Corrige agrupamento de magias por círculo em spells_known |
| 2026-09-04 | `32b46b5` | `d853f2f` | allow multiple comma-separated CORS_ORIGIN values |
| 2026-07-17 | `dd99233` | `7973772` | Add test coverage measurement script |
| 2026-06-04 | `23c6341` | `85fad97` | allow session DM to view player character sheets |
| 2026-06-04 | `c6f778a` | `4586b53` | add subrace support, new endpoints and character sheet improvements |
| 2026-06-04 | `cb2d3f7` | `180f19c` | add game session management endpoints |
| 2026-05-30 | `8e5d84e` | `6b3c976` | tela de anotações do personagem |
| 2026-05-17 | `39e4b7c` | `f36df8b` | novo avatar |
| 2026-05-17 | `87fcc97` | `c939efa` | Merge pull request #2 from osmorais/58 |
| 2026-05-17 | `f9d2e68` | `71252e7` | add traits das raças |
| 2026-05-13 | `623a2d6` | `f281510` | Merge pull request #1 from osmorais/056 |
| 2026-05-13 | `176fb1d` | `61357c3` | adicionando dados faltantes da classe |
| 2026-05-03 | `ba61938` | `25e6cd6` | [FEAT] 056 - Integração de Sign up e Sign In com google |
| 2026-05-02 | `5e8639e` | `527e497` | ajuste no build |
| 2026-05-02 | `3287947` | `22c71df` | [FIX] envio de email no render |
| 2026-05-02 | `9920f05` | `a06c17f` | envio de email de reset de senha |
| 2026-05-02 | `925b91c` | `94d68b5` | [feat] pagedlist + bearer token |
| 2026-05-01 | `f2010b7` | `a599529` | vinculo user character |
| 2026-04-30 | `a5abb95` | `358dab9` | equalizacao para continuar funcionando em dev |
| 2026-04-30 | `c9c4082` | `134e4bb` | ajuste |
| 2026-04-30 | `58f93fa` | `03a15e4` | ajustes build no render |
| 2026-04-30 | `8cb6e5a` | `7ce72f3` | [FEAT BIGGG] LOGIN DE USUARIOSSS |
| 2026-04-28 | `ce7ab6d` | `4459e56` | ajustes na tela de character-sheet e no retorno de spells |
| 2026-04-27 | `bf0da21` | `3d4b69b` | ajuste application.ts |
| 2026-04-27 | `1058871` | `74d0a37` | Ajustando package.json para deploy na hostinger |
| 2026-04-26 | `ed0be85` | `c2fe57d` | criacao da branch de desenvolvimento |
| 2026-04-26 | `5029254` | `96e3c2f` | configuracao de CORS |
| 2026-04-26 | `6f4ab34` | `d402a66` | [FIX] Retirando validacao isFinesse |
| 2026-04-25 | `00c9b1a` | `4d5b348` | Merge pull request #15 from osmorais/35 |
| 2026-04-25 | `3df2f4b` | `efc90ad` | [FEAT] 35 - Menu e listagem de personagens + Salvamento das pericias |
| 2026-04-24 | `2e65319` | `3eca9e2` | Merge pull request #14 from osmorais/20 |
| 2026-04-24 | `09ffa03` | `ea988a2` | [FEAT] 20 - Save e Get do personagem do banco de dados |
| 2026-04-23 | `f0f4656` | `1407eaf` | Merge pull request #13 from osmorais/28 |
| 2026-04-23 | `4e2b98f` | `dfe1f0c` | [FEAT] 28 - 29 - Passando objetos nas requisicoes e tela de selecao de armaduras |
| 2026-04-22 | `8bec02e` | `74978da` | Merge pull request #12 from osmorais/29 |
| 2026-04-22 | `53c9f72` | `42cd2f7` | [FEAT] 29 - Paginacao das listas de Magias e Armas |
| 2026-04-22 | `12ebef4` | `6841d5a` | Merge pull request #11 from osmorais/13 |
| 2026-04-22 | `e0dabf6` | `703cf55` | [FEAT] 13 - Trocando selects para pegar pelo ID |
| 2026-04-21 | `a1a0936` | `0c6b01b` | Merge pull request #10 from osmorais/26 |
| 2026-04-21 | `df603ad` | `cfb941c` | ajustando e movendo types |
| 2026-04-21 | `a697752` | `d27e756` | [FEAT] Carregando magias do banco de dados |
| 2026-04-21 | `f772203` | `e2b99a6` | [FEAT] 26 - Trazendo os dados do banco, mais ajustes gerais |
| 2026-04-21 | `f48a48d` | `930ea75` | Merge pull request #9 from osmorais/25 |
| 2026-04-21 | `2649ed3` | `431c235` | [FEAT] 25 - Populando o banco de dados |
| 2026-04-21 | `90d18be` | `552f0d4` | Merge branch 'main' of https://github.com/osmorais/dungeon-companion |
| 2026-04-21 | `6ff5cfd` | `4486542` | Merge pull request #6 from osmorais/04 |
| 2026-04-21 | `fb2b331` | `5a7da74` | Merge pull request #7 from osmorais/23 |
| 2026-04-21 | `e5275eb` | `0e38ecf` | [FEAT] Png dragon e scripts de banco de dados |
| 2026-04-21 | `4bf2740` | `77c6d29` | [FEAT] 04 - Criação da parte de perfil de ficha |
| 2026-04-21 | `a8619e4` | `80140b1` | ajuste na config do projeto |
| 2026-04-21 | `850701c` | `7f3e243` | Merge pull request #5 from osmorais/1 |
| 2026-04-20 | `c4474e4` | `44b639f` | [FEAT] 1 - Primeira versão da listagem de armas |
| 2026-04-20 | `2fb3948` | `cb516a9` | [FEAT] Scripts para geracao das tabelas |
| 2026-04-19 | `2f898b7` | `6525526` | Merge pull request #3 from osmorais/databaseConn |
| 2026-04-19 | `6449ff2` | `7f0b952` | [FEAT] conexao com database e exibicao no frontend |
| 2026-04-18 | `33b4754` | `11d6c5a` | Merge pull request #2 from osmorais/sheetChar |
| 2026-04-18 | `f326e7e` | `4655269` | [FEAT] visualizacao da ficha do personagem |
| 2026-04-18 | `b131f3a` | `279b6b2` | [FEAT] Api para criacao de fichas de rpg |
| 2026-04-17 | `cfe4264` | `f874a11` | [INIT] Creating the first application structure |
