import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { setSearch } from '../features/notes/notesSlice';

function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.notes.searchQuery);
  const theme = useSelector(state => state.theme.mode);
  
  const isDark = theme === 'dark';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className={`w-full pl-10 pr-4 py-2 rounded ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
      />
    </div>
  );
}

export default SearchBar;