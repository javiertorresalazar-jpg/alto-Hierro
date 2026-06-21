import React from 'react';

// Diagrama simple: coloca las tablas en 2 columnas y dibuja líneas
// entre las que están relacionadas (clave foránea).
export default function ERDiagram({ tables, relations }) {
  if (!tables || tables.length === 0) return null;

  const BOX_W = 150;
  const BOX_H = 38;
  const COL_X = [20, 230];        // x (esquina izq) de cada columna
  const ROW_GAP = 66;
  const TOP = 16;

  // posición de cada tabla
  const pos = {};
  tables.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = COL_X[col];
    const y = TOP + row * ROW_GAP;
    pos[t.name] = { x, y, cx: x + BOX_W / 2, cy: y + BOX_H / 2 };
  });

  const rows = Math.ceil(tables.length / 2);
  const width = COL_X[1] + BOX_W + 20;
  const height = TOP + rows * ROW_GAP + 10;

  return (
    <div>
      <div className="er-scroll">
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* líneas de relación */}
          {relations.map((r, i) => {
            const a = pos[r.from];
            const b = pos[r.to];
            if (!a || !b) return null;
            const mx = (a.cx + b.cx) / 2;
            const my = (a.cy + b.cy) / 2;
            return (
              <g key={i}>
                <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} stroke="#3b82f6" strokeWidth="1.5" opacity="0.55" />
                <circle cx={b.cx} cy={b.cy} r="3" fill="#3b82f6" />
                <rect x={mx - 30} y={my - 8} width="60" height="15" rx="3" fill="#0f172a" opacity="0.85" />
                <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fill="#93c5fd">{r.key}</text>
              </g>
            );
          })}
          {/* cajas de tabla */}
          {tables.map((t) => {
            const p = pos[t.name];
            return (
              <g key={t.name}>
                <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="8"
                  fill="#334155" stroke="#60a5fa" strokeWidth="1.2" />
                <text x={p.x + 12} y={p.y + 24} fontSize="15">{t.icon}</text>
                <text x={p.x + 32} y={p.y + 24} fontSize="12" fontWeight="700" fill="#e2e8f0"
                  fontFamily="monospace">{t.name}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <strong style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Relaciones</strong>
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {relations.map((r, i) => (
            <div key={i} style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              <code style={{ color: '#a5f3fc' }}>{r.from}</code>
              <span style={{ color: '#3b82f6' }}> ──({r.key})──▶ </span>
              <code style={{ color: '#a5f3fc' }}>{r.to}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
