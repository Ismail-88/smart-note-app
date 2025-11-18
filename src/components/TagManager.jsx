import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { addTag, removeTag } from '../features/notes/notesSlice';

function TagManager({ noteId, tags }) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const [input, setInput] = useState('');

  const isDark = theme === 'dark';
  const inputBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';

  const handleAdd = () => {
    const tag = input.trim();
    if (!tag) return;
    
    if (tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }

    dispatch(addTag({ noteId, tag }));
    setInput('');
    toast.success('Tag added');
  };

  const handleRemove = (tag) => {
    dispatch(removeTag({ noteId, tag }));
    toast.success('Tag removed');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${inputBg} border flex-wrap`}>
      <Tag size={16} className="text-gray-500" />
      
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-sm">
          {tag}
          <button onClick={() => handleRemove(tag)} className="hover:scale-110">
            <X size={14} />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        className="flex-1 min-w-[100px] bg-transparent focus:outline-none text-sm"
      />

      <button
        onClick={handleAdd}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
      >
        Add
      </button>
    </div>
  );
}

export default TagManager;