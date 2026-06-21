import React, { useState, useEffect } from 'react';

const TABLE_ICONS = {
  products: '📦',
  categories: '🏷️',
  customers: '👥',
  orders: '🛒',
  order_items: '📋',
  employees: '👤',
  departments: '🏢',
  reviews: '⭐',
};

export default function SchemaViewer() {
  const [schema, setSchema] = useState(null);
  const [open, setOpen] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/schema')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        const tables = Object.fromEntries(
          Object.entries(data).filter(([, cols]) => Array.isArray(cols))
        );
        setSchema(tables);
        const firstKey = Object.keys(tables)[0];
        if (firstKey) setOpen({ [firstKey]: true });
      })
      .catch((e) => setError('No se pudo conectar a la base de datos: ' + e.message));
  }, []);

  if (error) return <div className="feedback error">{error}</div>;
  if (!schema) return <div className="loading">Cargando esquema...</div>;

  const toggle = (t) => setOpen((p) => ({ ...p, [t]: !p[t] }));

  return (
    <div>
      <div className="card" style={{ marginBottom: 16, background: '#1e3a5f', border: '1px solid #2563eb' }}>
        <div style={{ fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.5 }}>
          <strong>📊 Base de datos: TechStore</strong>
          <br />
          Tienda de tecnología con productos, clientes, pedidos, empleados y reseñas.
          Todas las tablas están relacionadas entre sí.
        </div>
      </div>

      {Object.entries(schema).map(([tableName, columns]) => (
        <div key={tableName} className="schema-table card" style={{ padding: 12 }}>
          <div
            className="schema-table-name"
            onClick={() => toggle(tableName)}
          >
            <span>{TABLE_ICONS[tableName] || '📄'}</span>
            <span style={{ flex: 1 }}>{tableName}</span>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{columns.length} cols</span>
            <span style={{ color: '#64748b' }}>{open[tableName] ? '▲' : '▼'}</span>
          </div>

          {open[tableName] && (
            <div className="schema-columns">
              {columns.map((col) => (
                <div key={col.column} className="schema-column">
                  <span className="schema-col-name">{col.column}</span>
                  <span className="schema-col-type">{col.type}</span>
                  {col.nullable && <span className="schema-col-null">nullable</span>}
                  {col.default && (
                    <span className="schema-col-null" style={{ fontSize: '0.68rem' }}>
                      default: {col.default}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
          <strong style={{ color: '#94a3b8' }}>Relaciones clave:</strong>
          <br />
          products → categories (category_id)
          <br />
          orders → customers (customer_id)
          <br />
          order_items → orders + products
          <br />
          employees → departments (department_id)
          <br />
          reviews → products + customers
        </div>
      </div>
    </div>
  );
}
