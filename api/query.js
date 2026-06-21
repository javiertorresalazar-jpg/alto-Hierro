const { getPool } = require('./_lib/db');

const BLOCKED_KEYWORDS = /\b(DROP|TRUNCATE|DELETE|INSERT|UPDATE|ALTER|CREATE|GRANT|REVOKE|EXEC|EXECUTE)\b/i;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { sql } = req.body || {};
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
    const result = await getPool().query(trimmed);
    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map((f) => f.name),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
