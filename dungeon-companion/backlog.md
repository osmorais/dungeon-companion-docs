---
resumo: Todas as pendências do Dungeon Companion num lugar só, por área. Fonte única do "o que falta".
tipo: backlog
status: ativo
atualizado: 2026-10-22
---

# Dungeon Companion — Backlog

Consolidado em 2026-10-20 a partir das seções "pendente / próximos passos / ficou de fora" que
estavam espalhadas nos docs. **Ao concluir um item, remover daqui** (o registro do que foi feito
vai pro `estado-atual.md` e pro doc de conceito da área). Item novo entra aqui, não no fim de
outro doc.

Nada aqui foi pedido pelo usuário ainda: são candidatos. Não começar sem pedido explícito.

## Ações do usuário / fora do código

- [ ] **Revisão jurídica** da Política de Privacidade, dos Termos de Uso e dos prazos do plano de
      incidente ([`procedimentos/incidente.md`](procedimentos/incidente.md)).
- [ ] **Avisar os usuários** das mudanças da Política em 17/10 (imagens de referência), 20/10
      (preferência de tema no navegador, 1.3.0), 22/10 (preferência do Tom, 1.6.8) e 22/10 (ranking
      global, 1.7.0) — decidir se e como.
- [ ] **Direitos autorais**: descrições de magias e várias subclasses vieram do Livro do Jogador em
      português (só o SRD é de uso livre). Risco para a divulgação.
- [ ] Conferir nos logs do Render a linha `[rate-limit] IP do cliente obtido via ...` (não pode ser
      "conexão direta").
- [ ] Apagar as **38 imagens órfãs** do Supabase (61 MB, exclusão manual pelo painel). Lista e
      cuidados: [`historico/imagens-orfas-2026-10-14.md`](historico/imagens-orfas-2026-10-14.md).
      Conferir depois com `scripts/lgpd/orphans-list.js`.
- [ ] **~109 rolagens excedentes** numa sessão antiga (`session_roll_log`, de antes da poda de 30
      por sessão). O usuário nunca respondeu se quer limpar — **perguntar antes de qualquer DELETE**.

## Magias

Contexto: [`conceitos/magias-mecanicas.md`](conceitos/magias-mecanicas.md).

- [ ] Arma Elemental (bônus de ataque).
- [ ] Golpe Constritor, Saraivada de Espinhos, Flecha Relampejante.
- [ ] Crítico também na ficha isolada (lá o ataque com arma ainda não rola dano).
- [ ] Cura do Toque Vampírico; curas de valor fixo.
- [ ] Opcional: trocar o CSS dos efeitos de tela por sprites pixel art (o usuário busca os arquivos).

## Cartas

Contexto: [`conceitos/cartas.md`](conceitos/cartas.md).

- [ ] Opcional: habilidades de classe com rolagem no aviso de lançamento (ficaram de fora na 1.5.0).

## Avatar

Contexto: [`conceitos/avatar.md`](conceitos/avatar.md). O usuário gera as folhas no ChatGPT e
coloca em `artes/avatar/<categoria>/`; o recorte segue o mesmo processo dos cabelos.

- [ ] **Barbas** novas (próxima categoria pedida).
- [ ] **Roupas** novas (folha masculina e feminina).
- [ ] **Chapéus/elmos**: camada nova acima do cabelo + aba nova no personalizador.
- [ ] Mover as folhas das molduras pra `artes/molduras/` e corrigir o nome `modulras-card-sombrio.png`
      (lembrar de ajustar `scripts/molduras/frames.py` e o comentário no `styles.scss` do web).
- [ ] **Rostos** (sobrancelha, olhos, nariz, boca): exige refazer as 18 bases sem rosto (9 raças ×
      2 gêneros) e regerar `race_skin/`; draconato fica de fora. A aba ROSTO (hoje só sorriso)
      vira essas quatro escolhas.

## Traços e habilidades mecânicos

Contexto e limitações atuais: [`conceitos/tracos-mecanicos.md`](conceitos/tracos-mecanicos.md),
seção "O que ficou de fora".

- [ ] Vantagem condicional rolar 2d20 sozinha (hoje é só lembrete).
- [ ] Resistências vindas de magia (Proteção contra Energia, Pele de Pedra…) e de itens nas defesas
      do alvo.
- [ ] Defesas automáticas de monstros (hoje ficam com o mestre).
- [ ] Indomável verificar se a resistência falhou.
- [ ] Seção E (visão no escuro, Ação Ardilosa, Forma Selvagem, companheiro animal, Ataque Extra…)
      continua texto — só se o usuário quiser.

## Bloco "Média" da auditoria (o que restou)

Contexto: [`conceitos/auditoria-mecanicas.md`](conceitos/auditoria-mecanicas.md) e
[`historico/media-progress.md`](historico/media-progress.md). Deslocamento de voo ficou de fora
por decisão do usuário.

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
- [ ] Quadro do Mestre: dano em área não aplica resistência do alvo sozinho (mestre marca ½).
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

## Técnico

- [ ] `npm test` da api tem débito de lint antigo (por isso a regra usa `npm run test:unit`).
- [ ] `player-actions-modal.component.scss` passou do aviso de 12 kB (12,34 kB na 1.7.2; o erro é
      só em 32 kB).
- [ ] `session-panel.component.scss` está perto do orçamento de 32 kB (compilado ~29,1 kB na
      1.3.16) — se crescer, quebrar o componente em vez de subir o limite.
