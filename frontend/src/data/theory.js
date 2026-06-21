// Breve explicación teórica por tema. Se muestra antes de cada ejercicio.
// La clave es una palabra contenida en el campo "topic" del ejercicio.
const THEORY = {
  'SELECT': {
    title: 'SELECT — pedir datos',
    body: 'SELECT elige qué columnas quieres ver. `SELECT *` trae todas; `SELECT col1, col2` solo esas. Siempre va acompañado de `FROM tabla` para indicar de dónde sacar los datos.',
  },
  'WHERE': {
    title: 'WHERE — filtrar filas',
    body: 'WHERE deja pasar solo las filas que cumplen una condición. Ej: `WHERE precio > 100`. Para texto usa comillas simples: `WHERE pais = \'España\'`. Combina con AND / OR.',
  },
  'ORDER BY': {
    title: 'ORDER BY — ordenar',
    body: 'Ordena el resultado. `ASC` de menor a mayor (por defecto), `DESC` de mayor a menor. Ej: `ORDER BY precio DESC`.',
  },
  'LIMIT': {
    title: 'LIMIT — recortar',
    body: 'Limita cuántas filas se devuelven. `LIMIT 5` solo trae 5. Muy útil junto a ORDER BY para sacar "los N más caros/recientes".',
  },
  'COUNT': {
    title: 'COUNT — contar',
    body: 'Cuenta filas. `COUNT(*)` cuenta todas; `COUNT(columna)` ignora los NULL. Es una función de agregación.',
  },
  'AVG': {
    title: 'AVG — promedio',
    body: 'Calcula la media de una columna numérica. Hermanas: SUM (suma), MAX (máximo), MIN (mínimo). Suele combinarse con ROUND(valor, 2).',
  },
  'JOIN': {
    title: 'JOIN — combinar tablas',
    body: 'Une dos tablas relacionadas. `FROM a JOIN b ON a.id = b.a_id`. INNER JOIN solo trae coincidencias; LEFT JOIN trae todo lo de la izquierda aunque no haya pareja.',
  },
  'GROUP BY': {
    title: 'GROUP BY — agrupar',
    body: 'Agrupa filas con el mismo valor para resumirlas con COUNT/SUM/AVG. Ej: ventas por ciudad. Todas las columnas del SELECT que no sean agregados deben estar en el GROUP BY.',
  },
  'HAVING': {
    title: 'HAVING — filtrar grupos',
    body: 'Como WHERE, pero para grupos ya agregados. Ej: `GROUP BY cliente HAVING COUNT(*) > 1` (clientes con más de un pedido).',
  },
  'Subconsulta': {
    title: 'Subconsultas',
    body: 'Una consulta dentro de otra. Se ejecuta primero la de dentro. Ej: `WHERE salario > (SELECT AVG(salario) FROM empleados)`.',
  },
  'UNION': {
    title: 'UNION — apilar resultados',
    body: 'Junta los resultados de dos consultas (una debajo de otra). Deben tener las mismas columnas. UNION quita duplicados; UNION ALL los mantiene.',
  },
  'fecha': {
    title: 'Funciones de fecha',
    body: 'Para agrupar por mes/año: `TO_CHAR(fecha, \'YYYY-MM\')` o `DATE_TRUNC(\'month\', fecha)`. Para extraer una parte: `EXTRACT(YEAR FROM fecha)`.',
  },
  'IS NULL': {
    title: 'NULL — ausencia de valor',
    body: 'NULL significa "sin valor". No se compara con `=`; se usa `IS NULL` o `IS NOT NULL`. Aparece mucho con LEFT JOIN para encontrar filas sin pareja.',
  },
  'SUM': {
    title: 'SUM — sumar',
    body: 'Suma los valores de una columna numérica. Combinada con GROUP BY permite totales por categoría, por cliente, por mes, etc.',
  },
  'MAX': {
    title: 'MAX / MIN — extremos',
    body: 'MAX devuelve el valor más alto y MIN el más bajo de un grupo. Con GROUP BY obtienes el máximo/mínimo por cada grupo.',
  },
};

// Busca la teoría cuyo nombre clave esté contenido en el topic del ejercicio
export function getTheory(topic) {
  if (!topic) return null;
  const key = Object.keys(THEORY).find((k) => topic.toLowerCase().includes(k.toLowerCase()));
  return key ? THEORY[key] : null;
}
