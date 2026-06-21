// Genera una imagen PNG con el resultado para compartir, usando canvas.
export function buildShareImage({ title, subtitle, stats, rankIcon }) {
  const W = 1080;
  const H = 600;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Fondo degradado
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Borde superior de color
  const top = ctx.createLinearGradient(0, 0, W, 0);
  top.addColorStop(0, '#3b82f6');
  top.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 10);

  // Emoji grande
  ctx.font = '110px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(rankIcon || '🐘', W / 2, 170);

  // Título
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 56px -apple-system, Segoe UI, sans-serif';
  ctx.fillText(title, W / 2, 270);

  // Subtítulo
  ctx.fillStyle = '#93c5fd';
  ctx.font = '32px -apple-system, Segoe UI, sans-serif';
  ctx.fillText(subtitle, W / 2, 325);

  // Stats en columnas
  const n = stats.length;
  const colW = W / n;
  stats.forEach((s, i) => {
    const cx = colW * i + colW / 2;
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 64px -apple-system, Segoe UI, sans-serif';
    ctx.fillText(String(s.value), cx, 460);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '26px -apple-system, Segoe UI, sans-serif';
    ctx.fillText(s.label, cx, 500);
  });

  // Pie
  ctx.fillStyle = '#64748b';
  ctx.font = '28px -apple-system, Segoe UI, sans-serif';
  ctx.fillText('🐘 SQL Trainer · Aprende PostgreSQL', W / 2, 565);

  return canvas;
}

export async function shareOrDownload(canvas, filename = 'sql-trainer.png') {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);
      const file = new File([blob], filename, { type: 'image/png' });
      // Web Share API con archivos (móvil)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'SQL Trainer' });
          return resolve(true);
        } catch {
          /* el usuario canceló: caemos a descarga */
        }
      }
      // Fallback: descargar
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}
