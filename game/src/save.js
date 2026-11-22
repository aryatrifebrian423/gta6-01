import { CONFIG } from './config.js';

// Save data is a small versioned checkpoint. Storage access can fail in a
// private window, so reads and writes never prevent the current session playing.
const SAVE_VERSION = 1;

function wholeNumber(value, fallback, minimum, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
  return Math.max(minimum, Math.min(maximum, number));
}

export function canResume(value) {
  return Boolean(value && typeof value === 'object' && Number(value.mission) >= 0 && Number(value.mission) <= 10);
}

export function readSave() {
  try {
    const stored = localStorage.getItem(CONFIG.saveKey);
    if (!stored) return null;
    const value = JSON.parse(stored);
    if (!canResume(value)) return null;
    if (value.version !== undefined && value.version !== SAVE_VERSION) return null;
    return {
      mission: wholeNumber(value.mission, 0, 0, 10),
      cash: wholeNumber(value.cash, 250, 0),
      health: wholeNumber(value.health, 100, 1, 100),
      writtenAt: wholeNumber(value.updated, 0, 0),
      saveVersion: SAVE_VERSION
    };
  } catch (error) {
    return null;
  }
}

export function writeSave(state) {
  const record = {
    version: SAVE_VERSION,
    mission: wholeNumber(state.mission, 0, 0, 10),
    cash: wholeNumber(state.cash, 0, 0),
    health: wholeNumber(state.health, 100, 1, 100),
    updated: Date.now()
  };
  try {
    localStorage.setItem(CONFIG.saveKey, JSON.stringify(record));
    return { ok: true, record };
  } catch (error) {
    return { ok: false, record, reason: error?.name || 'storage unavailable' };
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(CONFIG.saveKey);
    return true;
  } catch {
    return false;
  }
}

export function saveSummary(value) {
  return `CHAPTER ${Math.min(10, value.mission)}/10 · $${wholeNumber(value.cash, 0, 0)} · HEALTH ${wholeNumber(value.health, 100, 0, 100)}%`;
}

// The checkpoint carries mission, cash and health under sunward-bay-save-v1.
