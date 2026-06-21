// Analiza una consulta correcta y la compara con la solución óptima
// para sugerir mejoras de estilo/eficiencia. Heurístico, no infalible.

function normalize(sql) {
  return sql
    .replace(/--.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function countOccurrences(str, re) {
  const m = str.match(re);
  return m ? m.length : 0;
}

export function analyzeQuery(userSql, solutionSql) {
  if (!userSql || !solutionSql) return [];
  const u = normalize(userSql);
  const s = normalize(solutionSql);
  const tips = [];

  // Subconsulta donde la solución no la usa
  const userSubqueries = countOccurrences(u, /\(\s*select/g);
  const solSubqueries = countOccurrences(s, /\(\s*select/g);
  if (userSubqueries > solSubqueries) {
    tips.push({
      type: 'warning',
      text: 'Usas una subconsulta que la solución de referencia evita. A veces un JOIN o una agregación directa es más simple y eficiente.',
    });
  }

  // SELECT * cuando se piden columnas concretas
  if (/select\s+\*/.test(u) && !/select\s+\*/.test(s)) {
    tips.push({
      type: 'warning',
      text: 'Usas SELECT *. Es buena práctica listar solo las columnas necesarias: más claro y evita traer datos de más.',
    });
  }

  // DISTINCT innecesario
  if (/\bdistinct\b/.test(u) && !/\bdistinct\b/.test(s)) {
    tips.push({
      type: 'info',
      text: 'Usas DISTINCT pero la solución no lo necesita. Si tu consulta ya no genera duplicados, DISTINCT añade trabajo extra.',
    });
  }

  // Más JOINs de los necesarios
  const userJoins = countOccurrences(u, /\bjoin\b/g);
  const solJoins = countOccurrences(s, /\bjoin\b/g);
  if (userJoins > solJoins && solJoins > 0) {
    tips.push({
      type: 'info',
      text: `Tu consulta hace ${userJoins} JOIN(s) y la de referencia solo ${solJoins}. Revisa si alguna tabla sobra.`,
    });
  }

  // Longitud notablemente mayor
  if (u.length > s.length * 1.6 && tips.length === 0) {
    tips.push({
      type: 'info',
      text: 'Tu consulta es bastante más larga que la solución de referencia. Funciona, pero quizá pueda simplificarse.',
    });
  }

  // Coincidencia casi exacta → felicitar
  if (u.replace(/\s/g, '') === s.replace(/\s/g, '')) {
    return [{ type: 'success', text: '¡Tu consulta coincide con la solución óptima! 🎯' }];
  }

  if (tips.length === 0) {
    tips.push({
      type: 'success',
      text: '¡Buena consulta! Es limpia y directa, comparable a la solución de referencia.',
    });
  }

  return tips;
}
