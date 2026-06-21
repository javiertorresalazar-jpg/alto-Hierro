import { useState, useCallback } from 'react';

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

// Gestiona favoritos y ejercicios fallados (para repasar), en localStorage.
export default function useExerciseMeta() {
  const [favorites, setFavorites] = useState(() => load('favorites'));
  const [failed, setFailed] = useState(() => load('failed'));

  const persist = (key, value, setter) => {
    localStorage.setItem(key, JSON.stringify(value));
    setter(value);
  };

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const markFailed = useCallback((id) => {
    setFailed((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('failed', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearFailed = useCallback((id) => {
    setFailed((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem('failed', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, failed, toggleFavorite, markFailed, clearFailed };
}
