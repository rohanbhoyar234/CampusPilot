import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthLayout.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.BACKEND_URI}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "student" && data.user.studentId) {
        localStorage.setItem("studentId", data.user.studentId);
      }
      if (data.user.role === "faculty" && data.user.facultyId) {
        localStorage.setItem("facultyId", data.user.facultyId);
      }

      window.dispatchEvent(new Event("storage"));

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card-left">
          <div className="form-box">
            <h2>Login</h2>

            {/* ✅ Hidden dummy form to trigger browser autofill */}
            <form
              action="https://example.com/login"
              method="post"
              autoComplete="on"
              style={{ display: "none" }}
            >
              <input name="email" type="email" autoComplete="email" />
              <input
                name="password"
                type="password"
                autoComplete="current-password"
              />
              <button type="submit">Login</button>
            </form>

            {/* ✅ Your actual form */}
            <form onSubmit={handleSubmit} autoComplete="on">
              <input
                type="email"
                name="email"
                autoComplete="email"
                autoCorrect="off"
                spellCheck="false"
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                autoCorrect="off"
                spellCheck="false"
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button type="submit">Login</button>
            </form>

            {error && <p className="error">{error}</p>}
            <p className="redirect">
              Don’t have an Account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>

        <div className="auth-card-right">
          <h2>Welcome Back !!</h2>
          <img src="/images/auth-illustration.svg" alt="illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
