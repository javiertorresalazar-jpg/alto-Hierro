import React, { useState, useEffect, useCallback } from 'react';
import ExerciseList from './components/ExerciseList';
import ExerciseEditor from './components/ExerciseEditor';
import CheatSheet from './components/CheatSheet';
import SchemaViewer from './components/SchemaViewer';
import InstallBanner from './components/InstallBanner';
import ProgressPanel from './components/ProgressPanel';
import Welcome from './components/Welcome';
import ScenarioSelector from './components/ScenarioSelector';
import Playground from './components/Playground';
import DailyChallenge from './components/DailyChallenge';
import LearningPaths from './components/LearningPaths';
import useGameState, { getRank, getDailyExerciseId } from './hooks/useGameState';
import './App.css';

export default function App() {
  const [tab, setTab] = useState(() =>
    localStorage.getItem('visited') ? 'ejercicios' : 'inicio'
  );
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [level, setLevel] = useState('basico');
  const [scenario, setScenario] = useState(() => localStorage.getItem('scenario') || 'tienda');
  const [scenarios, setScenarios] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state, recordCompletion, setDailyExercise } = useGameState();

  useEffect(() => {
    fetch('/api/scenarios').then((r) => r.json()).then(setScenarios).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/exercises').then((r) => r.json()).then(setAllExercises).catch(() => {});
  }, []);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/exercises?scenario=${scenario}&level=${level}`);
      setExercises(await r.json());
    } catch {
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [scenario, level]);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const dailyExercise = allExercises.length > 0
    ? allExercises.find((e) => e.id === getDailyExerciseId(allExercises))
    : null;

  useEffect(() => {
    if (dailyExercise) setDailyExercise(dailyExercise.id);
  }, [dailyExercise?.id]);

  const isDailyDone = state.dailyDate === new Date().toISOString().slice(0, 10) && state.dailyDone;

  const changeScenario = (id) => {
    setScenario(id);
    localStorage.setItem('scenario', id);
    setSelectedExercise(null);
  };

  const LEVELS = [
    { key: 'basico', label: 'Básico', color: '#10b981' },
    { key: 'intermedio', label: 'Intermedio', color: '#f59e0b' },
    { key: 'avanzado', label: 'Avanzado', color: '#ef4444' },
  ];

  const isLevelLocked = (levelKey) => {
    if (levelKey === 'basico') return false;
    if (levelKey === 'intermedio') return state.byLevel.basico < 5;
    if (levelKey === 'avanzado') return state.byLevel.intermedio < 5;
    return false;
  };

  const TABS = [
    { key: 'inicio', label: 'Inicio', icon: '🏠' },
    { key: 'ejercicios', label: 'Ejercicios', icon: '📝' },
    { key: 'rutas', label: 'Rutas', icon: '🗺️' },
    { key: 'libre', label: 'Modo libre', icon: '🧪' },
    { key: 'ayuda', label: 'Ayuda', icon: '📖' },
    { key: 'esquema', label: 'BD', icon: '🗄️' },
  ];

  const goToExercises = () => {
    localStorage.setItem('visited', '1');
    setTab('ejercicios');
  };

  const rank = getRank(state.xp).current;
  const meta = scenarios.find((s) => s.id === scenario);

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
        {tab === 'inicio' && (
          <Welcome
            scenarios={scenarios}
            scenario={scenario}
            meta={meta}
            onSelectScenario={changeScenario}
            onStart={goToExercises}
          />
        )}

        {tab === 'ejercicios' && !selectedExercise && (
          <>
            <ScenarioSelector scenarios={scenarios} value={scenario} onChange={changeScenario} />
            <ProgressPanel state={state} />

            {dailyExercise && (
              <DailyChallenge
                exercise={dailyExercise}
                completed={isDailyDone}
                onSelect={(ex) => {
                  const sc = ex.scenario || 'tienda';
                  if (sc !== scenario) changeScenario(sc);
                  setSelectedExercise(ex);
                }}
              />
            )}

            <div className="level-selector">
              {LEVELS.map((l) => {
                const locked = isLevelLocked(l.key);
                return (
                  <button
                    key={l.key}
                    className={`level-btn ${level === l.key ? 'active' : ''}`}
                    style={{ '--level-color': l.color, opacity: locked ? 0.5 : 1 }}
                    onClick={() => {
                      if (locked) return;
                      setLevel(l.key);
                    }}
                    title={
                      locked
                        ? l.key === 'intermedio'
                          ? `Completa 5 ejercicios básicos para desbloquear (${state.byLevel.basico}/5)`
                          : `Completa 5 ejercicios intermedios para desbloquear (${state.byLevel.intermedio}/5)`
                        : undefined
                    }
                  >
                    {locked ? '🔒 ' : ''}{l.label}
                    {locked && (
                      <span style={{ fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
                        {l.key === 'intermedio' ? `${state.byLevel.basico}/5` : `${state.byLevel.intermedio}/5`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isLevelLocked(level) ? (
              <div className="feedback info" style={{ textAlign: 'center', marginTop: 12 }}>
                🔒 Completa más ejercicios del nivel anterior para desbloquear este nivel.
              </div>
            ) : loading ? (
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

        {tab === 'rutas' && !selectedExercise && (
          <LearningPaths
            completedIds={state.completed}
            allExercises={allExercises}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
            }}
            onChangeScenario={changeScenario}
          />
        )}

        {tab === 'rutas' && selectedExercise && (
          <ExerciseEditor
            exercise={selectedExercise}
            onBack={() => setSelectedExercise(null)}
            onComplete={() => recordCompletion(selectedExercise)}
            isCompleted={state.completed.includes(selectedExercise.id)}
          />
        )}

        {tab === 'libre' && (
          <>
            <ScenarioSelector scenarios={scenarios} value={scenario} onChange={changeScenario} />
            <Playground scenario={scenario} />
          </>
        )}

        {tab === 'ayuda' && <CheatSheet />}

        {tab === 'esquema' && (
          <>
            <ScenarioSelector scenarios={scenarios} value={scenario} onChange={changeScenario} />
            <SchemaViewer scenario={scenario} meta={meta} />
          </>
        )}
      </main>
    </div>
  );
}
