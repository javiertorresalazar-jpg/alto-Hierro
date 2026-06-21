const { runScenarioQuery, schemaFor } = require('../_lib/db');
const exercises = require('../_lib/exercises-all');

const BLOCKED_KEYWORDS = /\b(DROP|TRUNCATE|DELETE|INSERT|UPDATE|ALTER|CREATE|GRANT|REVOKE|EXEC|EXECUTE)\b/i;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const ex = exercises.find((e) => e.id === parseInt(req.query.id));
  if (!ex) return res.status(404).json({ error: 'Ejercicio no encontrado' });

  const { sql } = req.body || {};
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
};
