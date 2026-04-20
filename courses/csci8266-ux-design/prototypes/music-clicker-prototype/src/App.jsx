import React, { useEffect, useRef, useState, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useGameState } from './store/useGameState.js';
import { audioEngine } from './audio/audioEngine.js';
import { INSTRUMENTS, buildPhraseFromPattern } from './data/gameData.js';
import TimelinePane from './components/LeftPane.jsx';
import ShopPane from './components/RightPane.jsx';

// ---------------------------------------------------------------------------
// Sync audio engine with game state
// ---------------------------------------------------------------------------
function useAudioSync(state, audioInitialized) {
  const prevStateRef = useRef(null);

  useEffect(() => {
    if (!audioInitialized) return;

    const prev = prevStateRef.current;
    prevStateRef.current = state;

    audioEngine.setTempo(state.tempo);
    audioEngine.setVolume(state.volume / 100);

    INSTRUMENTS.forEach(inst => {
      const instState = state.instruments[inst.id];
      const count = instState?.count || 0;
      const active = instState?.active || false;
      const phraseIndex = instState?.activePhrase || 0;
      const customPattern = instState?.customPattern || null;

      const prevInstState = prev?.instruments?.[inst.id];
      const prevCount = prevInstState?.count || 0;
      const prevActive = prevInstState?.active || false;
      const prevPhrase = prevInstState?.activePhrase || 0;
      const prevCustomPattern = prevInstState?.customPattern || null;

      // Use custom step-sequencer pattern if set, otherwise use the phrase
      const phraseData = customPattern
        ? buildPhraseFromPattern(inst.id, customPattern)
        : inst.phrases[phraseIndex];

      const shouldPlay = count > 0 && active;
      const wasShouldPlay = prevCount > 0 && prevActive;
      const patternChanged = customPattern !== prevCustomPattern;

      if (shouldPlay && (!wasShouldPlay || phraseIndex !== prevPhrase || patternChanged)) {
        audioEngine.startInstrument(inst.id, phraseData, inst.audioType || inst.id);
      } else if (!shouldPlay && wasShouldPlay) {
        audioEngine.stopInstrument(inst.id);
      }
    });
  }, [state, audioInitialized]);
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Driver.js tutorial step definitions
// ---------------------------------------------------------------------------
const TUTORIAL_STEP_CONFIGS = [
  {
    element: '[data-tutorial-shop-instrument="piano"]',
    popover: {
      title: '',
      description: 'Welcome to Music Clicker!\nTo get started, purchase your first instrument.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tutorial-toggle="piano"]',
    popover: {
      title: '',
      description: 'Toggle on and off instruments that you have purchased.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tutorial-beatgrid="piano"]',
    popover: {
      title: '',
      description: 'Tap here to edit the musical phrase.\nHere you can customize tempo and/or beat.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: 'body',
    popover: {
      title: '',
      description: 'As you compose, you get notes. Spend them in the shop on more instruments.\nEnjoy playing!',
      side: 'over',
      align: 'center',
    },
  },
];

export default function App() {
  const {
    state,
    stats,
    buyInstrument,
    toggleInstrument,
    buyPhrase,
    setActivePhrase,
    buyUpgrade,
    setTempo,
    setVolume,
    toggleBeat,
    reset,
  } = useGameState();

  const [audioInitialized, setAudioInitialized] = useState(false);
  const tutorialStepRef = useRef(
    localStorage.getItem('music_clicker_tutorial_done') ? -1 : 0
  );
  const driverRef = useRef(null);
  const lastBeatRewardRef = useRef(0); // timestamp of last beat-edit note reward

  // Initialize driver.js tutorial on mount
  useEffect(() => {
    // Skip if already seen
    if (tutorialStepRef.current === -1) return;
    const style = document.createElement('style');
    style.textContent = `
      .driver-popover {
        background: #DBEAFE !important;
        border-radius: 12px !important;
        padding: 24px 32px !important;
        max-width: 380px !important;
        min-width: 280px !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.35) !important;
        text-align: center !important;
      }
      .driver-popover-title {
        display: none !important;
      }
      .driver-popover-description {
        color: #000 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        line-height: 1.625 !important;
        white-space: pre-line !important;
        margin-bottom: 16px !important;
      }
      .driver-popover-footer {
        justify-content: center !important;
      }
      .driver-popover-footer button {
        background: #86EFAC !important;
        color: #14532D !important;
        border: 2px solid #4ADE80 !important;
        border-radius: 6px !important;
        padding: 8px 24px !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        text-shadow: none !important;
      }
      .driver-popover-navigation-btns .driver-popover-prev-btn,
      .driver-popover-close-btn {
        display: none !important;
      }
      .driver-popover-arrow {
        border: none !important;
      }
      .driver-popover-arrow-side-left { border-left-color: #DBEAFE !important; }
      .driver-popover-arrow-side-right { border-right-color: #DBEAFE !important; }
      .driver-popover-arrow-side-top { border-top-color: #DBEAFE !important; }
      .driver-popover-arrow-side-bottom { border-bottom-color: #DBEAFE !important; }
    `;
    document.head.appendChild(style);

    const d = driver({
      showProgress: false,
      showButtons: ['next'],
      nextBtnText: 'SKIP TUTORIAL',
      allowClose: false,
      overlayColor: 'rgba(0,0,0,0.45)',
      stagePadding: 6,
      stageRadius: 8,
      steps: TUTORIAL_STEP_CONFIGS,
      onNextClick: () => {
        // Button is always Skip (early steps) or Done (last step) — always dismiss
        localStorage.setItem('music_clicker_tutorial_done', '1');
        d.destroy();
        tutorialStepRef.current = -1;
      },
      onDestroyStarted: () => {
        localStorage.setItem('music_clicker_tutorial_done', '1');
        d.destroy();
        tutorialStepRef.current = -1;
      },
    });

    driverRef.current = d;

    // Start tutorial after a brief delay to let DOM render
    const timer = setTimeout(() => {
      d.drive(0);
      tutorialStepRef.current = 0;
    }, 300);

    return () => {
      clearTimeout(timer);
      style.remove();
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  // Auto-advance tutorial based on state changes
  useEffect(() => {
    const d = driverRef.current;
    if (!d || tutorialStepRef.current === -1) return;

    if (tutorialStepRef.current === 0) {
      // Step 1: waiting for instrument purchase
      const anyOwned = INSTRUMENTS.some(inst => state.instruments[inst.id]?.count > 0);
      if (anyOwned) {
        tutorialStepRef.current = 1;
        // Small delay to let toggle button render
        setTimeout(() => {
          if (driverRef.current && tutorialStepRef.current === 1) {
            driverRef.current.moveTo(1);
          }
        }, 100);
      }
    } else if (tutorialStepRef.current === 1) {
      // Step 2: waiting for toggle activation
      const anyActive = INSTRUMENTS.some(inst => state.instruments[inst.id]?.active);
      if (anyActive) {
        tutorialStepRef.current = 2;
        setTimeout(() => {
          if (driverRef.current && tutorialStepRef.current === 2) {
            driverRef.current.moveTo(2);
          }
        }, 100);
      }
    }
  }, [state.instruments]);

  const initAudio = useCallback(() => {
    if (!audioInitialized) {
      audioEngine.init();
      setAudioInitialized(true);
      // Don't start instruments here — useAudioSync handles that once
      // audioInitialized becomes true, using the correct post-action state.
      // Starting instruments here would race with the action being dispatched
      // in the same render batch, causing toggle/audio desync on first interaction.
    }
  }, [audioInitialized]);

  const handleBuyInstrument = useCallback((id) => {
    initAudio();
    buyInstrument(id);
  }, [initAudio, buyInstrument]);

  const handleToggle = useCallback((id) => {
    initAudio();
    toggleInstrument(id);
  }, [initAudio, toggleInstrument]);

  const handleBeatToggle = useCallback((instrumentId, cellIndex) => {
    initAudio();
    // Reward notes at most once per 3 seconds to prevent spam farming
    const now = Date.now();
    const earnNotes = now - lastBeatRewardRef.current >= 3000;
    if (earnNotes) lastBeatRewardRef.current = now;
    toggleBeat(instrumentId, cellIndex, earnNotes);
    // Advance tutorial from step 3 on first beat edit
    if (tutorialStepRef.current === 2) {
      tutorialStepRef.current = 3;
      setTimeout(() => {
        if (driverRef.current && tutorialStepRef.current === 3) {
          driverRef.current.moveTo(3);
          const btn = document.querySelector('.driver-popover-next-btn');
          if (btn) btn.textContent = 'DONE';
        }
      }, 100);
    }
  }, [initAudio, toggleBeat]);

  const handleRowClick = useCallback((id) => {
    if (tutorialStepRef.current === 2) {
      tutorialStepRef.current = 3;
      setTimeout(() => {
        if (driverRef.current && tutorialStepRef.current === 3) {
          driverRef.current.moveTo(3);
          // Change button text for final step
          const btn = document.querySelector('.driver-popover-next-btn');
          if (btn) btn.textContent = 'DONE';
        }
      }, 100);
    }
  }, []);

  const handleTempoChange = useCallback((t) => {
    setTempo(t);
    audioEngine.setTempo(t);
  }, [setTempo]);

  const handleVolumeChange = useCallback((v) => {
    setVolume(v);
    audioEngine.setVolume(v / 100);
  }, [setVolume]);

  useAudioSync(state, audioInitialized);

  useEffect(() => {
    return () => audioEngine.destroy();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* Timeline pane – ~67% */}
      <div className="flex-1 min-w-0 border-r border-black/40">
        <TimelinePane
          state={state}
          stats={stats}
          onToggle={handleToggle}
          onBeatToggle={handleBeatToggle}
          onTempoChange={handleTempoChange}
          onVolumeChange={handleVolumeChange}
          onReset={() => {
            reset();
            localStorage.removeItem('music_clicker_tutorial_done');
            window.location.reload();
          }}
        />
      </div>

      {/* Shop pane – ~33% */}
      <div className="flex-shrink-0" style={{ width: '33%' }}>
        <ShopPane
          state={state}
          stats={stats}
          onBuyInstrument={handleBuyInstrument}
          onBuyPhrase={buyPhrase}
          onSetPhrase={setActivePhrase}
          onBuyUpgrade={buyUpgrade}
          tutorialHighlight={tutorialStepRef.current === 0 ? 'piano' : null}
        />
      </div>
    </div>
  );
}
