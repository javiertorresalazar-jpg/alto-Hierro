import { useState, useEffect, useCallback } from 'react';

const FONT_SCALES = { pequeño: '90%', normal: '100%', grande: '112%' };

function load() {
  try {
    return JSON.parse(localStorage.getItem('settings')) || {};
  } catch {
    return {};
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = load();
    return {
      theme: saved.theme || 'oscuro',
      fontSize: saved.fontSize || 'normal',
      sound: saved.sound !== false,
    };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme === 'claro' ? 'light' : 'dark');
    root.style.setProperty('--font-scale', FONT_SCALES[settings.fontSize] || '100%');
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const update = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return { settings, update };
}
