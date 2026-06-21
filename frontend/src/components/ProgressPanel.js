import React from 'react';
import { getRank, BADGES } from '../hooks/useGameState';

export default function ProgressPanel({ state }) {
  const { current, next } = getRank(state.xp);
  const pct = next
    ? Math.min(100, Math.round(((state.xp - current.min) / (next.min - current.min)) * 100))
    : 100;

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: '2rem' }}>{current.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{current.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {state.xp} XP{next ? ` · faltan ${next.min - state.xp} para ${next.name}` : ' · ¡rango máximo!'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem' }}>🔥</div>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>{state.streak} día(s)</div>
        </div>
      </div>

      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        {BADGES.map((b) => {
          const earned = state.badges.includes(b.id);
          return (
            <div
              key={b.id}
              title={`${b.name} — ${b.desc}`}
              style={{
                fontSize: '1.1rem',
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                background: earned ? '#1e3a5f' : '#1e293b',
                border: earned ? '1px solid #3b82f6' : '1px solid #334155',
                filter: earned ? 'none' : 'grayscale(1) opacity(0.35)',
              }}
            >
              {b.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
