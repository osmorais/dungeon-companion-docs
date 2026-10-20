require(process.cwd() + '/node_modules/dotenv').config({path: process.cwd() + '/.env'});
const {PostgresDatasource} = require(process.cwd() + '/dist/datasources');
(async () => {
  const db = PostgresDatasource.getInstance();
  const sql = db.sql;
  const fks = await sql`
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, rc.delete_rule
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ORDER BY ccu.table_name, tc.table_name`;
  for (const r of fks) console.log(`${r.table_name}.${r.column_name} -> ${r.ref_table} [${r.delete_rule}]`);
  const cols = await sql`SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND (column_name ILIKE '%image%' OR column_name='user_id' OR column_name ILIKE '%snapshot%') ORDER BY 1`;
  console.log('---'); for (const c of cols) console.log(c.table_name + '.' + c.column_name);
  await sql.end();
})().catch(e => { console.error(e.message); process.exit(1); });
