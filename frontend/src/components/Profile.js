import React from 'react';
import { getRank, BADGES } from '../hooks/useGameState';
import { buildShareImage, shareOrDownload } from '../utils/shareImage';

function StatCard({ icon, value, label, color }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 90, textAlign: 'center', marginBottom: 0, padding: '14px 8px' }}>
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: color || 'var(--primary)' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

const LEVEL_LABELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };
const LEVEL_COLORS = { basico: '#10b981', intermedio: '#f59e0b', avanzado: '#ef4444' };

export default function Profile({ state, favorites, failed, allExercises, onSelectExercise, onChangeScenario }) {
  const { current, next } = getRank(state.xp);
  const accuracy = state.attempts > 0 ? Math.round((state.correctChecks / state.attempts) * 100) : null;
  const earnedBadges = BADGES.filter((b) => state.badges.includes(b.id));

  const topics = Object.entries(state.byTopic || {}).sort((a, b) => b[1] - a[1]);
  const maxTopic = topics.length ? topics[0][1] : 1;

  const favExercises = allExercises.filter((e) => favorites.includes(e.id));
  const failedExercises = allExercises.filter((e) => failed.includes(e.id) && !state.completed.includes(e.id));

  const share = async () => {
    const canvas = buildShareImage({
      title: current.name,
      subtitle: `${state.xp} XP en SQL Trainer`,
      rankIcon: current.icon,
      stats: [
        { value: state.completed.length, label: 'Ejercicios' },
        { value: `${state.streak}🔥`, label: 'Racha' },
        { value: earnedBadges.length, label: 'Medallas' },
      ],
    });
    await shareOrDownload(canvas, 'sql-trainer-perfil.png');
  };

  const openExercise = (ex) => {
    const sc = ex.scenario || 'tienda';
    if (onChangeScenario) onChangeScenario(sc);
    onSelectExercise(ex);
  };

  return (
    <div>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: '2.6rem' }}>{current.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{current.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {state.xp} XP{next ? ` · faltan ${next.min - state.xp} para ${next.name}` : ' · ¡rango máximo!'}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={share}>📤 Compartir</button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <StatCard icon="✅" value={state.completed.length} label="Completados" color="#4ade80" />
        <StatCard icon="🔥" value={state.streak} label="Racha (días)" color="#fbbf24" />
        <StatCard icon="🎯" value={accuracy === null ? '—' : `${accuracy}%`} label="Precisión" color="#3b82f6" />
        <StatCard icon="🏅" value={earnedBadges.length} label="Medallas" color="#a78bfa" />
      </div>

      <div className="card">
        <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Progreso por nivel</strong>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['basico', 'intermedio', 'avanzado'].map((lv) => {
            const done = state.byLevel[lv] || 0;
            return (
              <div key={lv}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
                  <span style={{ color: 'var(--text)' }}>{LEVEL_LABELS[lv]}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{done}</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, done * 10)}%`, height: '100%', background: LEVEL_COLORS[lv] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {topics.length > 0 && (
        <div className="card">
          <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Ejercicios por tema</strong>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topics.slice(0, 8).map(([topic, count]) => (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
                <div style={{ flex: 1, height: 14, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / maxTopic) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text)', width: 20, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>⭐ Favoritos ({favExercises.length})</strong>
        {favExercises.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Marca ejercicios con la estrella para guardarlos aquí.
          </p>
        ) : (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {favExercises.map((ex) => (
              <button key={ex.id} className="history-item" onClick={() => openExercise(ex)} style={{ cursor: 'pointer' }}>
                <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>#{ex.id} · {ex.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>🔁 Repasar fallados ({failedExercises.length})</strong>
        {failedExercises.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Los ejercicios que falles aparecerán aquí hasta que los completes.
          </p>
        ) : (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {failedExercises.map((ex) => (
              <button key={ex.id} className="history-item" onClick={() => openExercise(ex)} style={{ cursor: 'pointer', borderLeft: '3px solid #ef4444' }}>
                <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>#{ex.id} · {ex.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
