import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from './store/useGameState.js';
import { audioEngine } from './audio/audioEngine.js';
import { INSTRUMENTS } from './data/gameData.js';
import { formatNumber } from './data/gameData.js';
import LeftPane from './components/LeftPane.jsx';
import MiddlePane from './components/MiddlePane.jsx';
import RightPane from './components/RightPane.jsx';

// ---------------------------------------------------------------------------
// Sync audio engine with game state
// ---------------------------------------------------------------------------
function useAudioSync(state, audioInitialized) {
  const prevStateRef = useRef(null);

  useEffect(() => {
    if (!audioInitialized) return;

    const prev = prevStateRef.current;
    prevStateRef.current = state;

    // Update tempo
    audioEngine.setTempo(state.tempo);

    // Update volume
    audioEngine.setVolume(state.volume / 100);

    // For each instrument: start/stop/update based on count and active phrase
    INSTRUMENTS.forEach(inst => {
      const instState = state.instruments[inst.id];
      const count = instState?.count || 0;
      const phraseIndex = instState?.activePhrase || 0;
      const phraseData = inst.phrases[phraseIndex];

      const prevInstState = prev?.instruments?.[inst.id];
      const prevCount = prevInstState?.count || 0;
      const prevPhrase = prevInstState?.activePhrase || 0;

      if (count > 0 && (prevCount === 0 || phraseIndex !== prevPhrase)) {
        // Start or update phrase
        audioEngine.startInstrument(inst.id, phraseData, inst.id);
      } else if (count === 0 && prevCount > 0) {
        // Stop instrument
        audioEngine.stopInstrument(inst.id);
      }
    });
  }, [state, audioInitialized]);
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const {
    state,
    stats,
    click,
    buyInstrument,
    buyPhrase,
    setActivePhrase,
    buyUpgrade,
    setTempo,
    setVolume,
    reset,
  } = useGameState();

  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio on first user gesture
  const initAudio = useCallback(() => {
    if (!audioInitialized) {
      audioEngine.init();
      setAudioInitialized(true);

      // Start all currently active instruments
      INSTRUMENTS.forEach(inst => {
        const instState = state.instruments[inst.id];
        const count = instState?.count || 0;
        if (count > 0) {
          const phraseIndex = instState?.activePhrase || 0;
          const phraseData = inst.phrases[phraseIndex];
          audioEngine.startInstrument(inst.id, phraseData, inst.id);
        }
      });
    }
  }, [audioInitialized, state.instruments]);

  // Handle compose click
  const handleCompose = useCallback(() => {
    initAudio();
    click();
    audioEngine.playClickSound();
  }, [initAudio, click]);

  // Sync audio with state changes
  useAudioSync(state, audioInitialized);

  // Tempo/volume handlers
  const handleTempoChange = useCallback((t) => {
    setTempo(t);
    audioEngine.setTempo(t);
  }, [setTempo]);

  const handleVolumeChange = useCallback((v) => {
    setVolume(v);
    audioEngine.setVolume(v / 100);
  }, [setVolume]);

  // Buy instrument: also start audio if needed
  const handleBuyInstrument = useCallback((id) => {
    initAudio();
    buyInstrument(id);
  }, [initAudio, buyInstrument]);

  // Cleanup on unmount
  useEffect(() => {
    return () => audioEngine.destroy();
  }, []);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: '#0f0f1a', color: '#e2e8f0' }}
    >
      {/* Top header bar */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 border-b border-purple-900/40 z-10"
        style={{ background: '#12122a' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎵</span>
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-tight">
              Music Clicker
            </h1>
            <p className="text-purple-400/50 text-xs">Compose Your Empire</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-yellow-300 font-black text-lg leading-none">
              ♪ {formatNumber(Math.floor(state.notes))}
            </div>
            <div className="text-purple-400/50 text-xs">notes</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-base leading-none" style={{ color: '#a78bfa' }}>
              ⚡ {formatNumber(stats.totalNPS)}
            </div>
            <div className="text-purple-400/50 text-xs">per sec</div>
          </div>
          <div className="text-center">
            <div className="text-purple-300 font-bold text-base leading-none">
              {formatNumber(state.totalNotesEarned)}
            </div>
            <div className="text-purple-400/50 text-xs">total earned</div>
          </div>
        </div>
      </header>

      {/* Three-pane layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left pane – 30% */}
        <div
          className="flex-shrink-0 border-r border-purple-900/30"
          style={{ width: '30%' }}
        >
          <LeftPane
            state={state}
            stats={stats}
            onCompose={handleCompose}
            audioInitialized={audioInitialized}
          />
        </div>

        {/* Middle pane – 40% */}
        <div
          className="flex-1 border-r border-purple-900/30"
          style={{ minWidth: 0 }}
        >
          <MiddlePane
            state={state}
            stats={stats}
            onTempoChange={handleTempoChange}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        {/* Right pane – 30% */}
        <div
          className="flex-shrink-0"
          style={{ width: '30%' }}
        >
          <RightPane
            state={state}
            stats={stats}
            onBuyInstrument={handleBuyInstrument}
            onBuyPhrase={buyPhrase}
            onSetPhrase={setActivePhrase}
            onBuyUpgrade={buyUpgrade}
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
}
