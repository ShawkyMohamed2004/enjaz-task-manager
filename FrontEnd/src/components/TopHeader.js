import React, { useState, useEffect } from "react";
import DarkMode from "./DarkMode/Darkmode";
import Notification from "./Notification/Notification";
import { IoMdNotifications } from "react-icons/io";

import { RxHamburgerMenu } from "react-icons/rx";
import * as authApi from "../api/authApi";
import * as taskApi from "../api/taskApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import ReactDOM from "react-dom";
import { IoWarningOutline } from "react-icons/io5";

export default function TopHeader({ tasks = [], toggleSidebar, clearAllData }) {
  const [user, setUser] = useState();
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const fetchUser = () => {
    authApi.getUser()
      .then((res) => {
        setUser(res.data);
        if (res.data.picUrl) {
          localStorage.setItem('userPic', res.data.picUrl);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handlePicUpdate = () => {
      const storedPic = localStorage.getItem('userPic');
      if (storedPic && user) {
        setUser(prev => ({ ...prev, picUrl: storedPic }));
      }
    };
    window.addEventListener('userPicUpdated', handlePicUpdate);
    return () => window.removeEventListener('userPicUpdated', handlePicUpdate);
  }, [user]);

  useEffect(() => {
    taskApi.getTasks()
      .then((res) => {
        let temp = res.data.filter(
          (obj) =>
            obj.done === false &&
            obj.task.deadline === new Date().toISOString().split("T")[0]
        );
        setUpcomingTasks(temp);
      })
      .catch(() => {});
  }, [tasks]);

  useEffect(() => {
    if (!dialog && !profileMenu) return;
    const handleClickOutside = () => { setDialog(false); setProfileMenu(false); };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dialog, profileMenu]);

  const handleLogout = () => {
    authApi.logout()
      .then(() => {
        if (clearAllData) clearAllData();
        toast.success("Logged out successfully");
        const savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        if (savedTheme) localStorage.setItem('theme', savedTheme);
        sessionStorage.clear();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const currentPic = localStorage.getItem('userPic') || (user && user.picUrl) || "https://static.thenounproject.com/png/4851855-200.png";

  return (
    <div className="top-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <RxHamburgerMenu size={24} />
        </button>
      </div>
      <div className="right-actions">
        <DarkMode />
        <div className="bell-wrapper" onClick={(e) => e.stopPropagation()}>
          <button
            className={`bell-btn ${upcomingTasks.length ? "bell-active" : ""}`}
            onClick={() => setDialog(!dialog)}
          >
            <IoMdNotifications size={24} color="#64748B" />
            {upcomingTasks.length > 0 && <span className="badge">{upcomingTasks.length}</span>}
          </button>
          {dialog && <Notification closeNotifi={() => setDialog(false)} upcomingTasks={upcomingTasks} />}
        </div>
        <div className="profile-wrapper" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
          <div 
            className="avatar-btn" 
            onClick={() => setProfileMenu(!profileMenu)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={currentPic}
              alt="Profile"
              onError={(e) => { e.target.src = "https://static.thenounproject.com/png/4851855-200.png"; }}
            />
          </div>
          {profileMenu && (
            <div className="profile-dropdown-menu" style={{
              position: "absolute",
              top: "120%",
              right: "0",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              padding: "8px 0",
              minWidth: "180px",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column"
            }}>
              <button 
                onClick={() => { setProfileMenu(false); navigate("/Home/settings#profile"); }}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", color: "var(--text)", width: "100%", textAlign: "left", cursor: "pointer", fontWeight: "600" }}
              >
                <FaUser size={16} color="#10B981" /> Profile
              </button>
              <button 
                onClick={() => { navigate("/Home/settings#account"); setProfileMenu(false); }}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", color: "var(--text)", width: "100%", textAlign: "left", cursor: "pointer" }}
              >
                <IoSettingsOutline size={16} color="#64748B" /> Account Settings
              </button>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }}></div>
              <button 
                onClick={() => { setProfileMenu(false); setLogoutDialog(true); }}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", color: "#EF4444", width: "100%", textAlign: "left", cursor: "pointer", fontWeight: "600" }}
              >
                <BiLogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {logoutDialog && ReactDOM.createPortal(
        <div className="dialog-overlay" onClick={() => setLogoutDialog(false)}>
          <div className="dialog-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: "320px", maxWidth: "400px" }}>
            <div className="dialog-icon">
              <IoWarningOutline size={36} color="#EF4444" />
            </div>
            <h3 className="dialog-title" style={{ color: "#EF4444" }}>Log Out</h3>
            <p className="dialog-text" style={{ marginBottom: "24px" }}>
              Are you sure you want to log out of your account?
            </p>
            <div className="dialog-actions">
              <button onClick={() => setLogoutDialog(false)} className="dialog-btn-cancel" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleLogout} className="dialog-btn-delete" style={{ flex: 1, background: "#EF4444", color: "white" }}>
                Log Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
