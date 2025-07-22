import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-background" />

      <div className="hero-content">
        <h1 className="hero-title">Welcome to Campus Planner</h1>
        <p className="hero-subtitle">Smart Academic Scheduling & Automation</p>
      </div>
    </div>
  );
};

export default HeroSection;
