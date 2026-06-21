import React from 'react';
import { toCSV, download } from '../utils/sqlTools';

export default function ResultsTable({ fields, rows, rowCount, filename = 'resultado.csv' }) {
  if (!rows) return null;
  if (rows.length === 0) return <div className="feedback info">La consulta no devolvió filas.</div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rowCount ?? rows.length} fila(s)</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => download(filename, toCSV(fields, rows))}
        >
          ⬇ CSV
        </button>
      </div>
      <div className="result-wrapper">
        <table>
          <thead>
            <tr>{fields.map((f) => <th key={f}>{f}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {fields.map((f) => (
                  <td key={f}>
                    {row[f] === null ? <em style={{ color: '#64748b' }}>NULL</em> : String(row[f])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
