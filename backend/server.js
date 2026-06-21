const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db/pool');
const exercises = require('./data/exercises-all');
const scenarios = require('./data/scenarios');

const app = express();
const PORT = process.env.PORT || 3001;

const BLOCKED_KEYWORDS = /\b(DROP|TRUNCATE|DELETE|INSERT|UPDATE|ALTER|CREATE|GRANT|REVOKE|EXEC|EXECUTE)\b/i;
const VALID_SCHEMAS = new Set(scenarios.map((s) => s.schema));

app.use(cors());
app.use(express.json());

function schemaFor(scenarioId) {
  const sc = scenarios.find((s) => s.id === scenarioId);
  return sc ? sc.schema : 'public';
}

// Ejecuta una consulta con el search_path fijado al schema del escenario
async function runScenarioQuery(schema, sql) {
  const safe = VALID_SCHEMAS.has(schema) ? schema : 'public';
  const client = await pool.connect();
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

// GET /api/scenarios - escenarios disponibles
app.get('/api/scenarios', (req, res) => {
  res.json(scenarios.map(({ schema, ...rest }) => rest));
});

// GET /api/exercises - ejercicios (filtrables por level y scenario)
app.get('/api/exercises', (req, res) => {
  const { level, scenario } = req.query;
  let result = exercises;
  if (scenario) result = result.filter((e) => e.scenario === scenario);
  if (level) result = result.filter((e) => e.level === level);
  res.json(result.map(({ solution, ...rest }) => rest));
});

// POST /api/query - ejecutar una consulta SQL
app.post('/api/query', async (req, res) => {
  const { sql, scenario } = req.body;
  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'Consulta SQL requerida' });
  }

  const trimmed = sql.trim();
  if (BLOCKED_KEYWORDS.test(trimmed)) {
    return res.status(403).json({
      error: 'Solo se permiten consultas SELECT. Operaciones de escritura no están permitidas.',
    });
  }

  try {
    const result = await runScenarioQuery(schemaFor(scenario), trimmed);
    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map((f) => f.name),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/check/:id - verificar la solución del usuario
app.post('/api/check/:id', async (req, res) => {
  const ex = exercises.find((e) => e.id === parseInt(req.params.id));
  if (!ex) return res.status(404).json({ error: 'Ejercicio no encontrado' });

  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: 'Consulta requerida' });

  if (BLOCKED_KEYWORDS.test(sql)) {
    return res.status(403).json({ error: 'Solo se permiten consultas SELECT.' });
  }

  const schema = schemaFor(ex.scenario);

  try {
    const [userResult, solutionResult] = await Promise.all([
      runScenarioQuery(schema, sql.trim()),
      runScenarioQuery(schema, ex.solution),
    ]);

    const userRows = userResult.rows;
    const solRows = solutionResult.rows;

    const isCorrect =
      userRows.length === solRows.length &&
      JSON.stringify(userRows) === JSON.stringify(solRows);

    res.json({
      correct: isCorrect,
      userRows,
      userFields: userResult.fields.map((f) => f.name),
      expectedRows: solRows,
      expectedFields: solutionResult.fields.map((f) => f.name),
      rowCount: userResult.rowCount,
      feedback: isCorrect
        ? '¡Correcto! Tu consulta devuelve los resultados esperados.'
        : `Casi... Tu consulta devuelve ${userRows.length} filas pero se esperan ${solRows.length}. Revisa los filtros o el ORDER BY.`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/hint/:id - revelar la solución
app.get('/api/hint/:id', (req, res) => {
  const ex = exercises.find((e) => e.id === parseInt(req.params.id));
  if (!ex) return res.status(404).json({ error: 'Ejercicio no encontrado' });
  res.json({ solution: ex.solution });
});

// GET /api/schema - ver el esquema de la BD del escenario
app.get('/api/schema', async (req, res) => {
  const schema = schemaFor(req.query.scenario);
  try {
    const result = await pool.query(`
      SELECT
        t.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default
      FROM information_schema.tables t
      JOIN information_schema.columns c
        ON t.table_name = c.table_name AND t.table_schema = c.table_schema
      WHERE t.table_schema = $1
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name, c.ordinal_position;
    `, [schema]);

    const out = {};
    result.rows.forEach((row) => {
      if (!out[row.table_name]) out[row.table_name] = [];
      out[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        default: row.column_default,
      });
    });

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
