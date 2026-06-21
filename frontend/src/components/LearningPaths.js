import React, { useState } from 'react';
import { PATHS } from '../data/learningPaths';

function PathProgress({ path, completedIds, isLocked, onStart }) {
  const [open, setOpen] = useState(false);
  const done = path.exerciseIds.filter((id) => completedIds.includes(id)).length;
  const total = path.exerciseIds.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const finished = done === total;

  return (
    <div
      className="card"
      style={{
        marginBottom: 12,
        borderLeft: `3px solid ${isLocked ? '#334155' : path.color}`,
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => !isLocked && setOpen((o) => !o)}
      >
        <span style={{ fontSize: '1.4rem' }}>{isLocked ? '🔒' : path.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: isLocked ? '#64748b' : '#f1f5f9', fontSize: '0.95rem' }}>
              {path.title}
            </span>
            {finished && <span style={{ fontSize: '0.72rem', background: '#052e16', color: '#4ade80', padding: '2px 8px', borderRadius: 20 }}>✓ Completado</span>}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 6px', lineHeight: 1.4 }}>
            {isLocked ? `Completa "${PATHS.find((p) => p.id === path.requires)?.title}" para desbloquear` : path.description}
          </p>
          {!isLocked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: path.color, borderRadius: 4, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{done}/{total}</span>
            </div>
          )}
        </div>
        {!isLocked && (
          <span style={{ color: '#64748b', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
        )}
      </div>

      {open && !isLocked && (
        <div style={{ marginTop: 12, borderTop: '1px solid #1e293b', paddingTop: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {path.exerciseIds.map((id) => {
              const isDone = completedIds.includes(id);
              return (
                <span
                  key={id}
                  style={{
                    padding: '3px 9px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                    background: isDone ? '#052e16' : '#1e293b',
                    color: isDone ? '#4ade80' : '#64748b',
                    border: `1px solid ${isDone ? '#16a34a' : '#334155'}`,
                  }}
                >
                  {isDone ? '✓' : '#'}{id}
                </span>
              );
            })}
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: path.color, borderColor: path.color }}
            onClick={() => onStart(path)}
          >
            {done === 0 ? 'Empezar ruta' : done === total ? '🎉 Repetir' : 'Continuar →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LearningPaths({ completedIds, allExercises, onSelectExercise, onChangeScenario }) {
  const isUnlocked = (path) => {
    if (!path.requires) return true;
    const req = PATHS.find((p) => p.id === path.requires);
    if (!req) return true;
    const done = req.exerciseIds.filter((id) => completedIds.includes(id)).length;
    return done >= Math.ceil(req.exerciseIds.length * 0.5);
  };

  const handleStart = (path) => {
    const firstIncomplete = path.exerciseIds.find((id) => !completedIds.includes(id)) || path.exerciseIds[0];
    const ex = allExercises.find((e) => e.id === firstIncomplete);
    if (ex) {
      onChangeScenario(path.scenario);
      onSelectExercise(ex);
    }
  };

  const totalDone = completedIds.length;
  const totalEx = allExercises.length;

  return (
    <div>
      <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>🗺️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#f1f5f9' }}>Rutas de aprendizaje</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
              Sigue el orden recomendado para progresar paso a paso.
              Has completado <strong style={{ color: '#3b82f6' }}>{totalDone}</strong> de{' '}
              <strong>{totalEx}</strong> ejercicios totales.
            </div>
          </div>
        </div>
      </div>

      {PATHS.map((path) => (
        <PathProgress
          key={path.id}
          path={path}
          completedIds={completedIds}
          isLocked={!isUnlocked(path)}
          onStart={handleStart}
        />
      ))}
    </div>
  );
}
