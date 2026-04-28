import React, { useEffect } from "react";
import * as todoApi from "../../../api/todoApi";

const MainTodo = ({ todo, setTodo }) => {
  React.useEffect(() => {
    todoApi.getTodos()
      .then((res) => {
        setTodo(res.data);
      })
      .catch(() => {});
  }, [setTodo]);

  function tickTodo(todoId, status) {
    setTodo((current) =>
      current.map((item) =>
        item.todoId === todoId ? { ...item, status } : item
      )
    );
    todoApi.updateTodo(todoId, status)
      .catch(() => {});
  }

  const getRelativeDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      // Parse "6 Apr 2026" or similar formats
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return dateStr;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const target = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays === -1) return "Yesterday";
      if (diffDays > 1 && diffDays <= 7) return "This week";
      if (diffDays > 7 && diffDays <= 14) return "Next week";
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const activeTodos = todo.slice(0, 5); // Show max 5 in dashboard

  return (
    <div className="dash-todo-wrapper">
      <ul className="dash-quick-todo">
        {activeTodos.length === 0 && <p className="empty-state">No upcoming tasks.</p>}
        {activeTodos.map((item) => (
          <li key={item.todoId} className={`quick-todo-item ${item.status ? "completed" : ""}`}>
            <label className="quick-checkbox-wrapper">
              <input
                type="checkbox"
                checked={item.status}
                onChange={(e) => tickTodo(item.todoId, e.target.checked)}
              />
              <span className="dash-circle-checkbox"></span>
              <span className="quick-todo-text">{item.title}</span>
            </label>
            <span className={`quick-todo-date ${getRelativeDate(item.dateAdded) === "Today" ? "today" : ""}`}>
              {getRelativeDate(item.dateAdded)}
            </span>
          </li>
        ))}
      </ul>
      <div className="dash-todo-footer">
        <a href="/Home/todos" className="add-item-link">+ Add item</a>
      </div>
    </div>
  );
};

export default MainTodo;
