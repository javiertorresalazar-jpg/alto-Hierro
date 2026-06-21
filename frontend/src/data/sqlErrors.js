// Traduce/explica los errores más comunes de PostgreSQL a un lenguaje claro
const PATTERNS = [
  { re: /column "?(\w+)"? does not exist/i, msg: (m) => `La columna "${m[1]}" no existe. Revisa el nombre (mira la pestaña "Base de Datos") o si necesitas indicar la tabla (ej: productos.${m[1]}).` },
  { re: /relation "?(\w+)"? does not exist/i, msg: (m) => `La tabla "${m[1]}" no existe. Comprueba el nombre en la pestaña "Base de Datos".` },
  { re: /syntax error at or near "?(\S+?)"?$/i, msg: (m) => `Error de sintaxis cerca de "${m[1]}". Revisa que no falte una coma, paréntesis o palabra clave ahí.` },
  { re: /syntax error/i, msg: () => 'Hay un error de sintaxis. Revisa comas, paréntesis y el orden de las palabras (SELECT … FROM … WHERE …).' },
  { re: /missing FROM-clause entry for table "?(\w+)"?/i, msg: (m) => `Estás usando la tabla "${m[1]}" pero no la has incluido en el FROM o en un JOIN.` },
  { re: /must appear in the GROUP BY clause/i, msg: () => 'Cuando usas funciones como COUNT/SUM/AVG, las demás columnas del SELECT deben ir en el GROUP BY.' },
  { re: /aggregate functions are not allowed in WHERE/i, msg: () => 'No puedes usar COUNT/SUM/AVG en WHERE. Para filtrar por un agregado usa HAVING.' },
  { re: /operator does not exist/i, msg: () => 'Estás comparando tipos incompatibles (por ejemplo texto con número). Revisa los tipos de las columnas.' },
  { re: /division by zero/i, msg: () => 'Estás dividiendo entre cero. Filtra esos casos o usa NULLIF.' },
  { re: /invalid input syntax for/i, msg: () => 'Un valor no tiene el formato esperado (por ejemplo, texto donde se espera un número o una fecha).' },
];

export function explainSqlError(message) {
  if (!message) return null;
  for (const p of PATTERNS) {
    const m = message.match(p.re);
    if (m) return p.msg(m);
  }
  return null;
}
