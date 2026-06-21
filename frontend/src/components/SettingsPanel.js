import React from 'react';

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 6 }}>{children}</div>
    </div>
  );
}

function Choice({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
        background: active ? 'var(--primary)' : 'var(--surface2)',
        color: active ? 'white' : 'var(--text-muted)',
      }}
    >
      {children}
    </button>
  );
}

export default function SettingsPanel({ settings, update, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '18px 20px', width: '100%', maxWidth: 380, boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>⚙️ Ajustes</strong>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>×</button>
        </div>

        <Row label="Tema">
          <Choice active={settings.theme === 'oscuro'} onClick={() => update({ theme: 'oscuro' })}>🌙 Oscuro</Choice>
          <Choice active={settings.theme === 'claro'} onClick={() => update({ theme: 'claro' })}>☀️ Claro</Choice>
        </Row>

        <Row label="Tamaño de texto">
          <Choice active={settings.fontSize === 'pequeño'} onClick={() => update({ fontSize: 'pequeño' })}>A−</Choice>
          <Choice active={settings.fontSize === 'normal'} onClick={() => update({ fontSize: 'normal' })}>A</Choice>
          <Choice active={settings.fontSize === 'grande'} onClick={() => update({ fontSize: 'grande' })}>A+</Choice>
        </Row>

        <Row label="Sonido">
          <Choice active={settings.sound} onClick={() => update({ sound: true })}>🔊 Sí</Choice>
          <Choice active={!settings.sound} onClick={() => update({ sound: false })}>🔇 No</Choice>
        </Row>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
          Tus preferencias se guardan en este dispositivo.
        </p>
      </div>
    </div>
  );
}
