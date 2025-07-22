import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthLayout.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: "",
    facultyId: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    branch: "",
    year: "",
    className: "",
    teaches: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };

    if (form.role === "student") {
      if (!form.studentId?.trim()) {
        setError("Student ID is required.");
        return;
      }

      payload.studentId = form.studentId.trim();

      const hasCollegeInfo = form.branch && form.year;
      const hasSchoolInfo = form.className;

      if (!hasCollegeInfo && !hasSchoolInfo) {
        setError("Please provide either branch/year or class name.");
        return;
      }

      if (hasCollegeInfo) {
        payload.branch = form.branch;
        payload.year = form.year;
      } else if (hasSchoolInfo) {
        payload.className = form.className.trim();
      }
    }

    if (form.role === "faculty") {
      if (!form.facultyId?.trim()) {
        setError("Faculty ID is required.");
        return;
      }
      if (!form.teaches?.trim()) {
        setError("Subjects are required.");
        return;
      }

      payload.facultyId = form.facultyId.trim();
      payload.teaches = form.teaches.split(",").map((s) => s.trim());
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");

      alert("🎉 Registered successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card-left">
          <div className="form-box">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
              {form.role === "student" && (
                <input
                  name="studentId"
                  type="text"
                  placeholder="Student ID"
                  onChange={handleChange}
                  required
                />
              )}

              {form.role === "faculty" && (
                <>
                  <input
                    name="facultyId"
                    type="text"
                    placeholder="Faculty ID"
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="teaches"
                    type="text"
                    placeholder="Subjects (comma-separated)"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <select
                name="role"
                onChange={handleChange}
                required
                value={form.role}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>

              {form.role === "student" && (
                <>
                  <select
                    name="branch"
                    onChange={handleChange}
                    value={form.branch}
                  >
                    <option value="">Select Branch (if College)</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                  </select>

                  <select name="year" onChange={handleChange} value={form.year}>
                    <option value="">Select Year (if College)</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>

                  <input
                    name="className"
                    type="text"
                    placeholder="Class Name (if School)"
                    onChange={handleChange}
                    value={form.className}
                  />
                </>
              )}

              <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p className="redirect">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>

        <div className="auth-card-right">
          <h2>Welcome to Campus Pilot!</h2>
          <img src="/images/auth-illustration.svg" alt="illustration" />
        </div>
      </div>
    </div>
  );
};

export default Register;
