import React from "react";
import ReactDOM from "react-dom";
import { IoWarningOutline } from "react-icons/io5";
import "./dialog.css";

const Dialog = ({ areYouSure, title = "Delete Item", text = "Are you sure you want to delete this? This action cannot be undone." }) => {
  return ReactDOM.createPortal(
    <div className="dialog-overlay" onClick={() => areYouSure(false)}>
      <div className="dialog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">
          <IoWarningOutline size={36} color="#EF4444" />
        </div>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-text">{text}</p>
        <div className="dialog-actions">
          <button onClick={() => areYouSure(false)} className="dialog-btn-cancel">
            Cancel
          </button>
          <button onClick={() => areYouSure(true)} className="dialog-btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
