import { useState, useCallback } from 'react';

const KEY = 'queryHistory';
const MAX = 20;

export default function useQueryHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  const add = useCallback((sql, scenario) => {
    const entry = { sql: sql.trim(), scenario, at: Date.now() };
    setHistory((prev) => {
      const next = [entry, ...prev.filter((e) => e.sql !== entry.sql)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setHistory([]);
  }, []);

  return { history, add, clear };
}
