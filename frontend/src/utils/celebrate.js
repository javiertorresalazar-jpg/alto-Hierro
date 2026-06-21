import confetti from 'canvas-confetti';

export function fireConfetti() {
  const opts = { spread: 70, startVelocity: 45, ticks: 200, zIndex: 9999 };
  confetti({ ...opts, particleCount: 70, origin: { x: 0.2, y: 0.7 } });
  confetti({ ...opts, particleCount: 70, origin: { x: 0.8, y: 0.7 } });
  setTimeout(() => {
    confetti({ ...opts, particleCount: 50, origin: { x: 0.5, y: 0.6 } });
  }, 180);
}

export function fireRankUp() {
  const end = Date.now() + 900;
  const colors = ['#3b82f6', '#8b5cf6', '#fbbf24'];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors, zIndex: 9999 });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors, zIndex: 9999 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

let audioCtx = null;

// Sonido sintético sin assets externos. tones = [[freq, startMs, durMs], ...]
function playTones(tones) {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    tones.forEach(([freq, start, dur]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = now + start / 1000;
      const t1 = t0 + dur / 1000;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t1 + 0.02);
    });
  } catch {
    /* silencio si el navegador no lo permite */
  }
}

export function playSuccess(enabled = true) {
  if (!enabled) return;
  playTones([[523.25, 0, 120], [659.25, 110, 120], [783.99, 220, 180]]); // Do-Mi-Sol
}

export function playLevelUp(enabled = true) {
  if (!enabled) return;
  playTones([[523.25, 0, 110], [659.25, 100, 110], [783.99, 200, 110], [1046.5, 300, 260]]);
}
