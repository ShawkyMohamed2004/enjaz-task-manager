import React, { useState } from "react";
import "../../App.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaMicrosoft } from "react-icons/fa";
import { MdEmail, MdLockOutline, MdVisibilityOff, MdVisibility, MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import * as authApi from "../../api/authApi";

export default function Mainpage({ toast, isLogin, toggleForm, onLoginSuccess }) {
  const [users, setUsers] = useState({ userName: "", email: "", password: "" });
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const googleAuth = async (e) => {
    if (e) e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const response = await authApi.firebaseAuth({
        email: user.email,
        name: user.displayName,
        picUrl: user.photoURL,
        googleId: user.uid
      });

      if (response.data.success) {
        toast.success("Google Login successful!");
        onLoginSuccess();
        navigate("/Home");
      } else {
        toast.error(response.data.message || "Failed to link Google account");
      }
    } catch (error) {
      console.error(error);
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google login failed");
      }
    }
  };

  const microsoftAuth = (e) => {
    if (e) e.preventDefault();
    toast.info("Microsoft login coming soon...");
    window.location.assign(`${process.env.REACT_APP_API_URL}/microsoft`);
  };

  const appleAuth = (e) => {
    if (e) e.preventDefault();
    toast.info("Apple login coming soon...");
    window.location.assign(`${process.env.REACT_APP_API_URL}/apple`);
  };

  const openForgotPass = (e) => {
    e.preventDefault();
    navigate("/forgotpass");
  };

  function handleOnchange(e) {
    setUsers({ ...users, [e.target.name]: e.target.value });
  }

  function handleUserLogin(e) {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  }
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (userLogin.email === "" || userLogin.password === "") {
      toast.error("Please enter your email and password");
      return;
    }

    const normalizedEmail = userLogin.email.toLowerCase().trim();
    const loginData = { ...userLogin, email: normalizedEmail };

    authApi.login(loginData)
      .then((result) => {
        if (result.data.success) {
          toast.success("Login successful!");
          navigate("/Home");
        } else {
          toast.error(result.data.message || "Invalid email or password");
          setUserLogin({ email: "", password: "" });
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMsg);
        setUserLogin({ email: "", password: "" });
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!users.userName || !users.email || !users.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const normalizedEmail = users.email.toLowerCase().trim();
    
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'msn.com'];
    const emailDomain = normalizedEmail.split('@')[1];
    
    if (!emailDomain || !validDomains.includes(emailDomain)) {
      toast.error("Please use a valid email like gmail.com or yahoo.com");
      return;
    }

    const signupData = { ...users, email: normalizedEmail };

    authApi.signup(signupData)
      .then((result) => {
        toast.success("Signed up successfully! Please log in.");
        setUsers({ userName: "", email: "", password: "" });
        toggleForm();
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
        toast.error(errorMsg);
        setUsers({ userName: "", email: "", password: "" });
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <MdEmail className="input-icon" />
            <input type="email" name="email" value={userLogin.email} onChange={handleUserLogin} placeholder="Email Address" />
          </div>
          <div className="input-group password-field-wrap">
            <MdLockOutline className="input-icon" />
            <input type={showPassword ? "text" : "password"} name="password" value={userLogin.password} onChange={handleUserLogin} placeholder="Password" />
            <button type="button" className="eye-toggle-btn" onClick={togglePasswordVisibility}>
              {showPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
            </button>
          </div>
          <div className="password-row">
            <a onClick={openForgotPass} href="/forgotpass">Forgot password?</a>
          </div>
          
          <button className="bt" type="submit">Log In</button>
          
          <div className="separator">Or sign in with</div>
          <div className="social-icons">
            <button type="button" onClick={googleAuth}><FcGoogle size={22} /></button>
            <button type="button" onClick={appleAuth} aria-label="Apple Login">
              <FaApple size={22} color="var(--text)" />
            </button>
            <button type="button" onClick={microsoftAuth} aria-label="Microsoft Login">
              <FaMicrosoft size={18} color="#00a4ef" />
            </button>
          </div>
          
          <div className="auth-switch">
            Don't have an account? <span onClick={toggleForm}>Sign Up</span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <MdPersonOutline className="input-icon" />
            <input type="text" placeholder="Username" name="userName" value={users.userName} onChange={handleOnchange} />
          </div>
          <div className="input-group">
            <MdEmail className="input-icon" />
            <input type="email" placeholder="Email Address" name="email" value={users.email} onChange={handleOnchange} />
          </div>
          <div className="input-group password-field-wrap">
            <MdLockOutline className="input-icon" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" value={users.password} onChange={handleOnchange} />
            <button type="button" className="eye-toggle-btn" onClick={togglePasswordVisibility}>
              {showPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
            </button>
          </div>
          
          <button className="bt" type="submit">Sign Up</button>
          
          <div className="separator">Or sign up with</div>
          <div className="social-icons">
            <button type="button" onClick={googleAuth}><FcGoogle size={22} /></button>
            <button type="button" onClick={appleAuth} aria-label="Apple Login">
              <FaApple size={22} color="var(--text)" />
            </button>
            <button type="button" onClick={microsoftAuth} aria-label="Microsoft Login">
              <FaMicrosoft size={18} color="#00a4ef" />
            </button>
          </div>
          
          <div className="auth-switch">
            Already have an account? <span onClick={toggleForm}>Log In</span>
          </div>
        </form>
      )}
    </>
  );
}
