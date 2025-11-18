import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeId: null, 
  filter: 'all',
  searchQuery: '',
  selectedNotes: [], 
  sortBy: 'lastUpdated', 
  viewMode: 'advanced', 
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Create new note
    addNote: (state) => {
      const newNote = {
        id: Date.now().toString(),
        title: 'Untitled Note',
        content: '',
        tags: [],
        starred: false,
        pinned: false,
        mode: 'text',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
      state.items.unshift(newNote);
      state.activeId = newNote.id;
    },

    // Update note
    updateNote: (state, action) => {
      const note = state.items.find(n => n.id === action.payload.id);
      if (note) {
        Object.assign(note, action.payload.changes);
        note.updated = new Date().toISOString();
      }
    },

    // Delete note
    deleteNote: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
      if (state.activeId === action.payload) {
        state.activeId = state.items[0]?.id || null;
      }
    },

    // Set active note
    setActive: (state, action) => {
      state.activeId = action.payload;
    },

    // Toggle star
    toggleStar: (state, action) => {
      const note = state.items.find(n => n.id === action.payload);
      if (note) note.starred = !note.starred;
    },

    // Toggle pin
    togglePin: (state, action) => {
      const note = state.items.find(n => n.id === action.payload);
      if (note) note.pinned = !note.pinned;
    },

    // Add tag
    addTag: (state, action) => {
      const note = state.items.find(n => n.id === action.payload.noteId);
      if (note && !note.tags.includes(action.payload.tag)) {
        note.tags.push(action.payload.tag);
      }
    },

    // Remove tag
    removeTag: (state, action) => {
      const note = state.items.find(n => n.id === action.payload.noteId);
      if (note) {
        note.tags = note.tags.filter(t => t !== action.payload.tag);
      }
    },

    // Set filter
    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    // Set search
    setSearch: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Toggle note selection
    toggleSelectNote: (state, action) => {
      const id = action.payload;
      if (state.selectedNotes.includes(id)) {
        state.selectedNotes = state.selectedNotes.filter(noteId => noteId !== id);
      } else {
        state.selectedNotes.push(id);
      }
    },

    // Select all notes
    selectAllNotes: (state) => {
      state.selectedNotes = state.items.map(note => note.id);
    },

    // Clear selection
    clearSelection: (state) => {
      state.selectedNotes = [];
    },

    // Delete selected notes
    deleteSelectedNotes: (state) => {
      state.items = state.items.filter(note => !state.selectedNotes.includes(note.id));
      if (state.selectedNotes.includes(state.activeId)) {
        state.activeId = state.items[0]?.id || null;
      }
      state.selectedNotes = [];
    },

    // Set sort option
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    // Set view mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  addNote,
  updateNote,
  deleteNote,
  setActive,
  toggleStar,
  togglePin,
  addTag,
  removeTag,
  setFilter,
  setSearch,
  toggleSelectNote,
  selectAllNotes,
  clearSelection,
  deleteSelectedNotes,
  setSortBy,
  setViewMode,
} = notesSlice.actions;

// Selectors
export const selectActiveNote = (state) => 
  state.notes.items.find(n => n.id === state.notes.activeId);

export const selectFilteredNotes = (state) => {
  let notes = [...state.notes.items];
  
  // Apply search
  if (state.notes.searchQuery) {
    notes = notes.filter(n => 
      n.title.toLowerCase().includes(state.notes.searchQuery.toLowerCase())
    );
  }
  
  // Apply filter
  if (state.notes.filter === 'starred') {
    notes = notes.filter(n => n.starred);
  } else if (state.notes.filter === 'pinned') {
    notes = notes.filter(n => n.pinned);
  }
  
  // Sort based on sortBy
  const sortBy = state.notes.sortBy;
  
  if (sortBy === 'lastUpdated') {
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.updated) - new Date(a.updated);
    });
  } else if (sortBy === 'created') {
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.created) - new Date(a.created);
    });
  } else if (sortBy === 'titleAZ') {
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return a.title.localeCompare(b.title);
    });
  }
  
  return notes;
};

export default notesSlice.reducer;