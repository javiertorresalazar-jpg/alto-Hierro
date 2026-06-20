import React, { useState, useEffect, useCallback } from 'react';
import ExerciseList from './components/ExerciseList';
import ExerciseEditor from './components/ExerciseEditor';
import CheatSheet from './components/CheatSheet';
import SchemaViewer from './components/SchemaViewer';
import InstallBanner from './components/InstallBanner';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('ejercicios');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [level, setLevel] = useState('basico');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('completed') || '[]'); } catch { return []; }
  });

  const fetchExercises = useCallback(async () => {
    try {
      const r = await fetch(`/api/exercises?level=${level}`);
      const data = await r.json();
      setExercises(data);
    } catch {
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const markCompleted = (id) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem('completed', JSON.stringify(next));
      return next;
    });
  };

  const LEVELS = [
    { key: 'basico', label: 'Básico', color: '#10b981' },
    { key: 'intermedio', label: 'Intermedio', color: '#f59e0b' },
    { key: 'avanzado', label: 'Avanzado', color: '#ef4444' },
  ];

  const TABS = [
    { key: 'ejercicios', label: 'Ejercicios', icon: '📝' },
    { key: 'ayuda', label: 'Ayuda SQL', icon: '📖' },
    { key: 'esquema', label: 'Base de Datos', icon: '🗄️' },
  ];

  return (
    <div className="app">
      <InstallBanner />

      <header className="header">
        <div className="header-title">
          <span className="header-icon">🐘</span>
          <div>
            <h1>SQL Trainer</h1>
            <p>PostgreSQL · Aprende con ejercicios</p>
          </div>
        </div>
        <div className="progress-pill">
          {completedIds.length} completados
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => { setTab(t.key); setSelectedExercise(null); }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'ejercicios' && !selectedExercise && (
          <>
            <div className="level-selector">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  className={`level-btn ${level === l.key ? 'active' : ''}`}
                  style={{ '--level-color': l.color }}
                  onClick={() => { setLevel(l.key); setLoading(true); }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="loading">Cargando ejercicios...</div>
            ) : (
              <ExerciseList
                exercises={exercises}
                completedIds={completedIds}
                onSelect={setSelectedExercise}
              />
            )}
          </>
        )}

        {tab === 'ejercicios' && selectedExercise && (
          <ExerciseEditor
            exercise={selectedExercise}
            onBack={() => setSelectedExercise(null)}
            onComplete={() => markCompleted(selectedExercise.id)}
            isCompleted={completedIds.includes(selectedExercise.id)}
          />
        )}

        {tab === 'ayuda' && <CheatSheet />}
        {tab === 'esquema' && <SchemaViewer />}
      </main>
    </div>
  );
}
