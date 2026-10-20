require(process.cwd() + '/node_modules/dotenv').config({path: process.cwd() + '/.env', quiet: true});
const {PostgresDatasource} = require(process.cwd() + '/dist/datasources');
const API = 'http://localhost:3999';
const sql = PostgresDatasource.getInstance().sql;
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const ts = Date.now();
const A = {email: `lgpd-teste-${ts}-a@teste.invalid`, password: 'TesteLgpd#123'};
const B = {email: `lgpd-teste-${ts}-b@teste.invalid`, password: 'TesteLgpd#456'};
const results = [];
const uploaded = new Set();
function check(label, ok, extra = '') { results.push(`${ok ? 'OK  ' : 'FAIL'} ${label}${extra ? ' — ' + extra : ''}`); }

async function call(method, path, token, body, raw = false) {
  const headers = {Authorization: `Bearer ${token}`};
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(API + path, {method, headers, body: payload});
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return {status: res.status, json, text};
}
async function signup(u) {
  const res = await fetch(API + '/auth/signup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...u, full_name: 'Teste LGPD'})});
  const j = await res.json(); if (!j.token) throw new Error('signup falhou: ' + JSON.stringify(j));
  return j;
}
async function upload(path, token) {
  const fd = new FormData(); fd.append('image', new Blob([PNG], {type: 'image/png'}), 'foto-pessoa-real.png');
  const r = await call('POST', path, token, fd);
  if (r.status !== 200) throw new Error(`upload ${path} -> ${r.status} ${r.text}`);
  uploaded.add(r.json.image_url);
  return r.json.image_url;
}
async function isPublic(url) { const r = await fetch(url, {method: 'HEAD'}); return r.status === 200; }

(async () => {
  let ua, ub;
  try {
    ua = await signup(A); ub = await signup(B);
    const ta = ua.token, tb = ub.token, idA = ua.user.id;

    // --- personagem de A + imagem trocada
    const fx = require(process.cwd() + '/dist-test/__tests__/unit/fixtures.js');
    const input = fx.characterInput(); input.character_details.name = 'Heroi Teste LGPD';
    const created = await call('POST', '/api/character-sheet', ta, input);
    const ch = {id_character: created.json.id_character ?? created.json.character_sheet?.id_character ?? created.json.id};
    check('A cria personagem pela API', created.status === 200 && !!ch.id_character, String(created.status) + ' ' + Object.keys(created.json || {}).join(','));
    // Personagem "quebrado" (sem classe) — a exportação não pode cair por causa dele.
    await sql`INSERT INTO character (name, level, user_id) VALUES ('Quebrado LGPD', 1, ${idA})`;
    const img1 = await upload(`/api/character-sheet/${ch.id_character}/image`, ta);
    check('nome do arquivo é só UUID + extensão', /\/[0-9a-f-]{36}\.png$/.test(img1), img1.split('/').pop());
    const img2 = await upload(`/api/character-sheet/${ch.id_character}/image`, ta);
    check('trocar imagem do personagem apaga a antiga do storage', !(await isPublic(img1)) && (await isPublic(img2)));

    // --- B mestre, A jogador na sessão de B, A rola dado
    const sb = await call('POST', '/api/game-session', tb, {session_name: 'Mesa B LGPD', session_code: `LGPDB${ts}`.slice(0, 20), max_player_quantity: 4, dm_name: 'Mestre B'});
    const idSessB = sb.json.game_session?.id_game_session;
    check('B cria sessão', sb.status === 200 && !!idSessB, String(sb.status));
    const join = await call('POST', '/api/game-session/player', ta, {session_code: `LGPDB${ts}`.slice(0, 20), player_name: 'Jogador A', id_character: ch.id_character});
    check('A entra na sessão de B', join.status === 200, String(join.status));
    const roll = await call('POST', `/api/game-session/${idSessB}/roll`, ta, {id_character: ch.id_character, actor_name: 'Heroi Teste LGPD', roll_type: 'dice', label: 'Teste', dice_notation: '1d20', rolls: [11], advantage_state: 'normal', modifier: 0, total: 11});
    check('A rola dado na sessão de B', roll.status === 200, String(roll.status));

    // --- A mestre da própria sessão, com catálogo e monstro na sessão (imagens)
    const sa = await call('POST', '/api/game-session', ta, {session_name: 'Mesa A LGPD', session_code: `LGPDA${ts}`.slice(0, 20), max_player_quantity: 4, dm_name: 'Mestre A'});
    const idSessA = sa.json.game_session?.id_game_session;
    const [cat] = await sql`INSERT INTO monster_catalog (user_id, monster_api_slug, hp_max, ac, data_snapshot) VALUES (${idA}, 'goblin', 7, 15, ${sql.json({name: 'Goblin'})}) RETURNING id_monster_catalog`;
    const imgCat = await upload(`/api/monster-catalog/${cat.id_monster_catalog}/image`, ta);
    const [ms] = await sql`INSERT INTO monster_session (id_game_session, monster_api_slug, hp_current, hp_max, ac, data_snapshot, image_url) VALUES (${idSessA}, 'goblin', 7, 7, 15, ${sql.json({name: 'Goblin'})}, ${imgCat}) RETURNING id_monster_session`;
    const imgMs = await upload(`/api/game-session/monster-session/${ms.id_monster_session}/image`, ta);
    check('imagem do catálogo continua no storage enquanto o catálogo usa (era compartilhada com o monstro)', await isPublic(imgCat));

    // --- B (jogador? não — outro usuário) tenta apagar a sessão de A
    const forb = await call('DELETE', `/api/game-session/${idSessA}`, tb);
    const [stillA] = await sql`SELECT count(*)::int AS n FROM game_session WHERE id_game_session = ${idSessA}`;
    check('outro usuário NÃO consegue excluir a sessão de A', forb.status === 403 && stillA.n === 1, String(forb.status));

    // --- perfil e nome
    const prof = await call('GET', '/api/account', ta);
    check('perfil sem hash de senha', prof.status === 200 && prof.json.has_password === true && !('password_hash' in prof.json));
    const upd = await call('PATCH', '/api/account', ta, {full_name: '  Nome Corrigido  '});
    check('corrigir nome (aparado)', upd.json.full_name === 'Nome Corrigido');

    // --- exportação
    const exp = await call('GET', '/api/account/export', ta);
    const e = exp.json;
    check('exportação: status 200', exp.status === 200, String(exp.status));
    check('exportação: 2 personagens (1 ficha completa + 1 com aviso)', e.characters?.length === 2
      && e.characters.filter(c => c.aviso).length === 1
      && e.characters.some(c => !c.aviso && JSON.stringify(c).includes('Heroi Teste LGPD')), JSON.stringify(e.characters?.map(c => Object.keys(c).slice(0, 4))));
    check('exportação: 1 sessão como mestre com monstro', e.sessions_as_dm?.length === 1 && e.sessions_as_dm[0].monsters?.length === 1);
    check('exportação: 1 participação como jogador', e.sessions_as_player?.length === 1 && e.sessions_as_player[0].session_name === 'Mesa B LGPD');
    check('exportação: catálogo e rolagens', e.monster_catalog?.length === 1 && e.rolls?.length === 1);
    check('exportação: sem hash de senha nem dados de B', !exp.text.includes('password_hash') && !exp.text.includes(B.email) && !exp.text.includes(ub.user.id));

    // --- exclusão: confirmações erradas
    const wrongEmail = await call('POST', '/api/account/delete', ta, {confirm_email: 'x@y.z', password: A.password});
    const wrongPass = await call('POST', '/api/account/delete', ta, {confirm_email: A.email, password: 'errada'});
    check('exclusão recusa e-mail errado (422)', wrongEmail.status === 422, String(wrongEmail.status));
    check('exclusão recusa senha errada (422)', wrongPass.status === 422, String(wrongPass.status));

    // --- exclusão de verdade
    const del = await call('POST', '/api/account/delete', ta, {confirm_email: A.email.toUpperCase(), password: A.password});
    check('exclusão da conta A (200)', del.status === 200, String(del.status));

    const counts = await sql`SELECT
      (SELECT count(*) FROM users WHERE id = ${idA})::int AS users,
      (SELECT count(*) FROM character WHERE user_id = ${idA} OR id_character = ${ch.id_character} OR name = 'Quebrado LGPD')::int AS characters,
      (SELECT count(*) FROM game_session WHERE user_id = ${idA})::int AS sessions,
      (SELECT count(*) FROM player_session WHERE user_id = ${idA})::int AS participations,
      (SELECT count(*) FROM monster_catalog WHERE user_id = ${idA})::int AS catalog,
      (SELECT count(*) FROM monster_session WHERE id_monster_session = ${ms.id_monster_session})::int AS monsters,
      (SELECT count(*) FROM session_roll_log WHERE id_game_session = ${idSessB} AND actor_name = 'Heroi Teste LGPD')::int AS rolls_in_b,
      (SELECT count(*) FROM game_session WHERE id_game_session = ${idSessB})::int AS session_b`;
    const c = counts[0];
    check('banco: nada de A sobrou', c.users + c.characters + c.sessions + c.participations + c.catalog + c.monsters === 0, JSON.stringify(c));
    check('banco: rolagem de A na mesa de B foi apagada', c.rolls_in_b === 0);
    check('banco: sessão de B continua existindo', c.session_b === 1);
    const stillPublic = [];
    for (const u of [img2, imgCat, imgMs]) if (await isPublic(u)) stillPublic.push(u.split('/').pop());
    check('storage: imagens de A removidas (personagem, catálogo, monstro)', stillPublic.length === 0, stillPublic.join(', '));
    const me = await call('GET', '/api/account', ta);
    check('token antigo de A não acessa mais a conta', me.status === 404, String(me.status));

    // --- limpeza: B se exclui pela própria API
    const delB = await call('POST', '/api/account/delete', tb, {confirm_email: B.email, password: B.password});
    const [bLeft] = await sql`SELECT (SELECT count(*) FROM users WHERE id = ${ub.user.id}) + (SELECT count(*) FROM game_session WHERE id_game_session = ${idSessB}) AS n`;
    check('limpeza: conta B e a sessão dela apagadas', delB.status === 200 && Number(bLeft.n) === 0);
  } catch (err) {
    check('execução do roteiro', false, err.message);
  } finally {
    // Rede de segurança: nada de teste pode ficar no banco nem no storage.
    const ids = [ua?.user?.id, ub?.user?.id].filter(Boolean);
    if (ids.length) {
      await sql`DELETE FROM session_roll_log WHERE id_character IN (SELECT id_character FROM character WHERE user_id = ANY(${ids}))`;
      await sql`DELETE FROM users WHERE id = ANY(${ids})`;
    }
    const left = await sql`SELECT count(*)::int AS n FROM users WHERE email LIKE ${'lgpd-teste-' + ts + '%'}`;
    const {createClient} = require(process.cwd() + '/node_modules/@supabase/supabase-js');
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'monster-images';
    const leftovers = [];
    for (const u of uploaded) if (await isPublic(u)) leftovers.push(u.split(`/public/${bucket}/`)[1]);
    if (leftovers.length) await client.storage.from(bucket).remove(leftovers);
    results.push(`--- pós-teste: usuários de teste restantes=${left[0].n}; arquivos de teste que ainda precisaram ser removidos=${leftovers.length}`);
    console.log(results.join('\n'));
    await sql.end();
  }
})();
