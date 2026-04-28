import React, { useEffect, useMemo, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import "../../components/Notes/notes.css";
import Note from "../../components/Notes/Note";
import Dialog from "../../components/SrNoDialog/Dialog";
import * as noteApi from "../../api/noteApi";
import Aos from "aos";
import "aos/dist/aos.css";

const Notes = ({ notes, setNotes, toast }) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    noteApi.getNotes()
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, [setNotes]);

  const filteredItems = useMemo(() => {
    return notes
      .filter((eachItem) => {
        return eachItem.title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Priority 1: Pinned status
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
        // Priority 2: Pinned time (If both pinned, most recent pinnedAt comes first)
        if (a.pinned && b.pinned) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
        // Priority 3: Natural order for others
        return 0;
      });
  }, [notes, searchQuery]);

  const addNote = (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const title = noteTitle || "Untitled Note";
    const now = new Date();
    const date = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const time = now.toLocaleTimeString();
    const newNote = {
      id: id,
      noteText: "",
      date: date,
      time: time,
      title: title,
    };
    setNotes([...notes, newNote]);
    setNoteTitle("");
    noteApi.postNote(newNote)
      .catch((err) => console.log(err));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(n => n.id)));
    }
  };

  const deleteSelected = () => {
    setDeleteDialog(true);
  };

  const confirmBulkDelete = (yes) => {
    if (yes) {
      const count = selectedIds.size;
      selectedIds.forEach(id => {
        noteApi.deleteNote(id);
      });
      setNotes(notes.filter(n => !selectedIds.has(n.id)));
      setSelectedIds(new Set());
      toast.success(`${count} note${count > 1 ? 's' : ''} deleted`);
    }
    setDeleteDialog(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const isSelectionMode = selectedIds.size > 0;

  return (
    <div className="notes-body" data-aos="zoom-in">
      {deleteDialog && <Dialog 
        areYouSure={confirmBulkDelete} 
        title="Delete Selected Notes"
        text={`Are you sure you want to delete ${selectedIds.size} selected note(s)?`}
      />}
      <div className="notes-header-flex">
        <h1>Notes</h1>
        <div className="notes-actions">
          {isSelectionMode && (
            <div className="notes-bulk-actions">
              <button className="notes-bulk-btn cancel" onClick={() => setSelectedIds(new Set())}>
                Cancel
              </button>
              <button className="notes-bulk-btn select-all" onClick={selectAll}>
                {selectedIds.size === filteredItems.length ? 'Unselect All' : 'Select All'}
              </button>
              <button className="notes-bulk-btn delete-selected" onClick={deleteSelected}>
                <AiFillDelete size={16} /> Delete ({selectedIds.size})
              </button>
            </div>
          )}
          <button onClick={addNote} id="note-add-bt">
            + New Note
          </button>
          <div className="search-bar-inner">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search notes..."
            />
            <BiSearchAlt2 size={20} color="#94A3B8" />
          </div>
        </div>
      </div>
      
      <div className="notes-div" data-aos="zoom-out">
        {filteredItems.map((note) => (
          <Note
            key={note.id}
            val={note}
            notes={notes}
            setNotes={setNotes}
            toast={toast}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            onDelete={handleDeleteNote}
            isSelectionMode={isSelectionMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;
