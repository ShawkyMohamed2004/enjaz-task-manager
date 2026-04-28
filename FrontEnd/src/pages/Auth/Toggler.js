import React, { useState } from "react";
import Mainpage from "./Mainpage";
import "../../App.css";
import logoFull from "../../assets/logos/logo-full.png";

export default function Toggler({ toast, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="login-bg">
      <div className="glass-modal">
        <div className="glass-header">
          <div className="logo-line">
            <img src={logoFull} alt="Enjaz Logo" style={{ height: "80px", width: "auto", objectFit: "contain" }} />
          </div>
          <h1>Welcome to Enjaz</h1>
          <p>Sign in to manage your tasks effortlessly</p>
        </div>
        
        <Mainpage toast={toast} isLogin={isLogin} toggleForm={toggleForm} onLoginSuccess={onLoginSuccess} />
        
      </div>
    </div>
  );
}
