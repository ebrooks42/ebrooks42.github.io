import React, { useMemo } from 'react';
import { MIDI_PITCHES, getPhraseStepNotes, STEP_NOTES, getDefaultPattern } from '../data/gameData.js';
import InstrumentIcon from './InstrumentIcon.jsx';

const NUM_CELLS = 8;

// ---------------------------------------------------------------------------
// Derive initial midiNotes from existing state when modal first opens
// ---------------------------------------------------------------------------
function deriveInitialMidiNotes(instrument, instState) {
  // Already has explicit MIDI overrides — use them
  if (instState?.midiNotes) return instState.midiNotes;

  const phraseIndex = instState?.activePhrase || 0;
  const phrase = instrument.phrases[phraseIndex];
  const phraseNotes = getPhraseStepNotes(phrase, NUM_CELLS);
  const fallback = STEP_NOTES[instrument.id] || new Array(NUM_CELLS).fill('C4');
  const pattern = instState?.customPattern || getDefaultPattern(phrase);

  // For cells that are "on", pick a pitch; for cells that are "off", null
  return pattern.map((on, i) =>
    on ? (phraseNotes?.[i] ?? fallback[i]) : null
  );
}

// ---------------------------------------------------------------------------
// MidiEditorModal
// ---------------------------------------------------------------------------
export default function MidiEditorModal({ instrument, instState, onClose, onSetMidiPattern }) {
  const pitches = MIDI_PITCHES[instrument.id] || [];

  // Derive the working midiNotes from the latest instState each render
  // (changes are applied immediately so instState is always fresh)
  const midiNotes = useMemo(
    () => deriveInitialMidiNotes(instrument, instState),
    // Re-derive only when the actual midiNotes value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instState?.midiNotes, instState?.customPattern, instState?.activePhrase, instrument.id]
  );

  const handleCellClick = (colIndex, pitch) => {
    const newNotes = [...midiNotes];
    if (newNotes[colIndex] === pitch) {
      // Clicking the active pitch turns the step off
      newNotes[colIndex] = null;
    } else {
      // Clicking any other pitch assigns it (also turns step on)
      newNotes[colIndex] = pitch;
    }
    onSetMidiPattern(instrument.id, newNotes);
  };

  const handleClearAll = () => {
    onSetMidiPattern(instrument.id, new Array(NUM_CELLS).fill(null));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: '#1e1e1e',
          border: '1px solid #3a3a3a',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
          maxWidth: '92vw',
          maxHeight: '88vh',
          width: 660,
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* ---- Header ---- */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: '#2a2a2a', borderBottom: '1px solid #111' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, background: instrument.color }}
            >
              <InstrumentIcon instrumentId={instrument.id} size={18} color="#fff" />
            </span>
            <span className="font-bold text-white" style={{ fontSize: 15 }}>
              {instrument.name} — Note Editor
            </span>
          </div>
          <button
            className="flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors"
            style={{ width: 28, height: 28, fontSize: 20, lineHeight: 1 }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* ---- Step indicator bar ---- */}
        <div
          className="flex-shrink-0 flex items-center px-4 py-2 gap-1"
          style={{ background: '#252525', borderBottom: '1px solid #111', paddingLeft: 60 }}
        >
          {Array.from({ length: NUM_CELLS }, (_, i) => {
            const hasNote = midiNotes[i] !== null;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="rounded-full transition-all duration-75"
                  style={{
                    width: 8,
                    height: 8,
                    background: hasNote ? '#FBBF24' : '#3a3a3a',
                    boxShadow: hasNote ? '0 0 4px rgba(251,191,36,0.5)' : 'none',
                  }}
                />
                <span
                  className="font-mono text-center"
                  style={{ fontSize: 10, color: hasNote ? '#9ca3af' : '#4b5563' }}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* ---- Pitch grid ---- */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
          {pitches.map((pitch, rowIdx) => {
            // Highlight rows that contain C notes for orientation
            const isC = pitch.startsWith('C');
            return (
              <div key={pitch} className="flex items-center mb-px">

                {/* Pitch label */}
                <div
                  className="flex-shrink-0 text-right pr-2 font-mono"
                  style={{
                    width: 44,
                    fontSize: 11,
                    color: isC ? '#a78bfa' : '#6b7280',
                    fontWeight: isC ? 700 : 400,
                  }}
                >
                  {pitch}
                </div>

                {/* Step cells */}
                {Array.from({ length: NUM_CELLS }, (_, colIdx) => {
                  const isActive = midiNotes[colIdx] === pitch;
                  const colHasNote = midiNotes[colIdx] !== null;

                  return (
                    <div
                      key={colIdx}
                      className="flex-1 flex items-center justify-center rounded-sm cursor-pointer mx-px"
                      style={{
                        height: 26,
                        background: isActive
                          ? instrument.color
                          : colHasNote
                            ? 'rgba(255,255,255,0.03)'
                            : isC
                              ? 'rgba(167,139,250,0.06)'
                              : 'rgba(255,255,255,0.05)',
                        border: isActive
                          ? 'none'
                          : isC
                            ? '1px solid rgba(167,139,250,0.15)'
                            : '1px solid rgba(255,255,255,0.07)',
                        transition: 'background 80ms ease',
                      }}
                      onClick={() => handleCellClick(colIdx, pitch)}
                    >
                      {isActive && (
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.85)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ---- Footer ---- */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-3"
          style={{ background: '#2a2a2a', borderTop: '1px solid #111' }}
        >
          <button
            className="text-xs transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}
            onClick={handleClearAll}
          >
            Clear all
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#4b5563' }}>
              Click a row to set pitch · click again to mute
            </span>
            <button
              className="rounded-lg px-5 py-2 text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: instrument.color, color: '#fff' }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
