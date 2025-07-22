import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFilter,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminDropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleStorageChange = () => {
      const newUser = localStorage.getItem("user");
      setUser(newUser ? JSON.parse(newUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(e.target)
      ) {
        setAdminOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/home" : "/"} className="logo">
          Campus Pilot
        </Link>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to={user ? "/home" : "/"}>
            <FaHome className="icon" /> Home
          </Link>

          {user?.role === "student" && (
            <>
              <Link to="/student-timetable">
                <FaUserGraduate className="icon" /> My Courses
              </Link>
              <Link to="/exams">
                <FaFilter className="icon" /> Exams
              </Link>
              <Link to="/my-analytics">
                <FaUserGraduate className="icon" /> My Analytics
              </Link>
              <Link to="view-attendance"> Attendance</Link>
            </>
          )}

          {user?.role === "faculty" && (
            <>
              <Link to="/faculty-timetable">
                <FaChalkboardTeacher className="icon" /> Classes
              </Link>
              <Link to="/mark-attendance">Attendance</Link>
            </>
          )}

          {user?.role === "admin" && (
            <div className="dropdown-click" ref={adminDropdownRef}>
              <div
                className="dropdown-trigger"
                onClick={() => setAdminOpen(!adminOpen)}
              >
                <FaUserShield className="icon" /> Admin Panel ▾
              </div>
              {adminOpen && (
                <div className="dropdown-menu-click">
                  {/* <Link to="/dashboard" onClick={() => setAdminOpen(false)}>
                    Dashboard
                  </Link> */}
                  <Link to="/user-admin" onClick={() => setAdminOpen(false)}>
                    Manage Users
                  </Link>
                  <Link
                    to="/seating-planner"
                    onClick={() => setAdminOpen(false)}
                  >
                    Seating Planner
                  </Link>
                  <Link
                    to="/generate-timetable"
                    onClick={() => setAdminOpen(false)}
                  >
                    Generate Timetable
                  </Link>
                  <Link to="/analytics" onClick={() => setAdminOpen(false)}>
                    Analytics
                  </Link>
                </div>
              )}
            </div>
          )}
          {/* 
          <Link to="/about">
            <FaInfoCircle className="icon" /> About
          </Link>
          <Link to="/contact">
            <FaEnvelope className="icon" /> Contact
          </Link> */}
        </div>

        <div className="auth-buttons">
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="icon" /> Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              <FaSignInAlt className="icon" /> Login
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
