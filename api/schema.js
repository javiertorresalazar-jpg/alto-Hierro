const { getPool } = require('./_lib/db');

module.exports = async (req, res) => {
  try {
    const result = await getPool().query(`
      SELECT
        t.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default
      FROM information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name, c.ordinal_position;
    `);

    const schema = {};
    result.rows.forEach((row) => {
      if (!schema[row.table_name]) schema[row.table_name] = [];
      schema[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        default: row.column_default,
      });
    });

    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
