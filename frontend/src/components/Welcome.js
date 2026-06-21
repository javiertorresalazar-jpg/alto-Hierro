import React from 'react';

const TABLES = [
  { icon: '🏷️', name: 'categories', desc: 'Las familias de producto: Portátiles, Smartphones, Tablets, Audio, Gaming…' },
  { icon: '📦', name: 'products', desc: 'El catálogo: cada producto con su precio, stock y a qué categoría pertenece.' },
  { icon: '👥', name: 'customers', desc: 'Los clientes que compran, con su ciudad y país (España, Portugal, México…).' },
  { icon: '🛒', name: 'orders', desc: 'Cada pedido realizado, su estado (entregado, enviado, cancelado…) y su total.' },
  { icon: '📋', name: 'order_items', desc: 'El detalle de cada pedido: qué productos y en qué cantidad se compraron.' },
  { icon: '⭐', name: 'reviews', desc: 'Las valoraciones (1–5 estrellas) que los clientes dejan sobre los productos.' },
  { icon: '👤', name: 'employees', desc: 'La plantilla de la empresa, con su salario y antigüedad.' },
  { icon: '🏢', name: 'departments', desc: 'Los departamentos (Tecnología, Ventas, Logística…) donde trabajan los empleados.' },
];

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <div className="welcome-hero">
        <div style={{ fontSize: '3rem' }}>🐘</div>
        <h2>Bienvenido a SQL Trainer</h2>
        <p>
          Antes de empezar, ponte en situación. Aquí no vas a practicar con datos
          inventados sin sentido: vas a trabajar como el <strong>analista de datos</strong> de
          una tienda real. Esto es lo que necesitas saber. 👇
        </p>
      </div>

      <section className="welcome-card">
        <h3>🛒 El negocio: <span className="accent">TechStore</span></h3>
        <p>
          TechStore es una <strong>tienda online de tecnología</strong> con sede en España que
          vende ordenadores portátiles, smartphones, tablets, monitores, auriculares,
          accesorios y productos gaming. Tiene clientes en varios países y un equipo
          repartido en distintos departamentos.
        </p>
        <p>
          Como en cualquier comercio, cada día pasan cosas: entran <strong>pedidos</strong>,
          los clientes dejan <strong>reseñas</strong>, hay productos que se agotan y otros que casi
          no se venden. Toda esa actividad queda <strong>guardada en una base de datos</strong>, y tu
          trabajo será hacerle preguntas con SQL para sacar conclusiones.
        </p>
      </section>

      <section className="welcome-card">
        <h3>🗂️ Los datos que vas a explorar</h3>
        <p style={{ marginBottom: 12 }}>
          La base de datos tiene <strong>8 tablas</strong>. Piensa en cada tabla como una hoja de
          Excel con un tema concreto:
        </p>
        <div className="welcome-tables">
          {TABLES.map((t) => (
            <div key={t.name} className="welcome-table-item">
              <span className="welcome-table-icon">{t.icon}</span>
              <div>
                <code>{t.name}</code>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome-card">
        <h3>🔗 Cómo se conecta todo</h3>
        <p>
          Las tablas no están sueltas: están <strong>relacionadas</strong>. Por ejemplo, un
          <em> pedido</em> pertenece a un <em>cliente</em>; ese pedido contiene varios
          <em> productos</em>; y cada producto está dentro de una <em>categoría</em>. Gracias a
          esas conexiones podrás responder preguntas como:
        </p>
        <ul className="welcome-questions">
          <li>¿Qué productos son los más vendidos?</li>
          <li>¿Qué clientes gastan más dinero?</li>
          <li>¿Qué categoría genera más ingresos?</li>
          <li>¿Qué productos tienen mejores valoraciones?</li>
        </ul>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 8 }}>
          💡 En la pestaña <strong>"Base de Datos"</strong> puedes ver en todo momento las tablas,
          sus columnas y cómo se relacionan.
        </p>
      </section>

      <section className="welcome-card">
        <h3>🎯 Cómo funciona</h3>
        <ol className="welcome-steps">
          <li>Elige un ejercicio según tu nivel: <strong>Básico</strong>, <strong>Intermedio</strong> o <strong>Avanzado</strong>.</li>
          <li>Escribe tu consulta en el editor y pulsa <strong>Ejecutar</strong> para ver el resultado.</li>
          <li>Pulsa <strong>Verificar</strong> para comprobar si es correcta y ganar <strong>XP</strong>.</li>
          <li>¿Atascado? Tienes <strong>teoría</strong>, <strong>pistas</strong> y la <strong>chuleta</strong> en "Ayuda SQL".</li>
        </ol>
      </section>

      <button className="btn btn-primary welcome-cta" onClick={onStart}>
        🚀 Empezar a practicar
      </button>
    </div>
  );
}
