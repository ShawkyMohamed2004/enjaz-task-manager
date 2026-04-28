import React, { useState } from "react";
import "../../App.css";
import * as authApi from "../../api/authApi";
import { MdEmail } from "react-icons/md";
import { IoMailOpenOutline } from "react-icons/io5";
import { MdMarkEmailRead } from "react-icons/md";
import logoFull from "../../assets/logos/logo-full.png";

const ForgotPass = ({ toast }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const getNewPassLink = (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    authApi.forgotPassword(normalizedEmail)
      .then((res) => {
        setLoading(false);
        if (res.data.Status === "success") {
          setIsSent(true);
          toast.success("Check your email for reset link");
        } else {
          toast.error(res.data.Status || "Enter a valid signed-up email");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Forgot Pass Error:", err);
        toast.error("Failed to send reset email");
      });
  };

  return (
    <div className="login-bg">
      <div className="glass-modal">
        <div className="glass-header">
          <div className="logo-line">
            <img src={logoFull} alt="Enjaz Logo" style={{ height: "80px", width: "auto", objectFit: "contain" }} />
          </div>
          
          {isSent ? (
            <>
              <div className="success-icon-wrap" style={{ 
                fontSize: "55px", 
                color: "#ffffff", 
                margin: "30px auto",
                background: "linear-gradient(135deg, #10B981, #059669)",
                width: "110px",
                height: "110px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                border: "4px solid rgba(255, 255, 255, 0.5)"
              }}>
                <MdMarkEmailRead />
              </div>
              <h1>Check Your Email</h1>
              <p>We've sent a password reset link to <br/><strong>{email}</strong></p>
            </>
          ) : (
            <>
              <h1>Forgot Your Password?</h1>
              <p>No worries! Enter your email and we'll send you a reset link.</p>
            </>
          )}
        </div>

        {isSent ? (
          <div className="success-actions" style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <p style={{ fontSize: "13px", color: "var(--text)", opacity: 0.7 }}>Didn't receive the email? Check your spam folder or try again.</p>
            <button className="bt secondary" onClick={getNewPassLink} disabled={loading}>
              {loading ? "Resending..." : "Resend Email"}
            </button>
            <div className="auth-switch">
              <span onClick={() => window.location.href = '/'} style={{ cursor: "pointer", fontWeight: "700" }}>Back to Login</span>
            </div>
          </div>
        ) : (
          <form onSubmit={getNewPassLink}>
            <div className="input-group">
              <MdEmail className="input-icon" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </div>

            <button type="submit" className="bt" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div className="auth-switch" style={{ marginTop: "20px" }}>
              Remember your password? <span onClick={() => window.location.href = '/'} style={{ cursor: "pointer" }}>Back to Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
