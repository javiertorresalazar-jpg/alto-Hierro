import React, { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('install-dismissed') === 'true'
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-dismissed', 'true');
  };

  if (!prompt || dismissed) return null;

  return (
    <div className="install-banner">
      <span>📱 Instala SQL Trainer en tu teléfono para usarla sin internet</span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn btn-sm" onClick={install}>
          Instalar
        </button>
        <button
          onClick={dismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
