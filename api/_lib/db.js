const { Pool } = require('pg');

// Reutilizamos el pool entre invocaciones de la función serverless
let pool;

function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL || '';
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    // Supabase transaction pooler requiere pgbouncer=true para funciones serverless
    const connectionString = !isLocal && !url.includes('pgbouncer')
      ? url + (url.includes('?') ? '&' : '?') + 'pgbouncer=true'
      : url;
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}

module.exports = { getPool };
