import React from 'react';
import {
  GiGrandPiano,
  GiDrumKit,
  GiGuitar,
  GiXylophone,
  GiGuitarBassHead,
} from 'react-icons/gi';

const ICONS = {
  piano:    GiGrandPiano,
  drums:    GiDrumKit,
  guitar:   GiGuitar,
  triangle: GiXylophone,   // instrument id is still 'triangle', sound is xylophone
  bass:     GiGuitarBassHead,
  // kazoo removed — unknown ids fall back to null gracefully
};

/**
 * Renders an SVG icon for a given instrument id.
 * Falls back to nothing if the id isn't recognised.
 */
export default function InstrumentIcon({ instrumentId, size = 20, color = 'currentColor', style }) {
  const Icon = ICONS[instrumentId];
  if (!Icon) return null;
  return <Icon size={size} color={color} style={style} />;
}
