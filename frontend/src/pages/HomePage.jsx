import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTheme("light");
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  const handleCardClick = () => {
    navigate("/login");
  };

  return (
    <section className={`homepage-section ${theme}`}>
      <div className="homepage-content-container">
        <h1 className="homepage-title">CAMPUS PILOT</h1>
        <p className="homepage-subtitle">Integrates The Campus</p>

        <div className="homepage-user-cards">
          <div className="user-card" onClick={handleCardClick}>
            <h3>Student</h3>
            <p>Login to access your dashboard, attendance, and updates.</p>
          </div>
          <div className="user-card" onClick={handleCardClick}>
            <h3>Faculty</h3>
            <p>Manage classes, mark attendance, and view analytics.</p>
          </div>
          <div className="user-card" onClick={handleCardClick}>
            <h3>Admin</h3>
            <p>Control users, view insights, and manage infrastructure.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
