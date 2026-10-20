require(process.cwd() + '/node_modules/dotenv').config({path: process.cwd() + '/.env', quiet: true});
const {createClient} = require(process.cwd() + '/node_modules/@supabase/supabase-js');
const {PostgresDatasource} = require(process.cwd() + '/dist/datasources');
(async () => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'monster-images';
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const files = []; let offset = 0;
  for (;;) {
    const {data, error} = await client.storage.from(bucket).list('', {limit: 1000, offset, sortBy: {column: 'created_at', order: 'asc'}});
    if (error) throw error;
    files.push(...data.filter(f => f.id)); if (data.length < 1000) break; offset += 1000;
  }
  const sql = PostgresDatasource.getInstance().sql;
  const refs = await sql`SELECT image_url FROM character WHERE image_url IS NOT NULL UNION SELECT image_url FROM monster_catalog WHERE image_url IS NOT NULL UNION SELECT image_url FROM monster_session WHERE image_url IS NOT NULL`;
  const used = new Set(refs.map(r => decodeURIComponent(r.image_url.split(`/object/public/${bucket}/`)[1] || '')));
  const orphans = files.filter(f => !used.has(f.name));
  const pub = n => client.storage.from(bucket).getPublicUrl(n).data.publicUrl;
  console.log(JSON.stringify({bucket, total: files.length, used: used.size, orphans: orphans.map(f => ({name: f.name, size: f.metadata?.size || 0, created_at: f.created_at, url: pub(f.name)}))}));
  await sql.end();
})().catch(e => { console.error('erro:', e.message); process.exit(1); });
