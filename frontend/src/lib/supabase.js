import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Si no hay credenciales configuradas, la app sigue funcionando en modo
// invitado (solo localStorage) y el login simplemente no aparece.
export const isAuthConfigured = Boolean(url && anonKey);

export const supabase = isAuthConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
