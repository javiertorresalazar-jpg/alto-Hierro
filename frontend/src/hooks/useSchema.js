import { useState, useEffect } from 'react';

// Caché a nivel de módulo para no pedir el esquema varias veces
let cache = null;
let inflight = null;

export default function useSchema() {
  const [schema, setSchema] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) { setSchema(cache); return; }
    if (!inflight) {
      inflight = fetch('/api/schema')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          const tables = Object.fromEntries(
            Object.entries(data).filter(([, cols]) => Array.isArray(cols))
          );
          cache = tables;
          return tables;
        });
    }
    inflight
      .then((tables) => setSchema(tables))
      .catch((e) => setError(e.message));
  }, []);

  return { schema, error };
}
