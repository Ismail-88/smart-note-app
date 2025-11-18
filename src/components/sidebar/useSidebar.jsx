import {
  addNote,
  setSortBy,
  setViewMode,
  selectAllNotes,
  clearSelection,
  deleteSelectedNotes
} from "../../features/notes/notesSlice";

import { toggleTheme } from "../../features/themes/themeSlice";
import toast from "react-hot-toast";
import { FolderOpen, Pin, Star } from "lucide-react";

export const filterIcons = {
  all: <FolderOpen size={16} />,
  pinned: <Pin size={16} />,
  starred: <Star size={16} />
};

export function useSidebar(dispatch, theme, selectedNotes = []) {
  return {
    handleNewNote: () => {
      dispatch(addNote());
      toast.success("New note created!");
    },

    handleThemeToggle: () => {
      dispatch(toggleTheme());
      toast.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
    },

    handleSelectAll: () => {
      if (selectedNotes.length > 0) {
        dispatch(clearSelection());
        toast.success("Selection cleared");
      } else {
        dispatch(selectAllNotes());
        toast.success("All notes selected");
      }
    },

    handleClearSelection: () => {
      dispatch(clearSelection());
      toast.success("Selection cleared");
    },

    handleDeleteSelected: () => {
      if (!selectedNotes.length) {
        toast.error("No notes selected");
        return;
      }

      if (confirm(`Delete ${selectedNotes.length} note(s)?`)) {
        dispatch(deleteSelectedNotes());
        toast.success(`Deleted ${selectedNotes.length} note(s)`);
      }
    },

    handleSortChange: (value) => {
      dispatch(setSortBy(value));
      toast.success(
        `Sorted by ${
          value === "lastUpdated"
            ? "Last Updated"
            : value === "created"
            ? "Time Created"
            : "Title A-Z"
        }`
      );
    },

    handleViewModeChange: (value) => {
      dispatch(setViewMode(value));
      toast.success(`Switched to ${value} mode`);
    },
  };
}
