import React, { useState } from "react";
import { toast } from "react-toastify";
import { LuListTodo } from "react-icons/lu";
import { IoCalendarNumber } from "react-icons/io5";
import { FaRegNoteSticky, FaUserPen } from "react-icons/fa6";
import * as authApi from "../api/authApi";
import { BiSolidDashboard } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import logoIcon from "../assets/logos/logo-icon.png";

const Navbar = ({ isMobileOpen, setIsMobileOpen, isDesktopCollapsed, clearAllData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const closeMobileSidebar = () => setIsMobileOpen(false);

  function openTodo() { navigate("/Home/todos"); closeMobileSidebar(); }
  function openTask() { navigate("/Home/task"); closeMobileSidebar(); }
  function openNotes() { navigate("/Home/notes"); closeMobileSidebar(); }
  function gototDashboard() { navigate("/Home"); closeMobileSidebar(); }
  function openSettings() { navigate("/Home/settings"); closeMobileSidebar(); }

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    authApi.logout()
      .then((res) => {
        clearAllData();
        toast.success("Logged out successfully");
        const savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        if (savedTheme) localStorage.setItem('theme', savedTheme);
        sessionStorage.clear();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const isActive = (path) => {
    if (path === "/Home") return location.pathname === "/Home";
    return location.pathname.startsWith(path);
  };

  const navBtnStyle = (path) => ({
    backgroundColor: isActive(path) ? "rgba(255,255,255,0.08)" : "transparent",
    borderLeft: isActive(path) ? "4px solid var(--accent)" : "4px solid transparent",
    color: isActive(path) ? "#10B981" : "#F8FAFC",
    transition: "all 0.3s",
  });

  return (
    <>
      {isMobileOpen && <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>}
      <nav className={`nav-left ${isMobileOpen ? 'mobile-open' : ''} ${isDesktopCollapsed ? 'desktop-collapsed' : ''}`}>
        <div className="sidebar-brand">
          <img src={logoIcon} alt="Enjaz Logo" style={{ width: "55px", height: "auto", objectFit: "contain" }} />
          <div className="brand-text">
            <h3 style={{ fontSize: "26px", fontWeight: "700", margin: 0, letterSpacing: "1px" }}>Enjaz</h3>
          </div>
        </div>

        <div className="nav-links">
          <button onClick={gototDashboard} className="nav-item" style={navBtnStyle("/Home")} title="Dashboard">
            <BiSolidDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={openTask} className="nav-item" style={navBtnStyle("/Home/task")} title="Tasks">
            <IoCalendarNumber size={20} />
            <span>Tasks</span>
          </button>
          <button onClick={openNotes} className="nav-item" style={navBtnStyle("/Home/notes")} title="Notes">
            <FaRegNoteSticky size={20} />
            <span>Notes</span>
          </button>
          <button onClick={openTodo} className="nav-item" style={navBtnStyle("/Home/todos")} title="To-Do List">
            <LuListTodo size={20} />
            <span>To-Do List</span>
          </button>
        </div>

        <div className="nav-bottom">
          <button onClick={openSettings} className="nav-item" style={navBtnStyle("/Home/settings")} title="Settings">
            <IoSettingsOutline size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleCancelLogout}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '10px',
            minWidth: '320px',
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            color: 'var(--text)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '18px',
          textAlign: 'center',
          paddingBottom: '8px'
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', paddingTop: '8px !important' }}>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Are you sure you want to log out?
          </p>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          padding: '16px 24px 24px',
          gap: '12px'
        }}>
          <Button 
            onClick={handleCancelLogout}
            variant="outlined"
            sx={{
              borderColor: '#E2E8F0',
              color: '#64748B',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '8px 24px',
              '&:hover': {
                borderColor: '#94A3B8',
                backgroundColor: 'rgba(0,0,0,0.02)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmLogout}
            variant="contained"
            sx={{
              backgroundColor: '#EF4444',
              color: 'white',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '8px 24px',
              '&:hover': {
                backgroundColor: '#DC2626'
              }
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
