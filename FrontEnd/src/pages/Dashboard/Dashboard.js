import React, { useEffect } from "react";
import MainNote from "./DashBoardCom/MainNote";
import MainTask from "./DashBoardCom/MainTask";
import MainTodo from "./DashBoardCom/MainTodo";
import Calendar from "../../components/Calendar/Calendar";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const Dashboard = ({ notes, setNotes, tasks, setTasks, todo, setTodo }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="home-body-conatiner" data-aos="zoom-in">
      <main className="body-content">
        {/* Top Left: Notes */}
        <div className="dashboard-card notes" data-aos="fade-up-right">
          <div className="con-head">
            <p>My Notes</p>
            <button onClick={() => navigate("/Home/notes")} className="view-all">View all</button>
          </div>
          <MainNote notes={notes} setNotes={setNotes} />
        </div>

        {/* Top Right: Mini Calendar */}
        <div className="dashboard-card calendar-card" data-aos="fade-up-left">
          <div className="con-head">
            <p>Mini Calendar</p>
          </div>
          <div className="mini-calendar-wrapper">
            <Calendar />
          </div>
        </div>

        {/* Bottom Left: Quick To-Do */}
        <div className="dashboard-card todos">
          <div className="con-head">
            <p>My tasks ({String(todo.length).padStart(2, '0')})</p>
            <button onClick={() => navigate("/Home/todos")} className="view-all">⋮</button>
          </div>
          <MainTodo todo={todo} setTodo={setTodo} />
        </div>

        {/* Bottom Right: Task Overview */}
        <div className="dashboard-card stats">
          <div className="con-head">
            <p>Task Overview Table</p>
            <button onClick={() => navigate("/Home/task")} className="view-all">...</button>
          </div>
          <MainTask tasks={tasks} setTasks={setTasks} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
