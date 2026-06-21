import React from 'react';

export default function ScenarioSelector({ scenarios, value, onChange }) {
  if (!scenarios || scenarios.length === 0) return null;
  return (
    <div className="scenario-selector">
      {scenarios.map((s) => (
        <button
          key={s.id}
          className={`scenario-pill ${value === s.id ? 'active' : ''}`}
          onClick={() => onChange(s.id)}
          title={s.tagline}
        >
          <span className="scenario-pill-icon">{s.icon}</span>
          <span className="scenario-pill-name">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
