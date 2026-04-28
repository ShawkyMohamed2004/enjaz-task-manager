import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaCamera, FaTrash, FaUser, FaShieldAlt, FaBell } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { IoEyeOff, IoEye, IoWarningOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { MdDangerous } from "react-icons/md";
import ReactDOM from "react-dom";
import Notification from "../../components/Notification/Notification";
import DarkMode from "../../components/DarkMode/Darkmode";
import { TfiReload } from "react-icons/tfi";
import TypeWriter from "typewriter-effect";
import Calendar from "../../components/Calendar/Calendar";
import Aos from "aos";
import "aos/dist/aos.css";
import Cropper from "react-easy-crop";
import "./settings.css";
import "../../components/SrNoDialog/dialog.css";
import * as authApi from "../../api/authApi";
import * as taskApi from "../../api/taskApi";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { content: "Act as if what you do makes a difference. It does.", author: "William James" },
  { content: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { content: "Your limitation—it's only your imagination.", author: "Unknown" },
  { content: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

const Settings = ({ tasks, toast }) => {
  const DEFAULT_PIC = "https://static.thenounproject.com/png/4851855-200.png";
  const [activeTab, setActiveTab] = useState("profile");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [user, setUser] = useState({ userName: "", email: "", picUrl: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [preview, setPreview] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const [deletePassDialog, setDeletePassDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [notifPrefs, setNotifPrefs] = useState({
    loginAlerts: JSON.parse(localStorage.getItem("notif_loginAlerts") ?? "true"),
    dailyReminders: JSON.parse(localStorage.getItem("notif_dailyReminders") ?? "true"),
    passwordChanges: JSON.parse(localStorage.getItem("notif_passwordChanges") ?? "true"),
  });
  const [reminderTime, setReminderTime] = useState(localStorage.getItem("notif_reminderTime") || "07:00");
  const fileRef = useRef(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const location = window.location.pathname;
  const isSettingsPage = location === "/Home/settings";
  const navigate = useNavigate();

  const getRandomIndex = useCallback(() => {
    let idx;
    do { idx = Math.floor(Math.random() * QUOTES.length); } while (idx === quoteIndex && QUOTES.length > 1);
    return idx;
  }, [quoteIndex]);

  useEffect(() => {
    Aos.init({ duration: 1200 });
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
    
    authApi.getUser()
      .then((res) => {
        if (res.data) {
          setUser({
            userName: res.data.userName || "",
            email: res.data.email || "",
            picUrl: res.data.picUrl || DEFAULT_PIC,
          });
          if (res.data.picUrl) {
            localStorage.setItem('userPic', res.data.picUrl);
            window.dispatchEvent(new Event('userPicUpdated'));
          }
          if (res.data.reminderTime) {
            setReminderTime(res.data.reminderTime);
            localStorage.setItem("notif_reminderTime", res.data.reminderTime);
          }
          if (res.data.dailyReminders !== undefined) {
            setNotifPrefs(prev => ({ ...prev, dailyReminders: res.data.dailyReminders }));
            localStorage.setItem("notif_dailyReminders", JSON.stringify(res.data.dailyReminders));
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchTodayTasks = () => {
      taskApi.getTasks()
        .then((res) => {
          const today = new Date();
          const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          console.log("[DEBUG] localToday:", localToday);
          console.log("[DEBUG] All deadlines:", res.data.map(d => ({ name: d.task?.taskName || "Task", deadline: d.task?.deadline || "", done: d.done })));
          let temp = res.data.filter(
            (obj) => obj.done === false && obj.task?.deadline === localToday
          );
          console.log("[DEBUG] Filtered tasks:", temp.length);
          setUpcomingTasks(temp);
        })
        .catch((err) => console.log(err));
    };

    fetchTodayTasks();

    // Schedule a re-fetch exactly at midnight
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const msUntilMidnight = midnight - now;
    const timer = setTimeout(fetchTodayTasks, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [tasks]);

  const reloadQuote = () => {
    setQuoteIndex(getRandomIndex());
  };

  function openNotifi() { setNotificationOpen(true); }
  function closeNotifi() { setNotificationOpen(false); }

  const currentQuote = QUOTES[quoteIndex];

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
        setShowCropModal(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImage = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return null;
    const image = new Image();
    image.src = cropImageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      200,
      200
    );

    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedUrl = await getCroppedImage();
      if (!croppedUrl) {
        toast.error("Please choose crop area first");
        return;
      }
      setPreview(croppedUrl);
      setUser(prev => ({ ...prev, picUrl: croppedUrl }));
      localStorage.setItem('userPic', croppedUrl);
      window.dispatchEvent(new Event('userPicUpdated'));
      setShowCropModal(false);
      setCropImageSrc(null);
      setCroppedAreaPixels(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Photo updated successfully");
    } catch (err) {
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropImageSrc(null);
    setCroppedAreaPixels(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deletePhoto = () => {
    authApi.updateFullProfile({
      userName: user.userName,
      email: user.email,
      picUrl: DEFAULT_PIC,
    })
      .then((res) => {
        if (res.data.success) {
          setUser({ ...user, picUrl: DEFAULT_PIC });
          setPreview(null);
          localStorage.setItem('userPic', DEFAULT_PIC);
          window.dispatchEvent(new Event('userPicUpdated'));
          if (fileRef.current) fileRef.current.value = "";
          toast.success("Photo deleted successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete photo");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    authApi.updateFullProfile({
      userName: user.userName,
      email: user.email,
      picUrl: user.picUrl,
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Profile updated successfully");
          setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
          localStorage.setItem('userPic', user.picUrl);
          window.dispatchEvent(new Event('userPicUpdated'));
        } else {
          toast.error(res.data.message || "Failed to update profile");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error updating profile");
      });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const currentPic = preview || user.picUrl || DEFAULT_PIC;
  const showDeleteBtn = currentPic !== DEFAULT_PIC;

  const toggleNotifPref = (key) => {
    setNotifPrefs(prev => {
      const newVal = !prev[key];
      localStorage.setItem(`notif_${key}`, JSON.stringify(newVal));
      
      // If dailyReminders was toggled, update backend
      if (key === "dailyReminders") {
        authApi.updateNotifSettings({ dailyReminders: newVal })
          .catch(err => console.log("Failed to update dailyReminders on backend", err));
      }
      
      return { ...prev, [key]: newVal };
    });
  };

  const handleReminderTimeChange = (e) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    localStorage.setItem("notif_reminderTime", newTime);
    
    // Save to backend
    authApi.updateNotifSettings({ reminderTime: newTime })
      .catch(err => console.log("Failed to update reminderTime on backend", err));
  };

  if (!isSettingsPage) {
    return (
      <React.Fragment>
        <div className="profile" data-aos="fade-left">
          <div className="profile-div">
            <DarkMode />
            <button
              className={`${upcomingTasks.length ? " bell" : ""}`}
              onClick={openNotifi}
            >
              <span id="noti-count">{upcomingTasks.length}</span>
              <span>
                <IoMdNotifications size={25} color="#3081D0" />
              </span>
            </button>
            <div
              onClick={() => navigate("/Home/settings")}
              style={{ cursor: "pointer" }}
              title="Settings"
            >
              <img
                id="prof-img"
                src={user ? `${user.picUrl}` : DEFAULT_PIC}
                style={{ marginBottom: "10px" }}
                alt="Profile"
              />
            </div>
          </div>
          {notificationOpen && (
            <Notification
              closeNotifi={closeNotifi}
              upcomingTasks={upcomingTasks}
            />
          )}
          <Calendar />
          <div className="quote-div" data-aos="zoom-in">
            <h3>
              <TypeWriter
                key={quoteIndex}
                options={{
                  autoStart: true,
                  loop: false,
                  delay: 40,
                  deleteSpeed: 20,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(`" ${currentQuote.content} "`)
                    .pauseFor(4000)
                    .deleteAll(20)
                    .callFunction(() => {
                      setQuoteIndex(getRandomIndex());
                    })
                    .start();
                }}
              />
            </h3>
            <hr />
            <div className="quote-footer">
              <h4 id="auth-name"> - {currentQuote.author}</h4>
              <button onClick={reloadQuote} style={{border: 'none', background: 'transparent', cursor: 'pointer'}}>
                <TfiReload color="#10b981" size={18} />
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  const handleLogOut = () => {
    authApi.logout()
      .then(() => {
        toast.success("Logged out successfully");
        const savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        if (savedTheme) localStorage.setItem('theme', savedTheme);
        sessionStorage.clear();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error("Please enter your current password to confirm deletion.");
      return;
    }
    
    authApi.deleteAccount(deletePassword)
      .then((res) => {
        if (res.data.success) {
          toast.success("Account deleted permanently");
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error(res.data.message || "Failed to delete account");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred during account deletion");
        }
      });
  };

  return (
    <div style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }} data-aos="fade-left">
      <h1 className="settings-page-title">Settings</h1>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          <button className={`settings-tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            <span className="settings-tab-icon"><FaUser size={14} /></span> Profile
          </button>
          <button className={`settings-tab ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
            <span className="settings-tab-icon"><FaShieldAlt size={14} /></span> Security
          </button>
          <button className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
            <span className="settings-tab-icon"><FaBell size={14} /></span> Notifications
          </button>
          <button className={`settings-tab danger-tab ${activeTab === "account" ? "active" : ""}`} onClick={() => setActiveTab("account")}>
            <span className="settings-tab-icon"><BiLogOut size={16} /></span> Account Actions
          </button>
        </div>

        {/* Content Panel */}
        <div className="settings-content">

          {/* ===== PROFILE TAB ===== */}
          {activeTab === "profile" && (
            <>
              <h2 className="settings-section-title">Profile</h2>
              <p className="settings-section-desc">Manage your personal information and profile photo.</p>

              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <img src={currentPic} alt="Profile" className="profile-avatar-img" onError={(e) => (e.target.src = DEFAULT_PIC)} />
                  <button type="button" className="profile-camera-btn" onClick={() => fileRef.current && fileRef.current.click()} title="Change photo">
                    <FaCamera size={12} />
                  </button>
                  {showDeleteBtn && (
                    <button type="button" className="profile-delete-btn" onClick={deletePhoto} title="Remove photo">
                      <FaTrash size={10} />
                    </button>
                  )}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                <div className="profile-avatar-info">
                  <h2>{user.userName || "User"}</h2>
                  <p>{user.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input type="text" name="userName" value={user.userName} onChange={handleChange} placeholder="Enter your name" required />
                </div>
                <button type="submit" className="settings-save-btn">Save Profile Changes</button>
              </form>
            </>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === "security" && (
            <>
              <h2 className="settings-section-title">Security</h2>
              <p className="settings-section-desc">Manage your email and password settings.</p>

              <div className="settings-form">
                <div className="settings-field">
                  <label>Email Address</label>
                  <div className="settings-email-field">
                    <input type="email" name="email" value={user.email} readOnly className="email-readonly" />
                    <span className="verified-badge">Verified</span>
                  </div>
                </div>

                <div className="security-fields">
                  <div className="settings-field">
                    <label>Current Password</label>
                    <div className="password-input-wrapper">
                      <input type={showPasswords.oldPassword ? "text" : "password"} name="oldPassword" value={passwords.oldPassword} onChange={handlePassChange} placeholder="Enter current password" />
                      <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('oldPassword')}>
                        {showPasswords.oldPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="settings-field">
                    <label>New Password</label>
                    <div className="password-input-wrapper">
                      <input type={showPasswords.newPassword ? "text" : "password"} name="newPassword" value={passwords.newPassword} onChange={handlePassChange} placeholder="Enter new password" />
                      <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('newPassword')}>
                        {showPasswords.newPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="settings-field full-width">
                    <label>Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input type={showPasswords.confirmPassword ? "text" : "password"} name="confirmPassword" value={passwords.confirmPassword} onChange={handlePassChange} placeholder="Confirm new password" />
                      <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('confirmPassword')}>
                        {showPasswords.confirmPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="security-note">Leave blank if you don't want to change your password.</p>
                <button type="button" className="settings-save-btn" onClick={handleSubmit} disabled={!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}>
                  Save Password Changes
                </button>
              </div>
            </>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === "notifications" && (
            <>
              <h2 className="settings-section-title">Notifications</h2>
              <p className="settings-section-desc">Choose which email notifications you'd like to receive.</p>

              <div className="notif-preferences">
                <div className="notif-item">
                  <div className="notif-item-info">
                    <h4>Login Alerts</h4>
                    <p>Get notified when someone logs into your account from a new device.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifPrefs.loginAlerts} onChange={() => toggleNotifPref("loginAlerts")} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className={`notif-item ${notifPrefs.dailyReminders ? "notif-item-expanded" : ""}`}>
                  <div style={{ flex: 1 }}>
                    <div className="notif-item-info">
                      <h4>Daily Reminders</h4>
                      <p>Receive a daily summary of your tasks and todos due today.</p>
                    </div>
                    {notifPrefs.dailyReminders && (
                      <div className="reminder-time-row">
                        <span className="reminder-time-label">Send at:</span>
                        <div className="reminder-time-wrapper">
                          <input type="time" className="reminder-time-input" value={reminderTime} onChange={handleReminderTimeChange} />
                          <svg className="reminder-clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="toggle-switch" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                    <input type="checkbox" checked={notifPrefs.dailyReminders} onChange={() => toggleNotifPref("dailyReminders")} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notif-item">
                  <div className="notif-item-info">
                    <h4>Password Changes</h4>
                    <p>Receive a confirmation email when your password is changed.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifPrefs.passwordChanges} onChange={() => toggleNotifPref("passwordChanges")} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ===== DANGER ZONE TAB ===== */}
          {activeTab === "account" && (
            <>
              <h2 className="settings-section-title">Account Actions</h2>
              <p className="settings-section-desc">Manage your account and session.</p>

              <div className="danger-section">
                <h4>Delete Account</h4>
                <p>Once you delete your account, there is no going back. All your data (tasks, todos, notes) will be permanently removed.</p>
                <button type="button" className="danger-btn" onClick={() => setDeletePassDialog(true)}>
                  Delete Account
                </button>
              </div>

              <button type="button" className="logout-btn" onClick={() => setLogoutDialog(true)}>
                <BiLogOut size={20} /> Log Out
              </button>
            </>
          )}

        </div>
      </div>

      {/* ===== DIALOGS (portals) ===== */}
      {deletePassDialog && ReactDOM.createPortal(
        <div className="dialog-overlay" onClick={() => setDeletePassDialog(false)}>
          <div className="dialog-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: "350px", maxWidth: "450px" }}>
            <div className="dialog-icon"><IoWarningOutline size={36} color="#EF4444" /></div>
            <h3 className="dialog-title" style={{ color: "#EF4444" }}>Delete Account</h3>
            <p className="dialog-text" style={{ marginBottom: "20px" }}>
              Are you absolutely sure? This action cannot be undone. Please enter your current password to confirm.
            </p>
            <div className="password-input-wrapper" style={{ marginBottom: "20px", width: "100%" }}>
              <input type={showPasswords.oldPassword ? "text" : "password"} placeholder="Enter current password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--grey)", background: "transparent", color: "var(--text)" }} />
              <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('oldPassword')} style={{ right: "10px", top: "50%", transform: "translateY(-50%)" }}>
                {showPasswords.oldPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>
            <div className="dialog-actions" style={{ marginTop: "10px" }}>
              <button onClick={() => setDeletePassDialog(false)} className="dialog-btn-cancel" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDeleteAccount} className="dialog-btn-delete" style={{ flex: 1 }}>Confirm Delete</button>
            </div>
          </div>
        </div>, document.body
      )}

      {logoutDialog && ReactDOM.createPortal(
        <div className="dialog-overlay" onClick={() => setLogoutDialog(false)}>
          <div className="dialog-modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: "320px", maxWidth: "400px" }}>
            <div className="dialog-icon"><IoWarningOutline size={36} color="#EF4444" /></div>
            <h3 className="dialog-title" style={{ color: "#EF4444" }}>Log Out</h3>
            <p className="dialog-text" style={{ marginBottom: "24px" }}>Are you sure you want to log out of your account?</p>
            <div className="dialog-actions">
              <button onClick={() => setLogoutDialog(false)} className="dialog-btn-cancel" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleLogOut} className="dialog-btn-delete" style={{ flex: 1, background: "#EF4444", color: "white" }}>Log Out</button>
            </div>
          </div>
        </div>, document.body
      )}

      {showCropModal && ReactDOM.createPortal(
        <div className="dialog-overlay" onClick={handleCropCancel}>
          <div className="dialog-modal" onClick={(e) => e.stopPropagation()} style={{ padding: "24px", maxWidth: "500px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px 0", textAlign: "center" }}>Crop Your Photo</h3>
            <p className="crop-hint">Adjust the crop area</p>
            <div style={{ width: "100%", maxHeight: "460px", display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "430px", height: "320px", background: "#0f172a", borderRadius: "12px", overflow: "hidden" }}>
                <Cropper image={cropImageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="rect" objectFit="contain" showGrid onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <div style={{ width: "100%", maxWidth: "430px", display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "12px", fontWeight: "600" }}>
                <span>Zoom</span>
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ flex: 1 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button type="button" className="dialog-btn-cancel" onClick={handleCropCancel} style={{ flex: 1 }}>Cancel</button>
              <button type="button" onClick={handleCropConfirm} style={{ flex: 1, background: "var(--accent)", color: "white", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer", padding: "10px" }}>Save Photo</button>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
};

export default Settings;
