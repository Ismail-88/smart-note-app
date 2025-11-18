import { useSelector } from 'react-redux';
import { selectFilteredNotes } from './notesSlice';
import NoteCard from './NoteCard';

function NotesList({showCheckbox}) {
  const notes = useSelector(selectFilteredNotes);

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No notes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} showCheckbox={showCheckbox}/>
      ))}
    </div>
  );
}

export default NotesList;