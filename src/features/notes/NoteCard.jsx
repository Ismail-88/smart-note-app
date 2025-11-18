import { useDispatch, useSelector } from 'react-redux';
import { Star, Trash2, Pin } from 'lucide-react';
import toast from 'react-hot-toast';
import { setActive, deleteNote, toggleStar, togglePin, toggleSelectNote } from './notesSlice';

function NoteCard({ note, showCheckbox  }) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const activeId = useSelector(state => state.notes.activeId);
  const selectedNotes = useSelector(state => state.notes.selectedNotes);
  
  const isActive = note.id === activeId;
  const isSelected = selectedNotes.includes(note.id);
  const isDark = theme === 'dark';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      dispatch(deleteNote(note.id));
      toast.success('Note deleted');
    }
  };

  const handleStar = (e) => {
    e.stopPropagation();
    dispatch(toggleStar(note.id));
    toast.success(note.starred ? 'Unstarred' : 'Starred');
  };

  const handlePin = (e) => {
    e.stopPropagation();
    dispatch(togglePin(note.id));
    toast.success(note.pinned ? 'Unpinned' : 'Pinned');
  };

  const handleToggleSelect = (e) => {
    e.stopPropagation();
    dispatch(toggleSelectNote(note.id));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const cardBg = isActive
    ? (isDark ? 'bg-gray-600 border-blue-500' : 'bg-blue-50 border-blue-400')
    : isSelected
    ? (isDark ? 'bg-gray-650 border-blue-400' : 'bg-blue-100 border-blue-300')
    : (isDark ? 'bg-gray-700 border-transparent' : 'bg-gray-100 border-transparent');

  return (
    <div
      onClick={() => dispatch(setActive(note.id))}
      className={`p-4 rounded-lg cursor-pointer border-2 transition hover:border-gray-500 ${cardBg} relative`}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          onClick={(e) => {
            e.stopPropagation(); 
          }}
          className="absolute top-2 left-2 w-4 h-4 cursor-pointer"
        />
      )}
      {/* Header */}
      <div className="flex items-start justify-between mb-2 ml-6">
        <h3 className="font-semibold truncate flex-1">{note.title}</h3>
        <div className="flex gap-1 ml-2">
          <button onClick={handlePin} className="hover:scale-110 transition">
            <Pin size={16} className={note.pinned ? 'fill-blue-500 text-blue-500' : 'text-gray-400'} />
          </button>
          <button onClick={handleStar} className="hover:scale-110 transition">
            <Star size={16} className={note.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
          </button>
          <button onClick={handleDelete} className="hover:scale-110 transition">
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
        {note.content || 'No content'}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap">
        {note.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
            {tag}
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-auto">
          {formatDate(note.updated)}
        </span>
      </div>
    </div>
  );
}

export default NoteCard;