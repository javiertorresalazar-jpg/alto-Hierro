import React from 'react';

export default function ExerciseList({ exercises, completedIds, onSelect }) {
  if (!exercises.length) {
    return <div className="loading">No hay ejercicios disponibles.</div>;
  }

  return (
    <div>
      {exercises.map((ex) => {
        const done = completedIds.includes(ex.id);
        return (
          <button
            key={ex.id}
            className="card"
            style={{
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              border: done ? '1px solid #16a34a' : undefined,
              display: 'block',
            }}
            onClick={() => onSelect(ex)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>#{ex.id}</span>
                  <span className="tag tag-topic">{ex.topic}</span>
                  {done && <span className="tag" style={{ background: '#052e16', color: '#4ade80' }}>✓ Completado</span>}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>
                  {ex.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {ex.description}
                </div>
              </div>
              <span style={{ color: '#475569', fontSize: '1.2rem', flexShrink: 0 }}>›</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
