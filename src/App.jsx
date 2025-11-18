import { useSelector } from 'react-redux';
import { selectActiveNote } from './features/notes/notesSlice';
import Sidebar from './components/sidebar';
import NoteEditor from './features/notes/NoteEditor';

function App() {
  const theme = useSelector(state => state.theme.mode);
  const activeNote = useSelector(selectActiveNote);

  return (
    <div className={theme}>
      <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Sidebar />
        
        <main className="flex-1">
          {activeNote ? (
            <NoteEditor note={activeNote} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">No Note Selected</h2>
                <p>Create or select a note to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;