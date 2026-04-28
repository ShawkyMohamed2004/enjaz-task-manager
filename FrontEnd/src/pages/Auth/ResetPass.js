import React, { useState } from "react";
import "../../App.css"; 
import * as authApi from "../../api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { MdLockOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import logoFull from "../../assets/logos/logo-full.png";

const ResetPass = ({ toast }) => {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    authApi.resetPassword(id, token, newPassword)
      .then((res) => {
        setLoading(false);
        if (res.data.Status === "success") {
          toast.success("Password updated successfully! Please log in.");
          navigate("/");
        } else {
          toast.error(res.data.Status || "Failed to reset password");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Reset Pass Error:", err);
        toast.error("Link expired or invalid. Please request a new one.");
      });
  };

  return (
    <div className="login-bg">
      <div className="glass-modal">
        <div className="glass-header">
          <div className="logo-line">
            <img src={logoFull} alt="Enjaz Logo" style={{ height: "80px", width: "auto", objectFit: "contain" }} />
          </div>
          <h1>Reset Password</h1>
          <p>Create a strong new password for your account.</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <MdLockOutline className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
          </div>

          <div className="input-group password-field-wrap">
            <MdLockOutline className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
            />
            <button 
              type="button" 
              className="eye-toggle-btn" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
            </button>
          </div>

          <button type="submit" className="bt" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="auth-switch">
          Changed your mind? <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Back to Login</span>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
