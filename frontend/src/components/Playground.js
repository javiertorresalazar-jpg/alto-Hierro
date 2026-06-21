import React, { useState } from 'react';
import SqlEditor from './SqlEditor';
import ResultsTable from './ResultsTable';
import ResultChart from './ResultChart';
import { formatSql } from '../utils/sqlTools';
import { explainSqlError } from '../data/sqlErrors';
import useQueryHistory from '../hooks/useQueryHistory';

const EXAMPLES = {
  tienda: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5;',
  biblioteca: 'SELECT title, year FROM books ORDER BY year DESC LIMIT 5;',
  hospital: 'SELECT first_name, last_name, salary FROM doctors ORDER BY salary DESC;',
  banco: 'SELECT account_type, balance FROM accounts ORDER BY balance DESC LIMIT 5;',
};

export default function Playground({ scenario }) {
  const [sql, setSql] = useState(EXAMPLES[scenario] || 'SELECT 1;');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('tabla');
  const { history, add, clear } = useQueryHistory();

  const run = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, scenario }),
      });
      const data = await r.json();
      if (data.error) {
        setResult(null);
        setError(explainSqlError(data.error) || data.error);
      } else {
        setResult(data);
        setActiveTab('tabla');
        add(sql, scenario);
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 12, borderLeft: '3px solid #8b5cf6' }}>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          🧪 <strong>Modo libre.</strong> Escribe cualquier consulta SELECT y experimenta con la
          base de datos. Sin ejercicios, sin presión. Mira la pestaña "Base de Datos" para ver
          las tablas disponibles.
        </div>
      </div>

      <SqlEditor value={sql} onChange={setSql} onRun={run} scenario={scenario} height="180px" />

      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={run} disabled={loading}>▶ Ejecutar</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSql(formatSql(sql))}>✨ Formatear</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowHistory(!showHistory)}>
          🕘 Historial ({history.length})
        </button>
      </div>
      <div style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 2px' }}>
        💡 Ctrl/Cmd + Enter para ejecutar
      </div>

      {showHistory && (
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: '0.82rem' }}>Consultas recientes</strong>
            {history.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clear}>Vaciar</button>
            )}
          </div>
          {history.length === 0 && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Aún no hay consultas.</div>}
          {history.map((h, i) => (
            <button
              key={i}
              className="history-item"
              onClick={() => { setSql(h.sql); setShowHistory(false); }}
            >
              <code>{h.sql}</code>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="feedback error" style={{ marginTop: 8 }}>{error}</div>
      )}

      {result && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['tabla', 'grafico'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem',
                  background: activeTab === t ? '#3b82f6' : '#334155', color: 'white',
                }}
              >
                {t === 'tabla' ? '📊 Tabla' : '📈 Gráfico'}
              </button>
            ))}
          </div>
          {activeTab === 'tabla' && (
            <ResultsTable fields={result.fields} rows={result.rows} rowCount={result.rowCount} filename={`${scenario}.csv`} />
          )}
          {activeTab === 'grafico' && (
            <div className="card">
              <ResultChart rows={result.rows} fields={result.fields} />
              {!result.rows.length && <div style={{ color: '#64748b', fontSize: '0.82rem' }}>Sin datos para graficar.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
