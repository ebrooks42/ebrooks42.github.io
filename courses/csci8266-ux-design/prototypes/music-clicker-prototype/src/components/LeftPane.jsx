import React, { useMemo } from 'react';
import { INSTRUMENTS } from '../data/gameData.js';

// ---------------------------------------------------------------------------
// Compute beat grid dots from a phrase
// ---------------------------------------------------------------------------
function getBeatDots(phrase, numCells = 8) {
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

// ---------------------------------------------------------------------------
// Single instrument row
// ---------------------------------------------------------------------------
function InstrumentRow({ instrument, instState, onToggle, onRowClick }) {
  const count = instState?.count || 0;
  const active = instState?.active || false;
  const phraseIndex = instState?.activePhrase || 0;
  const phrase = instrument.phrases[phraseIndex];

  const beatDots = useMemo(
    () => (active ? getBeatDots(phrase) : []),
    [active, phrase]
  );

  return (
    <div
      className="flex items-stretch border-b border-black/25 cursor-pointer select-none"
      data-instrument-row={instrument.id}
      style={{ minHeight: 52 }}
      onClick={() => active && onRowClick(instrument.id)}
    >
      {/* Instrument control column */}
      <div
        className="flex items-center gap-2 px-3 flex-shrink-0"
        style={{ width: 185, background: count > 0 ? '#222222' : '#1c1c1c' }}
      >
        {/* Colored icon box */}
        <div
          className="w-9 h-9 rounded flex items-center justify-center text-base flex-shrink-0 font-bold"
          style={{
            background: count > 0 ? instrument.color : '#3a3a3a',
            color: count > 0 ? '#fff' : '#555',
            fontSize: instrument.emoji.length > 1 ? 18 : 20,
          }}
        >
          {instrument.emoji}
        </div>

        {/* Toggle pill */}
        {count > 0 ? (
          <button
            data-tutorial-toggle={instrument.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{
              background: active ? '#22C55E' : '#EF4444',
              minWidth: 68,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(instrument.id);
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-white/90 flex-shrink-0"
              style={{ transform: active ? 'none' : 'none' }}
            />
            <span>{active ? 'ON' : 'OFF'}</span>
          </button>
        ) : (
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: 68, height: 26, background: '#333', opacity: 0.5 }}
          />
        )}
      </div>

      {/* Beat grid */}
      {active ? (
        <div
          data-tutorial-beatgrid={instrument.id}
          className="flex-1 flex items-center px-1 py-1.5 gap-0.5"
          style={{ background: '#c0c0c0' }}
        >
          {beatDots.map((filled, i) => (
            <div
              key={i}
              className="flex-1 h-full flex items-center justify-center rounded-sm"
              style={{
                background: i % 2 === 0 ? '#a8a8a8' : '#b8b8b8',
                minWidth: 0,
              }}
            >
              {filled && (
                <div
                  className="rounded-full"
                  style={{
                    width: '60%',
                    paddingTop: '60%',
                    background: '#FBBF24',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex-1"
          style={{ background: count > 0 ? '#2a2a2a' : '#1e1e1e' }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimelinePane
// ---------------------------------------------------------------------------
export default function TimelinePane({ state, stats, onToggle, onRowClick, onTempoChange, onVolumeChange, onReset }) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#2a2a2a' }}>

      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ height: 72, borderBottom: '2px solid #1a1a1a' }}
      >
        <h1
          className="font-light tracking-wide"
          style={{ fontSize: 36, color: '#9ca3af', letterSpacing: '0.05em' }}
        >
          Timeline
        </h1>
      </div>

      {/* Empty composition space */}
      <div className="flex-1 min-h-0" style={{ background: '#1e1e1e' }}>
        {/* Tempo / volume controls in top area */}
        <div className="px-6 pt-4 pb-2 space-y-2 opacity-60">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs w-10">BPM</span>
            <input
              type="range"
              min={60}
              max={200}
              value={state.tempo}
              onChange={e => onTempoChange(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full cursor-pointer"
            />
            <span className="text-gray-400 text-xs w-8 text-right font-mono">{state.tempo}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs w-10">Vol</span>
            <input
              type="range"
              min={0}
              max={100}
              value={state.volume}
              onChange={e => onVolumeChange(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full cursor-pointer"
            />
            <span className="text-gray-400 text-xs w-8 text-right font-mono">{state.volume}%</span>
          </div>
        </div>
      </div>

      {/* Instrument rows panel */}
      <div className="flex-shrink-0" style={{ background: '#1a1a1a' }}>
        {INSTRUMENTS.map(inst => (
          <InstrumentRow
            key={inst.id}
            instrument={inst}
            instState={state.instruments[inst.id]}
            onToggle={onToggle}
            onRowClick={onRowClick}
          />
        ))}
      </div>

      {/* Footer bar: reset left, export right */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t border-black/40"
        style={{ background: '#2a2a2a' }}
      >
        <button
          className="text-xs font-medium tracking-wide transition-colors"
          style={{ color: 'rgba(239,68,68,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; }}
          onClick={() => {
            if (window.confirm('Reset all progress? This cannot be undone.')) {
              onReset();
            }
          }}
        >
          Reset Progress
        </button>
        <button
          className="text-gray-400 text-sm font-medium tracking-wide hover:text-gray-200 transition-colors"
          onClick={() => {}}
        >
          Export ↓
        </button>
      </div>
    </div>
  );
}
