import React from 'react';

const cell = (v) =>
  v === null ? <em style={{ color: '#64748b' }}>NULL</em> : String(v);

function MiniTable({ title, fields, rows, accent, highlightRows }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: accent, marginBottom: 6 }}>
        {title} · {rows.length} fila(s)
      </div>
      <div className="result-wrapper">
        <table>
          <thead>
            <tr>{fields.map((f) => <th key={f}>{f}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((row, i) => (
              <tr
                key={i}
                style={highlightRows && !highlightRows[i] ? { background: 'rgba(239,68,68,0.12)' } : undefined}
              >
                {fields.map((f) => <td key={f}>{cell(row[f])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Compara fila a fila (por igualdad JSON) y muestra ambas tablas lado a lado
export default function ResultDiff({ userRows, userFields, expectedRows, expectedFields }) {
  const expectedSet = new Set(expectedRows.map((r) => JSON.stringify(r)));
  // marca qué filas del usuario coinciden con alguna esperada
  const userMatch = userRows.map((r) => expectedSet.has(JSON.stringify(r)));

  return (
    <div>
      <div className="feedback info" style={{ marginBottom: 10 }}>
        Compara las dos tablas. Las filas en rojo de "Tu resultado" no aparecen en el resultado esperado.
      </div>
      <div className="diff-grid">
        <MiniTable
          title="❌ Tu resultado"
          fields={userFields}
          rows={userRows}
          accent="#f87171"
          highlightRows={userMatch}
        />
        <MiniTable
          title="✅ Esperado"
          fields={expectedFields}
          rows={expectedRows}
          accent="#4ade80"
        />
      </div>
    </div>
  );
}
