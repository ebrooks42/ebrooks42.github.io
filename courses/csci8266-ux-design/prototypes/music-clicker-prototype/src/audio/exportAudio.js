/**
 * Records 4 measures of the live audio output and downloads the result.
 *
 * Uses MediaRecorder on a tap off masterGain. Tries audio/mp4 first
 * (Safari), falls back to audio/webm (Chrome / Firefox).
 *
 * @param {AudioEngine} audioEngine - the singleton engine (must be initialized)
 * @param {number} tempo - current BPM
 * @param {function} onProgress - called with 0–1 as recording progresses
 * @returns {Promise<void>} resolves when download has been triggered
 */
export async function exportAudio(audioEngine, tempo, onProgress) {
  if (!audioEngine.initialized || !audioEngine.ctx) {
    throw new Error('Start playing before exporting — toggle an instrument on first.');
  }

  // 4 measures × 4 beats/measure
  const beatDuration = 60 / Math.max(tempo, 1);
  const totalDuration = 16 * beatDuration; // seconds

  // Tap the master output without disturbing the live playback
  const streamDest = audioEngine.ctx.createMediaStreamDestination();
  audioEngine.masterGain.connect(streamDest);

  // Pick best available container format.
  // Require explicit AAC codec for MP4 — Chrome supports 'audio/mp4' but
  // encodes with Opus, producing a .mp4 that Windows cannot play.
  // Only Safari supports 'audio/mp4;codecs=mp4a.40.2' (true AAC), so Chrome
  // correctly falls through to webm here.
  const candidates = [
    'audio/mp4;codecs=mp4a.40.2', // AAC-LC in MP4 — Safari; plays on Windows/Mac
    'audio/webm;codecs=opus',      // Chrome / Firefox
    'audio/webm',                  // last-resort fallback
  ];
  const mimeType = candidates.find(f => {
    try { return MediaRecorder.isTypeSupported(f); } catch { return false; }
  }) || 'audio/webm';
  const ext = mimeType.startsWith('audio/mp4') ? 'mp4' : 'webm';

  const chunks = [];
  const recorder = new MediaRecorder(streamDest.stream, { mimeType });
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      // Disconnect the tap — leave the main audio running
      try { audioEngine.masterGain.disconnect(streamDest); } catch {}

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `music-clicker-export.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      resolve();
    };

    recorder.onerror = e => {
      try { audioEngine.masterGain.disconnect(streamDest); } catch {}
      reject(new Error(`Recording failed: ${e.error?.message || 'unknown error'}`));
    };

    recorder.start(100); // collect chunks every 100 ms for smooth progress

    const startTime = Date.now();
    const tick = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / totalDuration, 1);
      if (onProgress) onProgress(progress);
      if (elapsed >= totalDuration) {
        clearInterval(tick);
        if (recorder.state === 'recording') recorder.stop();
      }
    }, 100);
  });
}
