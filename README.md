# 🐘 SQL Trainer — Aprende SQL PostgreSQL

App web (instalable en el móvil como PWA) para aprender SQL con ejercicios
por nivel de dificultad, una base de datos de ejemplo y una chuleta de ayuda.

- **24 ejercicios** en 3 niveles: básico, intermedio y avanzado
- **Base de datos de ejemplo** (tienda TechStore) para practicar
- **Editor SQL** con ejecución real y verificación automática de respuestas
- **Chuleta de ayuda** con 11 categorías de comandos SQL
- **Instalable en el teléfono** (PWA)

---

## 🚀 Ponerla online (Supabase + Vercel) — recomendado

### Paso 1 — Base de datos en Supabase

1. Entra en [supabase.com](https://supabase.com) → crea un proyecto nuevo.
2. En el menú lateral abre **SQL Editor** → **New query**.
3. Abre el archivo [`supabase/setup.sql`](supabase/setup.sql) de este repo,
   copia **todo** su contenido, pégalo y pulsa **Run**.
   (Crea la tienda TechStore con sus datos.)
4. Repite el paso 3 con [`supabase/setup-extra.sql`](supabase/setup-extra.sql)
   para añadir los escenarios de **Biblioteca** y **Hospital**.
5. Ve a **Connect** (botón arriba) → **Direct / URI**
   y copia la cadena de conexión. Sustituye `[YOUR-PASSWORD]` por la
   contraseña de tu proyecto. La necesitarás en el paso 2.

> Consejo: usa la opción **"Connection pooling"** (Transaction) de Supabase,
> que es la recomendada para apps serverless como esta.

### Paso 2 — Desplegar en Vercel

1. Entra en [vercel.com](https://vercel.com) → **Add New → Project**.
2. Importa este repositorio de GitHub.
3. Vercel detecta la configuración automáticamente (no cambies nada).
4. En **Environment Variables** añade:
   - **Name:** `DATABASE_URL`
   - **Value:** la cadena de conexión que copiaste de Supabase.
5. Pulsa **Deploy**.

En 1-2 minutos tendrás una URL pública (ej. `https://tu-app.vercel.app`)
que puedes abrir desde el móvil o el ordenador. Desde el móvil, el navegador
te ofrecerá **instalarla** en la pantalla de inicio.

---

## 💻 Ejecutar en local

Necesitas Node.js y PostgreSQL instalados.

```bash
# 1. Base de datos
psql -U postgres -c "CREATE DATABASE sql_learning;"

# 2. Backend (servidor Express clásico)
cd backend
cp .env.example .env      # ajusta tu contraseña
npm install
npm run seed              # carga los datos
npm start                 # http://localhost:3001

# 3. Frontend (en otra terminal)
cd frontend
npm install
npm start                 # http://localhost:3000
```

O con Docker: `docker-compose up` y abre `http://localhost:3000`.

---

## 🗂️ Estructura

```
├── api/              Funciones serverless para Vercel (online)
│   ├── _lib/         Conexión a BD + datos de ejercicios
│   ├── exercises.js  Lista de ejercicios
│   ├── query.js      Ejecuta consultas SELECT
│   ├── check/[id].js Verifica la respuesta del usuario
│   ├── hint/[id].js  Devuelve la solución
│   └── schema.js     Esquema de la BD
├── backend/          Servidor Express equivalente (para local / Docker)
├── frontend/         App React (PWA)
└── supabase/
    └── setup.sql     Script para crear y poblar la BD en Supabase
```

> La app funciona igual online (Vercel + Supabase) que en local (Express +
> PostgreSQL). El frontend llama siempre a `/api/...`, sin cambios.
