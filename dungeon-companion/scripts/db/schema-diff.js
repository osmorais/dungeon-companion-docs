// Só leitura: colunas do banco de produção que não aparecem no docs/database/database.sql.
require(process.cwd() + '/node_modules/dotenv').config({path: process.cwd() + '/.env'});
const fs = require('fs');
const {PostgresDatasource} = require(process.cwd() + '/dist/datasources');
(async () => {
  const sql = PostgresDatasource.getInstance().sql;
  const doc = fs.readFileSync('docs/database/database.sql', 'utf8').toLowerCase();
  const cols = await sql`SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`;
  const tables = [...new Set(cols.map(c => c.table_name))];
  const missingTables = tables.filter(t => !new RegExp(`create table (if not exists )?"?${t}"?\\b`).test(doc));
  const missingCols = cols.filter(c => !doc.includes(c.column_name.toLowerCase()));
  console.log('tabelas no banco:', tables.length);
  console.log('tabelas sem CREATE no database.sql:', missingTables);
  console.log('colunas cujo nome não aparece no database.sql:', missingCols.map(c => `${c.table_name}.${c.column_name}`));
  await sql.end();
})().catch(e => { console.error(e.message); process.exit(1); });
