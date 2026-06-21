import React, { useState } from 'react';

export default function AuthPanel({ auth, onClose }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg({ type: 'error', text: 'Rellena correo y contraseña.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = mode === 'login'
      ? await auth.signIn(email, password)
      : await auth.signUp(email, password);
    setBusy(false);

    if (res.error) {
      setMsg({ type: 'error', text: traducir(res.error) });
    } else if (res.needsConfirmation) {
      setMsg({ type: 'info', text: '¡Casi! Revisa tu correo y confirma la cuenta para entrar.' });
    } else {
      onClose();
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', marginBottom: 10,
  };

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
          padding: '22px 20px', width: '100%', maxWidth: 380, boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>
            {mode === 'login' ? '👋 Iniciar sesión' : '✨ Crear cuenta'}
          </strong>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>×</button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          Guarda tu progreso (XP, medallas y ejercicios) y sincronízalo entre tus dispositivos.
        </p>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {msg && (
            <div className={`feedback ${msg.type === 'error' ? 'error' : 'info'}`} style={{ marginTop: 0, marginBottom: 10 }}>
              {msg.text}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Un momento...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Crear una' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

function traducir(error) {
  const e = error.toLowerCase();
  if (e.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (e.includes('already registered') || e.includes('already been registered')) return 'Ese correo ya está registrado. Inicia sesión.';
  if (e.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (e.includes('unable to validate email') || e.includes('invalid email')) return 'El correo no es válido.';
  if (e.includes('email not confirmed')) return 'Confirma tu correo antes de entrar (revisa tu bandeja).';
  return error;
}
