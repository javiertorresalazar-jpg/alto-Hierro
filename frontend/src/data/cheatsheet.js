export const cheatsheet = [
  {
    category: 'SELECT',
    color: '#3b82f6',
    items: [
      {
        title: 'Seleccionar todo',
        code: 'SELECT * FROM tabla;',
        desc: 'Trae todas las columnas de la tabla',
      },
      {
        title: 'Seleccionar columnas',
        code: 'SELECT col1, col2 FROM tabla;',
        desc: 'Trae solo las columnas indicadas',
      },
      {
        title: 'Alias de columna',
        code: 'SELECT precio AS costo FROM tabla;',
        desc: 'Renombra columnas en el resultado',
      },
      {
        title: 'Eliminar duplicados',
        code: 'SELECT DISTINCT columna FROM tabla;',
        desc: 'Elimina filas repetidas del resultado',
      },
    ],
  },
  {
    category: 'WHERE',
    color: '#10b981',
    items: [
      { title: 'Igual a', code: "WHERE col = 'valor'", desc: 'Filtra filas exactas' },
      { title: 'Mayor / Menor', code: 'WHERE precio > 100', desc: 'Comparación numérica' },
      {
        title: 'Entre valores',
        code: 'WHERE precio BETWEEN 10 AND 100',
        desc: 'Rango inclusivo de valores',
      },
      {
        title: 'Lista de valores',
        code: "WHERE ciudad IN ('Madrid', 'Barcelona')",
        desc: 'Filtra si el valor está en la lista',
      },
      {
        title: 'Patrón de texto',
        code: "WHERE nombre LIKE 'A%'",
        desc: '% = cualquier cosa, _ = un carácter',
      },
      {
        title: 'Valor nulo',
        code: 'WHERE columna IS NULL',
        desc: 'Filtra filas sin valor',
      },
      {
        title: 'Combinar condiciones',
        code: 'WHERE a = 1 AND b = 2',
        desc: 'AND (ambas), OR (una de ellas), NOT (negación)',
      },
    ],
  },
  {
    category: 'ORDER BY',
    color: '#f59e0b',
    items: [
      { title: 'Ascendente', code: 'ORDER BY precio ASC', desc: 'De menor a mayor (por defecto)' },
      { title: 'Descendente', code: 'ORDER BY precio DESC', desc: 'De mayor a menor' },
      {
        title: 'Múltiples columnas',
        code: 'ORDER BY apellido ASC, nombre ASC',
        desc: 'Ordena primero por apellido, luego nombre',
      },
    ],
  },
  {
    category: 'LIMIT & OFFSET',
    color: '#8b5cf6',
    items: [
      { title: 'Limitar resultados', code: 'LIMIT 10', desc: 'Solo devuelve las primeras 10 filas' },
      {
        title: 'Paginación',
        code: 'LIMIT 10 OFFSET 20',
        desc: 'Salta 20 filas y trae las siguientes 10',
      },
    ],
  },
  {
    category: 'Funciones de Agregación',
    color: '#ef4444',
    items: [
      { title: 'Contar filas', code: 'COUNT(*)', desc: 'Cuenta todas las filas' },
      { title: 'Contar no nulos', code: 'COUNT(columna)', desc: 'Ignora valores NULL' },
      { title: 'Sumar', code: 'SUM(precio)', desc: 'Suma los valores de la columna' },
      { title: 'Promedio', code: 'AVG(salario)', desc: 'Calcula la media aritmética' },
      { title: 'Máximo', code: 'MAX(precio)', desc: 'El valor más alto' },
      { title: 'Mínimo', code: 'MIN(precio)', desc: 'El valor más bajo' },
      {
        title: 'Redondear',
        code: 'ROUND(AVG(precio), 2)',
        desc: 'Redondea a N decimales',
      },
    ],
  },
  {
    category: 'GROUP BY & HAVING',
    color: '#06b6d4',
    items: [
      {
        title: 'Agrupar',
        code: 'SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad;',
        desc: 'Agrupa filas con el mismo valor',
      },
      {
        title: 'Filtrar grupos',
        code: 'GROUP BY ciudad HAVING COUNT(*) > 5',
        desc: 'HAVING filtra grupos (como WHERE pero para grupos)',
      },
    ],
  },
  {
    category: 'JOIN',
    color: '#f97316',
    items: [
      {
        title: 'INNER JOIN',
        code: 'SELECT * FROM a JOIN b ON a.id = b.a_id;',
        desc: 'Solo filas que tienen coincidencia en ambas tablas',
      },
      {
        title: 'LEFT JOIN',
        code: 'SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;',
        desc: 'Todas las filas de la izquierda, las de la derecha si coinciden',
      },
      {
        title: 'RIGHT JOIN',
        code: 'SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;',
        desc: 'Todas las filas de la derecha, las de la izquierda si coinciden',
      },
      {
        title: 'Múltiples JOINs',
        code: 'FROM a JOIN b ON ... JOIN c ON ...',
        desc: 'Puedes encadenar tantos JOINs como necesites',
      },
    ],
  },
  {
    category: 'Subconsultas',
    color: '#ec4899',
    items: [
      {
        title: 'Subconsulta en WHERE',
        code: 'WHERE salario > (SELECT AVG(salario) FROM empleados)',
        desc: 'La subconsulta se ejecuta primero y devuelve un valor',
      },
      {
        title: 'Subconsulta en FROM',
        code: 'FROM (SELECT ... FROM ...) AS alias',
        desc: 'Usa el resultado de otra consulta como tabla',
      },
    ],
  },
  {
    category: 'Funciones de Texto',
    color: '#64748b',
    items: [
      { title: 'Concatenar', code: "nombre || ' ' || apellido", desc: 'Une cadenas de texto' },
      { title: 'Mayúsculas', code: 'UPPER(nombre)', desc: 'Convierte a mayúsculas' },
      { title: 'Minúsculas', code: 'LOWER(nombre)', desc: 'Convierte a minúsculas' },
      { title: 'Longitud', code: 'LENGTH(texto)', desc: 'Número de caracteres' },
    ],
  },
  {
    category: 'Funciones de Fecha',
    color: '#7c3aed',
    items: [
      { title: 'Fecha actual', code: 'CURRENT_DATE', desc: 'La fecha de hoy' },
      {
        title: 'Formatear fecha',
        code: "TO_CHAR(fecha, 'YYYY-MM')",
        desc: 'Convierte fecha a texto con formato',
      },
      {
        title: 'Truncar fecha',
        code: "DATE_TRUNC('month', fecha)",
        desc: 'Redondea a inicio de mes/año/día',
      },
      {
        title: 'Extraer parte',
        code: "EXTRACT(YEAR FROM fecha)",
        desc: 'Extrae año, mes, día, etc.',
      },
    ],
  },
  {
    category: 'UNION',
    color: '#0ea5e9',
    items: [
      {
        title: 'UNION',
        code: 'SELECT a FROM t1 UNION SELECT a FROM t2;',
        desc: 'Combina resultados eliminando duplicados',
      },
      {
        title: 'UNION ALL',
        code: 'SELECT a FROM t1 UNION ALL SELECT a FROM t2;',
        desc: 'Combina resultados incluyendo duplicados (más rápido)',
      },
    ],
  },
];
