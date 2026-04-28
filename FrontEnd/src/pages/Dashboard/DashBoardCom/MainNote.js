import React, { useEffect } from "react";
import * as noteApi from "../../../api/noteApi";
import { useNavigate } from "react-router-dom";
import { BsPinFill, BsPin } from "react-icons/bs";

const MainNote = ({ notes, setNotes }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    noteApi.getNotes()
      .then((res) => {
        setNotes(res.data);
      })
      .catch(() => {});
  }, [setNotes]);

  // Sort notes to show pinned ones first, or newest
  const displayNotes = [...notes]
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    .slice(0, 6);

  return (
    <div className="dash-note-wrapper">
      <div className="dash-notes-grid">
        {displayNotes.length === 0 && <p className="empty-state">No notes right now.</p>}
        {displayNotes.map((eachNote) => (
          <div 
            key={eachNote.id} 
            className={`dash-mini-note ${eachNote.pinned ? 'pinned' : ''}`}
            onClick={() => navigate("/Home/notes")}
          >
            <div className="mini-note-accent"></div>
            <div className="mini-note-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4>{eachNote.title || "Untitled Note"}</h4>
              {eachNote.pinned ? <BsPinFill size={12} color="#10B981" /> : <BsPin size={12} color="#94A3B8" opacity={0.5} />}
            </div>
            <p className="mini-note-body">{eachNote.noteText?.substring(0, 60)}{eachNote.noteText?.length > 60 ? "..." : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainNote;
