-- =====================================================================
-- SQL TRAINER · Tabla para guardar el progreso de cada usuario
-- ---------------------------------------------------------------------
-- Pega este archivo en el SQL Editor de Supabase y pulsa "Run".
-- Crea la tabla donde se sincroniza el progreso (XP, medallas, etc.)
-- de cada cuenta, protegida para que cada usuario solo vea lo suyo.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seguridad a nivel de fila: cada usuario solo accede a su propia fila.
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leer mi progreso" ON public.user_progress;
CREATE POLICY "leer mi progreso"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "crear mi progreso" ON public.user_progress;
CREATE POLICY "crear mi progreso"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "actualizar mi progreso" ON public.user_progress;
CREATE POLICY "actualizar mi progreso"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
