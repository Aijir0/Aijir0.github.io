import { sprites } from './manifest.js';
export const storageKey = 'pacqc.sprite-settings.v1';

export function readSpriteSettings() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const settings = {};
  for (const id of Object.keys(sprites)) {
    const value = saved?.[id];
    if (value && Number.isFinite(value.scale) && value.scale >= .25 && value.scale <= 2
      && Number.isFinite(value.offsetX) && Math.abs(value.offsetX) <= 32
      && Number.isFinite(value.offsetY) && Math.abs(value.offsetY) <= 32) {
      settings[id] = { scale: value.scale, offsetX: value.offsetX, offsetY: value.offsetY };
    }
  }
  return settings;
}
