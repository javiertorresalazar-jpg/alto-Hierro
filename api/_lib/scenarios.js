// Define cada "base de datos" disponible. El campo `schema` es el schema
// real de PostgreSQL (la tienda usa public por compatibilidad).
const scenarios = [
  {
    id: 'tienda',
    schema: 'public',
    name: 'TechStore',
    icon: '🛒',
    tagline: 'Tienda online de tecnología',
    market: [
      'TechStore es una tienda online de tecnología con sede en España que vende ordenadores portátiles, smartphones, tablets, monitores, auriculares, accesorios y productos gaming. Tiene clientes en varios países y un equipo repartido en distintos departamentos.',
      'Como en cualquier comercio, cada día entran pedidos, los clientes dejan reseñas y hay productos que se agotan. Toda esa actividad queda guardada en la base de datos, y tu trabajo será hacerle preguntas con SQL para sacar conclusiones.',
    ],
    tables: [
      { icon: '🏷️', name: 'categories', desc: 'Las familias de producto: Portátiles, Smartphones, Audio, Gaming…' },
      { icon: '📦', name: 'products', desc: 'El catálogo: cada producto con su precio, stock y categoría.' },
      { icon: '👥', name: 'customers', desc: 'Los clientes que compran, con su ciudad y país.' },
      { icon: '🛒', name: 'orders', desc: 'Cada pedido, su estado (entregado, enviado…) y su total.' },
      { icon: '📋', name: 'order_items', desc: 'El detalle de cada pedido: qué productos y en qué cantidad.' },
      { icon: '⭐', name: 'reviews', desc: 'Las valoraciones (1–5) que los clientes dejan en los productos.' },
      { icon: '👤', name: 'employees', desc: 'La plantilla, con su salario y antigüedad.' },
      { icon: '🏢', name: 'departments', desc: 'Los departamentos donde trabajan los empleados.' },
    ],
    questions: [
      '¿Qué productos son los más vendidos?',
      '¿Qué clientes gastan más dinero?',
      '¿Qué categoría genera más ingresos?',
      '¿Qué productos tienen mejores valoraciones?',
    ],
    relations: [
      { from: 'products', to: 'categories', key: 'category_id' },
      { from: 'orders', to: 'customers', key: 'customer_id' },
      { from: 'order_items', to: 'orders', key: 'order_id' },
      { from: 'order_items', to: 'products', key: 'product_id' },
      { from: 'reviews', to: 'products', key: 'product_id' },
      { from: 'reviews', to: 'customers', key: 'customer_id' },
      { from: 'employees', to: 'departments', key: 'department_id' },
    ],
  },
  {
    id: 'biblioteca',
    schema: 'biblioteca',
    name: 'BiblioRed',
    icon: '📚',
    tagline: 'Red de bibliotecas públicas',
    market: [
      'BiblioRed es una red de bibliotecas públicas. Gestiona un catálogo de libros de autores de todo el mundo, una lista de socios registrados y todos los préstamos que se realizan: quién se lleva qué libro, cuándo y si lo ha devuelto.',
      'Tu papel es el del bibliotecario de datos: responder preguntas sobre qué se lee más, qué socios tienen libros pendientes de devolver o qué autores son los más populares.',
    ],
    tables: [
      { icon: '✍️', name: 'authors', desc: 'Los autores, con su país y año de nacimiento.' },
      { icon: '📖', name: 'books', desc: 'El catálogo de libros: título, género, año, copias y autor.' },
      { icon: '🧑‍🤝‍🧑', name: 'members', desc: 'Los socios de la biblioteca y su ciudad.' },
      { icon: '🔄', name: 'loans', desc: 'Los préstamos: qué socio, qué libro, fechas y estado.' },
    ],
    questions: [
      '¿Cuál es el libro más prestado?',
      '¿Qué socios tienen préstamos sin devolver?',
      '¿Qué autores tienen más de un libro?',
      '¿Cuántos libros hay de cada género?',
    ],
    relations: [
      { from: 'books', to: 'authors', key: 'author_id' },
      { from: 'loans', to: 'members', key: 'member_id' },
      { from: 'loans', to: 'books', key: 'book_id' },
    ],
  },
  {
    id: 'hospital',
    schema: 'hospital',
    name: 'HospitalVida',
    icon: '🏥',
    tagline: 'Hospital y gestión de citas',
    market: [
      'HospitalVida es un hospital con varios servicios médicos (Cardiología, Pediatría, Neurología…). Tiene una plantilla de médicos asignados a cada departamento, un registro de pacientes y todas las citas que se programan entre pacientes y médicos.',
      'Trabajas en el área de datos del hospital: tu misión es analizar la actividad — qué médicos tienen más citas, el salario medio por servicio o qué pacientes aún no han tenido ninguna consulta.',
    ],
    tables: [
      { icon: '🏢', name: 'departments', desc: 'Los servicios del hospital y en qué planta están.' },
      { icon: '🩺', name: 'doctors', desc: 'Los médicos, su especialidad, departamento y salario.' },
      { icon: '🧑‍🦽', name: 'patients', desc: 'Los pacientes, su fecha de nacimiento, ciudad y grupo sanguíneo.' },
      { icon: '📅', name: 'appointments', desc: 'Las citas: paciente, médico, fecha, estado y motivo.' },
    ],
    questions: [
      '¿Qué médico tiene más citas?',
      '¿Cuál es el salario medio por departamento?',
      '¿Cuántas citas hay de cada estado?',
      '¿Qué pacientes no tienen ninguna cita?',
    ],
    relations: [
      { from: 'doctors', to: 'departments', key: 'department_id' },
      { from: 'appointments', to: 'patients', key: 'patient_id' },
      { from: 'appointments', to: 'doctors', key: 'doctor_id' },
    ],
  },
  {
    id: 'banco',
    schema: 'banco',
    name: 'BancoSeguro',
    icon: '🏦',
    tagline: 'Banco con cuentas y préstamos',
    market: [
      'BancoSeguro es una entidad bancaria con varias sucursales en España. Gestiona clientes que abren cuentas corrientes y de ahorro, registra todos los movimientos (depósitos, retiros y transferencias) y concede préstamos que pueden estar activos, pagados o en mora.',
      'Trabajas en el área de datos del banco: tu misión es analizar el negocio — qué clientes acumulan más patrimonio, qué sucursal gestiona más dinero o qué préstamos están impagados.',
    ],
    tables: [
      { icon: '🏢', name: 'branches', desc: 'Las sucursales del banco y la ciudad donde están.' },
      { icon: '👥', name: 'customers', desc: 'Los clientes, su ciudad y la fecha en que se hicieron clientes.' },
      { icon: '💳', name: 'accounts', desc: 'Las cuentas (corriente/ahorro), su saldo, sucursal y titular.' },
      { icon: '💸', name: 'transactions', desc: 'Los movimientos: depósitos, retiros y transferencias de cada cuenta.' },
      { icon: '📑', name: 'loans', desc: 'Los préstamos: importe, interés y estado (activo, pagado, moroso).' },
    ],
    questions: [
      '¿Qué clientes tienen más patrimonio?',
      '¿Qué sucursal gestiona más dinero?',
      '¿Qué préstamos están en mora?',
      '¿Cuántas cuentas hay de cada tipo?',
    ],
    relations: [
      { from: 'accounts', to: 'customers', key: 'customer_id' },
      { from: 'accounts', to: 'branches', key: 'branch_id' },
      { from: 'transactions', to: 'accounts', key: 'account_id' },
      { from: 'loans', to: 'customers', key: 'customer_id' },
    ],
  },
];

module.exports = scenarios;
