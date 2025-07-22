import React, { useState, useEffect } from "react";
import "./PersonalHome.css";
import {
  FaUser,
  FaGraduationCap,
  FaUserShield,
  FaChalkboardTeacher,
} from "react-icons/fa";

const PersonalHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [typedText, setTypedText] = useState("");
  const fullText = `Welcome, ${user.fullName || "User"}!`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [fullText]);

  const getRoleIcon = (role) => {
    switch (role) {
      case "student":
        return <FaGraduationCap />;
      case "faculty":
        return <FaChalkboardTeacher />;
      case "admin":
        return <FaUserShield />;
      default:
        return <FaUser />;
    }
  };

  return (
    <div className="personal-home-wrapper">
      <div className="personal-card">
        <div className="avatar-box">
          <img
            src="/images/avatar-placeholder.png"
            alt="avatar"
            className="avatar-img"
          />
        </div>

        <h2 className="welcome">{typedText}</h2>

        <div className="info-grid">
          <div className="info-item">
            <span className="label">Role:</span>
            <span className="value role-value">
              {user?.role?.toUpperCase()}
            </span>
          </div>
          {user?.studentId && (
            <div className="info-item">
              <span className="label">Student ID:</span>
              <span className="value">{user.studentId}</span>
            </div>
          )}
          {user?.email && (
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
          )}
        </div>

        <p className="quote">
          “Arise,Awake stop not until your goal is achieved” <br />– Swami
          Vivekananda
        </p>
      </div>
    </div>
  );
};

export default PersonalHome;
