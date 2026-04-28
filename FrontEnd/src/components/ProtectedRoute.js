import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as authApi from "../api/authApi";
import logoFull from "../assets/logos/logo-full.png";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"

  useEffect(() => {
    authApi.getUser()
      .then((res) => {
        if (res.data && res.data.email) {
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      })
      .catch(() => {
        setAuthState("unauthenticated");
      });
  }, []);

  if (authState === "loading") {
    return (
        <div className="custom-loader-wrapper">
          <div className="custom-loader">
            <div className="spinner-ring"></div>
            <img src={logoFull} alt="Enjaz Loading" className="loader-logo" />
          </div>
        </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
