import React, { useState, useEffect, useCallback } from 'react';
import ExerciseList from './components/ExerciseList';
import ExerciseEditor from './components/ExerciseEditor';
import CheatSheet from './components/CheatSheet';
import SchemaViewer from './components/SchemaViewer';
import InstallBanner from './components/InstallBanner';
import ProgressPanel from './components/ProgressPanel';
import Welcome from './components/Welcome';
import useGameState, { getRank } from './hooks/useGameState';
import './App.css';

export default function App() {
  const [tab, setTab] = useState(() =>
    localStorage.getItem('visited') ? 'ejercicios' : 'inicio'
  );
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [level, setLevel] = useState('basico');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state, recordCompletion } = useGameState();

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

  const LEVELS = [
    { key: 'basico', label: 'Básico', color: '#10b981' },
    { key: 'intermedio', label: 'Intermedio', color: '#f59e0b' },
    { key: 'avanzado', label: 'Avanzado', color: '#ef4444' },
  ];

  const TABS = [
    { key: 'inicio', label: 'Inicio', icon: '🏠' },
    { key: 'ejercicios', label: 'Ejercicios', icon: '📝' },
    { key: 'ayuda', label: 'Ayuda SQL', icon: '📖' },
    { key: 'esquema', label: 'Base de Datos', icon: '🗄️' },
  ];

  const goToExercises = () => {
    localStorage.setItem('visited', '1');
    setTab('ejercicios');
  };

  const rank = getRank(state.xp).current;

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
        <div className="progress-pill" title={`${rank.name} · ${state.xp} XP`}>
          {rank.icon} {state.xp} XP
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
        {tab === 'inicio' && <Welcome onStart={goToExercises} />}

        {tab === 'ejercicios' && !selectedExercise && (
          <>
            <ProgressPanel state={state} />
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
                completedIds={state.completed}
                onSelect={setSelectedExercise}
              />
            )}
          </>
        )}

        {tab === 'ejercicios' && selectedExercise && (
          <ExerciseEditor
            exercise={selectedExercise}
            onBack={() => setSelectedExercise(null)}
            onComplete={() => recordCompletion(selectedExercise)}
            isCompleted={state.completed.includes(selectedExercise.id)}
          />
        )}

        {tab === 'ayuda' && <CheatSheet />}
        {tab === 'esquema' && <SchemaViewer />}
      </main>
    </div>
  );
}
