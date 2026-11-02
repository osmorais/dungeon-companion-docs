// Só leitura: quantos usuários acessaram o site nas últimas 24 h, 7 dias e 30 dias, pela coluna
// users.last_access_at (1.17.8; gravada no máximo uma vez por hora por usuário). Só números, nunca
// quem — dado pessoal não sai daqui. Rodar de dentro do repo da api, depois de `npm run build`:
//   node ~/projects/docs/dungeon-companion/scripts/db/usuarios-ativos.js
require(process.cwd() + '/node_modules/dotenv').config({path: process.cwd() + '/.env', quiet: true});
const {PostgresDatasource} = require(process.cwd() + '/dist/datasources');
(async () => {
  const sql = PostgresDatasource.getInstance().sql;
  const [r] = await sql`
    SELECT
      COUNT(*)::int                                                          AS contas,
      COUNT(*) FILTER (WHERE last_access_at >= NOW() - INTERVAL '24 hours')::int AS ultimas_24h,
      COUNT(*) FILTER (WHERE last_access_at >= NOW() - INTERVAL '7 days')::int   AS ultimos_7_dias,
      COUNT(*) FILTER (WHERE last_access_at >= NOW() - INTERVAL '30 days')::int  AS ultimos_30_dias,
      COUNT(*) FILTER (WHERE last_access_at IS NULL)::int                        AS sem_registro,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int      AS novas_30_dias
    FROM users
  `;
  console.table(r);
  console.log('sem_registro = contas que não voltaram desde a 1.17.8 (a coluna começou vazia).');
  await sql.end();
})().catch(e => { console.error(e.message); process.exit(1); });
