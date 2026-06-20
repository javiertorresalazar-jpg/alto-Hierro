import React, { useState } from 'react';

const PLACEHOLDER = '-- Escribe tu consulta SQL aquí\nSELECT ';

export default function ExerciseEditor({ exercise, onBack, onComplete, isCompleted }) {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');

  const runQuery = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const r = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await r.json();
      if (data.error) {
        setResult(null);
        setFeedback({ type: 'error', text: `Error: ${data.error}` });
      } else {
        setResult(data);
      }
    } catch {
      setFeedback({ type: 'error', text: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/check/${exercise.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await r.json();
      if (data.error) {
        setFeedback({ type: 'error', text: `Error: ${data.error}` });
      } else if (data.correct) {
        setFeedback({ type: 'success', text: data.feedback });
        setResult({ rows: data.userRows, fields: data.userFields, rowCount: data.rowCount });
        onComplete();
      } else {
        setFeedback({ type: 'warning', text: data.feedback });
        setResult({ rows: data.userRows, fields: data.userFields, rowCount: data.rowCount });
      }
    } catch {
      setFeedback({ type: 'error', text: 'No se pudo verificar la respuesta.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSolution = async () => {
    const r = await fetch(`/api/hint/${exercise.id}`);
    const data = await r.json();
    setSolution(data.solution);
  };

  const LEVEL_COLORS = { basico: '#10b981', intermedio: '#f59e0b', avanzado: '#ef4444' };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 12 }}>
        ← Volver
      </button>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            className="tag"
            style={{
              background: LEVEL_COLORS[exercise.level] + '22',
              color: LEVEL_COLORS[exercise.level],
            }}
          >
            {exercise.level}
          </span>
          <span className="tag tag-topic">{exercise.topic}</span>
          {isCompleted && (
            <span className="tag" style={{ background: '#052e16', color: '#4ade80' }}>
              ✓ Completado
            </span>
          )}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{exercise.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{exercise.description}</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {['editor', 'resultado'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === t ? '#3b82f6' : '#334155',
              color: 'white',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t === 'editor' ? '✏️ Editor' : `📊 Resultado ${result ? `(${result.rowCount})` : ''}`}
          </button>
        ))}
      </div>

      {activeTab === 'editor' && (
        <>
          <textarea
            className="code-block"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder={PLACEHOLDER}
            style={{
              width: '100%',
              minHeight: 140,
              resize: 'vertical',
              outline: 'none',
              caretColor: '#60a5fa',
              fontSize: '0.88rem',
              lineHeight: 1.6,
            }}
            spellCheck={false}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={runQuery} disabled={loading}>
              ▶ Ejecutar
            </button>
            <button className="btn btn-primary btn-sm" onClick={checkAnswer} disabled={loading}>
              ✓ Verificar
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setShowHint(!showHint);
                if (!solution) fetchSolution();
              }}
            >
              💡 {showHint ? 'Ocultar' : 'Ver solución'}
            </button>
          </div>

          {showHint && exercise.hint && !solution && (
            <div className="feedback info" style={{ marginTop: 8 }}>
              <strong>Pista:</strong> {exercise.hint}
            </div>
          )}

          {showHint && solution && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>Solución:</div>
              <pre className="code-block" style={{ fontSize: '0.82rem' }}>
                {solution}
              </pre>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 6 }}
                onClick={() => setSql(solution)}
              >
                Copiar al editor
              </button>
            </div>
          )}

          {feedback && (
            <div
              className={`feedback ${feedback.type === 'success' ? 'success' : feedback.type === 'warning' ? 'info' : 'error'}`}
              style={{ marginTop: 8 }}
            >
              {feedback.text}
            </div>
          )}
        </>
      )}

      {activeTab === 'resultado' && (
        <>
          {!result && (
            <div className="feedback info">Ejecuta una consulta para ver los resultados aquí.</div>
          )}
          {result && result.rows.length === 0 && (
            <div className="feedback info">La consulta no devolvió filas.</div>
          )}
          {result && result.rows.length > 0 && (
            <>
              <div
                style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8 }}
              >{result.rowCount} fila(s)</div>
              <div className="result-wrapper">
                <table>
                  <thead>
                    <tr>
                      {result.fields.map((f) => <th key={f}>{f}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i}>
                        {result.fields.map((f) => (
                          <td key={f}>{row[f] === null ? <em style={{ color: '#64748b' }}>NULL</em> : String(row[f])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {feedback && (
            <div
              className={`feedback ${feedback.type === 'success' ? 'success' : feedback.type === 'warning' ? 'info' : 'error'}`}
              style={{ marginTop: 8 }}
            >
              {feedback.text}
            </div>
          )}
        </>
      )}
    </div>
  );
}
