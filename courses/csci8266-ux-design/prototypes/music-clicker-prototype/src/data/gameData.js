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
        { note: 'E4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'C4', duration: 1.0 },
      ],
      totalBeats: 4,
    },
    {
      id: 'piano_2',
      name: 'Arpeggio',
      notes: [
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'F4', duration: 0.25 },
        { note: 'A4', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'A4', duration: 0.25 },
        { note: 'F4', duration: 0.25 },
        { note: 'D4', duration: 0.5 },
        { note: 'REST', duration: 0.25 },
      ],
      totalBeats: 4,
    },
    {
      id: 'piano_3',
      name: 'Ballad',
      notes: [
        { note: 'E4', duration: 0.75 },
        { note: 'D4', duration: 0.25 },
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'E4', duration: 1.0 },
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
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'guitar_3',
      name: 'Fast Riff',
      notes: [
        { note: 'C4', duration: 0.25 },
        { note: 'D4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'A4', duration: 0.5 },
        { note: 'G4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
  triangle: [
    {
      id: 'triangle_1',
      name: 'Bright Ping',
      notes: [
        { note: 'C5', duration: 0.25 },
        { note: 'REST', duration: 1.75 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 1.75 },
      ],
      totalBeats: 4,
    },
    {
      id: 'triangle_2',
      name: 'Double Tap',
      notes: [
        { note: 'C5', duration: 0.25 },
        { note: 'REST', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'REST', duration: 1.25 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 0.25 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 1.25 },
      ],
      totalBeats: 4,
    },
    {
      id: 'triangle_3',
      name: 'Shimmer',
      notes: [
        { note: 'C5', duration: 0.25 },
        { note: 'E5', duration: 0.25 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'E5', duration: 0.25 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'E5', duration: 0.25 },
        { note: 'G5', duration: 0.25 },
        { note: 'REST', duration: 0.25 },
        { note: 'C6', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
  ],
  kazoo: [
    {
      id: 'kazoo_1',
      name: 'Hum Along',
      notes: [
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 },
        { note: 'D4', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'kazoo_2',
      name: 'Buzzy Tune',
      notes: [
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'A4', duration: 0.5 },
        { note: 'G4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
        { note: 'REST', duration: 0.5 },
        { note: 'C4', duration: 0.5 },
      ],
      totalBeats: 4,
    },
    {
      id: 'kazoo_3',
      name: 'Fast Buzz',
      notes: [
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'A4', duration: 0.25 },
        { note: 'G4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'C4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'A4', duration: 0.25 },
        { note: 'C5', duration: 0.25 },
        { note: 'A4', duration: 0.25 },
        { note: 'E4', duration: 0.25 },
        { note: 'G4', duration: 0.5 },
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
        { note: 'C2', duration: 1.0 },
        { note: 'G2', duration: 1.0 },
        { note: 'A2', duration: 1.0 },
        { note: 'G2', duration: 1.0 },
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
        { note: 'REST', duration: 0.25 },
        { note: 'G2', duration: 0.75 },
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
    name: 'Triangle',
    emoji: '△',
    baseCost: 250,
    baseNPS: 15,
    color: '#06B6D4',
    audioType: 'violin',
    phrases: PHRASES.triangle,
    phraseCosts: [0, 0, 1000, 4000],
  },
  {
    id: 'kazoo',
    name: 'Kazoo',
    emoji: '〰',
    baseCost: 500,
    baseNPS: 40,
    color: '#84CC16',
    audioType: 'synth',
    phrases: PHRASES.kazoo,
    phraseCosts: [0, 0, 2000, 8000],
  },
  {
    id: 'bass',
    name: 'Bass',
    emoji: '🎸',
    baseCost: 1000,
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
const STEP_NOTES = {
  piano:    ['C4','E4','G4','A4','C5','A4','G4','E4'],
  guitar:   ['G3','A3','C4','D4','E4','D4','C4','A3'],
  triangle: ['C5','E5','G5','C5','G5','E5','C5','G5'],
  kazoo:    ['C4','D4','E4','G4','A4','G4','E4','D4'],
  bass:     ['C2','G2','A2','G2','C2','G2','A2','G2'],
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

// Build an audio-engine-compatible phraseData from an 8-cell boolean pattern
export function buildPhraseFromPattern(instrumentId, pattern) {
  const CELL_BEATS = 0.5;
  const totalBeats = pattern.length * CELL_BEATS;

  if (instrumentId === 'drums') {
    const hits = [];
    pattern.forEach((active, i) => {
      if (active) hits.push({ drum: STEP_DRUMS[i], time: i * CELL_BEATS });
    });
    return { isDrum: true, hits, totalBeats };
  }

  const scaleNotes = STEP_NOTES[instrumentId] || new Array(pattern.length).fill('C4');
  const notes = pattern.map((active, i) => ({
    note: active ? scaleNotes[i] : 'REST',
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
