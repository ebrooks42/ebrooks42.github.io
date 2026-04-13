import React, { useState, useEffect, useRef, useMemo } from 'react';
import { INSTRUMENTS } from '../data/gameData.js';
import { formatNumber } from '../data/gameData.js';

// -------------------------------------------------------------------------
// Visualizer bars
// -------------------------------------------------------------------------
const BAR_DELAYS = [0, 0.15, 0.35, 0.05, 0.45, 0.2, 0.55, 0.1, 0.4, 0.25, 0.5, 0.3, 0.07, 0.42, 0.18, 0.38];
const BAR_DURATIONS = [0.8, 0.6, 1.1, 0.7, 0.9, 0.5, 1.2, 0.65, 0.85, 0.75, 0.55, 1.0, 0.95, 0.62, 1.05, 0.72];

function Visualizer({ isActive, nps }) {
  // Scale bars by NPS
  const intensity = Math.min(1, Math.log10(1 + nps) / 4);

  return (
    <div className="flex items-end gap-1 h-20 px-2">
      {BAR_DELAYS.map((delay, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            background: `linear-gradient(to top, #7c3aed, #a78bfa)`,
            opacity: isActive ? 0.7 + intensity * 0.3 : 0.15,
            animation: isActive
              ? `barPulse ${BAR_DURATIONS[i]}s ${delay}s ease-in-out infinite alternate`
              : 'none',
            minHeight: 4,
            height: isActive ? undefined : 4,
            transition: 'opacity 0.5s ease',
          }}
        />
      ))}
    </div>
  );
}

// -------------------------------------------------------------------------
// Floating note symbols
// -------------------------------------------------------------------------
const NOTE_SYMBOLS = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];

function FloatingNote({ note }) {
  return (
    <span
      key={note.id}
      className="absolute text-purple-300 pointer-events-none select-none font-bold"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        fontSize: note.size,
        opacity: note.opacity,
        transform: `rotate(${note.rot}deg)`,
        transition: 'all 0.1s linear',
      }}
    >
      {note.symbol}
    </span>
  );
}

// -------------------------------------------------------------------------
// Active instrument row
// -------------------------------------------------------------------------
function ActiveInstrumentRow({ instrument, instState }) {
  const phraseIndex = instState.activePhrase;
  const phrase = instrument.phrases[phraseIndex];

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20 border border-white/5"
      style={{ borderLeftColor: instrument.color, borderLeftWidth: 3 }}
    >
      <span className="text-xl" role="img">{instrument.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white/90 text-sm font-medium truncate">{instrument.name}</div>
        <div className="text-purple-400/70 text-xs truncate">
          {phrase?.name || 'Simple Melody'} × {instState.count}
        </div>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: instState.unlockedPhrases[i]
                ? (i === phraseIndex ? instrument.color : `${instrument.color}88`)
                : '#ffffff18',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// MiddlePane
// -------------------------------------------------------------------------
export default function MiddlePane({ state, stats, onTempoChange, onVolumeChange }) {
  const { totalNPS } = stats;
  const isActive = totalNPS > 0;

  // Floating notes state
  const [floatingNotes, setFloatingNotes] = useState([]);
  const noteIdRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);

  // Spawn and animate floating notes
  useEffect(() => {
    if (!isActive) return;

    let running = true;

    function animate(ts) {
      if (!running) return;

      // Spawn new notes based on NPS
      const spawnInterval = Math.max(200, 1500 - totalNPS * 2);
      if (ts - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = ts;
        const id = noteIdRef.current++;
        setFloatingNotes(prev => [
          ...prev.slice(-20),
          {
            id,
            x: 5 + Math.random() * 90,
            y: 80 + Math.random() * 15,
            vy: -(0.15 + Math.random() * 0.2),
            opacity: 0.6 + Math.random() * 0.4,
            size: 12 + Math.floor(Math.random() * 16),
            symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
            rot: -15 + Math.random() * 30,
          },
        ]);
      }

      // Move existing notes upward and fade
      setFloatingNotes(prev =>
        prev
          .map(n => ({ ...n, y: n.y + n.vy, opacity: n.opacity - 0.005 }))
          .filter(n => n.opacity > 0.02 && n.y > -10)
      );

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, totalNPS]);

  // Active instruments
  const activeInstruments = useMemo(() =>
    INSTRUMENTS.filter(inst => (state.instruments[inst.id]?.count || 0) > 0),
    [state.instruments]
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0d0d1f' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-900/40 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="text-yellow-300 font-black text-xl">
            ♪ {formatNumber(Math.floor(state.notes))}
          </span>
          <span className="text-purple-400/50 text-sm ml-1">notes</span>
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: '#a78bfa' }}>
            ⚡ {formatNumber(totalNPS)}
          </span>
          <span className="text-purple-400/50 text-sm ml-1">/sec</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="px-2 pt-3 flex-shrink-0">
        <div className="relative rounded-xl overflow-hidden bg-black/40 border border-purple-900/30 py-2">
          <Visualizer isActive={isActive} nps={totalNPS} />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-purple-400/40 text-sm">
              Buy instruments to start the music…
            </div>
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="px-4 py-3 flex-shrink-0 space-y-3 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <span className="text-purple-300/70 text-xs w-8">BPM</span>
          <input
            type="range"
            min={60}
            max={200}
            value={state.tempo}
            onChange={e => onTempoChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full accent-violet-500 cursor-pointer"
          />
          <span className="text-purple-300 text-xs w-8 text-right font-mono">{state.tempo}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-purple-300/70 text-xs w-8">Vol</span>
          <input
            type="range"
            min={0}
            max={100}
            value={state.volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full accent-violet-500 cursor-pointer"
          />
          <span className="text-purple-300 text-xs w-8 text-right font-mono">{state.volume}%</span>
        </div>
      </div>

      {/* Live Composition */}
      <div className="flex-1 overflow-y-auto px-3 py-3 relative min-h-0">
        <div className="text-purple-400/50 text-xs uppercase tracking-widest mb-2 px-1">
          Live Composition
        </div>

        {/* Floating note symbols */}
        {activeInstruments.length > 0 && (
          <div className="relative h-28 mb-3 rounded-xl bg-black/20 border border-purple-900/20 overflow-hidden">
            {floatingNotes.map(n => (
              <FloatingNote key={n.id} note={n} />
            ))}
            {floatingNotes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-purple-400/20 text-xs">
                music flows here…
              </div>
            )}
          </div>
        )}

        {/* Active instrument list */}
        <div className="space-y-2">
          {activeInstruments.length === 0 ? (
            <div className="text-purple-400/30 text-sm text-center py-8">
              No instruments yet — buy one from the shop!
            </div>
          ) : (
            activeInstruments.map(inst => (
              <ActiveInstrumentRow
                key={inst.id}
                instrument={inst}
                instState={state.instruments[inst.id]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
