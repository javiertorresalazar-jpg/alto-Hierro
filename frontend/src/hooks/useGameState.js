import { useState, useCallback } from 'react';

// XP por nivel de dificultad
const XP_BY_LEVEL = { basico: 10, intermedio: 20, avanzado: 30 };

// Rangos según XP acumulado
export const RANKS = [
  { name: 'Novato', min: 0, icon: '🌱' },
  { name: 'Aprendiz', min: 50, icon: '📗' },
  { name: 'Practicante', min: 150, icon: '⚙️' },
  { name: 'Analista', min: 300, icon: '📊' },
  { name: 'Experto', min: 550, icon: '🚀' },
  { name: 'Maestro SQL', min: 850, icon: '👑' },
];

// Definición de medallas (se desbloquean según el estado)
export const BADGES = [
  { id: 'first', icon: '🎯', name: 'Primer paso', desc: 'Completa tu primer ejercicio', check: (s) => s.completed.length >= 1 },
  { id: 'five', icon: '🔥', name: 'En racha', desc: 'Completa 5 ejercicios', check: (s) => s.completed.length >= 5 },
  { id: 'ten', icon: '💪', name: 'Constante', desc: 'Completa 10 ejercicios', check: (s) => s.completed.length >= 10 },
  { id: 'basico', icon: '🟢', name: 'Base sólida', desc: 'Completa los 10 básicos', check: (s) => s.byLevel.basico >= 10 },
  { id: 'intermedio', icon: '🟡', name: 'Subiendo nivel', desc: 'Completa los 10 intermedios', check: (s) => s.byLevel.intermedio >= 10 },
  { id: 'avanzado', icon: '🔴', name: 'Nivel pro', desc: 'Completa los 10 avanzados', check: (s) => s.byLevel.avanzado >= 10 },
  { id: 'streak3', icon: '📅', name: 'Disciplina', desc: 'Racha de 3 días', check: (s) => s.streak >= 3 },
  { id: 'all', icon: '👑', name: 'Maestría total', desc: 'Completa los 30 ejercicios', check: (s) => s.completed.length >= 30 },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

function load() {
  try {
    return JSON.parse(localStorage.getItem('gameState')) || {};
  } catch {
    return {};
  }
}

export function getDailyExerciseId(exercises) {
  if (!exercises || exercises.length === 0) return null;
  const dayNum = Math.floor(Date.now() / 86400000);
  return exercises[dayNum % exercises.length].id;
}

export function getRank(xp) {
  let current = RANKS[0];
  let next = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

export default function useGameState() {
  const [state, setState] = useState(() => {
    const saved = load();
    return {
      xp: saved.xp || 0,
      completed: saved.completed || [],
      byLevel: saved.byLevel || { basico: 0, intermedio: 0, avanzado: 0 },
      streak: saved.streak || 0,
      lastDay: saved.lastDay || null,
      badges: saved.badges || [],
      dailyDate: saved.dailyDate || null,
      dailyDone: saved.dailyDone || false,
      attempts: saved.attempts || 0,
      correctChecks: saved.correctChecks || 0,
      byTopic: saved.byTopic || {},
    };
  });

  const persist = (next) => {
    localStorage.setItem('gameState', JSON.stringify(next));
    setState(next);
  };

  // Registra cada intento de verificación (para calcular precisión)
  const recordAttempt = useCallback((correct) => {
    setState((prev) => {
      const next = {
        ...prev,
        attempts: prev.attempts + 1,
        correctChecks: prev.correctChecks + (correct ? 1 : 0),
      };
      localStorage.setItem('gameState', JSON.stringify(next));
      return next;
    });
  }, []);

  // Devuelve info de lo que cambió: { xpGained, newBadges, leveledUp }
  const recordCompletion = useCallback((exercise) => {
    if (state.completed.includes(exercise.id)) {
      return { xpGained: 0, newBadges: [], leveledUp: false, alreadyDone: true };
    }

    const today = todayStr();
    const isDaily = state.dailyDate === today && !state.dailyDone;
    const baseXp = XP_BY_LEVEL[exercise.level] || 10;
    const xpGained = isDaily ? baseXp * 2 : baseXp;
    const newXp = state.xp + xpGained;

    // Calcular racha
    let streak = state.streak;
    if (state.lastDay !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = state.lastDay === yesterday ? state.streak + 1 : 1;
    }
    if (streak === 0) streak = 1;

    const byLevel = {
      ...state.byLevel,
      [exercise.level]: (state.byLevel[exercise.level] || 0) + 1,
    };

    const byTopic = {
      ...state.byTopic,
      [exercise.topic]: (state.byTopic[exercise.topic] || 0) + 1,
    };

    const isDailyExercise = state.dailyDate === today && !state.dailyDone;

    const candidate = {
      ...state,
      xp: newXp,
      completed: [...state.completed, exercise.id],
      byLevel,
      byTopic,
      streak,
      lastDay: today,
      badges: state.badges,
      dailyDate: state.dailyDate,
      dailyDone: isDailyExercise ? true : state.dailyDone,
    };

    // Comprobar medallas nuevas
    const newBadges = BADGES.filter(
      (b) => !state.badges.includes(b.id) && b.check(candidate)
    );
    candidate.badges = [...state.badges, ...newBadges.map((b) => b.id)];

    const leveledUp = getRank(newXp).current.name !== getRank(state.xp).current.name;

    persist(candidate);
    return { xpGained, newBadges, leveledUp, alreadyDone: false, isDaily: isDailyExercise };
  }, [state]);

  const setDailyExercise = useCallback((exerciseId) => {
    const today = todayStr();
    if (state.dailyDate === today) return;
    const next = { ...state, dailyDate: today, dailyDone: false };
    persist(next);
  }, [state]);

  // Reemplaza el estado completo (lo usa la sincronización con la nube
  // tras combinar el progreso local con el de la cuenta).
  const setFullState = useCallback((incoming) => {
    setState((prev) => {
      const next = { ...prev, ...incoming };
      localStorage.setItem('gameState', JSON.stringify(next));
      return next;
    });
  }, []);

  return { state, recordCompletion, setDailyExercise, recordAttempt, setFullState };
}
