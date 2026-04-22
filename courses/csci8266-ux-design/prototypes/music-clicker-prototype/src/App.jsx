import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useGameState } from './store/useGameState.js';
import { audioEngine } from './audio/audioEngine.js';
import { exportAudio } from './audio/exportAudio.js';
import { INSTRUMENTS, UPGRADES, buildPhraseFromPattern } from './data/gameData.js';
import TimelinePane from './components/LeftPane.jsx';
import ShopPane from './components/RightPane.jsx';

// ---------------------------------------------------------------------------
// Sync audio engine with game state
// Returns pendingPhraseChange: { [instrumentId]: true } for instruments
// whose phrase switch is scheduled but hasn't fired yet (shows clock icon).
// ---------------------------------------------------------------------------
function useAudioSync(state, audioInitialized) {
  const prevStateRef = useRef(null);
  const [pendingPhraseChange, setPendingPhraseChange] = useState({});
  const [pendingActivation, setPendingActivation] = useState({});
  const pendingTimersRef = useRef({});           // instrumentId → phrase-change timeoutId
  const pendingActivationTimersRef = useRef({}); // instrumentId → activation timeoutId

  // Helper: cancel a pending-phrase timer and clear the pending flag
  const clearPending = useCallback((id) => {
    if (pendingTimersRef.current[id]) {
      clearTimeout(pendingTimersRef.current[id]);
      delete pendingTimersRef.current[id];
    }
    setPendingPhraseChange(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Helper: cancel a pending-activation timer and clear its flag
  const clearPendingActivation = useCallback((id) => {
    if (pendingActivationTimersRef.current[id]) {
      clearTimeout(pendingActivationTimersRef.current[id]);
      delete pendingActivationTimersRef.current[id];
    }
    setPendingActivation(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!audioInitialized) return;

    const prev = prevStateRef.current;
    prevStateRef.current = state;

    // Only push tempo to engine when it actually changes in React state.
    // Unconditional setTempo calls would overwrite the engine's pendingBpm
    // that was registered by handleTempoChange for the upcoming loop boundary.
    if (!prev || state.tempo !== prev.tempo) {
      audioEngine.setTempo(state.tempo);
    }
    audioEngine.setVolume(state.volume / 100);

    INSTRUMENTS.forEach(inst => {
      const instState = state.instruments[inst.id];
      const count = instState?.count || 0;
      const active = instState?.active || false;
      const phraseIndex = instState?.activePhrase || 0;
      const customPattern = instState?.customPattern || null;
      const midiNotes = instState?.midiNotes || null;

      const prevInstState = prev?.instruments?.[inst.id];
      const prevCount = prevInstState?.count || 0;
      const prevActive = prevInstState?.active || false;
      const prevPhrase = prevInstState?.activePhrase || 0;
      const prevCustomPattern = prevInstState?.customPattern || null;
      const prevMidiNotes = prevInstState?.midiNotes || null;

      // Use custom step-sequencer pattern if set, otherwise use the phrase.
      // Pass midiNotes for exact per-cell pitch when the MIDI editor has been used.
      const activePhrase = inst.phrases[phraseIndex];
      const phraseData = customPattern
        ? buildPhraseFromPattern(inst.id, customPattern, activePhrase, midiNotes)
        : activePhrase;

      const shouldPlay = count > 0 && active;
      const wasShouldPlay = prevCount > 0 && prevActive;
      const patternChanged = customPattern !== prevCustomPattern || midiNotes !== prevMidiNotes;
      const phraseChanged = phraseIndex !== prevPhrase;

      if (!shouldPlay && wasShouldPlay) {
        audioEngine.stopInstrument(inst.id);
        clearPending(inst.id);
        clearPendingActivation(inst.id);
      } else if (shouldPlay && !wasShouldPlay) {
        // Instrument just turned on — align to next loop boundary so it
        // doesn't start mid-phrase and fall out of sync with other instruments
        const syncTime = audioEngine.getNextLoopBoundary() ?? undefined;
        audioEngine.startInstrument(inst.id, phraseData, inst.audioType || inst.id, syncTime);

        // Dim the row until the instrument actually starts playing
        if (syncTime !== undefined && audioEngine.ctx) {
          const delayMs = Math.max(0, (syncTime - audioEngine.ctx.currentTime) * 1000) + 100;
          setPendingActivation(prev => ({ ...prev, [inst.id]: true }));
          pendingActivationTimersRef.current[inst.id] = setTimeout(() => {
            clearPendingActivation(inst.id);
          }, delayMs);
        }
      } else if (shouldPlay && phraseChanged) {
        // Phrase selection changed — wait for the next loop boundary so all
        // instruments stay in sync, and show a clock badge until it fires.
        clearPending(inst.id); // cancel any existing timer for this instrument
        const syncTime = audioEngine.getNextLoopBoundary() ?? undefined;
        audioEngine.startInstrument(inst.id, phraseData, inst.audioType || inst.id, syncTime);

        if (syncTime !== undefined && audioEngine.ctx) {
          const delayMs = Math.max(0, (syncTime - audioEngine.ctx.currentTime) * 1000) + 100;
          setPendingPhraseChange(prev => ({ ...prev, [inst.id]: true }));
          pendingTimersRef.current[inst.id] = setTimeout(() => {
            clearPending(inst.id);
          }, delayMs);
        }
      } else if (shouldPlay && patternChanged) {
        // Beat grid edit — swap phrase data in-place without resetting timing
        // so all instruments stay in sync
        audioEngine.patchInstrumentPhrase(inst.id, phraseData, inst.audioType || inst.id);
      }
    });
  }, [state, audioInitialized, clearPending]);

  // Clean up all pending timers on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingTimersRef.current).forEach(clearTimeout);
      Object.values(pendingActivationTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  return { pendingPhraseChange, pendingActivation };
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Driver.js tutorial step definitions
// ---------------------------------------------------------------------------
// Steps 0-2 auto-advance based on game state.
// Step 3 is the final step — it points at the treble-clef button and closes
// automatically the moment the user clicks it (tutorial completes on that action).
// Clicking the button on any step skips the entire tutorial.
const TUTORIAL_STEP_CONFIGS = [
  {
    // Step 0 — auto-advances when first instrument is purchased
    element: '[data-tutorial-shop-instrument="piano"]',
    popover: {
      title: '',
      description: 'Welcome to Music Chef!\nLet\'s get cooking!\n\nPurchase your first instrument to start composing.',
      side: 'left',
      align: 'center',
    },
  },
  {
    // Step 1 — auto-advances when instrument is toggled on
    element: '[data-tutorial-toggle="piano"]',
    popover: {
      title: '',
      description: 'Toggle on and off instruments that you have purchased.',
      side: 'right',
      align: 'center',
    },
  },
  {
    // Step 2 — auto-advances when a beat cell is tapped
    element: '[data-tutorial-beatgrid="piano"]',
    popover: {
      title: '',
      description: 'Tap the beat cells to turn individual notes on or off\nand customize the rhythm.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    // Step 3 — points at the notes counter; explains accumulation + free phrase switching.
    // User clicks "Next →" to continue to the final step.
    element: '[data-tutorial-notes]',
    popover: {
      title: '',
      description: 'Your notes accumulate here as your composition plays — spend them on more instruments and upgrades!\n\nYou can also switch musical phrases for free: open any instrument\'s upgrade section in the shop to try different melodies.',
      nextBtnText: 'Next →',
      side: 'left',
      align: 'center',
    },
  },
  {
    // Step 4 — final step, highlights the treble-clef button.
    // Closes automatically when the user clicks the clef (handled in onMidiEditorOpen).
    element: '[data-tutorial-wand="piano"]',
    popover: {
      title: '',
      description: 'For even more control, click the treble clef button to open the Note Editor and assign specific pitches to each beat step.',
      side: 'left',
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
    setMidiPattern,
    midiEdit,
    reset,
  } = useGameState();

  const [audioInitialized, setAudioInitialized] = useState(false);
  const [exportState, setExportState] = useState(null); // null | { progress: 0–1 }
  const [showCongrats, setShowCongrats] = useState(false);
  const [activeBeat, setActiveBeat] = useState({}); // instrumentId → current cell (0-7)
  const [pendingTempo, setPendingTempo] = useState(null); // BPM queued for next loop boundary
  const activeBeatRef = useRef({});
  const pendingTempoTimerRef = useRef(null);
  const tutorialStepRef = useRef(
    localStorage.getItem('music_clicker_tutorial_done') ? -1 : 0
  );
  const driverRef = useRef(null);
  const lastBeatRewardRef = useRef(0);  // timestamp of last beat-edit note reward
  const lastMidiRewardRef = useRef(0);  // timestamp of last MIDI-editor note reward

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
        if (tutorialStepRef.current === 3) {
          // Notes/phrases step → advance to the treble-clef step
          tutorialStepRef.current = 4;
          d.moveTo(4);
        } else {
          // All other steps: skip or dismiss
          localStorage.setItem('music_clicker_tutorial_done', '1');
          d.destroy();
          tutorialStepRef.current = -1;
        }
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
    // Auto-advance tutorial from beat-grid step → notes/phrases step
    if (tutorialStepRef.current === 2) {
      tutorialStepRef.current = 3;
      setTimeout(() => {
        if (driverRef.current && tutorialStepRef.current === 3) {
          driverRef.current.moveTo(3);
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
          const btn = document.querySelector('.driver-popover-next-btn');
          if (btn) btn.textContent = 'Next →';
        }
      }, 100);
    }
  }, []);

  const handleTempoChange = useCallback((t) => {
    // Cancel any existing pending tempo change first
    if (pendingTempoTimerRef.current) {
      clearTimeout(pendingTempoTimerRef.current);
      pendingTempoTimerRef.current = null;
    }

    // If cancelling a pending change by re-clicking the current tempo, just clear
    if (t === state.tempo) {
      setPendingTempo(null);
      return;
    }

    // If audio isn't running yet or no instruments are playing, apply immediately
    const syncTime = audioInitialized ? audioEngine.getNextLoopBoundary() : null;
    if (syncTime === null || !audioEngine.ctx) {
      setTempo(t);
      audioEngine.setTempo(t);
      setPendingTempo(null);
      return;
    }

    // Tell the audio engine to switch BPM exactly at the loop boundary.
    // The scheduler uses _beatDurationAt() per note/loop so every instrument
    // (including drums) transitions on the same downbeat.
    audioEngine.scheduleTempoChange(t, syncTime);

    // React timer: fires slightly after the boundary to update UI state
    // (clear the clock icon, commit state.tempo).
    setPendingTempo(t);
    const delayMs = Math.max(0, (syncTime - audioEngine.ctx.currentTime) * 1000) + 100;
    pendingTempoTimerRef.current = setTimeout(() => {
      setTempo(t);
      audioEngine.setTempo(t); // also clears engine's pendingBpm
      setPendingTempo(null);
      pendingTempoTimerRef.current = null;
    }, delayMs);
  }, [audioInitialized, state.tempo, setTempo]);

  const handleVolumeChange = useCallback((v) => {
    setVolume(v);
    audioEngine.setVolume(v / 100);
  }, [setVolume]);

  const handleExport = useCallback(async () => {
    if (exportState) return; // already recording
    if (!audioInitialized) {
      alert('Toggle an instrument on first to start playing, then export.');
      return;
    }
    const anyActive = INSTRUMENTS.some(i => state.instruments[i.id]?.active && state.instruments[i.id]?.count > 0);
    if (!anyActive) {
      alert('Turn on at least one instrument before exporting.');
      return;
    }
    setExportState({ progress: 0 });
    try {
      await exportAudio(audioEngine, state.tempo, (progress) => {
        setExportState({ progress });
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setExportState(null);
    }
  }, [exportState, audioInitialized, state.instruments, state.tempo]);

  // Win condition: all instruments purchased + all upgrades bought
  useEffect(() => {
    if (localStorage.getItem('music_clicker_congrats_shown')) return;
    const allInstruments = INSTRUMENTS.every(inst => (state.instruments[inst.id]?.count || 0) > 0);
    const allUpgrades = UPGRADES.every(upg => state.purchasedUpgrades.includes(upg.id));
    if (allInstruments && allUpgrades) {
      localStorage.setItem('music_clicker_congrats_shown', '1');
      setShowCongrats(true);
    }
  }, [state.instruments, state.purchasedUpgrades]);

  // rAF loop: poll current beat cell for each active instrument.
  // Only calls setState when the beat index actually changes (at most ~4/s
  // at 120 BPM) so it doesn't cause excessive re-renders.
  useEffect(() => {
    let rafId;
    const tick = () => {
      if (audioEngine.initialized) {
        const next = {};
        INSTRUMENTS.forEach(inst => {
          if (audioEngine.activeInstruments.has(inst.id)) {
            next[inst.id] = audioEngine.getCurrentCellIndex(inst.id);
          }
        });
        const prev = activeBeatRef.current;
        if (INSTRUMENTS.some(inst => prev[inst.id] !== next[inst.id])) {
          activeBeatRef.current = next;
          setActiveBeat(next);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const { pendingPhraseChange, pendingActivation } = useAudioSync(state, audioInitialized);

  useEffect(() => {
    return () => {
      audioEngine.destroy();
      if (pendingTempoTimerRef.current) clearTimeout(pendingTempoTimerRef.current);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#1a1a1a' }}>

      {/* Congratulations modal */}
      {showCongrats && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
        >
          <div
            className="flex flex-col items-center gap-5 rounded-2xl px-10 py-10 text-center"
            style={{
              background: '#1e1e1e',
              border: '2px solid #4ADE80',
              boxShadow: '0 0 48px rgba(74,222,128,0.25)',
              maxWidth: 440,
              width: '90%',
            }}
          >
            <div style={{ fontSize: 56, lineHeight: 1 }}>🎵</div>
            <h2
              className="font-bold tracking-wide"
              style={{ fontSize: 28, color: '#86EFAC' }}
            >
              Congratulations!
            </h2>
            <p
              className="font-medium leading-relaxed"
              style={{ fontSize: 15, color: '#d1d5db' }}
            >
              You've assembled a full band and mastered every technique.
              Your composition is complete — the stage is yours!
            </p>
            <div className="flex gap-3 pt-1">
              <button
                className="rounded-lg px-6 py-2.5 text-sm font-bold transition-colors"
                style={{
                  background: '#86EFAC',
                  color: '#14532D',
                  border: '2px solid #4ADE80',
                }}
                onClick={handleExport}
              >
                Export Masterpiece ↓
              </button>
              <button
                className="rounded-lg px-6 py-2.5 text-sm font-bold transition-colors"
                style={{
                  background: 'transparent',
                  color: '#9ca3af',
                  border: '2px solid #374151',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.borderColor = '#6b7280'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#374151'; }}
                onClick={() => setShowCongrats(false)}
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Timeline pane – ~67% */}
      <div className="flex-1 min-w-0 border-r border-black/40">
        <TimelinePane
          state={state}
          stats={stats}
          activeBeat={activeBeat}
          pendingTempo={pendingTempo}
          pendingActivation={pendingActivation}
          onToggle={handleToggle}
          onBeatToggle={handleBeatToggle}
          onMidiEditorOpen={() => {
            // Clicking the treble-clef completes the tutorial if it's still showing
            if (tutorialStepRef.current !== -1 && driverRef.current) {
              localStorage.setItem('music_clicker_tutorial_done', '1');
              driverRef.current.destroy();
              tutorialStepRef.current = -1;
            }
          }}
          onSetMidiPattern={(instrumentId, notes) => {
            // Earn 100× NPC per MIDI edit, debounced to once per 3 s
            const now = Date.now();
            if (now - lastMidiRewardRef.current >= 3000) {
              lastMidiRewardRef.current = now;
              midiEdit();
            }
            setMidiPattern(instrumentId, notes);
          }}
          onTempoChange={handleTempoChange}
          onVolumeChange={handleVolumeChange}
          onExport={handleExport}
          exportProgress={exportState?.progress ?? null}
          onReset={() => {
            reset();
            localStorage.removeItem('music_clicker_tutorial_done');
            localStorage.removeItem('music_clicker_congrats_shown');
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
          pendingPhraseChange={pendingPhraseChange}
          tutorialHighlight={tutorialStepRef.current === 0 ? 'piano' : null}
        />
      </div>
    </div>
  );
}
