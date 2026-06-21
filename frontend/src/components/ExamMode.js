import React, { useState, useEffect, useRef } from 'react';
import SqlEditor from './SqlEditor';
import { buildShareImage, shareOrDownload } from '../utils/shareImage';

const NUM_QUESTIONS = 10;

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ExamMode({ allExercises }) {
  const [phase, setPhase] = useState('intro'); // intro | running | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [sql, setSql] = useState('');
  const [results, setResults] = useState([]); // {id, correct}
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const start = () => {
    const pool = allExercises.filter((e) => e.scenario === 'tienda' || !e.scenario);
    setQuestions(pickRandom(pool.length >= NUM_QUESTIONS ? pool : allExercises, NUM_QUESTIONS));
    setIdx(0);
    setResults([]);
    setSql('');
    setSeconds(0);
    setFeedback(null);
    setPhase('running');
  };

  const current = questions[idx];

  const submit = async () => {
    if (!sql.trim() || checking) return;
    setChecking(true);
    setFeedback(null);
    try {
      const r = await fetch(`/api/check/${current.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await r.json();
      const correct = !!data.correct;
      setFeedback(correct ? { ok: true, text: '✓ ¡Correcto!' } : { ok: false, text: '✗ Incorrecto' });
      setResults((prev) => [...prev, { id: current.id, correct }]);
      setTimeout(next, 750);
    } catch {
      setFeedback({ ok: false, text: 'Error de conexión' });
    } finally {
      setChecking(false);
    }
  };

  const skip = () => {
    setResults((prev) => [...prev, { id: current.id, correct: false }]);
    next();
  };

  const next = () => {
    setFeedback(null);
    setSql('');
    if (idx + 1 >= questions.length) {
      clearInterval(timerRef.current);
      setPhase('done');
    } else {
      setIdx((i) => i + 1);
    }
  };

  const score = results.filter((r) => r.correct).length;

  const shareResult = async () => {
    const canvas = buildShareImage({
      title: `${score}/${questions.length}`,
      subtitle: 'Examen SQL completado',
      rankIcon: score >= 8 ? '🏆' : score >= 5 ? '👍' : '📚',
      stats: [
        { value: `${Math.round((score / questions.length) * 100)}%`, label: 'Acierto' },
        { value: fmtTime(seconds), label: 'Tiempo' },
        { value: questions.length, label: 'Preguntas' },
      ],
    });
    await shareOrDownload(canvas, 'sql-examen.png');
  };

  if (phase === 'intro') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <div style={{ fontSize: '2.6rem' }}>⏱️</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', margin: '8px 0' }}>Modo examen</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 16px' }}>
          {NUM_QUESTIONS} preguntas al azar de la tienda TechStore, con el reloj corriendo.
          Sin pistas ni soluciones: resuelve cada consulta y comprueba tu nota final.
          Ideal para ponerte a prueba antes de una entrevista.
        </p>
        <button className="btn btn-primary" onClick={start} disabled={!allExercises.length}>
          🚀 Empezar examen
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((score / questions.length) * 100);
    const msg = pct >= 80 ? '¡Excelente! Dominas SQL 🏆' : pct >= 50 ? 'Bien, pero puedes mejorar 💪' : 'Sigue practicando 📚';
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ fontSize: '3rem' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)' }}>{score}/{questions.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>{pct}% de acierto · ⏱️ {fmtTime(seconds)}</div>
          <p style={{ color: 'var(--text)', fontWeight: 600, margin: '8px 0 16px' }}>{msg}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={start}>🔄 Repetir</button>
            <button className="btn btn-ghost btn-sm" onClick={shareResult}>📤 Compartir</button>
          </div>
        </div>

        <div className="card">
          <strong style={{ fontSize: '0.88rem', color: 'var(--text)' }}>Repaso</strong>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {questions.map((q, i) => {
              const res = results[i];
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                  <span>{res?.correct ? '✅' : '❌'}</span>
                  <span style={{ color: 'var(--text-muted)' }}>#{q.id} · {q.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // running
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Pregunta <strong style={{ color: 'var(--text)' }}>{idx + 1}</strong> / {questions.length}
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>⏱️ {fmtTime(seconds)}</span>
      </div>

      <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ width: `${(idx / questions.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <span className="tag tag-topic">{current.topic}</span>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '8px 0 6px' }}>{current.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{current.description}</p>
      </div>

      <SqlEditor value={sql} onChange={setSql} onRun={submit} scenario={current.scenario || 'tienda'} />

      {feedback && (
        <div className={`feedback ${feedback.ok ? 'success' : 'error'}`} style={{ marginTop: 8 }}>{feedback.text}</div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn btn-primary btn-sm" onClick={submit} disabled={checking}>
          {checking ? 'Comprobando...' : '✓ Responder'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={skip} disabled={checking}>Saltar →</button>
      </div>
    </div>
  );
}
