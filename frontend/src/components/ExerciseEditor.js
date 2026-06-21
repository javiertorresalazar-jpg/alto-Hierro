import React, { useState } from 'react';
import SqlEditor from './SqlEditor';
import ResultDiff from './ResultDiff';
import { getTheory } from '../data/theory';
import { explainSqlError } from '../data/sqlErrors';

const LEVEL_COLORS = { basico: '#10b981', intermedio: '#f59e0b', avanzado: '#ef4444' };

export default function ExerciseEditor({ exercise, onBack, onComplete, isCompleted }) {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState(null);
  const [diff, setDiff] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [solution, setSolution] = useState(null);
  const [reward, setReward] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');

  const theory = getTheory(exercise.topic);

  const handleError = (msg) => {
    const explained = explainSqlError(msg);
    setFeedback({ type: 'error', text: explained || `Error: ${msg}`, raw: explained ? msg : null });
  };

  const runQuery = async () => {
    if (!sql.trim()) return;
    setLoading(true);
    setFeedback(null);
    setDiff(null);
    try {
      const r = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await r.json();
      if (data.error) {
        setResult(null);
        handleError(data.error);
      } else {
        setResult(data);
        setActiveTab('resultado');
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
    setDiff(null);
    try {
      const r = await fetch(`/api/check/${exercise.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await r.json();
      if (data.error) {
        handleError(data.error);
      } else if (data.correct) {
        setFeedback({ type: 'success', text: data.feedback });
        setResult({ rows: data.userRows, fields: data.userFields, rowCount: data.rowCount });
        const rw = onComplete();
        if (rw && !rw.alreadyDone) setReward(rw);
      } else {
        setFeedback({ type: 'warning', text: data.feedback });
        setResult({ rows: data.userRows, fields: data.userFields, rowCount: data.rowCount });
        setDiff({
          userRows: data.userRows,
          userFields: data.userFields,
          expectedRows: data.expectedRows,
          expectedFields: data.expectedFields,
        });
        setActiveTab('comparar');
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

  const tabs = [
    { key: 'editor', label: '✏️ Editor' },
    { key: 'resultado', label: `📊 Resultado${result ? ` (${result.rowCount})` : ''}` },
  ];
  if (diff) tabs.push({ key: 'comparar', label: '🔍 Comparar' });

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 12 }}>
        ← Volver
      </button>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className="tag" style={{ background: LEVEL_COLORS[exercise.level] + '22', color: LEVEL_COLORS[exercise.level] }}>
            {exercise.level}
          </span>
          <span className="tag tag-topic">{exercise.topic}</span>
          {isCompleted && <span className="tag" style={{ background: '#052e16', color: '#4ade80' }}>✓ Completado</span>}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{exercise.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{exercise.description}</p>
      </div>

      {theory && (
        <div className="card" style={{ marginBottom: 12, borderLeft: '3px solid #3b82f6' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => setShowTheory(!showTheory)}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#93c5fd' }}>
              📘 Teoría: {theory.title}
            </span>
            <span style={{ color: '#64748b' }}>{showTheory ? '▲' : '▼'}</span>
          </div>
          {showTheory && (
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.6, marginTop: 8 }}>{theory.body}</p>
          )}
        </div>
      )}

      {reward && (
        <div className="reward-banner">
          <div style={{ fontSize: '1.5rem' }}>🎉</div>
          <div style={{ flex: 1 }}>
            <strong>+{reward.xpGained} XP</strong>
            {reward.leveledUp && <span> · ¡Subiste de rango! 🆙</span>}
            {reward.newBadges.length > 0 && (
              <div style={{ fontSize: '0.78rem', marginTop: 4 }}>
                Nueva medalla: {reward.newBadges.map((b) => `${b.icon} ${b.name}`).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none',
              background: activeTab === t.key ? '#3b82f6' : '#334155',
              color: 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'editor' && (
        <>
          <SqlEditor value={sql} onChange={setSql} onRun={runQuery} />
          <div style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 2px' }}>
            💡 Atajo: Ctrl/Cmd + Enter para ejecutar
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={runQuery} disabled={loading}>▶ Ejecutar</button>
            <button className="btn btn-primary btn-sm" onClick={checkAnswer} disabled={loading}>✓ Verificar</button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setShowHint(!showHint); if (!solution) fetchSolution(); }}
            >
              💡 {showHint ? 'Ocultar' : 'Ver solución'}
            </button>
          </div>

          {showHint && exercise.hint && (
            <div className="feedback info" style={{ marginTop: 8 }}>
              <strong>Pista:</strong> {exercise.hint}
            </div>
          )}

          {showHint && solution && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>Solución:</div>
              <pre className="code-block" style={{ fontSize: '0.82rem' }}>{solution}</pre>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={() => setSql(solution)}>
                Copiar al editor
              </button>
            </div>
          )}

          {feedback && (
            <div className={`feedback ${feedback.type === 'success' ? 'success' : feedback.type === 'warning' ? 'info' : 'error'}`} style={{ marginTop: 8 }}>
              {feedback.text}
              {feedback.raw && <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 4 }}>({feedback.raw})</div>}
            </div>
          )}
        </>
      )}

      {activeTab === 'resultado' && (
        <>
          {!result && <div className="feedback info">Ejecuta una consulta para ver los resultados aquí.</div>}
          {result && result.rows.length === 0 && <div className="feedback info">La consulta no devolvió filas.</div>}
          {result && result.rows.length > 0 && (
            <>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8 }}>{result.rowCount} fila(s)</div>
              <div className="result-wrapper">
                <table>
                  <thead><tr>{result.fields.map((f) => <th key={f}>{f}</th>)}</tr></thead>
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
        </>
      )}

      {activeTab === 'comparar' && diff && <ResultDiff {...diff} />}
    </div>
  );
}
