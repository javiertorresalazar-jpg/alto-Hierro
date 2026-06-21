// Combina dos estados de progreso (local y nube) sin perder nada:
// se queda con lo mejor de cada uno.
function maxMap(a = {}, b = {}) {
  const out = { ...a };
  for (const k of Object.keys(b)) {
    out[k] = Math.max(a[k] || 0, b[k] || 0);
  }
  return out;
}

export default function mergeProgress(local = {}, cloud = {}) {
  const completed = Array.from(new Set([...(local.completed || []), ...(cloud.completed || [])]));
  const badges = Array.from(new Set([...(local.badges || []), ...(cloud.badges || [])]));

  // La fecha de reto diario más reciente manda
  const localDate = local.dailyDate || '';
  const cloudDate = cloud.dailyDate || '';
  const useLocalDaily = localDate >= cloudDate;

  return {
    xp: Math.max(local.xp || 0, cloud.xp || 0),
    completed,
    byLevel: maxMap(local.byLevel, cloud.byLevel),
    byTopic: maxMap(local.byTopic, cloud.byTopic),
    streak: Math.max(local.streak || 0, cloud.streak || 0),
    lastDay: (local.lastDay || '') >= (cloud.lastDay || '') ? local.lastDay : cloud.lastDay,
    badges,
    dailyDate: useLocalDaily ? local.dailyDate : cloud.dailyDate,
    dailyDone: useLocalDaily ? local.dailyDone : cloud.dailyDone,
    attempts: Math.max(local.attempts || 0, cloud.attempts || 0),
    correctChecks: Math.max(local.correctChecks || 0, cloud.correctChecks || 0),
  };
}
