// Note frequency lookup table
export const NOTE_FREQUENCIES = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50,
  'REST': 0,
};

export const PHRASES = {
  piano: [
    {
      id: 'piano_1',
      name: 'Simple Melody',
      notes: [
        { note: 'C4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'C5', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'piano_2',
      name: 'Arpeggio',
      notes: [
        { note: 'C4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'C5', duration: 0.5 },
        { note: 'E5', duration: 0.5 },
        { note: 'C5', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'piano_3',
      name: 'Ballad',
      notes: [
        { note: 'E4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
  drums: [
    {
      id: 'drums_1',
      name: 'Basic Beat',
      isDrum: true,
      hits: [
        { drum: 'kick',  time: 0 },
        { drum: 'hihat', time: 0 },
        { drum: 'hihat', time: 0.5 },
        { drum: 'snare', time: 1 },
        { drum: 'hihat', time: 1 },
        { drum: 'hihat', time: 1.5 },
        { drum: 'kick',  time: 2 },
        { drum: 'hihat', time: 2 },
        { drum: 'hihat', time: 2.5 },
        { drum: 'snare', time: 3 },
        { drum: 'hihat', time: 3 },
        { drum: 'hihat', time: 3.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'drums_2',
      name: 'Rock Beat',
      isDrum: true,
      hits: [
        { drum: 'kick',  time: 0 },
        { drum: 'hihat', time: 0 },
        { drum: 'kick',  time: 0.5 },
        { drum: 'snare', time: 1 },
        { drum: 'hihat', time: 1 },
        { drum: 'kick',  time: 2 },
        { drum: 'hihat', time: 2 },
        { drum: 'snare', time: 3 },
        { drum: 'hihat', time: 3 },
        { drum: 'kick',  time: 3.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'drums_3',
      name: 'Groove Beat',
      isDrum: true,
      hits: [
        { drum: 'kick',  time: 0 },
        { drum: 'hihat', time: 0 },
        { drum: 'snare', time: 0.75 },
        { drum: 'hihat', time: 1 },
        { drum: 'kick',  time: 1.25 },
        { drum: 'hihat', time: 1.5 },
        { drum: 'snare', time: 2 },
        { drum: 'kick',  time: 2.5 },
        { drum: 'snare', time: 3 },
        { drum: 'kick',  time: 3.75 },
      ],
      totalBeats: 4,
    },
  ],
  guitar: [
    {
      id: 'guitar_1',
      name: 'Strum Along',
      notes: [
        { note: 'G3', duration: 0.5 },
        { note: 'A3', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'A3', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'guitar_2',
      name: 'Power Chords',
      notes: [
        { note: 'C4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'guitar_3',
      name: 'Fast Riff',
      notes: [
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'A4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
  triangle: [
    {
      id: 'triangle_1',
      name: 'Bright Ping',
      notes: [
        { note: 'C5', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'G5', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'triangle_2',
      name: 'Double Tap',
      notes: [
        { note: 'C5', duration: 0.5 },
        { note: 'C5', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'G5', duration: 0.5 },
        { note: 'G5', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'triangle_3',
      name: 'Shimmer',
      notes: [
        { note: 'C5', duration: 0.5 },
        { note: 'E5', duration: 0.5 },
        { note: 'G5', duration: 0.5 },
        { note: 'C6', duration: 0.5 },
        { note: 'G5', duration: 0.5 },
        { note: 'E5', duration: 0.5 },
        { note: 'C5', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
  bass: [
    {
      id: 'bass_1',
      name: 'Root Notes',
      notes: [
        { note: 'C2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'A2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'bass_2',
      name: 'Walking',
      notes: [
        { note: 'C2', duration: 0.5 },
        { note: 'D2', duration: 0.5 },
        { note: 'E2', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'A2', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'E2', duration: 0.5 },
        { note: 'D2', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'bass_3',
      name: 'Groove',
      notes: [
        { note: 'C2', duration: 0.5 },
        { note: 'C2', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'A2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'G2', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
};

export const INSTRUMENTS = [
  {
    id: 'piano',
    name: 'Piano',
    emoji: '🎹',
    baseCost: 30,
    baseNPS: 0.5,
    color: '#D4A017',
    audioType: 'piano',
    phrases: PHRASES.piano,
    phraseCosts: [0, 0, 100, 800],
  },
  {
    id: 'drums',
    name: 'Drums',
    emoji: '🥁',
    baseCost: 50,
    baseNPS: 2,
    color: '#EF4444',
    audioType: 'drums',
    phrases: PHRASES.drums,
    phraseCosts: [0, 0, 200, 800],
  },
  {
    id: 'guitar',
    name: 'Guitar',
    emoji: '🎸',
    baseCost: 100,
    baseNPS: 5,
    color: '#10B981',
    audioType: 'guitar',
    phrases: PHRASES.guitar,
    phraseCosts: [0, 0, 400, 1600],
  },
  {
    id: 'triangle',
    name: 'Xylophone',
    emoji: '🎵',
    baseCost: 250,
    baseNPS: 15,
    color: '#06B6D4',
    audioType: 'triangle',
    phrases: PHRASES.triangle,
    phraseCosts: [0, 0, 1000, 4000],
  },
  {
    id: 'bass',
    name: 'Bass',
    emoji: '🎸',
    baseCost: 500,
    baseNPS: 100,
    color: '#6366F1',
    audioType: 'bass',
    phrases: PHRASES.bass,
    phraseCosts: [0, 0, 4000, 16000],
  },
];

export const UPGRADES = [
  {
    id: 'better_technique',
    name: 'Better Technique',
    description: 'Doubles notes per click',
    cost: 100,
    icon: '✋',
    effect: { type: 'npc_multiplier', value: 2 },
  },
  {
    id: 'metronome',
    name: 'Metronome',
    description: '1.5× all notes per second',
    cost: 500,
    icon: '🎙️',
    effect: { type: 'nps_multiplier', value: 1.5 },
  },
  {
    id: 'studio_reverb',
    name: 'Studio Reverb',
    description: '+2 NPS per instrument owned',
    cost: 2000,
    icon: '🔊',
    effect: { type: 'nps_per_instrument', value: 2 },
  },
  {
    id: 'sound_engineer',
    name: 'Sound Engineer',
    description: '2× all notes per second',
    cost: 10000,
    icon: '🎚️',
    effect: { type: 'nps_multiplier', value: 2 },
  },
  {
    id: 'record_label',
    name: 'Record Label',
    description: '3× all notes per second',
    cost: 60000,
    icon: '💿',
    effect: { type: 'nps_multiplier', value: 3 },
  },
  {
    id: 'world_tour',
    name: 'World Tour',
    description: '5× all notes per second',
    cost: 300000,
    icon: '🌍',
    effect: { type: 'nps_multiplier', value: 5 },
  },
];

// ---------------------------------------------------------------------------
// Step sequencer helpers
// ---------------------------------------------------------------------------

// One note per cell (8 cells) for each melodic instrument
export const STEP_NOTES = {
  piano:    ['C4','E4','G4','A4','C5','A4','G4','E4'],
  guitar:   ['G3','A3','C4','D4','E4','D4','C4','A3'],
  triangle: ['C5','E5','G5','C5','G5','E5','C5','G5'],
  bass:     ['C2','G2','A2','G2','C2','G2','A2','G2'],
};

// Available pitches for the MIDI editor, ordered high → low.
// Sticks to natural notes (C D E F G A B) that exist in NOTE_FREQUENCIES.
export const MIDI_PITCHES = {
  piano:    ['C5','B4','A4','G4','F4','E4','D4','C4','B3','A3','G3','F3','E3','D3','C3'],
  guitar:   ['E4','D4','C4','B3','A3','G3','F3','E3','D3','C3','B2','A2','G2'],
  triangle: ['A5','G5','F5','E5','D5','C5','B4','A4','G4','F4','E4','D4','C4'],
  bass:     ['E3','D3','C3','B2','A2','G2','F2','E2','D2','C2'],
};

// Drum type per step cell
const STEP_DRUMS = ['kick','hihat','snare','hihat','kick','hihat','snare','hihat'];

// Derive an 8-cell boolean pattern from a phrase (used to seed customPattern)
export function getDefaultPattern(phrase, numCells = 8) {
  if (!phrase) return new Array(numCells).fill(false);
  const totalBeats = phrase.totalBeats || 4;
  const filled = new Array(numCells).fill(false);

  if (phrase.isDrum) {
    phrase.hits.forEach(hit => {
      const idx = Math.min(Math.floor((hit.time / totalBeats) * numCells), numCells - 1);
      filled[idx] = true;
    });
  } else {
    let beatPos = 0;
    for (const note of phrase.notes) {
      if (note.note !== 'REST') {
        const idx = Math.min(Math.floor((beatPos / totalBeats) * numCells), numCells - 1);
        filled[idx] = true;
      }
      beatPos += note.duration;
    }
  }
  return filled;
}

// Derive one representative note per step cell from a phrase.
// Uses the same time-bucketing as getDefaultPattern so the notes
// align with the visual dots shown in the beat grid.
export function getPhraseStepNotes(phrase, numCells = 8) {
  if (!phrase || phrase.isDrum) return null;
  const totalBeats = phrase.totalBeats || 4;
  // Start with the fallback scale so every cell always has a note
  const fallback = STEP_NOTES; // looked up by caller
  const result = new Array(numCells).fill(null);
  let beatPos = 0;
  for (const note of phrase.notes) {
    if (note.note !== 'REST') {
      const idx = Math.min(Math.floor((beatPos / totalBeats) * numCells), numCells - 1);
      if (result[idx] === null) result[idx] = note.note; // first note wins per cell
    }
    beatPos += note.duration;
  }
  return result; // may still contain nulls for empty cells
}

// Build an audio-engine-compatible phraseData from an 8-cell boolean pattern.
// Pass the currently active phrase so the step notes match what was selected.
// Pass midiNotes (Array<string|null>) to use exact per-cell pitches from the
// MIDI editor instead of deriving them from the phrase.
export function buildPhraseFromPattern(instrumentId, pattern, activePhrase, midiNotes) {
  const CELL_BEATS = 0.5;
  const totalBeats = pattern.length * CELL_BEATS;

  if (instrumentId === 'drums' || activePhrase?.isDrum) {
    const hits = [];
    pattern.forEach((active, i) => {
      if (active) hits.push({ drum: STEP_DRUMS[i], time: i * CELL_BEATS });
    });
    return { isDrum: true, hits, totalBeats };
  }

  // MIDI editor notes take priority; fall back to phrase-derived or generic scale
  if (midiNotes) {
    const notes = midiNotes.map(noteStr => ({
      note: noteStr ?? 'REST',
      duration: CELL_BEATS,
    }));
    return { notes, totalBeats };
  }

  const phraseStepNotes = activePhrase ? getPhraseStepNotes(activePhrase, pattern.length) : null;
  const fallbackScale = STEP_NOTES[instrumentId] || new Array(pattern.length).fill('C4');
  const notes = pattern.map((active, i) => ({
    note: active ? (phraseStepNotes?.[i] ?? fallbackScale[i]) : 'REST',
    duration: CELL_BEATS,
  }));
  return { notes, totalBeats };
}

export function getInstrumentCost(instrument, countOwned) {
  if (instrument.baseCost === 0 && countOwned === 0) return 0;
  return Math.ceil(instrument.baseCost * Math.pow(1.15, countOwned));
}

export function formatNumber(n) {
  if (n === undefined || n === null) return '0';
  if (n < 1000) return Math.floor(n).toString();
  if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
}

// Like formatNumber but preserves up to one decimal place for values under 10,
// so small NPS rates like 0.5 display correctly instead of flooring to 0.
export function formatNPS(n) {
  if (n === undefined || n === null) return '0';
  if (n < 10) return parseFloat(n.toFixed(1)).toString();
  if (n < 1000) return Math.floor(n).toString();
  if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
}
