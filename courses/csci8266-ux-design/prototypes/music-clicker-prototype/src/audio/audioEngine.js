import { NOTE_FREQUENCIES } from '../data/gameData.js';

// ---------------------------------------------------------------------------
// Audio Engine – singleton
// Uses a lookahead scheduler: setInterval every 50ms, schedules notes up to
// 200ms ahead using AudioContext.currentTime.
// ---------------------------------------------------------------------------

const LOOKAHEAD = 0.2;       // seconds to schedule ahead
const SCHEDULER_INTERVAL = 50; // ms between scheduler runs

// How far ahead of the actual beat the visual cursor starts its transition.
// 1/5 means the highlight begins at 80% through the previous cell so it
// arrives fully blue exactly on the downbeat. Tweak here to taste.
export const VISUAL_LEAD_FRACTION = 1 / 80;

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bpm = 120;
    this.volume = 0.7;
    this.initialized = false;

    // Map of instrumentId -> scheduler state
    // { phraseData, type, nextNoteTime, noteIndex, schedulerTimer }
    this.activeInstruments = new Map();

    this._schedulerTimer = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;

      // Start the global scheduler loop
      this._schedulerTimer = setInterval(() => this._runScheduler(), SCHEDULER_INTERVAL);
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }

  setTempo(bpm) {
    this.bpm = Math.max(60, Math.min(200, bpm));
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // beatDuration in seconds given current BPM
  _beatDuration() {
    return 60 / this.bpm;
  }

  // -------------------------------------------------------------------------
  // Instrument scheduling
  // -------------------------------------------------------------------------

  startInstrument(id, phraseData, instrumentType, startTime) {
    if (!this.initialized) return;
    const t = startTime ?? this.ctx.currentTime;
    // If already running this id, restart with new phrase
    if (this.activeInstruments.has(id)) {
      const existing = this.activeInstruments.get(id);
      existing.phraseData = phraseData;
      existing.type = instrumentType;
      existing.noteIndex = 0;
      existing.nextNoteTime = t;
      existing.currentLoopStart = t;
      return;
    }
    this.activeInstruments.set(id, {
      phraseData,
      type: instrumentType,
      noteIndex: 0,
      nextNoteTime: t,
      currentLoopStart: t,
    });
  }

  // Returns the soonest upcoming loop boundary across all active instruments,
  // so a newly toggled instrument can wait and join on the downbeat.
  // Returns null if no instruments are currently playing.
  getNextLoopBoundary() {
    if (!this.initialized || !this.ctx) return null;
    const now = this.ctx.currentTime;
    let soonest = Infinity;

    for (const [, state] of this.activeInstruments) {
      if (!state.phraseData || state.currentLoopStart === undefined) continue;
      const loopDur = state.phraseData.totalBeats * this._beatDuration();
      if (loopDur <= 0) continue;

      // currentLoopStart is the most recently scheduled loop's start time.
      // If it's still in the future the scheduler queued it ahead of time —
      // that IS the next boundary. If it's in the past, the next boundary
      // is one loop duration later.
      const boundary = state.currentLoopStart > now
        ? state.currentLoopStart
        : state.currentLoopStart + loopDur;

      if (boundary < soonest) soonest = boundary;
    }

    return soonest === Infinity ? null : soonest;
  }

  stopInstrument(id) {
    this.activeInstruments.delete(id);
  }

  stopAll() {
    this.activeInstruments.clear();
  }

  updateInstrumentPhrase(id, phraseData, instrumentType) {
    if (this.activeInstruments.has(id)) {
      const state = this.activeInstruments.get(id);
      state.phraseData = phraseData;
      state.type = instrumentType;
      state.noteIndex = 0;
      state.nextNoteTime = this.ctx.currentTime;
    }
  }

  // Swap phrase data without resetting position or timing.
  // For melodic instruments the current loop continues from the same noteIndex;
  // for drums the already-scheduled hits play out and the new pattern takes
  // effect on the next loop. Either way no desync is introduced.
  patchInstrumentPhrase(id, phraseData, instrumentType) {
    if (!this.activeInstruments.has(id)) return;
    const state = this.activeInstruments.get(id);
    state.phraseData = phraseData;
    state.type = instrumentType;
    // noteIndex and nextNoteTime are intentionally left unchanged
  }

  // -------------------------------------------------------------------------
  // Scheduler loop
  // -------------------------------------------------------------------------

  _runScheduler() {
    if (!this.initialized || !this.ctx) return;
    const deadline = this.ctx.currentTime + LOOKAHEAD;

    for (const [id, state] of this.activeInstruments) {
      this._scheduleInstrument(id, state, deadline);
    }
  }

  _scheduleInstrument(id, state, deadline) {
    const { phraseData, type } = state;
    if (!phraseData) return;

    const beatDur = this._beatDuration();

    if (phraseData.isDrum) {
      // Drum scheduling: we treat the phrase as a fixed set of hits per loop
      // We store loopStartTime and schedule entire loops
      if (state.nextNoteTime === undefined || state.nextNoteTime <= this.ctx.currentTime - phraseData.totalBeats * beatDur - 0.5) {
        state.nextNoteTime = this.ctx.currentTime;
        state.loopIndex = 0;
      }
      while (state.nextNoteTime < deadline) {
        const loopStart = state.nextNoteTime;
        state.currentLoopStart = loopStart; // record for UI cursor
        // Schedule all hits in this loop
        for (const hit of phraseData.hits) {
          const hitTime = loopStart + hit.time * beatDur;
          if (hitTime >= this.ctx.currentTime - 0.01) {
            this._scheduleDrumHit(hit.drum, hitTime);
          }
        }
        state.nextNoteTime += phraseData.totalBeats * beatDur;
      }
    } else {
      // Melodic scheduling: note by note
      const notes = phraseData.notes;
      if (!notes || notes.length === 0) return;

      while (state.nextNoteTime < deadline) {
        if (state.noteIndex === 0) {
          state.currentLoopStart = state.nextNoteTime; // new loop starting here
        }
        const note = notes[state.noteIndex % notes.length];
        const freq = NOTE_FREQUENCIES[note.note] || 0;
        const duration = note.duration * beatDur;

        if (freq > 0) {
          this._scheduleMelodicNote(freq, state.nextNoteTime, duration, type);
        }

        state.nextNoteTime += duration;
        state.noteIndex = (state.noteIndex + 1) % notes.length;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Note synthesis
  // -------------------------------------------------------------------------

  _scheduleMelodicNote(freq, time, duration, type) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    switch (type) {
      case 'piano':
        this._synthPiano(freq, time, duration);
        break;
      case 'bass':
        this._synthBass(freq, time, duration);
        break;
      case 'guitar':
        this._synthGuitar(freq, time, duration);
        break;
      case 'synth':
        this._synthSynth(freq, time, duration);
        break;
      case 'triangle':
        this._synthTriangle(freq, time, duration);
        break;
      case 'violin':
        this._synthViolin(freq, time, duration);
        break;
      case 'trumpet':
        this._synthTrumpet(freq, time, duration);
        break;
      case 'orchestra':
        this._synthOrchestra(freq, time, duration);
        break;
      default:
        this._synthPiano(freq, time, duration);
    }
  }

  _makeGain(time, peak, attack, decay, sustain, release, noteDur) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + attack);
    g.gain.linearRampToValueAtTime(peak * sustain, time + attack + decay);
    const noteEnd = time + noteDur;
    g.gain.setValueAtTime(peak * sustain, noteEnd - release);
    g.gain.linearRampToValueAtTime(0, noteEnd);
    return g;
  }

  _synthPiano(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Add slight detuned copy for richness
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.0, time);

    const env = this._makeGain(time, 0.35, 0.002, 0.1, 0.4, 0.15, duration);
    const env2 = this._makeGain(time, 0.1, 0.002, 0.05, 0.2, 0.1, duration);

    osc.connect(env);
    osc2.connect(env2);
    env.connect(this.masterGain);
    env2.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.2);
    osc2.start(time);
    osc2.stop(time + duration + 0.2);
  }

  _synthBass(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.Q.setValueAtTime(2, time);

    const env = this._makeGain(time, 0.5, 0.01, 0.15, 0.7, 0.05, duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  _synthGuitar(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, time + 0.3);
    filter.Q.setValueAtTime(1, time);

    // Pluck-like envelope
    const env = this._makeGain(time, 0.4, 0.003, 0.05, 0.3, 0.1, duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.15);
  }

  _synthSynth(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, time);
    filter.Q.setValueAtTime(3, time);

    // Slow attack pad feel
    const env = this._makeGain(time, 0.3, 0.1, 0.2, 0.8, 0.2, duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.3);
  }

  _synthTriangle(freq, time, duration) {
    const ctx = this.ctx;
    // A struck metal bar (triangle) has inharmonic overtones at roughly
    // 2.76× and 5.40× the fundamental — this is what gives it that bright
    // metallic "ting". Each partial rings out with a long exponential decay
    // regardless of the note's nominal duration.
    const ringTime = Math.max(duration + 0.3, 1.8);
    const partials = [
      { ratio: 1,    gain: 0.45 },
      { ratio: 2.76, gain: 0.18 },
      { ratio: 5.40, gain: 0.07 },
    ];

    partials.forEach(({ ratio, gain: peak }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, time);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(peak, time + 0.001); // near-instant strike
      env.gain.exponentialRampToValueAtTime(0.001, time + ringTime);

      osc.connect(env);
      env.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + ringTime + 0.05);
    });
  }

  _synthViolin(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Slight vibrato via LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.5, time);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0, time);
    lfoGain.gain.linearRampToValueAtTime(4, time + 0.3); // vibrato kicks in
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2, time);
    filter.Q.setValueAtTime(0.8, time);

    // Slow bow attack
    const env = this._makeGain(time, 0.35, 0.2, 0.1, 0.85, 0.15, duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    lfo.start(time);
    lfo.stop(time + duration + 0.3);
    osc.start(time);
    osc.stop(time + duration + 0.3);
  }

  _synthTrumpet(freq, time, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    // Add harmonics for brass brightness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, time);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, time);

    const env = this._makeGain(time, 0.3, 0.02, 0.05, 0.8, 0.08, duration);
    const env2 = this._makeGain(time, 0.15, 0.02, 0.05, 0.7, 0.08, duration);

    osc.connect(filter);
    filter.connect(env);
    osc2.connect(env2);
    env.connect(this.masterGain);
    env2.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.15);
    osc2.start(time);
    osc2.stop(time + duration + 0.15);
  }

  _synthOrchestra(freq, time, duration) {
    const ctx = this.ctx;
    // Layer multiple oscillators for a full sound
    const freqs = [freq, freq * 2, freq * 3, freq * 0.5];
    const types = ['sawtooth', 'triangle', 'sine', 'sawtooth'];
    const gains = [0.2, 0.12, 0.06, 0.1];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = types[i];
      osc.frequency.setValueAtTime(f, time);

      const env = this._makeGain(time, gains[i], 0.15, 0.3, 0.75, 0.3, duration);

      osc.connect(env);
      env.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + duration + 0.4);
    });
  }

  // -------------------------------------------------------------------------
  // Drum synthesis
  // -------------------------------------------------------------------------

  _scheduleDrumHit(drumType, time) {
    switch (drumType) {
      case 'kick':
        this._synthKick(time);
        break;
      case 'snare':
        this._synthSnare(time);
        break;
      case 'hihat':
        this._synthHihat(time);
        break;
    }
  }

  _synthKick(time) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    // Pitch glide from 150 → 0.01 Hz
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.9, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  _synthSnare(time) {
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, time);
    filter.Q.setValueAtTime(0.8, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.5, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.2);
  }

  _synthHihat(time) {
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.18, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.06);
  }

  // Returns the 0-based cell index (out of numCells) currently being heard
  // for the given instrument. Returns -1 if not playing or not yet started.
  getCurrentCellIndex(id, numCells = 8) {
    if (!this.initialized || !this.ctx) return -1;
    const state = this.activeInstruments.get(id);
    if (!state || !state.phraseData || state.currentLoopStart === undefined) return -1;

    const loopDur = state.phraseData.totalBeats * this._beatDuration();
    if (loopDur <= 0) return -1;

    const cellDur = loopDur / numCells;

    // Shift currentTime forward by the visual lead so the cursor starts
    // transitioning to the next cell VISUAL_LEAD_FRACTION of a cell duration
    // before the note actually sounds, arriving fully highlighted on the beat.
    // Modulo handles the lookahead window gracefully.
    let elapsed = (this.ctx.currentTime + VISUAL_LEAD_FRACTION * cellDur) - state.currentLoopStart;
    elapsed = ((elapsed % loopDur) + loopDur) % loopDur;
    return Math.min(Math.floor((elapsed / loopDur) * numCells), numCells - 1);
  }

  // -------------------------------------------------------------------------
  // Click sound
  // -------------------------------------------------------------------------

  playClickSound() {
    if (!this.initialized || !this.ctx) return;
    const ctx = this.ctx;
    const time = ctx.currentTime;

    // Short musical click: quick triangle tone
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, time);
    osc.frequency.linearRampToValueAtTime(660, time + 0.08);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.25, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  destroy() {
    if (this._schedulerTimer) clearInterval(this._schedulerTimer);
    if (this.ctx) this.ctx.close();
  }
}

export const audioEngine = new AudioEngine();
