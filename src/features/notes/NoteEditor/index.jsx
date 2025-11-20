import EditorToolbar from "../../../components/EditorToolbar";
import TagManager from "../../../components/TagManager";
import CustomRichEditor from "../../../components/CustomRichEditor";
import { Trash2 } from "lucide-react";

import useNoteEditor from "./useNoteEditor";

export default function NoteEditor({ note }) {
  const {
    title,
    setTitle,
    content,
    setContent,
    mode,
    setMode,
    effectiveMode,
    inputBg,
    canvasRef,
    penColor,
    setPenColor,
    penSize,
    setPenSize,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    handleSave,
    formatDate,
  } = useNoteEditor(note);

  return (
    <div className="flex flex-col h-full">
      
      <EditorToolbar mode={mode} setMode={setMode} onSave={handleSave} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
         
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-3xl font-bold bg-transparent border-none focus:outline-none"
          />

          
          <div className="space-y-3">
            <TagManager noteId={note.id} tags={note.tags} />
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Created: {formatDate(note.created)}</span>
              <span>Updated: {formatDate(note.updated)}</span>
            </div>
          </div>

          
          {effectiveMode === "text" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing..."
              className={`w-full h-96 p-4 rounded-lg ${inputBg} border`}
            />
          )}

          
          {effectiveMode === "rich" && (
            <CustomRichEditor content={content} onChange={setContent} />
          )}

         
          {effectiveMode === "draw" && (
            <div className={`p-4 rounded-lg ${inputBg} border`}>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <span className="text-sm">Color:</span>
                  {["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setPenColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          penColor === color ? "border-blue-500 scale-110" : "border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
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

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full bg-white border-2 rounded cursor-crosshair"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
