import React, { useState } from 'react';
import { INSTRUMENTS, UPGRADES, getInstrumentCost, formatNumber } from '../data/gameData.js';

// -------------------------------------------------------------------------
// Upgrade card
// -------------------------------------------------------------------------
function UpgradeCard({ upgrade, notes, purchased, onBuy }) {
  const canAfford = notes >= upgrade.cost;
  const borderColor = purchased ? '#10B981' : canAfford ? '#fbbf24' : '#374151';

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 select-none"
      style={{
        background: purchased ? '#10B98120' : canAfford ? '#fbbf2410' : '#ffffff08',
        borderColor,
        opacity: purchased ? 0.6 : 1,
      }}
      onClick={() => !purchased && canAfford && onBuy(upgrade.id)}
      title={upgrade.description}
    >
      <span className="text-lg flex-shrink-0">{upgrade.icon}</span>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-sm truncate"
          style={{ color: purchased ? '#6ee7b7' : canAfford ? '#fbbf24' : '#9ca3af' }}
        >
          {upgrade.name}
          {purchased && <span className="ml-1 text-xs">✓</span>}
        </div>
        <div className="text-xs text-white/40 truncate">{upgrade.description}</div>
      </div>
      {!purchased && (
        <div
          className="text-xs font-bold flex-shrink-0"
          style={{ color: canAfford ? '#fbbf24' : '#6b7280' }}
        >
          ♪{formatNumber(upgrade.cost)}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// Phrase section (expandable)
// -------------------------------------------------------------------------
function PhrasesSection({ instrument, instState, notes, onBuyPhrase, onSetPhrase }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1.5">
      <button
        className="text-xs text-purple-400/60 hover:text-purple-300 transition-colors flex items-center gap-1"
        onClick={() => setOpen(o => !o)}
      >
        <span>Phrases {open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="mt-1.5 space-y-1.5 pl-2 border-l border-purple-900/40">
          {instrument.phrases.map((phrase, i) => {
            const isActive = instState.activePhrase === i;
            const isUnlocked = instState.unlockedPhrases[i];
            const cost = instrument.phraseCosts[i + 1];
            const canAfford = notes >= cost;
            const isFirst = i === 0;

            return (
              <div
                key={phrase.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs"
                style={{
                  background: isActive ? `${instrument.color}22` : '#ffffff08',
                  border: `1px solid ${isActive ? instrument.color + '66' : '#ffffff10'}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium truncate"
                    style={{ color: isUnlocked ? '#e2e8f0' : '#6b7280' }}
                  >
                    {i + 1}. {phrase.name}
                  </div>
                  {!isUnlocked && !isFirst && (
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: canAfford ? '#fbbf24' : '#6b7280' }}
                    >
                      ♪{formatNumber(cost)}
                    </div>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    className="px-2 py-0.5 rounded text-xs font-semibold transition-colors"
                    style={{
                      background: isActive ? instrument.color : `${instrument.color}33`,
                      color: isActive ? '#fff' : instrument.color,
                    }}
                    onClick={() => onSetPhrase(instrument.id, i)}
                  >
                    {isActive ? 'Active' : 'Use'}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford || isFirst}
                    className="px-2 py-0.5 rounded text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: canAfford ? '#fbbf2433' : '#ffffff10',
                      color: canAfford ? '#fbbf24' : '#6b7280',
                    }}
                    onClick={() => canAfford && onBuyPhrase(instrument.id, i)}
                  >
                    Unlock
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// Instrument card
// -------------------------------------------------------------------------
function InstrumentCard({ instrument, instState, notes, onBuy, onBuyPhrase, onSetPhrase }) {
  const count = instState?.count || 0;
  const cost = getInstrumentCost(instrument, count);
  const canAfford = notes >= cost;
  const isOwned = count > 0;

  return (
    <div
      className="rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
      style={{
        background: isOwned ? `${instrument.color}0d` : '#ffffff06',
        borderColor: isOwned ? `${instrument.color}40` : '#ffffff10',
      }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Color bar */}
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ background: instrument.color }}
        />

        <span className="text-2xl flex-shrink-0" role="img">{instrument.emoji}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-sm"
              style={{ color: isOwned ? instrument.color : '#9ca3af' }}
            >
              {instrument.name}
            </span>
            {isOwned && (
              <span
                className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${instrument.color}33`, color: instrument.color }}
              >
                ×{count}
              </span>
            )}
          </div>
          <div className="text-white/40 text-xs">
            {instrument.baseNPS} NPS each
            {isOwned && ` · ${formatNumber(instrument.baseNPS * count)} total`}
          </div>
        </div>

        {/* Buy button */}
        <button
          disabled={!canAfford}
          className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          style={{
            background: canAfford ? `${instrument.color}` : '#ffffff18',
            color: canAfford ? '#fff' : '#9ca3af',
            boxShadow: canAfford ? `0 0 12px ${instrument.color}66` : 'none',
          }}
          onClick={() => canAfford && onBuy(instrument.id)}
        >
          <div>Buy</div>
          <div
            className="font-normal"
            style={{ color: canAfford ? 'rgba(255,255,255,0.8)' : '#6b7280' }}
          >
            ♪{formatNumber(cost)}
          </div>
        </button>
      </div>

      {/* Phrases section (only if owned) */}
      {isOwned && (
        <div className="px-3 pb-2.5">
          <PhrasesSection
            instrument={instrument}
            instState={instState}
            notes={notes}
            onBuyPhrase={onBuyPhrase}
            onSetPhrase={onSetPhrase}
          />
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// RightPane
// -------------------------------------------------------------------------
export default function RightPane({ state, stats, onBuyInstrument, onBuyPhrase, onSetPhrase, onBuyUpgrade, onReset }) {
  const { notes } = state;
  const availableUpgrades = UPGRADES.filter(u => !state.purchasedUpgrades.includes(u.id) || state.purchasedUpgrades.includes(u.id));
  const unpurchasedUpgrades = UPGRADES.filter(u => !state.purchasedUpgrades.includes(u.id));
  const purchasedUpgrades = UPGRADES.filter(u => state.purchasedUpgrades.includes(u.id));

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#1a1a2e' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-900/40 flex-shrink-0">
        <h2 className="text-purple-300 font-bold text-sm uppercase tracking-widest">Shop</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0">

        {/* UPGRADES section */}
        <section>
          <div className="text-purple-400/60 text-xs uppercase tracking-widest mb-2 px-1 font-semibold">
            ✦ Upgrades
          </div>
          <div className="space-y-1.5">
            {unpurchasedUpgrades.length === 0 && (
              <div className="text-purple-400/30 text-xs text-center py-2">All upgrades purchased!</div>
            )}
            {unpurchasedUpgrades.map(upg => (
              <UpgradeCard
                key={upg.id}
                upgrade={upg}
                notes={notes}
                purchased={false}
                onBuy={onBuyUpgrade}
              />
            ))}
            {purchasedUpgrades.length > 0 && (
              <details className="group">
                <summary className="text-purple-400/40 text-xs cursor-pointer hover:text-purple-400/60 py-1 px-1 list-none flex items-center gap-1">
                  <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                  {purchasedUpgrades.length} purchased
                </summary>
                <div className="mt-1 space-y-1">
                  {purchasedUpgrades.map(upg => (
                    <UpgradeCard
                      key={upg.id}
                      upgrade={upg}
                      notes={notes}
                      purchased={true}
                      onBuy={() => {}}
                    />
                  ))}
                </div>
              </details>
            )}
          </div>
        </section>

        {/* INSTRUMENTS section */}
        <section>
          <div className="text-purple-400/60 text-xs uppercase tracking-widest mb-2 px-1 font-semibold">
            ♪ Instruments
          </div>
          <div className="space-y-2">
            {INSTRUMENTS.map(inst => (
              <InstrumentCard
                key={inst.id}
                instrument={inst}
                instState={state.instruments[inst.id]}
                notes={notes}
                onBuy={onBuyInstrument}
                onBuyPhrase={onBuyPhrase}
                onSetPhrase={onSetPhrase}
              />
            ))}
          </div>
        </section>

        {/* Reset button */}
        <div className="pt-2 pb-4">
          <button
            className="w-full py-2 rounded-lg text-xs text-red-400/50 hover:text-red-400 border border-red-900/20 hover:border-red-900/50 transition-colors"
            onClick={() => {
              if (window.confirm('Reset all progress? This cannot be undone.')) {
                onReset();
              }
            }}
          >
            Reset Save
          </button>
        </div>
      </div>
    </div>
  );
}
