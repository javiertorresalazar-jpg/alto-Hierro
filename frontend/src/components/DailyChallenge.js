import React from 'react';

const LEVEL_COLORS = { basico: '#10b981', intermedio: '#f59e0b', avanzado: '#ef4444' };

export default function DailyChallenge({ exercise, completed, onSelect }) {
  if (!exercise) return null;

  const color = LEVEL_COLORS[exercise.level] || '#3b82f6';

  return (
    <div
      className="card"
      style={{
        marginBottom: 16,
        border: completed ? '1px solid #16a34a' : '1px solid #f59e0b',
        background: completed ? '#0a1a0f' : '#1a1400',
        cursor: completed ? 'default' : 'pointer',
      }}
      onClick={() => !completed && onSelect(exercise)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{completed ? '✅' : '🎯'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              background: '#f59e0b22', color: '#fbbf24',
            }}>
              ⚡ RETO DEL DÍA
            </span>
            <span style={{
              fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20,
              background: color + '22', color,
            }}>
              {exercise.level}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>+2× XP</span>
          </div>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 4 }}>
            {exercise.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
            {exercise.description}
          </div>
          {completed && (
            <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#4ade80', fontWeight: 600 }}>
              ¡Reto completado hoy! Vuelve mañana para uno nuevo.
            </div>
          )}
        </div>
        {!completed && <span style={{ color: '#f59e0b', fontSize: '1.2rem', flexShrink: 0 }}>›</span>}
      </div>
    </div>
  );
}
