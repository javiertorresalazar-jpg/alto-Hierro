import { useState, useEffect } from 'react';

// Caché por escenario para no pedir el esquema varias veces
const cache = {};
const inflight = {};

export default function useSchema(scenario = 'tienda') {
  const [schema, setSchema] = useState(cache[scenario] || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    if (cache[scenario]) { setSchema(cache[scenario]); return; }
    setSchema(null);
    if (!inflight[scenario]) {
      inflight[scenario] = fetch(`/api/schema?scenario=${scenario}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          const tables = Object.fromEntries(
            Object.entries(data).filter(([, cols]) => Array.isArray(cols))
          );
          cache[scenario] = tables;
          return tables;
        })
        .finally(() => { delete inflight[scenario]; });
    }
    let active = true;
    inflight[scenario]
      .then((tables) => { if (active) setSchema(tables); })
      .catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [scenario]);

  return { schema, error };
}
