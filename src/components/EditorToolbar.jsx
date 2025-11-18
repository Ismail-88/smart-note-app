import { useSelector } from 'react-redux';
import { Save } from 'lucide-react';

function EditorToolbar({ mode, setMode, onSave }) {
  const theme = useSelector(state => state.theme.mode);
  const viewMode = useSelector(state => state.notes.viewMode);
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const modes = [
    { id: 'text', label: 'Text' },
    { id: 'rich', label: 'Rich' },
    { id: 'draw', label: 'Draw' },
  ];

  return (
    <div className={`p-4 border-b ${border} flex items-center justify-between`}>
      <div className="flex gap-2">
        {viewMode === 'advanced' && (
          <>
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded transition ${
                  mode === m.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </>
        )}
        <button className="px-4 py-2 rounded hover:bg-gray-700 transition">
          🤖 AI Assistant
        </button>
      </div>

      <button
        onClick={onSave}
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
      >
        <Save size={18} />
        Save
      </button>
    </div>
  );
}

export default EditorToolbar;