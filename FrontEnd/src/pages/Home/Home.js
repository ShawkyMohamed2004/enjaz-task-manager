import React from "react";
import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./Home.css";
import Navbar from "../../components/Navbar.js";
import TopHeader from "../../components/TopHeader.js";
import { Outlet, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import Aos from "aos";
import "aos/dist/aos.css";
import logoFull from "../../assets/logos/logo-full.png";

const Home = ({ tasks, clearAllData }) => {
  const [loading, setLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const navigate = useNavigate();

    useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newVal = !isDesktopCollapsed;
      setIsDesktopCollapsed(newVal);
      localStorage.setItem('sidebarCollapsed', newVal);
    }
  };

  return (
    <>
      {loading ? (
        <div className="custom-loader-wrapper">
          <div className="custom-loader">
            <div className="spinner-ring"></div>
            <img src={logoFull} alt="Enjaz Loading" className="loader-logo" />
          </div>
        </div>
      ) : (
        <div className="main-home-container">
          <Navbar 
            isMobileOpen={isMobileOpen} 
            setIsMobileOpen={setIsMobileOpen} 
            isDesktopCollapsed={isDesktopCollapsed}
            clearAllData={clearAllData}
          />
          <div className="content-wrapper">
            <TopHeader tasks={tasks} toggleSidebar={toggleSidebar} clearAllData={clearAllData} />
            <div className="outlet-container">
              <Outlet />
              <footer className="home-footer">
                <div className="footer-content">
                  <div className="footer-left">
                    <button
                      type="button"
                      className="footer-logo-link"
                      onClick={() => navigate("/Home")}
                      title="Go to Dashboard"
                    >
                      <img src={logoFull} alt="Enjaz Logo" className="footer-logo" />
                    </button>
                  </div>
                  
                  <div className="footer-center">
                    <p className="copyright">&copy; 2026 ENJAZ. All rights reserved.</p>
                  </div>

                  <div className="footer-right">
                    <a href="https://github.com/ShawkyMohamed2004/enjaz-task-manager" target="_blank" rel="noreferrer" className="glass-link">
                      <FaGithub size={18} /> <span>GitHub Repo</span>
                    </a>
                    <a href="https://linktr.ee/shawky_mohamed" target="_blank" rel="noreferrer" className="glass-link">
                      <SiLinktree size={18} /> <span>LinkTree</span>
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
