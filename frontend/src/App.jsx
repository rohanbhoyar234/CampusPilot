import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadSeatingPlan from "./pages/admin/UploadSeatingPlan";
import ViewSeatingPlan from "./pages/admin/ViewSeatingPlan"; // ✅ Add this import
import GenerateTimetable from "./pages/admin/GenerateTimetable";
import StudentExamPage from "./pages/StudentExamPage";
import StudentAnalyticsPage from "./pages/admin/Analytics";
import StudentAnalytics from "./pages/StudentAnalytics";
import PersonalHome from "./pages/PersonalHome";
import AdminUserManager from "./pages/admin/AdminUserManager";
import StudentTimetable from "./pages/StudentTimetable";
import FacultyTimetable from "./pages/FacultyTimetable";
import Attendance from "./pages/MarkAttendance";
import ViewAttendance from "./pages/ViewAttendance";

import "./App.css";

// Temporary dummy pages
const Filters = () => <div className="page">Explore Filters</div>;
const About = () => <div className="page">About Us</div>;
const Contact = () => <div className="page">Contact Us</div>;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ✅ Admin Seating Planner Routes */}
        <Route path="/seating-planner" element={<UploadSeatingPlan />} />
        <Route path="/generate-timetable" element={<GenerateTimetable />} />
        <Route path="/exams" element={<StudentExamPage />} />
        <Route path="/analytics" element={<StudentAnalyticsPage />} />
        <Route path="/my-analytics" element={<StudentAnalytics />} />
        <Route path="/home" element={<PersonalHome />} />
        <Route path="/user-admin" element={<AdminUserManager />} />
        <Route path="/student-timetable" element={<StudentTimetable />} />
        <Route path="/faculty-timetable" element={<FacultyTimetable />} />
        <Route path="/mark-attendance" element={<Attendance />} />
        <Route path="/view-attendance" element={<ViewAttendance />} />
        <Route path="/admin/view-seating" element={<ViewSeatingPlan />} />{" "}
        {/* ✅ ADD THIS */}
      </Routes>
    </Router>
  );
}

export default App;
