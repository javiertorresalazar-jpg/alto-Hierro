import React, { useState, useEffect } from 'react';
import useSchema from '../hooks/useSchema';
import ERDiagram from './ERDiagram';

export default function SchemaViewer({ scenario = 'tienda', meta }) {
  const { schema, error } = useSchema(scenario);
  const [open, setOpen] = useState({});
  const [view, setView] = useState('diagrama');

  useEffect(() => {
    if (schema) {
      const firstKey = Object.keys(schema)[0];
      setOpen(firstKey ? { [firstKey]: true } : {});
    }
  }, [schema]);

  const iconFor = (name) => {
    const t = meta && meta.tables.find((x) => x.name === name);
    return t ? t.icon : '📄';
  };

  if (error) return <div className="feedback error">No se pudo conectar a la base de datos: {error}</div>;
  if (!schema) return <div className="loading">Cargando esquema...</div>;

  const toggle = (t) => setOpen((p) => ({ ...p, [t]: !p[t] }));

  return (
    <div>
      <div className="card" style={{ marginBottom: 12, background: '#1e3a5f', border: '1px solid #2563eb' }}>
        <div style={{ fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.5 }}>
          <strong>{meta?.icon} {meta?.name}</strong> · {meta?.tagline}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['diagrama', '🗺️ Diagrama'], ['tablas', '📋 Tablas']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none',
              background: view === k ? '#3b82f6' : '#334155',
              color: 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'diagrama' && meta && (
        <ERDiagram tables={meta.tables} relations={meta.relations || []} />
      )}

      {view === 'tablas' && Object.entries(schema).map(([tableName, columns]) => (
        <div key={tableName} className="schema-table card" style={{ padding: 12 }}>
          <div className="schema-table-name" onClick={() => toggle(tableName)}>
            <span>{iconFor(tableName)}</span>
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
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
