import { useState, useEffect, useCallback } from 'react';
import { supabase, isAuthConfigured } from '../lib/supabase';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isAuthConfigured);

  useEffect(() => {
    if (!isAuthConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Si la confirmación de email está activada, no habrá sesión todavía
    if (!data.session) return { needsConfirmation: true };
    return { user: data.user };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Lee el progreso guardado en la nube para el usuario actual
  const fetchCloudProgress = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return null;
    return data?.data || null;
  }, []);

  // Guarda (upsert) el progreso en la nube
  const saveCloudProgress = useCallback(async (userId, progress) => {
    await supabase
      .from('user_progress')
      .upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  }, []);

  return {
    configured: isAuthConfigured,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    fetchCloudProgress,
    saveCloudProgress,
  };
}
