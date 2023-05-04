const GAME_KEY = 'SAVED_GAME_862e5a27-7c6d';
const HISTORY_KEY = 'SAVED_MOVE_HISTORY_862e5a27-7c6d';
const OPTIONS_KEY = 'GAME_OPTIONS_862e5a27-7c6d';
const SCORES_KEY = 'GAME_SCORES_862e5a27-7c6d';

// Local Storage Shorthands

function loadFromStorage(key) {
  let object;
  try {
    object = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    object = null;
  }
  return object;
}

function saveToStorage(key, obj) {
  window.localStorage.setItem(key, JSON.stringify(obj));
}

function isInStorage(key) {
  return loadFromStorage(key) !== null;
}

function isGameSaved() {
  return isInStorage(GAME_KEY) && isInStorage(HISTORY_KEY);
}

export {
  loadFromStorage, saveToStorage, isInStorage, isGameSaved,
  GAME_KEY, HISTORY_KEY, OPTIONS_KEY, SCORES_KEY,
};
