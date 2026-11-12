---
resumo: Sistema de amigos (1.18.0): solicitações, bloqueio, presença, notificações, convites para mesa e a tela /amigos.
tipo: conceito
status: ativo
atualizado: 2026-11-09
---

# Dungeon Companion — Amigos

Entrou na **1.18.0** (2026-11-09, PRs web #9 e api #6).
LGPD: [`lgpd.md`](lgpd.md). Pendências: seção "Amigos" do [`backlog.md`](../backlog.md).

## Tabelas

Todas com `ON DELETE CASCADE` a partir de `users` (`docs/database/database.sql` da api):

- `friend_request`: uma pendente por par (`uq_friend_request_pending_pair`); status `pending`,
  `accepted`, `rejected`, `cancelled`.
- `friendship`: uma linha por par (`user_low_id`, `user_high_id`).
- `user_block`: quem bloqueou quem.
- `notification`: `dedupe_key` única por destinatário.
- `session_invite`: um pendente por pessoa e mesa (`uq_session_invite_pending`), vale 7 dias.
- Em `users`: `discoverable`, `accept_friend_requests`, `presence_visibility`, `show_last_seen`.

## Endpoints

- Amigos: `GET /api/friends` (conectados primeiro), `DELETE /api/friends/{userId}`.
- Solicitações: `GET /api/friend-requests/received`, `/sent`, `/count`; `POST /api/friend-requests`,
  `POST .../{id}/accept`, `.../{id}/reject`, `DELETE .../{id}`.
- Busca: `GET /api/users/search`.
- Bloqueio: `GET /api/users/blocked`, `POST` e `DELETE /api/users/{id}/block`.
- Presença: `GET` e `PUT /api/presence/me`.
- Notificações: `GET /api/notifications`, `/unread-count`, `PATCH .../{id}/read`, `POST .../read-all`.
- Convites: `GET /api/session-invites/received`, `/sent`; `POST /api/session-invites`,
  `POST .../{id}/accept`, `.../{id}/reject`, `DELETE .../{id}`.
- Limites (`RATE_LIMITS`): 30 solicitações/h, 120 buscas/15 min, 60 bloqueios/15 min, 30 convites/h.

## Regras

- **Recusa:** 30 dias até o mesmo remetente poder enviar de novo.
- **Cancelar e reenviar:** livre, mas a notificação é **uma por remetente e por dia UTC**
  (`dedupe_key` = `friend_request_received:{remetente}:{AAAA-MM-DD}`).
- **Botões da notificação:** `GET /api/notifications` devolve `pending_friend_request_id`, a
  solicitação pendente **de agora** entre os dois. O `payload` guarda a primeira do dia, que pode
  já ter sido cancelada. Sem pendente, a notificação fica só como histórico.
- **Bloquear:** na mesma transação desfaz a amizade e cancela solicitações e convites pendentes.
- **Desfazer amizade:** na mesma transação cancela os convites para mesa pendentes, nas duas direções.
- **Entrar na mesa pelo código** fecha o convite pendente daquela mesa como `accepted`, sem
  notificar o mestre. Falha aqui só vai pro log, porque o jogador já entrou.
- **Aceitar convite** reserva o convite (`claim`), chama `GameSessionService.addPlayer` e, se a
  entrada falhar, devolve o convite pra pendente.
- **Não revelar o bloqueio:** ao convidar, quem bloqueou o mestre responde como quem só não é amigo
  (422 "Só é possível convidar amigos"). Em `POST /api/friend-requests` fica o 404 de jogador
  inexistente, coerente com a busca, que também esconde quem bloqueou.

## Presença

Fica **em memória** na api (`PresenceService`), nunca no banco, e vale para uma instância só.

1. O sino do topo abre o socket `/social` enquanto o usuário está logado, com heartbeat a cada 25 s.
2. Sem heartbeat por 70 s, a conexão cai.
3. O status escolhido (online, ausente, ocupado) só é mostrado enquanto há conexão aberta.
4. `presence_visibility = 'nobody'` aparece sempre offline.
5. Na lista, conectados vêm primeiro, menos quem esconde a presença, pra ordem não entregar. Um
   amigo que conecta acende no lugar; a ordem só muda na próxima carga.

## Tela `/amigos` (web)

Uma tela só, sem abas. Área principal com os cards e coluna à direita com pedidos, convites e
enviados; abaixo de 1000 px a coluna vem primeiro.

- **Cards** (`.framed-card` + `--character-card-bg`), sem anel: acesos com brilho quem está por
  perto, apagados (dessaturados) quem está offline.
- **Busca única:** filtra os amigos e, com 2 letras ou mais, mostra "Outros jogadores" (sem quem
  já é amigo).
- **Ações:** `friends/icon-action.component.ts`, ícone com dica (`data-tip`) que também é o nome
  acessível.
- **Bloqueados:** link no fim da coluna, abre uma janela.
- **Resposta imediata:** toda ação muda a tela no clique, trava o botão até a resposta e volta
  ao estado anterior se a API recusar (`removeCard`, `runOnPlayer`). `PagedState`
  (`friends/paged-state.ts`) ignora resposta antiga e volta de página quando a atual fica vazia.

## Convidar para a mesa

- Pelo card do amigo (`app-session-invite-modal`): a janela fecha no clique e o erro aparece na
  página, com o recado perdido.
- Dentro da sessão, só o mestre (`app-session-friends-invite`): marca NA MESA e CONVIDADO.
- Na criação da sessão: seção igual à de NPCs, até 50 amigos, sem busca e sem recado. Os convites
  saem depois de salvar; convite que falha não impede de abrir a sessão e não avisa.

## Notificações

Painel no topo (`notification-center/`): ícone por tipo, nome em dourado e, na solicitação, título
"Solicitação de amizade" com aceitar e recusar. Todos os links levam a `/amigos`, exceto convite
aceito, que leva à mesa. No celular, o resto da tela escurece com o painel aberto.
