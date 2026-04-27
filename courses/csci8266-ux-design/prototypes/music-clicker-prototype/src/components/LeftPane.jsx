import React, { useMemo, useState, useCallback } from 'react';
import { INSTRUMENTS, getDefaultPattern } from '../data/gameData.js';
import { VISUAL_LEAD_FRACTION } from '../audio/audioEngine.js';
import MidiEditorModal from './MidiEditorModal.jsx';
import InstrumentIcon from './InstrumentIcon.jsx';
import { GiGClef } from 'react-icons/gi';

// ---------------------------------------------------------------------------
// Single instrument row
// ---------------------------------------------------------------------------
function InstrumentRow({ instrument, instState, onToggle, onBeatToggle, onOpenMidiEditor, activeCellIndex, beatTransitionMs, isPendingActivation }) {
  const count = instState?.count || 0;
  const active = instState?.active || false;
  const phraseIndex = instState?.activePhrase || 0;
  const phrase = instrument.phrases[phraseIndex];

  // Use saved custom pattern if present, else derive from phrase
  const displayPattern = useMemo(() => {
    if (instState?.customPattern) return instState.customPattern;
    return getDefaultPattern(phrase);
  }, [instState?.customPattern, phrase]);

  return (
    <div
      className="flex items-stretch border-b border-black/25 select-none"
      data-instrument-row={instrument.id}
      style={{ minHeight: 52, opacity: isPendingActivation ? 0.65 : 1, transition: isPendingActivation ? 'none' : 'opacity 0.25s ease' }}
    >
      {/* Instrument control column */}
      <div
        className="flex items-center gap-2 px-3 flex-shrink-0"
        style={{ width: 185, background: count > 0 ? '#222222' : '#1c1c1c' }}
      >
        {/* Colored icon box — tappable to toggle when owned */}
        <div
          className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: count > 0 ? instrument.color : '#3a3a3a',
            cursor: count > 0 ? 'pointer' : 'default',
          }}
          onClick={(e) => {
            if (count > 0) {
              e.stopPropagation();
              onToggle(instrument.id);
            }
          }}
        >
          <InstrumentIcon
            instrumentId={instrument.id}
            size={20}
            color={count > 0 ? '#fff' : '#555'}
          />
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
            <div className="w-3 h-3 rounded-full bg-white/90 flex-shrink-0" />
            <span>{active ? (isPendingActivation ? '⏱️' : 'ON') : 'OFF'}</span>
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
          className="flex-1 flex items-center"
          style={{ background: '#c0c0c0' }}
        >
          {/* Step cells */}
          <div className="flex-1 flex items-center px-1 py-1.5 gap-0.5 min-w-0" style={{ height: '100%' }}>
            {displayPattern.map((filled, i) => (
              <div
                key={i}
                className="flex-1 h-full flex items-center justify-center rounded-sm cursor-pointer"
                style={{
                  background: i === activeCellIndex ? '#BFDBFE' : (i % 2 === 0 ? '#a8a8a8' : '#b8b8b8'),
                  transition: `background ${beatTransitionMs}ms ease-out`,
                  minWidth: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBeatToggle(instrument.id, i);
                }}
              >
                {filled ? (
                  <div
                    className="rounded-full transition-transform duration-75 hover:scale-110"
                    style={{
                      width: 'min(60%, 28px)',
                      aspectRatio: '1',
                      background: '#FBBF24',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    }}
                  />
                ) : (
                  <div
                    className="rounded-full"
                    style={{
                      width: 'min(40%, 18px)',
                      aspectRatio: '1',
                      background: 'rgba(0,0,0,0)',
                      border: '2px solid rgba(255,255,255,0.35)',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right-edge clef button / spacer — always rendered to keep rows aligned */}
          {phrase?.isDrum ? (
            // Drums: invisible spacer matching the clef button width
            <div
              className="flex-shrink-0"
              style={{
                width: 36,
                height: '100%',
                borderLeft: '1px solid rgba(0,0,0,0.15)',
                background: 'rgba(0,0,0,0.12)',
              }}
            />
          ) : (
            // Melodic: always-active note editor button
            <button
              data-tutorial-wand={instrument.id}
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 36,
                height: '100%',
                background: 'rgba(0,0,0,0.12)',
                borderLeft: '1px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                color: instState?.midiNotes ? instrument.color : 'rgba(0,0,0,0.45)',
              }}
              title="Note Editor"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMidiEditor(instrument.id);
              }}
            >
              <GiGClef size={18} />
            </button>
          )}
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
export default function TimelinePane({ state, stats, activeBeat, pendingTempo, pendingActivation, onToggle, onBeatToggle, onSetMidiPattern, onMidiEditorOpen, onTempoChange, onVolumeChange, onExport, exportProgress, onReset }) {
  const [midiEditId, setMidiEditId] = useState(null);

  const handleOpenMidiEditor = useCallback((id) => {
    onMidiEditorOpen?.();
    setMidiEditId(id);
  }, [onMidiEditorOpen]);
  // Cell duration at current BPM: each phrase is 4 beats, split into 8 cells
  const cellDurSec = (4 / 8) * (60 / state.tempo);
  const beatTransitionMs = Math.round(VISUAL_LEAD_FRACTION * cellDurSec * 1000);

  // Instrument for the currently-open MIDI editor
  const midiEditInstrument = midiEditId ? INSTRUMENTS.find(i => i.id === midiEditId) : null;
  const midiEditInstState = midiEditId ? state.instruments[midiEditId] : null;

  return (
    <div className="flex flex-col h-full" style={{ background: '#2a2a2a' }}>

      {/* MIDI editor modal */}
      {midiEditInstrument && midiEditInstState && (
        <MidiEditorModal
          instrument={midiEditInstrument}
          instState={midiEditInstState}
          onClose={() => setMidiEditId(null)}
          onSetMidiPattern={onSetMidiPattern}
        />
      )}

      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ height: 72, borderBottom: '2px solid #1a1a1a' }}
      >
        <div className="flex flex-col items-center" style={{ lineHeight: 1.15 }}>
          <h1
            className="font-light tracking-wide"
            style={{ fontSize: 32, color: '#9ca3af', letterSpacing: '0.05em' }}
          >
            Music Chef
          </h1>
          <span
            className="font-light italic"
            style={{ fontSize: 13, color: '#6b7280', letterSpacing: '0.03em' }}
          >
            Let's get cooking!
          </span>
        </div>
      </div>

      {/* Composition space: sliders + instrument icon cloud */}
      <div className="flex-1 min-h-0 flex flex-col" style={{ background: '#1e1e1e' }}>
        {/* Tempo / volume controls */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 space-y-3" style={{ opacity: 0.75 }}>

          {/* BPM — preset buttons */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs flex-shrink-0" style={{ width: 28 }}>BPM</span>
            <div className="flex-1 flex gap-1.5">
              {[70, 90, 120, 150].map(bpm => {
                const isActive = state.tempo === bpm && !pendingTempo;
                const isPending = pendingTempo === bpm;
                const isDimmed = !!pendingTempo && state.tempo === bpm;
                return (
                  <button
                    key={bpm}
                    className="flex-1 rounded font-bold text-xs transition-colors flex items-center justify-center gap-0.5"
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      background: isPending ? 'rgba(251,191,36,0.18)' : isActive ? '#9ca3af' : isDimmed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                      color: isPending ? '#fbbf24' : isActive ? '#1a1a1a' : '#6b7280',
                      border: isPending ? '1px solid rgba(251,191,36,0.45)' : isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      opacity: isDimmed ? 0.5 : 1,
                    }}
                    onClick={() => onTempoChange(bpm)}
                  >
                    <span>{bpm}</span>
                    {isPending && <span style={{ fontSize: 10 }}>⏱️</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume — tall slider for easy touch */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs flex-shrink-0" style={{ width: 28 }}>Vol</span>
            <input
              type="range"
              min={0}
              max={100}
              value={state.volume}
              onChange={e => onVolumeChange(Number(e.target.value))}
              className="flex-1 cursor-pointer"
              style={{ height: 36 }}
            />
            <span className="text-gray-400 text-xs text-right font-mono flex-shrink-0" style={{ width: 32 }}>
              {state.volume}%
            </span>
          </div>

        </div>

        {/* Instrument icon cloud — one icon per owned instrument */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {INSTRUMENTS.flatMap(inst => {
              const count = state.instruments[inst.id]?.count || 0;
              return Array.from({ length: count }, (_, i) => (
                <div
                  key={`${inst.id}-${i}`}
                  className="rounded flex items-center justify-center flex-shrink-0"
                  style={{ width: 28, height: 28, background: inst.color }}
                >
                  <InstrumentIcon instrumentId={inst.id} size={16} color="#fff" />
                </div>
              ));
            })}
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
            onBeatToggle={onBeatToggle}
            onOpenMidiEditor={handleOpenMidiEditor}
            activeCellIndex={activeBeat?.[inst.id] ?? -1}
            beatTransitionMs={beatTransitionMs}
            isPendingActivation={!!pendingActivation?.[inst.id]}
          />
        ))}
      </div>

      {/* Footer bar: reset, review, export */}
      <div
        className="flex-shrink-0 flex items-center justify-center px-4 py-3 border-t border-black/40 gap-3"
        style={{ background: '#2a2a2a' }}
      >
        <button
          className="rounded-lg py-2.5 px-6 text-sm font-semibold tracking-wide transition-colors"
          style={{
            background: 'rgba(239,68,68,0.12)',
            color: 'rgba(239,68,68,0.7)',
            border: '1px solid rgba(239,68,68,0.25)',
            minWidth: 110,
            maxWidth: 160,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
            e.currentTarget.style.color = 'rgba(239,68,68,0.7)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
          }}
          onClick={() => {
            if (window.confirm('Reset all progress? This cannot be undone.')) {
              onReset();
            }
          }}
        >
          Reset
        </button>
        <a
          href="https://forms.gle/DeywAS8iCm2FEQhg6"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg py-2.5 px-6 text-sm font-semibold tracking-wide transition-colors"
          style={{
            background: 'rgba(139,92,246,0.12)',
            color: 'rgba(167,139,250,0.8)',
            border: '1px solid rgba(139,92,246,0.25)',
            minWidth: 110,
            maxWidth: 160,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.2)';
            e.currentTarget.style.color = '#a78bfa';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
            e.currentTarget.style.color = 'rgba(167,139,250,0.8)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
          }}
        >
          Review ★
        </a>
        {exportProgress !== null ? (
          <div className="flex items-center gap-2" style={{ minWidth: 110, maxWidth: 160, justifyContent: 'center' }}>
            <div
              className="rounded-full overflow-hidden"
              style={{ width: 72, height: 6, background: '#3a3a3a' }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${Math.round(exportProgress * 100)}%`, background: '#86EFAC' }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: '#86EFAC' }}>
              {Math.round(exportProgress * 100)}%
            </span>
          </div>
        ) : (
          <button
            className="rounded-lg py-2.5 px-6 text-sm font-semibold tracking-wide transition-colors"
            style={{
              background: 'rgba(134,239,172,0.12)',
              color: 'rgba(134,239,172,0.8)',
              border: '1px solid rgba(134,239,172,0.25)',
              minWidth: 110,
              maxWidth: 160,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(134,239,172,0.2)';
              e.currentTarget.style.color = '#86EFAC';
              e.currentTarget.style.borderColor = 'rgba(134,239,172,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(134,239,172,0.12)';
              e.currentTarget.style.color = 'rgba(134,239,172,0.8)';
              e.currentTarget.style.borderColor = 'rgba(134,239,172,0.25)';
            }}
            onClick={onExport}
          >
            Export ↓
          </button>
        )}
      </div>
    </div>
  );
}
