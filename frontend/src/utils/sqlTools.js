import { format } from 'sql-formatter';

// Formatea (ordena/indenta) una consulta SQL
export function formatSql(sql) {
  try {
    return format(sql, { language: 'postgresql', keywordCase: 'upper', tabWidth: 2 });
  } catch {
    return sql;
  }
}

// Convierte filas a texto CSV
export function toCSV(fields, rows) {
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = fields.join(',');
  const body = rows.map((r) => fields.map((f) => escape(r[f])).join(',')).join('\n');
  return head + '\n' + body;
}

// Descarga un texto como archivo
export function download(filename, content, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['﻿' + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
