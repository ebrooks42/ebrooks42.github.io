import React, { useState, useRef, useCallback, useEffect } from 'react';
import { INSTRUMENTS } from '../data/gameData.js';
import { formatNumber } from '../data/gameData.js';

// -------------------------------------------------------------------------
// Floating particle component
// -------------------------------------------------------------------------
function Particle({ id, x, y, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none absolute select-none font-bold text-yellow-300 text-lg animate-float-up z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      ♪+1
    </div>
  );
}

// -------------------------------------------------------------------------
// LeftPane
// -------------------------------------------------------------------------
export default function LeftPane({ state, stats, onCompose, audioInitialized }) {
  const [particles, setParticles] = useState([]);
  const [isPulsing, setIsPulsing] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const containerRef = useRef(null);
  const particleIdRef = useRef(0);

  // Determine the "primary" instrument (last purchased or highest count)
  const primaryInstrument = React.useMemo(() => {
    let best = INSTRUMENTS[0];
    for (const inst of [...INSTRUMENTS].reverse()) {
      if (state.instruments[inst.id]?.count > 0) {
        best = inst;
        break;
      }
    }
    return best;
  }, [state.instruments]);

  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleClick = useCallback((e) => {
    onCompose();
    setIsPulsing(true);
    setClickCount(c => c + 1);
    setTimeout(() => setIsPulsing(false), 300);

    // Spawn particle at click position
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = particleIdRef.current++;
      setParticles(prev => [...prev.slice(-12), { id, x, y }]);
    }
  }, [onCompose]);

  // Passive NPS display — updates each render
  const { totalNPC, totalNPS } = stats;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#1a1a2e' }}
    >
      {/* Header strip */}
      <div className="px-4 py-3 border-b border-purple-900/40">
        <h2 className="text-purple-300 font-bold text-sm uppercase tracking-widest">Studio</h2>
      </div>

      {/* Main click area */}
      <div
        ref={containerRef}
        className="flex-1 relative flex flex-col items-center justify-center gap-6 px-4 overflow-hidden"
      >
        {/* Particles */}
        {particles.map(p => (
          <Particle
            key={p.id}
            id={p.id}
            x={p.x}
            y={p.y}
            onDone={() => removeParticle(p.id)}
          />
        ))}

        {/* Ambient glow behind the icon */}
        <div
          className="absolute rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            width: 220,
            height: 220,
            background: primaryInstrument.color,
          }}
        />

        {/* Instrument icon button */}
        <button
          onClick={handleClick}
          className="relative flex items-center justify-center rounded-full cursor-pointer select-none
                     transition-transform duration-150 active:scale-95 focus:outline-none"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle at 40% 35%, ${primaryInstrument.color}33, ${primaryInstrument.color}11)`,
            border: `3px solid ${primaryInstrument.color}66`,
            boxShadow: isPulsing
              ? `0 0 48px ${primaryInstrument.color}99, 0 0 90px ${primaryInstrument.color}44`
              : `0 0 24px ${primaryInstrument.color}44`,
            transform: isPulsing ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          }}
          title="Compose!"
          aria-label="Compose notes"
        >
          <span style={{ fontSize: 80, lineHeight: 1 }} role="img" aria-label={primaryInstrument.name}>
            {primaryInstrument.emoji}
          </span>
        </button>

        {/* Compose label */}
        <div className="text-center">
          <div
            className="font-black text-xl tracking-wide uppercase"
            style={{ color: primaryInstrument.color }}
          >
            Compose!
          </div>
          <div className="text-xs text-purple-400/60 mt-0.5">{primaryInstrument.name}</div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2.5">
            <span className="text-purple-300/70 text-sm">Per Click</span>
            <span className="text-yellow-300 font-bold text-lg">
              ♪ {formatNumber(totalNPC)}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2.5">
            <span className="text-purple-300/70 text-sm">Per Second</span>
            <span className="font-bold text-lg" style={{ color: '#a78bfa' }}>
              ⚡ {formatNumber(totalNPS)}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2.5">
            <span className="text-purple-300/70 text-sm">Clicks</span>
            <span className="text-purple-400 font-bold text-lg">
              {formatNumber(clickCount)}
            </span>
          </div>
        </div>

        {/* Audio hint */}
        {!audioInitialized && (
          <div className="text-purple-400/50 text-xs text-center animate-pulse">
            Click to start the music!
          </div>
        )}
      </div>
    </div>
  );
}
