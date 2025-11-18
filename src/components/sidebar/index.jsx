import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Sun,
  Moon,
  Trash2,
  ChevronDown,
} from "lucide-react";


import {
  setFilter,
} from "../../features/notes/notesSlice";

import SearchBar from "../SearchBar";
import NotesList from "../../features/notes/NotesList";

import { filterIcons, useSidebar } from "./useSidebar";

function Sidebar() {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.mode);
  const filter = useSelector((state) => state.notes.filter);
  const notesCount = useSelector((state) => state.notes.items.length);
  const selectedNotes = useSelector((state) => state.notes.selectedNotes);
  const sortBy = useSelector((state) => state.notes.sortBy);
  const viewMode = useSelector((state) => state.notes.viewMode);

  const isDark = theme === "dark";
  const bg = isDark ? "bg-gray-800" : "bg-gray-50";
  const border = isDark ? "border-gray-700" : "border-gray-200";

  const handlers = useSidebar(dispatch, theme, selectedNotes);
  const showCheckbox = selectedNotes.length > 0;

  return (
    <aside className={`w-80 ${bg} border-r ${border} flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b ${border}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Smart Notes</h1>
          <div className="flex gap-2">
            <button
              onClick={handlers.handleThemeToggle}
              className="p-2 rounded hover:bg-gray-700 transition"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handlers.handleNewNote}
              className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <SearchBar />

        {/* Selection Controls */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-gray-500">{selectedNotes.length} selected</span>

          <button
            onClick={handlers.handleSelectAll}
            className="text-sm text-blue-500 hover:text-blue-400 transition"
          >
            {selectedNotes.length > 0 ? "Clear" : "Select All"}
          </button>

          {selectedNotes.length > 0 && (
            <>
              <button
                onClick={handlers.handleClearSelection}
                className="text-sm text-gray-500 hover:text-gray-400 transition"
              >
                Clear
              </button>

              <button
                onClick={handlers.handleDeleteSelected}
                className="ml-auto px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete ({selectedNotes.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* View Mode Selector */}
      <div className={`p-4 border-b ${border}`}>
        <div className="relative">
          <select
            value={viewMode}
            onChange={(e) => handlers.handleViewModeChange(e.target.value)}
            className={`w-full px-3 py-2 rounded ${
              isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer`}
          >
            <option value="simple">Simple</option>
            <option value="advanced">Advanced</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-400" size={16} />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          {["all", "pinned", "starred"].map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f))}
              className={`px-4 py-2 rounded capitalize transition flex items-center gap-1 ${
                filter === f ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              {filterIcons[f]}
              {f}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Recent</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handlers.handleSortChange(e.target.value)}
              className={`w-full px-3 py-2 rounded ${
                isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-sm`}
            >
              <option value="lastUpdated">Last Updated</option>
              <option value="created">Time Created</option>
              <option value="titleAZ">Title A-Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-400" size={14} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Notes</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">All Notes ({notesCount})</span>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <NotesList showCheckbox={showCheckbox} />
      </div>
    </aside>
  );
}

export default Sidebar;
