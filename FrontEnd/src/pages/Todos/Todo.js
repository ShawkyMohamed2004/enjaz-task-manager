import React, { useState, useEffect, useMemo, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiSearchAlt2 } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { VscEllipsis } from "react-icons/vsc";
import { ImCheckboxUnchecked } from "react-icons/im";
import { MdExpandMore } from "react-icons/md";
import * as todoApi from "../../api/todoApi";
import Dialog from "../../components/SrNoDialog/Dialog";
import Aos from "aos";
import "aos/dist/aos.css";
import "./todo.css";

// Modern Combobox for Categories
const ModernCombobox = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className={`modern-combo-container ${isOpen ? 'open' : ''}`} ref={containerRef}>
      <div className="modern-combo-input-wrapper">
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          className="modern-combo-input"
        />
        <MdExpandMore 
          className={`combo-expand-icon ${isOpen ? 'rotate' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="modern-combo-dropdown">
          {options.map(opt => (
            <div 
              key={opt} 
              className={`modern-combo-option ${value === opt ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Todo = ({ toast, todo, setTodo }) => {
  const [newItem, setNewItem] = useState("");
  const [category, setCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const deleteIdRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpenId && !e.target.closest('.todo-menu-wrapper')) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpenId]);

  const filteredItems = useMemo(() => {
    return todo.filter((eachItem) => {
      return eachItem.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [todo, searchQuery]);

  const groupedTodos = useMemo(() => {
    const groups = {};
    filteredItems.forEach(item => {
      const date = item.dateAdded || "Previous items";
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [filteredItems]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    todoApi.getTodos()
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => console.log(err));
  }, [setTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newItem === "") {
      toast.error("Please type something");
      return;
    }
    const newTodoItem = {
      todoId: crypto.randomUUID(),
      title: newItem,
      status: false,
      dateAdded: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      category: category,
    };
    setTodo((current) => {
      return [...current, newTodoItem];
    });
    await todoApi.postTodo(newTodoItem)
      .catch((err) => console.log(err));
    toast.success("Added Successfully");
    setNewItem("");
  };

  function tickTodo(todoId, status) {
    setTodo((current) => {
      return current.map((todo) => {
        if (todo.todoId === todoId) {
          return { ...todo, status };
        }
        return todo;
      });
    });
    todoApi.updateTodo(todoId, { status })
      .catch((err) => console.log(err));
  }

  function deleteTodo(todoId) {
    deleteIdRef.current = todoId;
    setDeleteDialog(true);
    setMenuOpenId(null);
  }

  function startEdit(item) {
    setEditingId(item.todoId);
    setEditText(item.title);
    setMenuOpenId(null);
  }

  function saveEdit(todoId) {
    if (editText.trim() === "") {
      toast.error("Cannot be empty");
      return;
    }
    
    // Generate current formatted date
    const updatedDate = new Date().toLocaleDateString("en-GB", { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });

    setTodo((current) =>
      current.map((t) =>
        t.todoId === todoId ? { ...t, title: editText, dateAdded: updatedDate } : t
      )
    );
    
    // Update title and date in backend
    todoApi.updateTodo(todoId, { 
      title: editText, 
      dateAdded: updatedDate 
    }).catch((err) => console.log(err));

    setEditingId(null);
    toast.success("Updated Successfully");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  const toggleSelect = (todoId) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(todoId)) {
        newSet.delete(todoId);
      } else {
        newSet.add(todoId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(t => t.todoId)));
    }
  };

  const deleteSelected = () => {
    deleteIdRef.current = "bulk";
    setDeleteDialog(true);
  };

  const areYouSure = (yes) => {
    if (yes) {
      const id = deleteIdRef.current;
      if (id === "bulk") {
        const count = selectedIds.size;
        selectedIds.forEach(todoId => {
          todoApi.deleteTodo(todoId);
        });
        setTodo((current) => current.filter(t => !selectedIds.has(t.todoId)));
        setSelectedIds(new Set());
        toast.success(`${count} todo${count > 1 ? 's' : ''} deleted`);
      } else {
        todoApi.deleteTodo(id);
        setTodo((current) => {
          return current.filter((t) => t.todoId !== id);
        });
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

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { 
    month: "long", day: "numeric", year: "numeric" 
  });

  const isSelectionMode = selectedIds.size > 0;

  return (
    <div className="todo-page" data-aos="zoom-in">
      {deleteDialog && <Dialog 
        areYouSure={areYouSure} 
        title={deleteIdRef.current === "bulk" ? "Delete Selected Todos" : "Delete Todo"}
        text={deleteIdRef.current === "bulk" ? `Are you sure you want to delete ${selectedIds.size} selected item(s)?` : "Are you sure you want to delete this item? This action cannot be undone."}
      />}
      <div className="todo-page-header">
        <div>
          <h1>To-Do List</h1>
          <p className="todo-date">{dateStr}</p>
        </div>
        <div className="todo-stats">
          <span className="todo-stat-badge">{todo.filter(t => !t.status).length} active</span>
          <span className="todo-stat-badge completed-badge">{todo.filter(t => t.status).length} done</span>
        </div>
      </div>

      {isSelectionMode && (
        <div className="todo-bulk-actions">
          <button className="todo-bulk-btn cancel" onClick={() => setSelectedIds(new Set())}>
            Cancel
          </button>
          <button className="todo-bulk-btn select-all" onClick={selectAll}>
            {selectedIds.size === filteredItems.length ? 'Unselect All' : 'Select All'}
          </button>
          <button className="todo-bulk-btn delete-selected" onClick={deleteSelected}>
            <AiFillDelete size={16} /> Delete ({selectedIds.size})
          </button>
        </div>
      )}

      <div className="todo-add-section">
        <h2>Add new reminder</h2>
        <form onSubmit={handleSubmit} className="todo-add-form">
          <div className="todo-input-wrapper">
            <span className="todo-circle-icon"></span>
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              type="text"
              placeholder="Add a new task..."
            />
          </div>
          <div className="todo-category-wrapper">
            <ModernCombobox 
              value={category}
              onChange={(val) => setCategory(val)}
              options={["General", "Work", "Personal", "Shopping", "Urgent", "Healthy", "Education"]}
              placeholder="Category..."
            />
          </div>
          <button type="submit" className="todo-add-btn">+ Add Todo</button>
        </form>
      </div>

      <div className="todo-list-card">
        <div className="todo-list-header">
          <h3>Today's Tasks • {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</h3>
          <div className="todo-search-inline">
            <BiSearchAlt2 size={18} color="#94A3B8" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="todo-items-list-container">
          {todo.length === 0 && <div className="empty-todo">All caught up! No tasks yet.</div>}
          
          {Object.entries(groupedTodos).map(([date, items]) => (
            <div key={date} className="todo-date-group">
              <div className="todo-group-header">{date}</div>
              <ul className="todo-items-list">
                {items.map((item) => (
                  <li key={item.todoId} className={`todo-item ${item.status ? 'completed' : ''} ${selectedIds.has(item.todoId) ? 'selected' : ''}`}>
                    <div className="todo-item-left">
                      {isSelectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.todoId)}
                          onChange={() => toggleSelect(item.todoId)}
                          style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer', accentColor: '#10B981' }}
                        />
                      )}
                      <label className="todo-checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={(e) => {
                            // Stop event from bubbling if it's inside a label, just to be safe
                            e.stopPropagation();
                            tickTodo(item.todoId, e.target.checked);
                          }}
                          className="todo-status-checkbox"
                        />
                        <span className="todo-custom-check"></span>
                      </label>
                      {editingId === item.todoId ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(item.todoId); }}
                          className="todo-edit-input"
                          autoFocus
                        />
                      ) : (
                        <div className="todo-title-wrap">
                          <span className="todo-item-text">{item.title}</span>
                          <div className="todo-meta-info">
                            {item.category && <span className={`todo-category-badge ${item.category}`}>{item.category}</span>}
                            {item.dateAdded && <span className="todo-date-text">{item.dateAdded}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="todo-item-actions">
                      {editingId === item.todoId ? (
                        <>
                          <button className="todo-action-btn save" onClick={() => saveEdit(item.todoId)} title="Save">
                            <FaCheck size={12} />
                          </button>
                          <button className="todo-action-btn cancel" onClick={cancelEdit} title="Cancel">✕</button>
                        </>
                      ) : (
                        <div className="todo-menu-wrapper">
                          <button 
                            className="todo-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === item.todoId ? null : item.todoId);
                            }}
                          >
                            <VscEllipsis size={18} />
                          </button>
                          {menuOpenId === item.todoId && (
                            <div className="todo-menu-dropdown">
                              <button onClick={() => { toggleSelect(item.todoId); setMenuOpenId(null); }}>
                                <ImCheckboxUnchecked size={14} /> Select
                              </button>
                              <button onClick={() => startEdit(item)}>
                                <BiEdit size={14} /> Edit
                              </button>
                              <button onClick={() => deleteTodo(item.todoId)} className="delete">
                                <AiFillDelete size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
