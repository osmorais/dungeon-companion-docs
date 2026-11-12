---
resumo: Todas as pendências do Dungeon Companion num lugar só, por área. Fonte única do "o que falta".
tipo: backlog
status: ativo
atualizado: 2026-11-12
---

# Dungeon Companion — Backlog

Consolidado em 2026-10-20 a partir das seções "pendente / próximos passos / ficou de fora" que
estavam espalhadas nos docs. **Ao concluir um item, remover daqui** (o registro do que foi feito
vai pro `estado-atual.md` e pro doc de conceito da área). Item novo entra aqui, não no fim de
outro doc.

Nada aqui foi pedido pelo usuário ainda: são candidatos. Não começar sem pedido explícito.

Desde 2026-11-05 as tarefas também ficam num **kanban no Monday**. Item com a marca **(card: Nome)**
já virou card lá; resumo, decisões e dúvidas de cada card em [`kanban.md`](kanban.md) (inclui cards
de funcionalidades novas que não estavam aqui: amigos, chat, sussurros, Minha Conta, telas de
criar/entrar em sessão, tutorial do Tom, painel de admin, homologação, artes dos monstros).

## Ações do usuário / fora do código

- [ ] (relacionado ao card: Ambiente de homologação) **Decidir**: a `main` da api e do web tem a regra "mudança só por pull request", e os pushes
      diretos (como o da 1.14.1, em 2026-10-27) passam porque a conta ignora a regra. Se a regra
      é pra valer (outro desenvolvedor no projeto), as entregas passam a ir por branch + PR.

- [ ] **Trocar credenciais** que apareceram por engano na saída de um comando numa sessão do Claude
      em 2026-11-09, se forem as de produção: senha do Postgres, `JWT_SECRET` (desloga todos os
      usuários) e senha do Supabase. O `GOOGLE_CLIENT_ID` é público.
- [ ] **Revisão jurídica** da Política de Privacidade, dos Termos de Uso e dos prazos do plano de
      incidente ([`procedimentos/incidente.md`](procedimentos/incidente.md)).
- [ ] **Avisar os usuários** das mudanças da Política em 17/10 (imagens de referência), 20/10
      (preferência de tema no navegador, 1.3.0), 22/10 (preferência do Tom, 1.6.8), 22/10 (ranking
      global, 1.7.0), 24/10 (nome de usuário, 1.9.0), 31/10 (servidor na Hostinger, 1.17.1) e 02/11
      (data do último acesso, 1.17.8) — decidir se e como.
- [ ] **Direitos autorais**: descrições de magias e várias subclasses vieram do Livro do Jogador em
      português, e desde a 1.10.0 as 428 fichas do Manual dos Monstros em português (inclusive as
      que não estão no SRD) aparecem pra todo mestre (só o SRD é de uso livre). Risco para a
      divulgação — apontado na revisão dos PRs da 1.10.0; decidir se mantém.
- [ ] Conferir no log da VPS (`journalctl -u forja-api | grep rate-limit`) a linha
      `[rate-limit] IP do cliente obtido via x-forwarded-for (último)` (não pode ser "conexão
      direta" nem `cf-connecting-ip`) — [`conceitos/infraestrutura.md`](conceitos/infraestrutura.md).
- [ ] **Apagar o serviço do Render** depois de alguns dias com a VPS estável (ficou de reserva na
      virada da 1.17.1, em 2026-10-31). Antes, conferir que nada mais chama
      `dungeon-companion-api.onrender.com`.
- [ ] Conferir em qual **data center** a VPS ficou (hPanel) e a região do Neon (no `PGHOST`): se o
      banco estiver nos EUA e a VPS no Brasil, cada consulta cruza o continente — avaliar mudar.
      Atualizar a seção 7 do [`conceitos/lgpd.md`](conceitos/lgpd.md) com o país da VPS.
- [ ] **Renovação da VPS** em 2028-10 (contrato de 24 meses a R$ 29,99/mês; renova a R$ 59,99/mês).
- [ ] Opcional: ativar o **Ubuntu Pro** na VPS (grátis pra uso pessoal; amplia as correções de
      segurança).
- [ ] Apagar as **38 imagens órfãs** do Supabase (61 MB, exclusão manual pelo painel). Lista e
      cuidados: [`historico/imagens-orfas-2026-10-14.md`](historico/imagens-orfas-2026-10-14.md).
      Conferir depois com `scripts/lgpd/orphans-list.js`.
- [ ] **Menções a D&D 5e fora da tela inicial** (oferecido na 1.8.1, sem resposta): o item 7 dos
      Termos (aviso de marca da Wizards of the Coast — protege o site; mudar exige atualizar a data
      dos Termos e passar pela revisão jurídica) e as partes que ninguém vê na tela (comando da IA
      em `ai-agent.service.ts`, descrições do Swagger, comentários, `CLAUDE.md`, `database.sql`).
- [ ] Tirar o `MAIL_RELAY_SECRET` do `/etc/forja-api.env` (`sudo sed -i '/^MAIL_RELAY_SECRET=/d'
      /etc/forja-api.env && sudo systemctl restart forja-api`) e do `.env` local da api — sem uso
      desde a 1.17.3 ([`conceitos/email.md`](conceitos/email.md)). O `forja-mail-config.php` da
      Hostinger já foi apagado (2026-11-02).
- [ ] **~109 rolagens excedentes** numa sessão antiga (`session_roll_log`, de antes da poda de 30
      por sessão). O usuário nunca respondeu se quer limpar — **perguntar antes de qualquer DELETE**.

## Magias

Contexto: [`conceitos/magias-mecanicas.md`](conceitos/magias-mecanicas.md).

- [ ] Arma Elemental (bônus de ataque). (card: Magias com mecânica pendente)
- [ ] Golpe Constritor, Saraivada de Espinhos, Flecha Relampejante. (card: Magias com mecânica pendente)
- [ ] Crítico também na ficha isolada (lá o ataque com arma ainda não rola dano). (card: Magias com mecânica pendente)
- [ ] Cura do Toque Vampírico; curas de valor fixo. (card: Magias com mecânica pendente)
- [ ] Opcional: trocar o CSS dos efeitos de tela por sprites pixel art (o usuário busca os arquivos).
- [ ] **Descrições de magia mais curtas que o livro** (comparação de 2026-10-31 com
      `referencias/magias.txt`, só leitura): ~100 das 357 que o leitor achou no livro têm menos de
      85% do tamanho do texto do livro. Dois tipos: **cortadas** (começo igual ao livro, param no
      meio: Perdição, Onda Destrutiva, Destruição Lancinante, Terreno Alucinógeno, Inseto Gigante,
      Moldar Rochas) e **resumidas** com outras palavras (as piores: Consagrar, Aura Mágica de
      Nystul, Metamorfose, Similaridade, Projeção Astral, Ilusão Menor, Desejo, Convocar Familiar).
      Barreira de Lâminas, Muralha de Vento e Conjurar Rajada já foram trocadas (1.17.1). Antes
      de corrigir em massa: conferir cada uma (o leitor junta a magia seguinte quando não acha o
      nome dela, ex.: Vidência + Vínculo Protetor) e decidir com o usuário. Correção no banco e no
      `database_inserts.sql`, com autorização. Contradiz o "361/361 conferidas" de
      `historico/spells-progress.md`.
- [ ] (card: Magias com mecânica pendente) Selo de dano: na tela de lançamento aparece o valor base, não o do personagem (a api não
      tem a ficha de quem lança ali). Se incomodar, mandar o selo junto no `spell-cast-stage`.
- [ ] (card: Magias com mecânica pendente) Filtro de magia de **ritual**: a tabela `spell` não guarda isso. Precisaria de coluna nova ou
      de uma lista no código (como `spell-tags.ts`).

## Cartas

Contexto: [`conceitos/cartas.md`](conceitos/cartas.md).

- [ ] Opcional: habilidades de classe com rolagem no aviso de lançamento (ficaram de fora na 1.5.0).

## Avatar

Contexto: [`conceitos/avatar.md`](conceitos/avatar.md). O usuário gera as folhas no ChatGPT e
coloca em `artes/avatar/<categoria>/`; o recorte segue o mesmo processo dos cabelos.

- [ ] **Barbas** novas (próxima categoria pedida). (card: Avatar: barbas, roupas e chapéus/elmos)
- [ ] (card: Avatar: barbas, roupas e chapéus/elmos) Opcional (oferecido na 1.8.1): pele original do meio-orc (`race/base_half_orc.png`, oliva)
      como mais um tom no personalizador — hoje só o card de exemplo da tela inicial usa.
- [ ] **Roupas** novas (folha masculina e feminina). (card: Avatar: barbas, roupas e chapéus/elmos)
- [ ] **Chapéus/elmos**: camada nova acima do cabelo + aba nova no personalizador. (card: Avatar: barbas, roupas e chapéus/elmos)
- [ ] Mover as folhas das molduras pra `artes/molduras/` e corrigir o nome `modulras-card-sombrio.png`
      (lembrar de ajustar `scripts/molduras/frames.py` e o comentário no `styles.scss` do web).
- [ ] **Rostos** (sobrancelha, olhos, nariz, boca): exige refazer as 18 bases sem rosto (9 raças ×
      2 gêneros) e regerar `race_skin/`; draconato fica de fora. A aba ROSTO (hoje só sorriso)
      vira essas quatro escolhas.

## Traços e habilidades mecânicos

Contexto e limitações atuais: [`conceitos/tracos-mecanicos.md`](conceitos/tracos-mecanicos.md),
seção "O que ficou de fora".

- [ ] Vantagem condicional rolar 2d20 sozinha também na rolagem **manual** (desde a 1.19.0 entra
      sozinha só quando o pedido de resistência traz o contexto). (card: Automação de traços)
- [ ] Resistências vindas de magia (Proteção contra Energia, Pele de Pedra…) e de itens nas defesas
      do alvo. (card: Resistências, imunidades e vulnerabilidades)
- [ ] Defesas automáticas de monstros (hoje ficam com o mestre). (card: Resistências, imunidades e vulnerabilidades)
- [ ] Forma Selvagem: a duração é só informativa (não volta sozinha quando acaba). (card: Automação de traços)
- [ ] Forma Selvagem de **druida NPC**: o dano aplicado vai direto no PV do druida, sem passar pela
      forma. (card: Automação de traços)
- [ ] Companheiro Animal: as resistências da besta não contam no dano aplicado nele. (card: Resistências, imunidades e vulnerabilidades)
- [ ] Magias só de resistência (sem jogada de ataque) não pedem o teste pelo modal de ações. (card: Automação de traços)
- [ ] (card: Automação de traços) O resto da seção E (traços sem número ou que dependem do mestre)
      continua texto — só se o usuário quiser.

## Bloco "Média" da auditoria (o que restou)

Contexto: [`conceitos/auditoria-mecanicas.md`](conceitos/auditoria-mecanicas.md) e
[`historico/media-progress.md`](historico/media-progress.md). Deslocamento de voo ficou de fora
por decisão do usuário.

Card: **Mecânicas de classe restantes** cobre os itens abaixo, menos os catálogos grandes.

- [ ] **Guerreiro — Mestre de Batalha**: Superioridade em Combate (dados de superioridade +
      manobras, reaproveita o padrão `ChiAbility`) e Estudioso da Guerra.
- [ ] **Guerreiro — Cavaleiro Arcano**: Vínculo com Arma.
- [ ] **Bruxo — Dádiva do Pacto** (nv3): escolha Corrente/Lâmina/Grimório. A coluna
      `character.chosen_pact_boon` já existe em produção; falta o tipo em `rules.ts`, a validação
      em `build()`/`confirmLevelUp` e a tela no wizard de level-up (mesmo padrão de
      `fightingStyleChoice`).
- [ ] **Bruxo — Arcana Mística** (escolha de magia por nível + rastreio por magia).
- [ ] **Talentos com tela de escolha**: Resiliente (atributo), Iniciado em Magia (classe + 2
      truques + 1 magia de 1º círculo). Usam `choice_data` (o Habilidoso já usa, 1.1.7).
- [ ] Talento **Atleta** dá +1 fixo em FOR; o livro deixa escolher FOR ou DES.
- [ ] **Catálogos grandes** (cada um é uma feature própria): Invocações Místicas, Metamágica em
      detalhe (hoje só o contador), Manobras do Mestre de Batalha.

## Subclasses

Contexto: [`conceitos/subclasses.md`](conceitos/subclasses.md).

- [ ] **Conferir com o livro** (o usuário reenvia as páginas): Cavaleiro Arcano (nível → feature),
      Mago (ordem 6º/10º de Necromancia; nível da Alquimia Menor), Bruxo (as 4 características de
      cada patrono), Paladino (Canalizar Divindade dos 3 juramentos; Vingador Implacável; Campeão
      dos Anciões), Ranger (opções do Conclave do Caçador).
- [ ] Subsistemas modelados só como texto (detalhes em
      [`historico/levelup-plan.md`](historico/levelup-plan.md), "Fase 2 — pendências futuras"):
      tabela de Surto de Magia Selvagem (d100), disciplinas do Caminho dos Quatro Elementos,
      terreno do Círculo da Terra (magias por terreno), escolhas por nível do Conclave do Caçador.

## Level-up

- [ ] **Multiclasse** (Fase 3 do plano original): N entradas classe+nível por personagem, só a
      partir do level-up (nível total 2+). Só começar com pedido explícito.

## Combate e sessão

- [ ] Opcional: colocar no inventário da sessão o item dos kits escolhidos no Habilidoso (hoje só dá
      a proficiência, como no livro).
- [ ] Opcional: mostrar na ficha de onde vem o PV máximo (dado rolado × média por nível).
- [ ] Quadro do Mestre: rolagens ocultas somem quando o log de 30 rolagens por sessão enche — se
      incomodar, guardar mais (ou guardar as ocultas à parte) na api.
- [ ] Quadro do Mestre: dano em área não aplica resistência do alvo sozinho (mestre marca ½). (card: Resistências, imunidades e vulnerabilidades)
- [ ] Quadro do Mestre: descanso do grupo não atualiza ficha/ações já abertas dos jogadores
      (só ao reabrir).
- [ ] Opcional: levar o padrão mobile (`.m-*`) pra login/cadastro/senha e conta (1.3.6 cobriu
      criar/entrar em sessão e catalogar monstro; 1.6.8, o wizard de criação).
- [ ] Decidir (oferecido na 1.3.16): esconder o quadro AVENTUREIROS da sessão no celular quando não
      há jogador.
- [ ] Opcional (oferecido na 1.3.18): depois de executar uma rolagem aberta pelas ações, reabrir a
      gaveta de ações quando o aviso do resultado some (hoje ela fecha pra mostrar o resultado).

- [ ] **Conferir a altura dos cards** com as molduras (1.7.1): antes cabiam 2 linhas de 3 cards
      sem rolar em 1080p; o anel e as barras deixaram o card mais alto (avatar já foi diminuído).
- [ ] Ranking: NPCs e monstros não entram; "monstros derrotados" só conta com dano **aplicado**
      (o mestre aplicando pelos cards não passa pela api de aplicar, então não conta).

- [ ] Conferir a sincronia do aviso de lançamento com **dois navegadores** (quem lança e a mesa) e
      as animações de quebra/vitória (1.7.2).
- [ ] Opcional (oferecido na 1.7.2): som na quebra (errou) e na saída de vitória.
- [ ] Conferir o **fundo padrão do card** na mesa (1.8.1): o card é mais largo que a imagem (2:3),
      então ela corta em cima e embaixo e as tochas podem sumir; o fundo vai sem escurecer — se o
      texto ficar difícil de ler, escurecer um pouco.
- [ ] Conferir a **moldura nova do SOMBRIO** (1.8.3) nos cards pequenos (mesa no celular, toasts):
      os cantos ficaram maiores (~27–34 px contra ~22 px) e os espinhos das laterais se repetem
      conforme a altura do card.

## Monstros

- [ ] (relacionado ao card: Melhorar tela de criar nova sessão — decidir junto) **Decidir o papel do catálogo do mestre** depois do bestiário (1.10.0). Catalogar existia pra
      trazer a ficha da dnd5eapi; hoje só serve pra personalizar (nome, imagem) e como atalho, mas
      continua obrigatório pra pôr monstro na mesa (o "catalogar agora" da sessão cria entrada como
      efeito colateral). Proposta (2026-10-25): "+ ADICIONAR" com abas BESTIÁRIO (direto da tabela
      `monster`, sem catalogar) e MEUS MONSTROS; catálogo vira "Meus monstros" (personalizar:
      nome editável + imagem). Em aberto: tela só de consulta ao bestiário e o nome ("Meus
      monstros" × "Catálogo"). Sem mudança no banco (`monster_session.data_snapshot` já é cópia).
- [ ] (card: Resistências, imunidades e vulnerabilidades) **Resistência dos monstros ao dano dos jogadores**: hoje o dano entra cheio num monstro
      resistente a fogo. A ficha já tem as listas (`damage_resistances` etc.), em texto do livro.
- [ ] (card: Resistências, imunidades e vulnerabilidades) Dano com **dois tipos** (cortante + fogo): se o alvo resiste a só um, o modal corta o dano
      inteiro pela metade (mesmo comportamento das magias). Resolver junto com o item acima.
- [ ] Bestiário: o "Cuspir Veneno" da Naga Guardiã está marcado como ataque — aparece ATACAR sem
      dano no acerto, mais o botão de resistência com o dano. Corrigir no seed e em produção.
- [ ] Lembrete do covil usa a iniciativa de quem joga, sem olhar quem **atrasou** o turno: com
      atraso na rodada, pode repetir ou pular.
- [ ] Conferir no navegador (1.11.0 a 1.13.2): aviso de revelação (carta caindo e virando, 30 s),
      explosão da derrota, carrossel trocando na vez do monstro, ataque de monstro revelado e
      escondido na tela de lançamento, gaveta do monstro (DERROTAR, REVELAR, editar, mão de cartas
      das ações cobrindo a tela toda), moldura do monstro no SOMBRIO.
- [ ] Conferir a leitura do texto e dos dados sobre os fundos novos (1.13.1/1.13.2): taverna e
      covil nas linhas de NPC/monstro, e principalmente o tapete do FANTASIA (mais claro) nos
      avisos. Se ficar difícil, escurecer com um degradê por cima, só onde precisar.
- [ ] Opcional: moldura da carta do monstro no tema FANTASIA (hoje usa a comum, com o "?").
- [ ] Na tela de lançamento do monstro o PÚBLICO/OCULTO some: a visibilidade segue o monstro estar
      revelado (trocar no meio deixaria a mesa com o aviso sem as rolagens). Pra um ataque
      secreto de monstro revelado, hoje é preciso escondê-lo antes. Decidir se vale uma opção na
      gaveta antes de rolar.
- [ ] Opcional: revisar as descrições das bestas e NPCs comuns (lobo, guarda, plebeu), mais curtas
      e simples que as dos monstros icônicos.
- [ ] Opcional: apagar `assets/broken.png` do web, sem uso desde a 1.11.0.
- [ ] Bestiário do mestre (1.14.0) carrega o catálogo inteiro (lotes de 50) e filtra no navegador.
      Se algum mestre passar de algumas centenas de monstros, levar os filtros pra api.

## Tela inicial

Contexto: [`conceitos/tela-inicial.md`](conceitos/tela-inicial.md).

- [ ] (card: Login com e-mail ou nome de usuário) **Entrar com e-mail ou nome de usuário** (sugestão do usuário no review do PR #7):
      o campo do login aceita os dois. Precisa de mudança na api (`/auth/login` procura por e-mail
      ou `LOWER(username)`, com a mesma mensagem de erro nos dois casos). O preenchimento automático
      já foi resolvido de outro jeito na 1.13.3 (o e-mail é o identificador nas duas telas).

- [ ] Conferir no navegador (1.8.1): logo grande na abertura empurra os botões pra baixo em
      notebook baixo; Tom maior pode cobrir o canto do card, principalmente no celular.
- [ ] O painel do mestre da seção MESTRES é uma ilustração própria, não o Quadro do Mestre real
      (apontado na revisão da 1.8.0; uma tentativa de copiar o quadro real foi descartada pelo
      usuário).

## Criação de ficha

- [ ] **Botão "aplicar sugestão" nos atributos**: distribuir os valores (matriz padrão ou rolagem)
  pela prioridade da classe (1.17.10 só sugere) — [`conceitos/criacao-de-ficha.md`](conceitos/criacao-de-ficha.md).

## Amigos

- [ ] **Presença offline:** no teste local (2026-11-09) dois amigos apareceram offline um para o
      outro mesmo com o status online, e a api não tinha nenhuma conexão de navegador aberta no
      momento da conferência. O endpoint `/social` respondeu normalmente. Testar em produção,
      olhando em DevTools → Network → WS se o socket conecta (101) e se "Mostrar aos meus amigos
      quando estou online" está marcada. Sem isso, os cards ficam todos apagados.
- [ ] Corridas raras apontadas no code review: mesa acima do limite quando dois convidados aceitam
      ao mesmo tempo (contagem e insert em `addPlayer` não são atômicos, sem constraint); aceitar
      convite não é transacional (queda entre `claim` e `addPlayer` deixa o convite `accepted` sem
      jogador); aceitar solicitação e bloquear ao mesmo tempo pode deixar amizade e bloqueio juntos.
- [ ] Socket social guarda o token da conexão inicial: token rejeitado ao reconectar deixa o tempo
      real parado até recarregar a página.
- [ ] Limpeza: `docs/database/database.sql` lista só 2 dos 5 valores de `notification.type` (a regra
      manda manter o comentário atualizado); `UserBlockService.isBlockedEither` sem uso;
      `GET /api/friend-requests/count` sem uso pelo web.
- [ ] Limitações aceitas: convite que falha na criação da sessão não avisa (dá pra convidar de novo
      dentro dela); criação mostra até 50 amigos, sem busca e sem recado; erro ao convidar pelo
      card perde o recado digitado; ícone de remover/recusar é o caractere ✕, sem arte própria.

## Técnico

- [ ] Teste instável na api: o `before each` de "Criação de personagem → ficha gravada"
      (`character-creation.unit.ts`) estourou os 2 s uma vez em 15 rodadas (máquina carregada,
      2026-10-24). Se repetir, subir o `timeout` do bloco. Em 2026-10-30 uma rodada deu
      "492 passing, 1 failing" e as 4 seguintes deram 517 (não deu pra ver qual teste).
- [ ] `npm test` da api tem débito de lint antigo (por isso a regra usa `npm run test:unit`).
- [ ] **`CONNECT_TIMEOUT` do banco** (2026-11-02, 03:08 e 03:09 UTC): dois "esqueci minha senha"
      deram 500 porque a api não conectou no Neon (`write CONNECT_TIMEOUT undefined:undefined`, em
      `clearExpiredResetTokens`), no mesmo processo; minutos depois funcionou. Suspeita: o Neon
      grátis dormindo de madrugada (ou rede VPS → Neon). Se repetir: ver o horário em
      `journalctl -u forja-api | grep CONNECT_TIMEOUT`, o painel do Neon e a região do `PGHOST`
      (item da VPS acima); opções: subir o `connect_timeout` do driver em
      `postgres.datasource.ts` ou tentar de novo uma vez antes de dar erro. Roteiro no
      [`procedimentos/servidor-api.md`](procedimentos/servidor-api.md).
- [ ] **Otimizar as imagens do site** nós mesmos: os fundos de `public/backgrounds/` são PNG de
      1,3–1,7 MB (2036 px de largura). Gerar WebP com boa qualidade (~150–300 KB) e trocar em
      `background.service.ts`; conferir também os PNG grandes de `src/assets`. Motivo: a
      otimização automática da CDN da Hostinger, que fazia isso, comprimia demais e foi
      **desligada** em 2026-10-31 (ver [`gotchas.md`](gotchas.md)).
- [ ] **Segurança (revisão de 2026-11-02, ver [`conceitos/lgpd.md`](conceitos/lgpd.md))**:
      - Restam 27 alertas do `npm audit --omit=dev` na api (25 moderados, 2 altos), todos
        dentro da própria LoopBack 15 (o "conserto" do npm seria voltar pra versões antigas
        dela). Os 2 altos (`undici` 5 e `@fastify/busboy`) vêm do `openapi-typescript`, que só
        busca specs OpenAPI remotas — caminho que a api não usa. Esperar a LoopBack atualizar;
        conferir de tempos em tempos (`npm audit --omit=dev`). O `@anthropic-ai/sdk` (moderado) só
        importa se a IA for reativada.
      - CSP completa no site (de onde podem vir scripts, estilos, imagens, conexões): hoje só
        `frame-ancestors` e `upgrade-insecure-requests` (1.17.7). Delicado por causa do login do
        Google, dos estilos do Angular, das imagens do Supabase e da api — testar com
        `Content-Security-Policy-Report-Only` antes de valer.
      - Dependências de build do web (26 alertas): só ferramenta, atualizar com o tempo.
- [ ] Dependências **descontinuadas** na api (avisos do `npm ci`): eslint 8, glob 7/10, rimraf 3,
      inflight. Quase tudo ferramenta de build/lint; atualizar com calma.
- [ ] O teste instável abaixo agora também **trava o deploy** (o GitHub Actions roda
      `test:unit` antes): se a Action falhar só nele, rodar de novo pelo botão "Re-run".
- [ ] `player-actions-modal.component.scss` passou do aviso de 12 kB (13,3 kB na 1.7.4; o erro é
      só em 32 kB) — se crescer muito, separar partes (DANO/CURA, SUA VEZ) em componentes.
- [ ] `session-panel.component.scss` está perto do orçamento de 32 kB (compilado 28,3 kB na
      1.8.1) — se crescer, quebrar o componente em vez de subir o limite.
- [ ] Limpeza: as classes `player-card--has-bg` / `mobile-player-card--has-bg` do
      `session-panel.component.html` ficaram sem regra no CSS (1.8.1).
