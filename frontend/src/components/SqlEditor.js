import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, PostgreSQL } from '@codemirror/lang-sql';
import useSchema from '../hooks/useSchema';

// Editor SQL con resaltado de sintaxis y autocompletado de tablas/columnas
export default function SqlEditor({ value, onChange, onRun }) {
  const { schema } = useSchema();

  const extensions = useMemo(() => {
    // Construir el mapa de tablas->columnas para el autocompletado
    const schemaMap = {};
    if (schema) {
      Object.entries(schema).forEach(([table, cols]) => {
        schemaMap[table] = cols.map((c) => c.column);
      });
    }
    return [
      sql({
        dialect: PostgreSQL,
        schema: schemaMap,
        upperCaseKeywords: true,
      }),
    ];
  }, [schema]);

  return (
    <div className="sql-editor-wrapper">
      <CodeMirror
        value={value}
        height="160px"
        theme="dark"
        extensions={extensions}
        onChange={onChange}
        placeholder={'-- Escribe tu consulta SQL\nSELECT '}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
        onKeyDown={(e) => {
          // Ctrl/Cmd + Enter ejecuta la consulta
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onRun) {
            e.preventDefault();
            onRun();
          }
        }}
      />
    </div>
  );
}
