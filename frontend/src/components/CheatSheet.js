import React, { useState } from 'react';
import { cheatsheet } from '../data/cheatsheet';

export default function CheatSheet() {
  const [open, setOpen] = useState({ SELECT: true });
  const [search, setSearch] = useState('');

  const toggle = (cat) => setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const filtered = search.trim()
    ? cheatsheet.map((c) => ({
        ...c,
        items: c.items.filter(
          (i) =>
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.code.toLowerCase().includes(search.toLowerCase()) ||
            i.desc.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((c) => c.items.length > 0)
    : cheatsheet;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Buscar... (ej: JOIN, GROUP BY, fecha)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #475569',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
      </div>

      {filtered.map((cat) => (
        <div key={cat.category} className="cheatsheet-category">
          <div className="cheatsheet-header" onClick={() => toggle(cat.category)}>
            <div className="cheatsheet-dot" style={{ background: cat.color }} />
            <span className="cheatsheet-title">{cat.category}</span>
            <span className={`cheatsheet-chevron ${open[cat.category] || search ? 'open' : ''}`}>▼</span>
          </div>

          {(open[cat.category] || search) && (
            <div className="cheatsheet-items">
              {cat.items.map((item, i) => (
                <div
                  key={i}
                  className="cheatsheet-item"
                  style={{ '--item-color': cat.color }}
                >
                  <div className="cheatsheet-item-title">{item.title}</div>
                  <code>{item.code}</code>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
