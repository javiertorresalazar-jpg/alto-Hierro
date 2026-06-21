const { Pool } = require('pg');
const scenarios = require('./scenarios');

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

// Schemas válidos (lista blanca) para poder interpolarlos de forma segura
const VALID_SCHEMAS = new Set(scenarios.map((s) => s.schema));

// Resuelve el schema real a partir del id de escenario (p.ej. 'biblioteca')
function schemaFor(scenarioId) {
  const sc = scenarios.find((s) => s.id === scenarioId);
  return sc ? sc.schema : 'public';
}

// Ejecuta una consulta dentro de una transacción con el search_path fijado
// al schema indicado. Funciona también con el pooler de Supabase (pgbouncer).
async function runScenarioQuery(schema, sql) {
  const safe = VALID_SCHEMAS.has(schema) ? schema : 'public';
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL search_path TO ${safe}, public`);
    const res = await client.query(sql);
    await client.query('COMMIT');
    return res;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getPool, runScenarioQuery, schemaFor };
