import AuthPage from "./pages/Auth/Toggler";
import Task from "./pages/Tasks/Task";
import Home from "./pages/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Todo from "./pages/Todos/Todo";
import Dashboard from "./pages/Dashboard/Dashboard";
import Notes from "./pages/Notes/Notes";
import ForgotPass from "./pages/Auth/ForgotPass";
import ResetPass from "./pages/Auth/ResetPass";
import Settings from "./pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

// Apply saved theme immediately before any render
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
}

function App() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState([]);

  const clearAllData = () => {
    setNotes([]);
    setTasks([]);
    setTodo([]);
  };

  const onLoginSuccess = () => {
    // Additional logic on login success can be added here
    console.log("User logged in successfully");
  };

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<AuthPage toast={toast} onLoginSuccess={onLoginSuccess} />}></Route>
        <Route path="/ForgotPass" element={<ForgotPass toast={toast} />} />
        <Route
          path="/ResetPass/:id/:token"
          element={<ResetPass toast={toast} />}
        />
        <Route path="/Home" element={
          <ProtectedRoute>
            <Home tasks={tasks} clearAllData={clearAllData} />
          </ProtectedRoute>
        }>
          <Route
            index
            element={
              <Dashboard
                notes={notes}
                setNotes={setNotes}
                tasks={tasks}
                setTasks={setTasks}
                todo={todo}
                setTodo={setTodo}
              />
            }
          />
          <Route
            path="/Home/todos"
            element={<Todo toast={toast} todo={todo} setTodo={setTodo} />}
          />
          <Route
            path="/Home/notes"
            element={<Notes notes={notes} setNotes={setNotes} toast={toast} />}
          />
          <Route
            path="/Home/settings"
            element={<Settings tasks={tasks} toast={toast} />}
          />
          <Route
            path="/Home/task"
            element={<Task toast={toast} tasks={tasks} setTasks={setTasks} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

