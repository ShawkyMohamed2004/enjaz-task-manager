import React, { useEffect, useState } from "react";
import { IoMdSunny, IoIosMoon } from "react-icons/io";
import "./darkmode.css";

const DarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.querySelector("body").setAttribute("data-theme", "dark");
      setIsDark(true);
    } else {
      document.querySelector("body").setAttribute("data-theme", "light");
      setIsDark(false);
    }
  }, []);

  const changeTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    const theme = newMode ? 'dark' : 'light';
    document.querySelector("body").setAttribute("data-theme", theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="modern-darkmode" onClick={changeTheme}>
      <div className={`mode-pill ${isDark ? 'dark-active' : ''}`}>
        <div className="mode-slider">
          {isDark ? <IoIosMoon size={14} color="#0F172A" /> : <IoMdSunny size={14} color="#D97706" />}
        </div>
      </div>
    </div>
  );
};

export default DarkMode;
