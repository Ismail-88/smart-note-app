import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNote } from "../../../features/notes/notesSlice";
import toast from "react-hot-toast";

export default function useNoteEditor(note) {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.mode);
  const viewMode = useSelector((state) => state.notes.viewMode);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [mode, setMode] = useState(note.mode);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(2);

  const isDark = theme === "dark";
  const inputBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-300";

  const effectiveMode = viewMode === "simple" ? "text" : mode;

  // Sync when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setMode(note.mode);
  }, [note.id]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        updateNote({
          id: note.id,
          changes: { title, content, mode },
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, mode]);

  const handleSave = () => {
    dispatch(
      updateNote({
        id: note.id,
        changes: { title, content, mode },
      })
    );
    toast.success("Note saved!");
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    toast.success("Canvas cleared");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return {
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
  };
}
