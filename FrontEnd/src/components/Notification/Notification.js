import React from "react";
import "./notification.css";

const Notification = ({ closeNotifi, upcomingTasks }) => {
  const normalizePriority = (p) => {
    const map = { top: "High", average: "Medium", low: "Low" };
    return map[p] || p || "Low";
  };
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      });
    } catch { 
      return dateStr; 
    }
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      });
    } catch { 
      return "11:59 PM"; 
    }
  };

  const getPriorityLabel = (p) => {
    switch (p) {
      case "High": return "High";
      case "Medium": return "Medium";
      case "Low": return "Low";
      default: return "Normal";
    }
  };

  const getPriorityIcon = (p) => {
    switch (p) {
      case "High": return "🔴";
      case "Medium": return "🟡";
      case "Low": return "🔵";
      default: return "⚪";
    }
  };

  return (
    <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <h4>Today's Tasks</h4>
        <button onClick={closeNotifi} className="notif-close">✕</button>
      </div>
      <div className="notif-body">
        {upcomingTasks.length === 0 && (
          <div className="notif-empty">
            <span className="notif-empty-icon">🎉</span>
            <p>No tasks due today!</p>
          </div>
        )}
        {upcomingTasks.map((eachTask) => (
          <div key={eachTask.id} className="notif-item">
            <div className="notif-icon-wrapper">
              <span className="notif-icon">📌</span>
            </div>
            <div className="notif-content">
              <div className="notif-title">
                Task '{eachTask.task?.taskName || "Unnamed Task"}' is due on {formatDate(eachTask.task?.deadline || "No Date")}
              </div>
              <div className="notif-priority-row">
                <span className={`notif-priority ${normalizePriority(eachTask.task?.priority)}`}>
                  {getPriorityIcon(normalizePriority(eachTask.task?.priority))} {getPriorityLabel(normalizePriority(eachTask.task?.priority))} Priority
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {upcomingTasks.length > 0 && (
        <div className="notif-footer">
          <span>{upcomingTasks.length} task{upcomingTasks.length > 1 ? 's' : ''} due today</span>
        </div>
      )}
    </div>
  );
};

export default Notification;
