import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiSearchAlt2 } from "react-icons/bi";
import { IoArrowUndoSharp, IoCheckmarkCircle } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { VscEllipsis } from "react-icons/vsc";
import { ImCheckboxUnchecked } from "react-icons/im";
import Dialog from "../../components/SrNoDialog/Dialog";
import "./task.css";
import Aos from "aos";
import * as taskApi from "../../api/taskApi";
import "aos/dist/aos.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Modern Custom Select Component
const ModernSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0, direction: 'down' });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target) &&
        !e.target.closest('.modern-select-dropdown')
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const toggleOpen = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = options.length * 40 + 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const goUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      setDropPos({
        top: goUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        direction: goUp ? 'up' : 'down',
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`modern-select-container ${isOpen ? 'open' : ''}`} ref={containerRef}>
      <div className="modern-select-trigger" ref={triggerRef} onClick={toggleOpen}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <MdExpandMore className={`expand-icon ${isOpen ? 'rotate' : ''}`} />
      </div>
      {isOpen && createPortal(
        <div
          className="modern-select-dropdown"
          style={{ position: 'fixed', top: `${dropPos.top}px`, left: `${dropPos.left}px`, width: `${dropPos.width}px`, zIndex: 99999 }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              className={`modern-select-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

const Task = ({ toast, tasks, setTasks }) => {
  // Normalize old DB values (top/average/low) to new unified names (High/Medium/Low)
  const normalizePriority = (p) => {
    const map = { top: "High", average: "Medium", low: "Low" };
    return map[p] || p || "Low";
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [task, setTask] = useState({
    taskName: "",
    priority: "High",
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({ taskName: "", priority: "", deadline: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const deleteIdRef = useRef(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [completedExpanded, setCompletedExpanded] = useState(true);
  const menuAnchorRef = useRef(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    taskApi.getTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, [setTasks]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuOpenId) return;
      if (!e.target.closest(".task-menu-btn") && !e.target.closest(".task-floating-menu")) {
        setMenuOpenId(null);
        menuAnchorRef.current = null;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  function handleOnchange(e) {
    setTask({ ...task, [e.target.name]: e.target.value });
  }

  const addTask = () => {
    if (task.taskName.trim() === "" || task.deadline === "") {
      toast.error("Please enter task and deadline");
      return;
    }
    const selectedDate = new Date(task.deadline);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      toast.error("Please select a valid date");
      return;
    }
    const newTask = { id: crypto.randomUUID(), task, done: false };
    taskApi.postTask(newTask)
      .catch((err) => console.log(err));
    setTasks([...tasks, newTask]);
    toast.success("Added Successfully");
    setTask({ taskName: "", priority: "High", deadline: "" });
  };

  const markDone = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, done: true } : t));
    taskApi.updateTask(id, { done: true })
      .catch((err) => console.log(err));
  };

  const undoComplete = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, done: false } : t));
    taskApi.updateTask(id, { done: false })
      .catch((err) => console.log(err));
    toast.success("Moved back to current tasks");
  };

  const startEdit = (eachTask) => {
    setEditingId(eachTask.id);
    setMenuOpenId(null);
    setEditTask({
      taskName: eachTask.task?.taskName || "",
      priority: normalizePriority(eachTask.task?.priority),
      deadline: eachTask.task?.deadline || "",
    });
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, task: { ...editTask } } : t));
    taskApi.updateTask(id, { task: editTask })
      .catch((err) => console.log(err));
    setEditingId(null);
    toast.success("Updated Successfully");
  };

  const cancelEdit = () => setEditingId(null);

  const confirmDelete = (id) => {
    deleteIdRef.current = id;
    setDeleteDialog(true);
    setMenuOpenId(null);
  };

  const areYouSure = (yes) => {
    if (yes) {
      const id = deleteIdRef.current;
      if (id === "bulk") {
        const count = selectedIds.size;
        selectedIds.forEach(tId => {
          taskApi.deleteTask(tId).catch((err) => console.log(err));
        });
        setTasks(tasks.filter(t => !selectedIds.has(t.id)));
        setSelectedIds(new Set());
        toast.success(`${count} task${count > 1 ? 's' : ''} deleted`);
      } else {
        taskApi.deleteTask(id)
          .catch((err) => console.log(err));
        setTasks(tasks.filter((t) => id !== t.id));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Deleted Successfully");
      }
    }
    setDeleteDialog(false);
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

  const selectAll = (items) => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(t => t.id)));
    }
  };

  const deleteSelected = () => {
    deleteIdRef.current = "bulk";
    setDeleteDialog(true);
  };

  const upcomingTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);

  const filteredCurrent = useMemo(() => {
    return upcomingTasks.filter((t) =>
      (t.task?.taskName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [upcomingTasks, searchQuery]);

  const filteredCompleted = useMemo(() => {
    return completedTasks.filter((t) =>
      (t.task?.taskName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [completedTasks, searchQuery]);

  const getPriorityLabel = (p) => {
    const n = normalizePriority(p);
    return n === "High" ? "High" : n === "Medium" ? "Medium" : "Low";
  };

  const isSelectionMode = selectedIds.size > 0;

  const updateMenuPosition = (anchorEl) => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const menuWidth = 170;
    const menuHeight = 108;
    let left = rect.left + 6;
    let top = rect.bottom + 4;

    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (left < 8) left = 8;

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - 6;
    }

    setMenuPos({ top, left });
  };

  const openMenu = (e, id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null);
      menuAnchorRef.current = null;
      return;
    }
    menuAnchorRef.current = e.currentTarget;
    updateMenuPosition(menuAnchorRef.current);
    setMenuOpenId(id);
  };

  useEffect(() => {
    if (!menuOpenId || !menuAnchorRef.current) return;

    const handleScrollOrResize = () => {
      if (!menuAnchorRef.current || !document.body.contains(menuAnchorRef.current)) {
        setMenuOpenId(null);
        menuAnchorRef.current = null;
        return;
      }
      updateMenuPosition(menuAnchorRef.current);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [menuOpenId]);

  const renderRowActions = (eachTask) => (
    <div className="task-actions-row">
      {!eachTask.done && (
        <button className="action-btn edit" onClick={() => startEdit(eachTask)} title="Edit">
          <BiEdit size={14} />
        </button>
      )}
      {!eachTask.done && (
        <button className="action-btn done" onClick={() => markDone(eachTask.id)} title="Mark Done">
          <IoCheckmarkCircle size={14} />
        </button>
      )}
      {eachTask.done && (
        <button className="action-btn undo" onClick={() => undoComplete(eachTask.id)} title="Undo">
          <IoArrowUndoSharp size={14} />
        </button>
      )}
      <button
        className="task-menu-btn"
        onClick={(e) => {
          e.stopPropagation();
          openMenu(e, eachTask.id);
        }}
      >
        <VscEllipsis size={18} />
      </button>
    </div>
  );

  const renderFloatingMenu = () => {
    if (!menuOpenId) return null;
    return createPortal(
      <div className="task-floating-menu" style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}>
        <button onClick={() => { toggleSelect(menuOpenId); setMenuOpenId(null); }}>
          <ImCheckboxUnchecked size={14} /> Select
        </button>
        <button onClick={() => { confirmDelete(menuOpenId); setMenuOpenId(null); }} className="delete">
          <AiFillDelete size={14} /> Delete
        </button>
      </div>,
      document.body
    );
  };

  const renderRow = (eachTask, isCompleted) => (
    <tr key={eachTask.id} className={selectedIds.has(eachTask.id) ? 'selected' : ''}>
      {editingId === eachTask.id ? (
        <>
          <td className="checkbox-col">
            {isSelectionMode && (
              <input type="checkbox" checked={selectedIds.has(eachTask.id)} onChange={() => toggleSelect(eachTask.id)} className="task-checkbox" />
            )}
          </td>
          <td>
            <input type="text" value={editTask.taskName}
              onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })}
              className="edit-inline-input" />
          </td>
          <td>
            <ModernSelect 
              value={editTask.priority}
              onChange={(val) => setEditTask({ ...editTask, priority: val })}
              options={[
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" }
              ]}
            />
          </td>
          <td>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={editTask.deadline ? new Date(editTask.deadline) : null}
                onChange={(newValue) => {
                  if (newValue && !isNaN(newValue.getTime())) {
                    const yyyy = newValue.getFullYear();
                    const mm = String(newValue.getMonth() + 1).padStart(2, '0');
                    const dd = String(newValue.getDate()).padStart(2, '0');
                    setEditTask({ ...editTask, deadline: `${yyyy}-${mm}-${dd}` });
                  }
                }}
                slotProps={{ textField: { size: 'small', className: 'mui-date-input edit-date-picker' } }}
              />
            </LocalizationProvider>
          </td>
          <td><span className={`status-pill ${isCompleted ? 'completed' : 'in-progress'}`}>{isCompleted ? 'Completed' : 'In Progress'}</span></td>
          <td className="actions-cell">
            <button className="action-btn save" onClick={() => saveEdit(eachTask.id)}>Save</button>
            <button className="action-btn cancel" onClick={cancelEdit}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td className="checkbox-col">
            {isSelectionMode && (
              <input type="checkbox" checked={selectedIds.has(eachTask.id)} onChange={() => toggleSelect(eachTask.id)} className="task-checkbox" />
            )}
          </td>
          <td className="task-name-cell">{eachTask.task?.taskName || "Unnamed Task"}</td>
          <td><span className={`priority-pill ${normalizePriority(eachTask.task?.priority)}`}>{getPriorityLabel(eachTask.task?.priority)}</span></td>
          <td>{eachTask.task?.deadline || "No Deadline"}</td>
          <td><span className={`status-pill ${isCompleted ? 'completed' : 'in-progress'}`}>{isCompleted ? 'Completed' : 'In Progress'}</span></td>
          <td className="actions-cell">
            {renderRowActions(eachTask)}
          </td>
        </>
      )}
    </tr>
  );

  return (
    <div className="task-page-wrapper" data-aos="zoom-in">
      {deleteDialog && <Dialog 
        areYouSure={areYouSure} 
        title={deleteIdRef.current === "bulk" ? "Delete Selected Items" : "Delete Task"}
        text={deleteIdRef.current === "bulk" ? `Are you sure you want to delete ${selectedIds.size} selected task(s)?` : undefined}
      />}
      {renderFloatingMenu()}

      <div className="task-header-flex">
        <h1>Tasks</h1>
        {isSelectionMode && (
          <div className="bulk-actions">
            <button className="bulk-btn cancel" onClick={() => setSelectedIds(new Set())}>
              Cancel
            </button>
            <button className="bulk-btn select-all" onClick={() => selectAll([...filteredCurrent, ...filteredCompleted])}>
              {selectedIds.size === [...filteredCurrent, ...filteredCompleted].length ? 'Unselect All' : 'Select All'}
            </button>
            <button className="bulk-btn delete-selected" onClick={deleteSelected}>
              <AiFillDelete size={16} /> Delete ({selectedIds.size})
            </button>
          </div>
        )}
        <div className="search-bar-inner">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search tasks..."
          />
          <BiSearchAlt2 size={20} color="#94A3B8" />
        </div>
      </div>
      
      <div className="add-task-panel">
        <h2 className="panel-title">Add New Task</h2>
        <div className="add-div">
          <div className="input-col">
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Enter task name..."
              name="taskName"
              value={task.taskName || ""}
              onChange={handleOnchange}
            />
          </div>
          <div className="input-col">
            <label>Priority</label>
            <ModernSelect 
              value={task.priority}
              onChange={(val) => setTask({ ...task, priority: val })}
              options={[
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" }
              ]}
            />
          </div>
          <div className="input-col">
            <label>Due Date</label>
            <div className="date-input-wrapper">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={task.deadline ? new Date(task.deadline) : null}
                  onChange={(newValue) => {
                    if (newValue && !isNaN(newValue.getTime())) {
                      const yyyy = newValue.getFullYear();
                      const mm = String(newValue.getMonth() + 1).padStart(2, '0');
                      const dd = String(newValue.getDate()).padStart(2, '0');
                      setTask({ ...task, deadline: `${yyyy}-${mm}-${dd}` });
                    } else {
                      setTask({ ...task, deadline: "" });
                    }
                  }}
                  slotProps={{ textField: { size: 'small', className: 'mui-date-input' } }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <button id="add-bt" onClick={addTask}>Add Task</button>
        </div>
      </div>

      <main className="task-body" data-aos="zoom-out">
        <div className="task-table-container">
          <div className="table-header-row">
            <h3>Current Tasks</h3>
            <span className="task-count">({filteredCurrent.length}) entries</span>
          </div>
          <div className="task-table-scroll">
            <table>
              <thead>
                <tr>
                  <th className="checkbox-col header-checkbox"></th>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrent.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">No active tasks</td></tr>
                )}
                {filteredCurrent.map((eachTask) => renderRow(eachTask, false))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="task-table-container completed-tasks-dropdown" style={{minHeight: '200px'}}>
          <div className="table-header-row" onClick={() => setCompletedExpanded(!completedExpanded)} style={{cursor: 'pointer'}}>
            <div className="table-header-left">
              <h3>Completed Tasks</h3>
              <span className="task-count">({filteredCompleted.length}) entries</span>
            </div>
          </div>
          <div className={`task-table-scroll ${completedExpanded ? 'show' : 'hide'}`}>
            <table>
              <thead>
                <tr>
                  <th className="checkbox-col header-checkbox"></th>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Completed Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompleted.length === 0 && (
                  <tr><td colSpan="6" className="empty-row">No completed tasks yet</td></tr>
                )}
                {filteredCompleted.map((eachTask) => renderRow(eachTask, true))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Task;
