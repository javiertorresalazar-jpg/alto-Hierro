import React from 'react';
import ScenarioSelector from './ScenarioSelector';

export default function Welcome({ scenarios, scenario, meta, onSelectScenario, onStart }) {
  if (!meta) return <div className="loading">Cargando…</div>;

  return (
    <div className="welcome">
      <div className="welcome-hero">
        <div style={{ fontSize: '3rem' }}>🐘</div>
        <h2>Bienvenido a SQL Trainer</h2>
        <p>
          Aquí no practicas con datos sin sentido: trabajas como el <strong>analista de
          datos</strong> de un negocio real. Elige con qué mundo quieres empezar 👇
        </p>
      </div>

      <ScenarioSelector scenarios={scenarios} value={scenario} onChange={onSelectScenario} />

      <section className="welcome-card">
        <h3>{meta.icon} El escenario: <span className="accent">{meta.name}</span></h3>
        {meta.market.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section className="welcome-card">
        <h3>🗂️ Los datos que vas a explorar</h3>
        <p style={{ marginBottom: 12 }}>
          Esta base de datos tiene <strong>{meta.tables.length} tablas</strong>. Piensa en cada
          una como una hoja de Excel con un tema concreto:
        </p>
        <div className="welcome-tables">
          {meta.tables.map((t) => (
            <div key={t.name} className="welcome-table-item">
              <span className="welcome-table-icon">{t.icon}</span>
              <div>
                <code>{t.name}</code>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome-card">
        <h3>🔗 Preguntas que podrás responder</h3>
        <ul className="welcome-questions">
          {meta.questions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 8 }}>
          💡 En la pestaña <strong>"Base de Datos"</strong> tienes el diagrama con las tablas y
          cómo se relacionan. En <strong>"Modo libre"</strong> puedes experimentar sin ejercicios.
        </p>
      </section>

      <section className="welcome-card">
        <h3>🎯 Cómo funciona</h3>
        <ol className="welcome-steps">
          <li>Elige un ejercicio según tu nivel: <strong>Básico</strong>, <strong>Intermedio</strong> o <strong>Avanzado</strong>.</li>
          <li>Escribe tu consulta y pulsa <strong>Ejecutar</strong> para ver el resultado.</li>
          <li>Pulsa <strong>Verificar</strong> para comprobarla y ganar <strong>XP</strong>.</li>
          <li>¿Atascado? Tienes <strong>teoría</strong>, <strong>pistas</strong> y la <strong>chuleta</strong> en "Ayuda SQL".</li>
        </ol>
      </section>

      <button className="btn btn-primary welcome-cta" onClick={onStart}>
        🚀 Empezar con {meta.name}
      </button>
    </div>
  );
}
