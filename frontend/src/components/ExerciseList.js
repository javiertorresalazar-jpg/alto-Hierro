import React, { useState, useMemo } from 'react';

export default function ExerciseList({ exercises, completedIds, onSelect }) {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  const topics = useMemo(() => {
    const set = new Set(exercises.map((e) => e.topic));
    return Array.from(set).sort();
  }, [exercises]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return exercises.filter((ex) => {
      const matchTopic = !topicFilter || ex.topic === topicFilter;
      const matchSearch = !q || (
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        ex.topic.toLowerCase().includes(q)
      );
      return matchTopic && matchSearch;
    });
  }, [exercises, search, topicFilter]);

  if (!exercises.length) {
    return <div className="loading">No hay ejercicios disponibles.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexDirection: 'column' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar ejercicio..."
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #334155',
            background: '#1e293b', color: '#f1f5f9', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
        {topics.length > 1 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setTopicFilter('')}
              style={{
                padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.72rem',
                background: !topicFilter ? '#3b82f6' : '#1e293b', color: !topicFilter ? 'white' : '#94a3b8',
              }}
            >
              Todos
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(topicFilter === t ? '' : t)}
                style={{
                  padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.72rem',
                  background: topicFilter === t ? '#334155' : '#1e293b',
                  color: topicFilter === t ? '#f1f5f9' : '#94a3b8',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.88rem' }}>
          No se encontraron ejercicios con esos filtros.
          <br />
          <button
            style={{ marginTop: 8, background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.85rem' }}
            onClick={() => { setSearch(''); setTopicFilter(''); }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {filtered.map((ex) => {
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
