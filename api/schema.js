const { getPool, schemaFor } = require('./_lib/db');

module.exports = async (req, res) => {
  const schema = schemaFor(req.query.scenario);
  try {
    const result = await getPool().query(`
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
};
