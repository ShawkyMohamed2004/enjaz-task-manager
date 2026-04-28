import React, { useEffect } from "react";
import * as taskApi from "../../../api/taskApi";

const MainTask = ({ tasks, setTasks }) => {
  const normalizePriority = (p) => {
    const map = { top: "High", average: "Medium", low: "Low" };
    return map[p] || p || "Low";
  };

  React.useEffect(() => {
    taskApi.getTasks()
      .then((res) => {
        setTasks(res.data);
      })
      .catch(() => {});
  }, [setTasks]);

  const activeTasks = tasks.filter(t => !t.done);

  return (
    <div className="dash-task-wrapper">
      <div className="task-table-scroll">
        <table className="dash-task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeTasks.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">No active tasks</td>
              </tr>
            )}
            {activeTasks.map((eachTask) => (
              <tr key={eachTask.id}>
                <td className="dash-task-name">{eachTask.task?.taskName || "Unnamed Task"}</td>
                <td>
                  <span className={`priority-pill ${normalizePriority(eachTask.task?.priority)}`}>
                    {normalizePriority(eachTask.task?.priority)}
                  </span>
                </td>
                <td className="dash-task-date">{eachTask.task?.deadline || "No Date"}</td>
                <td>
                  <span className="status-pill in-progress">In Progress</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainTask;
