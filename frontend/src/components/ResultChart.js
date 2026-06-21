import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

function isNumeric(val) {
  if (val === null || val === undefined || val === '') return false;
  return !isNaN(Number(val));
}

function detectChartConfig(fields, rows) {
  if (!fields || !rows || rows.length === 0) return null;

  const numericFields = fields.filter((f) => rows.slice(0, 5).every((r) => isNumeric(r[f])));
  const labelFields = fields.filter((f) => !numericFields.includes(f));

  if (numericFields.length === 0) return null;

  const labelField = labelFields[0] || fields[0];
  const valueFields = numericFields.filter((f) => f !== labelField);
  if (valueFields.length === 0) return null;

  return { labelField, valueFields };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill, fontSize: '0.85rem', margin: 0 }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('es-ES', { maximumFractionDigits: 2 })}</strong>
        </p>
      ))}
    </div>
  );
};

export default function ResultChart({ rows, fields }) {
  const [chartType, setChartType] = useState('bar');
  const config = detectChartConfig(fields, rows);

  if (!config) return null;

  const { labelField, valueFields } = config;
  const data = rows.map((r) => {
    const entry = { label: String(r[labelField] ?? '?') };
    valueFields.forEach((f) => { entry[f] = Number(r[f]); });
    return entry;
  });

  const primaryValue = valueFields[0];

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Visualización: <strong style={{ color: '#cbd5e1' }}>{labelField}</strong> vs{' '}
          <strong style={{ color: '#3b82f6' }}>{valueFields.join(', ')}</strong>
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['bar', 'pie'].map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              style={{
                padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: '0.75rem',
                background: chartType === t ? '#3b82f6' : '#334155', color: 'white',
              }}
            >
              {t === 'bar' ? '📊 Barras' : '🥧 Sectores'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: Math.max(220, Math.min(320, rows.length * 32 + 60)) }}>
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={data.length > 6 ? -35 : 0}
                textAnchor={data.length > 6 ? 'end' : 'middle'}
                interval={0}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.toLocaleString('es-ES')} />
              <Tooltip content={<CustomTooltip />} />
              {valueFields.map((f, i) => (
                <Bar key={f} dataKey={f} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={primaryValue}
                nameKey="label"
                cx="50%"
                cy="45%"
                outerRadius={90}
                label={({ label, percent }) => `${label} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
