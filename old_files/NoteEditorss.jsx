import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Eraser, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateNote } from './notesSlice';
import EditorToolbar from '../../components/EditorToolbar';
import TagManager from '../../components/TagManager';
import CustomRichEditor from '../../components/CustomRichEditor';

function NoteEditor({ note }) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const viewMode = useSelector(state => state.notes.viewMode);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [mode, setMode] = useState(note.mode);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);

  const isDark = theme === 'dark';
  const border = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';

  // In simple mode, always use text
  const effectiveMode = viewMode === 'simple' ? 'text' : mode;

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setMode(note.mode);
  }, [note.id]);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        dispatch(updateNote({
          id: note.id,
          changes: { title, content, mode }
        }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, content, mode]);

  const handleSave = () => {
    dispatch(updateNote({
      id: note.id,
      changes: { title, content, mode }
    }));
    toast.success('Note saved!');
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    toast.success('Canvas cleared');
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col h-full">
     
      <EditorToolbar mode={mode} setMode={setMode} onSave={handleSave} />

      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-3xl font-bold bg-transparent border-none focus:outline-none"
          />

          {/* Metadata */}
          <div className="space-y-3">
            <TagManager noteId={note.id} tags={note.tags} />
            
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Created: {formatDate(note.created)}</span>
              <span>Updated: {formatDate(note.updated)}</span>
            </div>
          </div>

          {/* Text Mode */}
          {effectiveMode === 'text' && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing..."
              className={`w-full h-96 p-4 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
          )}

          {/* Rich Text Mode */}
          {effectiveMode === 'rich' && (
            <CustomRichEditor content={content} onChange={setContent} />
          )}

          {/* Draw Mode */}
          {effectiveMode === 'draw' && (
            <div className={`p-4 rounded-lg ${inputBg} border`}>
              {/* Drawing Controls */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <span className="text-sm">Color:</span>
                  {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                    <button
                      key={color}
                      onClick={() => setPenColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${penColor === color ? 'border-blue-500 scale-110' : 'border-gray-400'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={penSize}
                    onChange={(e) => setPenSize(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm">{penSize}px</span>
                </div>

                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-2 px-4 py-2 ml-auto text-white bg-red-600 rounded hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>

              {/* Canvas */}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`border-2 rounded cursor-crosshair w-full ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-white'}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;