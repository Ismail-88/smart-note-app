import { configureStore } from '@reduxjs/toolkit';
import notesReducer from '../features/notes/notesSlice';
import themeReducer from '../features/theme/themeSlice';

// Load from localStorage
const loadState = () => {
  try {
    const saved = localStorage.getItem('smartNotes');
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
};

// Save to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem('smartNotes', JSON.stringify(state));
  } catch {
    console.error('Failed to save state');
  }
};

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    theme: themeReducer,
  },
  preloadedState: loadState(),
});

// Auto-save on every change
store.subscribe(() => {
  saveState(store.getState());
});

export default store;