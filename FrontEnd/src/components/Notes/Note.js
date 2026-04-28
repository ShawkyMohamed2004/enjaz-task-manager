import React, { useEffect, useState, useRef, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsPin, BsPinFill } from "react-icons/bs";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { ImCheckboxUnchecked } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { VscEllipsis } from "react-icons/vsc";
import Dialog from "../SrNoDialog/Dialog";
import * as noteApi from "../../api/noteApi";
import "./notes.css";

const Note = (props) => {
  const { val, notes, setNotes, toast, selectedIds, toggleSelect, onDelete, isSelectionMode } = props;
  const [dialog, setDialog] = useState({ isLoading: false });
  const [text, setText] = useState(val.noteText);
  const [title, setTitle] = useState(val.title);
  const [pinned, setPinned] = useState(val.pinned || false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [saved, setSaved] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef();
  const idRef = useRef();
  const saveTimerRef = useRef(null);
  const menuRef = useRef(null);

  const isSelected = selectedIds?.has(val.id);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    } catch { return dateStr; }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const parts = timeStr.split(":");
        return parts[0] + ":" + parts[1] + " " + timeStr.slice(-2);
      }
      return timeStr;
    } catch { return timeStr; }
  };

  const autoSave = useCallback(async (id, newText, newTitle, newDate, newTime) => {
    noteApi.updateNote(id, { newText, newTitle, newDate, newTime })
      .then(() => setSaved(true))
      .catch((err) => console.log(err));
  }, []);

  const triggerSave = useCallback((newText, newTitle) => {
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const now = new Date();
      const newDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      const newTime = now.toLocaleTimeString();

      setNotes((current) =>
        current.map((n) =>
          n.id === val.id ? { ...n, noteText: newText, title: newTitle, date: newDate, time: newTime } : n
        )
      );

      autoSave(val.id, newText, newTitle, newDate, newTime);
    }, 1500);
  }, [autoSave, val.id, setNotes]);

  const typing = (e) => {
    const newText = e.target.value;
    setText(newText);
    setNotes((current) => current.map((n) => (n.id === val.id ? { ...n, noteText: newText } : n)));
    triggerSave(newText, title);
  };

  const typingTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setNotes((current) => current.map((n) => (n.id === val.id ? { ...n, title: newTitle } : n)));
    triggerSave(text, newTitle);
  };

  const togglePin = () => {
    const newPinned = !pinned;
    const newPinnedAt = newPinned ? Date.now() : 0;
    setPinned(newPinned);
    setNotes(notes.map((n) => n.id === val.id ? { ...n, pinned: newPinned, pinnedAt: newPinnedAt } : n));
    noteApi.updateNote(val.id, { pinned: newPinned, pinnedAt: newPinnedAt })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, []);

  const deleteNote = (id) => {
    setDialog({ isLoading: true });
    idRef.current = id;
  };

  const areYouSure = (yes) => {
    if (yes) {
      noteApi.deleteNote(idRef.current)
        .catch((err) => console.log(err));
      onDelete(idRef.current);
      setDialog({ isLoading: false });
      toast.success("Deleted Successfully");
    } else {
      setDialog({ isLoading: false });
    }
  };

  const handleSelect = () => {
    toggleSelect(val.id);
    setMenuOpen(false);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.note-checkbox') || 
        e.target.closest('.note-menu-wrapper') ||
        e.target.closest('.note-title-input') ||
        e.target.closest('.note-textarea')) {
      return;
    }
    if (isSelectionMode) {
      toggleSelect(val.id);
    }
  };

  return (
    <>
      {dialog.isLoading && <Dialog areYouSure={areYouSure} />}
      <div 
        className={`note-card ${pinned ? 'pinned' : ''} ${isSelected ? 'selected' : ''} ${isSelectionMode ? 'selection-active' : ''}`}
        onClick={handleCardClick}
      >
        <div className="note-accent-bar"></div>

        <div className="note-top-row">
          <div className="note-checkbox" onClick={(e) => { e.stopPropagation(); toggleSelect(val.id); }}>
            {isSelected ? (
              <BsCheckSquare size={20} color="#10B981" />
            ) : (
              <BsSquare size={20} color="#94A3B8" />
            )}
          </div>
          <div className="note-top-right">
            <span className={`note-save-indicator ${saved ? 'saved' : 'saving'}`}>
              {saved ? <><FaCheck size={8} /> Saved</> : "Saving..."}
            </span>
            <button className="note-pin-btn" onClick={(e) => { e.stopPropagation(); togglePin(); }}>
              {pinned ? <BsPinFill size={14} color="#10B981" /> : <BsPin size={14} color="#94A3B8" />}
            </button>
          </div>
        </div>

        <div className="note-content-area">
          {editingTitle ? (
            <input
              type="text"
              value={title}
              onChange={typingTitle}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
              autoFocus
              className="note-title-input"
            />
          ) : (
            <h3 className="note-title" onClick={() => setEditingTitle(true)} title="Click to edit title">
              {title}
            </h3>
          )}

          <textarea
            ref={textareaRef}
            value={text}
            spellCheck="false"
            onChange={typing}
            placeholder="Start typing..."
            className="note-textarea"
          ></textarea>
        </div>

        <div className="note-footer-row">
          <div className="note-date-time">
            <span className="note-date">{formatDate(val.date)}</span>
            {val.time && (
              <span className="note-time">
                <IoTimeOutline size={11} style={{ marginRight: '3px', verticalAlign: 'text-bottom' }} />
                {formatTime(val.time)}
              </span>
            )}
          </div>
          <div className="note-menu-wrapper" ref={menuRef}>
            <button 
              className="note-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <VscEllipsis size={18} />
            </button>
            {menuOpen && (
              <div className="note-menu-dropdown">
                <button onClick={handleSelect}>
                  <ImCheckboxUnchecked size={14} /> Select
                </button>
                <button onClick={() => { deleteNote(val.id); setMenuOpen(false); }} className="delete">
                  <AiFillDelete size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
