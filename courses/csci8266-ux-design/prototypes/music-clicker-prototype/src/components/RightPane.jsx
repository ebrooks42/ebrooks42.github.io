import React, { useState } from 'react';
import { INSTRUMENTS, UPGRADES, getInstrumentCost, formatNumber, formatNPS } from '../data/gameData.js';

// ---------------------------------------------------------------------------
// Phrase upgrade section (expandable, shown inside instrument upgrade dropdown)
// ---------------------------------------------------------------------------
function PhraseSection({ instrument, instState, notes, onBuyPhrase, onSetPhrase, pendingChange }) {
  return (
    <div className="pt-1 pb-2 px-3 space-y-1.5">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phrases</div>
      {instrument.phrases.map((phrase, i) => {
        const isActive = instState.activePhrase === i;
        const isUnlocked = instState.unlockedPhrases[i];
        const cost = instrument.phraseCosts[i + 1];
        const canAfford = notes >= cost;
        const isFree = i === 0;

        return (
          <div
            key={phrase.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs select-none"
            style={{
              background: isActive ? `${instrument.color}22` : '#ffffff10',
              border: `1px solid ${isActive ? instrument.color + '55' : '#ffffff18'}`,
              cursor: isUnlocked ? 'pointer' : 'default',
            }}
            onClick={() => isUnlocked && onSetPhrase(instrument.id, i)}
          >
            <div className="flex-1 min-w-0">
              <span
                className="font-medium truncate block"
                style={{ color: isUnlocked ? '#e2e8f0' : '#6b7280' }}
              >
                {i + 1}. {phrase.name}
              </span>
              {!isUnlocked && !isFree && (
                <span
                  className="text-xs"
                  style={{ color: canAfford ? '#fbbf24' : '#6b7280' }}
                >
                  ♪{formatNumber(cost)}
                </span>
              )}
            </div>
            {isUnlocked ? (
              <div
                className="px-2 py-0.5 rounded text-xs font-semibold pointer-events-none"
                style={{
                  background: isActive ? instrument.color : `${instrument.color}33`,
                  color: isActive ? '#fff' : instrument.color,
                }}
                title={isActive && pendingChange ? 'Switching at next loop boundary…' : undefined}
              >
                {isActive ? (pendingChange ? '🕐' : 'Active') : 'Use'}
              </div>
            ) : (
              <button
                disabled={!canAfford || isFree}
                className="px-2 py-0.5 rounded text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: canAfford ? '#fbbf2433' : '#ffffff10',
                  color: canAfford ? '#fbbf24' : '#6b7280',
                }}
                onClick={(e) => { e.stopPropagation(); canAfford && onBuyPhrase(instrument.id, i); }}
              >
                Unlock
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShopPane
// ---------------------------------------------------------------------------
export default function ShopPane({
  state,
  stats,
  onBuyInstrument,
  onBuyPhrase,
  onSetPhrase,
  onBuyUpgrade,
  tutorialHighlight,
  pendingPhraseChange,
}) {
  const { notes } = state;
  // undefined = default open; false = explicitly closed; true = explicitly opened
  const [upgradeOpen, setUpgradeOpen] = useState({});

  // Effective NPS multiplier from purchased upgrades (used to show real ♪/s values)
  const npsMultiplier = state.purchasedUpgrades.reduce((mult, uid) => {
    const upg = UPGRADES.find(u => u.id === uid);
    if (upg?.effect.type === 'nps_multiplier') return mult * upg.effect.value;
    return mult;
  }, 1);

  const toggleUpgrade = (id) => {
    // undefined/true → close (false); false → open (true)
    setUpgradeOpen(prev => ({ ...prev, [id]: prev[id] !== false ? false : true }));
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#646464' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-3"
        style={{ height: 72, borderBottom: '2px solid rgba(0,0,0,0.25)', background: '#5a5a5a' }}
      >
        <h1
          className="font-light tracking-wide"
          style={{ fontSize: 36, color: '#1a1a1a', letterSpacing: '0.05em' }}
        >
          Shop
        </h1>
        <div
          data-tutorial-notes
          className="rounded px-2 py-0.5 font-bold text-xl"
          style={{
            background: notes > 0 ? '#BFDBFE' : '#d4d4d4',
            color: '#1a1a1a',
            transition: 'background 0.3s',
          }}
        >
          {formatNumber(Math.floor(notes))}
        </div>
        <span style={{ fontSize: 22, color: '#1a1a1a' }}>♪</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 py-3 space-y-2 px-3">

        {/* Instruments section header (non-interactive, like Global Upgrades) */}
        <div className="px-1 py-1 text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Instruments
        </div>

        {/* One entry per instrument — buy card when unowned, upgrade panel when owned */}
        {INSTRUMENTS.map(inst => {
          const instState = state.instruments[inst.id];
          const count = instState?.count || 0;
          const isOwned = count > 0;
          const isHighlighted = tutorialHighlight === inst.id;

          if (!isOwned) {
            const cost = getInstrumentCost(inst, count);
            const canAfford = notes >= cost;
            return (
              <div
                key={inst.id}
                data-tutorial-shop-instrument={inst.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer select-none transition-all duration-150"
                style={{
                  background: isHighlighted || canAfford ? '#ffffff' : '#3a3a3a',
                  boxShadow: isHighlighted ? '0 0 0 2px #3B82F6' : 'none',
                }}
                onClick={() => canAfford && onBuyInstrument(inst.id)}
              >
                <div className="flex flex-col">
                  <span
                    className="font-semibold text-lg"
                    style={{ color: isHighlighted || canAfford ? '#1a1a1a' : '#6b7280' }}
                  >
                    {inst.name}
                  </span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>
                    {formatNPS(inst.baseNPS * npsMultiplier)} ♪/s per copy
                  </span>
                </div>
                <span
                  className="font-semibold text-lg"
                  style={{ color: isHighlighted || canAfford ? '#1a1a1a' : '#6b7280' }}
                >
                  {formatNumber(cost)}♪
                </span>
              </div>
            );
          }

          // Owned: upgrade panel, default open (upgradeOpen[id] !== false)
          const isOpen = upgradeOpen[inst.id] !== false;
          return (
            <div key={inst.id}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-base"
                style={{ background: '#4a4a4a', color: '#e2e8f0' }}
                onClick={() => toggleUpgrade(inst.id)}
              >
                <span>Upgrade {inst.name}</span>
                <span style={{ fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div
                  className="mt-1 rounded-xl overflow-hidden"
                  style={{ background: '#2a2a2a' }}
                >
                  {/* Buy more */}
                  <div className="px-3 pt-2 pb-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Buy More
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm">
                          {inst.name} ×{instState.count}
                        </span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {formatNPS(inst.baseNPS * instState.count * npsMultiplier)} ♪/s total
                          {' · '}
                          {formatNPS(inst.baseNPS * npsMultiplier)} ♪/s each
                        </span>
                      </div>
                      {(() => {
                        const nextCost = getInstrumentCost(inst, instState.count);
                        const canAfford = notes >= nextCost;
                        return (
                          <button
                            disabled={!canAfford}
                            className="px-3 py-1 rounded-lg text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                              background: canAfford ? inst.color : '#ffffff18',
                              color: '#fff',
                            }}
                            onClick={() => canAfford && onBuyInstrument(inst.id)}
                          >
                            ♪{formatNumber(nextCost)}
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Phrase upgrades */}
                  <PhraseSection
                    instrument={inst}
                    instState={instState}
                    notes={notes}
                    onBuyPhrase={onBuyPhrase}
                    onSetPhrase={onSetPhrase}
                    pendingChange={!!pendingPhraseChange?.[inst.id]}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Global Upgrades */}
        {UPGRADES.filter(u => !state.purchasedUpgrades.includes(u.id)).length > 0 && (
          <div>
            <div className="px-1 py-1 text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Global Upgrades
            </div>
            <div className="space-y-1.5">
              {UPGRADES.filter(u => !state.purchasedUpgrades.includes(u.id)).map(upg => {
                const canAfford = notes >= upg.cost;
                return (
                  <div
                    key={upg.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                    style={{
                      background: canAfford ? '#fbbf2418' : '#2a2a2a',
                      border: `1px solid ${canAfford ? '#fbbf2455' : '#3a3a3a'}`,
                    }}
                    onClick={() => canAfford && onBuyUpgrade(upg.id)}
                  >
                    <span className="text-lg">{upg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ color: canAfford ? '#fbbf24' : '#6b7280' }}
                      >
                        {upg.name}
                      </div>
                      <div className="text-xs text-white/40 truncate">{upg.description}</div>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: canAfford ? '#fbbf24' : '#6b7280' }}
                    >
                      ♪{formatNumber(upg.cost)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
