import { useReducer, useEffect, useRef, useCallback } from 'react';
import { INSTRUMENTS, UPGRADES, getInstrumentCost } from '../data/gameData.js';

const SAVE_KEY = 'music_clicker_save_v2';
const TICK_INTERVAL = 100;
const NOTES_SAVE_INTERVAL = 3000; // save note balance every 3s

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
function buildInitialState() {
  const instruments = {};
  INSTRUMENTS.forEach(inst => {
    instruments[inst.id] = {
      count: 0,
      activePhrase: 0,
      active: false,
      unlockedPhrases: [false, false, false],
    };
  });

  return {
    notes: 30,          // starting balance to purchase first instrument
    totalNotesEarned: 0,
    instruments,
    purchasedUpgrades: [],
    tempo: 120,
    volume: 70,
    npc: 1,
  };
}

// ---------------------------------------------------------------------------
// Derived stats
// ---------------------------------------------------------------------------
export function computeStats(state) {
  const { instruments, purchasedUpgrades } = state;

  let npcMultiplier = 1;
  let npsMultiplier = 1;
  let npsPerInstrumentBonus = 0;

  for (const uid of purchasedUpgrades) {
    const upg = UPGRADES.find(u => u.id === uid);
    if (!upg) continue;
    if (upg.effect.type === 'npc_multiplier') npcMultiplier *= upg.effect.value;
    if (upg.effect.type === 'nps_multiplier') npsMultiplier *= upg.effect.value;
    if (upg.effect.type === 'nps_per_instrument') npsPerInstrumentBonus += upg.effect.value;
  }

  const totalNPC = state.npc * npcMultiplier;

  let totalInstrumentCount = 0;
  INSTRUMENTS.forEach(inst => {
    totalInstrumentCount += instruments[inst.id]?.count || 0;
  });

  let totalNPS = 0;
  INSTRUMENTS.forEach(inst => {
    const instState = instruments[inst.id];
    const count = instState?.count || 0;
    const active = instState?.active || false;
    if (count > 0 && active) {
      totalNPS += inst.baseNPS * count;
    }
  });

  totalNPS += npsPerInstrumentBonus * totalInstrumentCount;
  totalNPS *= npsMultiplier;

  return { totalNPC, totalNPS, totalInstrumentCount };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function gameReducer(state, action) {
  switch (action.type) {

    case 'CLICK': {
      const { totalNPC } = computeStats(state);
      return {
        ...state,
        notes: state.notes + totalNPC,
        totalNotesEarned: state.totalNotesEarned + totalNPC,
      };
    }

    case 'TICK': {
      const { totalNPS } = computeStats(state);
      const gain = totalNPS * (TICK_INTERVAL / 1000);
      if (gain === 0) return state;
      return {
        ...state,
        notes: state.notes + gain,
        totalNotesEarned: state.totalNotesEarned + gain,
      };
    }

    case 'BUY_INSTRUMENT': {
      const { instrumentId } = action;
      const inst = INSTRUMENTS.find(i => i.id === instrumentId);
      if (!inst) return state;

      const current = state.instruments[instrumentId];
      const cost = getInstrumentCost(inst, current.count);
      if (state.notes < cost) return state;

      const newCount = current.count + 1;
      const newUnlocked = [...current.unlockedPhrases];
      if (newCount === 1) {
        newUnlocked[0] = true;
      }

      return {
        ...state,
        notes: state.notes - cost,
        instruments: {
          ...state.instruments,
          [instrumentId]: {
            ...current,
            count: newCount,
            unlockedPhrases: newUnlocked,
          },
        },
      };
    }

    case 'TOGGLE_INSTRUMENT': {
      const { instrumentId } = action;
      const current = state.instruments[instrumentId];
      if (!current || current.count === 0) return state;
      return {
        ...state,
        instruments: {
          ...state.instruments,
          [instrumentId]: {
            ...current,
            active: !current.active,
          },
        },
      };
    }

    case 'BUY_PHRASE': {
      const { instrumentId, phraseIndex } = action;
      const inst = INSTRUMENTS.find(i => i.id === instrumentId);
      if (!inst) return state;

      const current = state.instruments[instrumentId];
      if (current.count === 0) return state;
      if (current.unlockedPhrases[phraseIndex]) return state;

      const cost = inst.phraseCosts[phraseIndex + 1];
      if (state.notes < cost) return state;

      const newUnlocked = [...current.unlockedPhrases];
      newUnlocked[phraseIndex] = true;

      return {
        ...state,
        notes: state.notes - cost,
        instruments: {
          ...state.instruments,
          [instrumentId]: {
            ...current,
            unlockedPhrases: newUnlocked,
          },
        },
      };
    }

    case 'SET_ACTIVE_PHRASE': {
      const { instrumentId, phraseIndex } = action;
      const current = state.instruments[instrumentId];
      if (!current || !current.unlockedPhrases[phraseIndex]) return state;

      return {
        ...state,
        instruments: {
          ...state.instruments,
          [instrumentId]: {
            ...current,
            activePhrase: phraseIndex,
          },
        },
      };
    }

    case 'BUY_UPGRADE': {
      const { upgradeId } = action;
      if (state.purchasedUpgrades.includes(upgradeId)) return state;
      const upg = UPGRADES.find(u => u.id === upgradeId);
      if (!upg || state.notes < upg.cost) return state;

      return {
        ...state,
        notes: state.notes - upg.cost,
        purchasedUpgrades: [...state.purchasedUpgrades, upgradeId],
      };
    }

    case 'SET_TEMPO': {
      return { ...state, tempo: action.tempo };
    }

    case 'SET_VOLUME': {
      return { ...state, volume: action.volume };
    }

    case 'LOAD_SAVE': {
      return { ...buildInitialState(), ...action.saveData };
    }

    case 'RESET': {
      return buildInitialState();
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const initial = buildInitialState();
        const merged = {
          ...initial,
          ...saved,
          instruments: {},
        };
        INSTRUMENTS.forEach(inst => {
          merged.instruments[inst.id] = {
            ...(initial.instruments[inst.id]),
            ...(saved.instruments?.[inst.id] || {}),
          };
        });
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return buildInitialState();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, TICK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  // Save immediately whenever meaningful state changes (instruments, upgrades, settings)
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.instruments, state.purchasedUpgrades, state.tempo, state.volume]);

  // Also periodically save note balance (changes every tick, so we throttle it)
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
      } catch (e) {
        console.warn('Failed to save:', e);
      }
    }, NOTES_SAVE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const click = useCallback(() => dispatch({ type: 'CLICK' }), []);
  const buyInstrument = useCallback((id) => dispatch({ type: 'BUY_INSTRUMENT', instrumentId: id }), []);
  const toggleInstrument = useCallback((id) => dispatch({ type: 'TOGGLE_INSTRUMENT', instrumentId: id }), []);
  const buyPhrase = useCallback((instrumentId, phraseIndex) => dispatch({ type: 'BUY_PHRASE', instrumentId, phraseIndex }), []);
  const setActivePhrase = useCallback((instrumentId, phraseIndex) => dispatch({ type: 'SET_ACTIVE_PHRASE', instrumentId, phraseIndex }), []);
  const buyUpgrade = useCallback((id) => dispatch({ type: 'BUY_UPGRADE', upgradeId: id }), []);
  const setTempo = useCallback((t) => dispatch({ type: 'SET_TEMPO', tempo: t }), []);
  const setVolume = useCallback((v) => dispatch({ type: 'SET_VOLUME', volume: v }), []);
  const reset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  const stats = computeStats(state);

  return {
    state,
    stats,
    dispatch,
    click,
    buyInstrument,
    toggleInstrument,
    buyPhrase,
    setActivePhrase,
    buyUpgrade,
    setTempo,
    setVolume,
    reset,
  };
}
