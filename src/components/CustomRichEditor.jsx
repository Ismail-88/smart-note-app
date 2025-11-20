import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

function CustomRichEditor({ content, onChange }) {
  const editorRef = useRef(null);
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const buttons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  const inputBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';
  const toolbarBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={`rounded-lg border ${inputBg}`}>
      
      <div className={`p-2 border-b ${inputBg} flex gap-1 flex-wrap ${toolbarBg}`}>
        {buttons.map(({ icon: Icon, command, value, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => format(command, value)}
            title={title}
            className="p-2 transition rounded hover:bg-gray-600"
          >
            <Icon size={18} />
          </button>
        ))}
        
        <div className="mx-2 border-l border-gray-500" />
        
        <input
          type="color"
          onChange={(e) => format('foreColor', e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          title="Text Color"
        />
        
        <input
          type="color"
          onChange={(e) => format('backColor', e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          title="Background Color"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-4 min-h-[384px] max-h-[384px] overflow-y-auto focus:outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
        style={{
          caretColor: isDark ? 'white' : 'black',
        }}
        data-placeholder="Start typing with rich formatting..."
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: ${isDark ? '#9ca3af' : '#6b7280'};
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
}

export default CustomRichEditor;