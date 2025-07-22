import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MarkAttendance.css";

const MarkAttendance = () => {
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [teaches, setTeaches] = useState([]);

  const facultyId = JSON.parse(localStorage.getItem("user"))?.facultyId || "";

  // ✅ Fetch latest subjects taught by faculty
  useEffect(() => {
    const fetchTeaches = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URI}/api/attendance/faculty/${facultyId}`
        );
        setTeaches(res.data?.teaches || []);
      } catch (err) {
        console.error("Failed to fetch teaches", err);
      }
    };

    if (facultyId) fetchTeaches();
  }, [facultyId]);

  // ✅ Fetch students based on year, branch, and subject
  useEffect(() => {
    const fetchStudents = async () => {
      if (!branch || !year || !subject) return;

      try {
        const res = await axios.get(
          `${process.env.BACKEND_URI}/api/attendance/students/${year}/${branch}/${subject}`
        );
        setStudents(res.data || []);
        setAttendance({});
        setMessage("");
      } catch (err) {
        console.error("Failed to fetch students", err);
        setMessage("No student found !!");
      }
    };

    fetchStudents();
  }, [branch, year, subject]);

  const handleCheckboxChange = (studentId, isChecked) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isChecked ? "Present" : "Absent",
    }));
  };

  const handleSubmit = async () => {
    if (!subject || !branch || !year || students.length === 0) {
      setMessage("Please fill all fields and ensure students are loaded.");
      return;
    }

    const studentArray = students.map((student) => ({
      studentId: student.studentId,
      status: attendance[student.studentId] || "Absent",
    }));

    try {
      const res = await axios.post(
        `${process.env.BACKEND_URI}/api/attendance/mark`,
        {
          facultyId,
          subject,
          className: `${year}${branch}`,
          date,
          students: studentArray,
        }
      );

      setMessage(res.data.message || "Attendance marked successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance.");
    }
  };

  return (
    <div className="mark-attendance-container">
      <h2>Mark Attendance</h2>

      <div className="attendance-form">
        <label>
          Select Subject:
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">-- Select --</option>
            {teaches.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Branch:
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="CSE">CSE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="ELEC">ELEC</option>
            <option value="ARTS">ARTS</option>
          </select>
        </label>

        <label>
          Select Year:
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
          </select>
        </label>

        <label>
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      {students.length > 0 && (
        <div className="student-list">
          <h3>
            Students in {year} {branch}
          </h3>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Present</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentId}</td>
                  <td>{s.fullName}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={attendance[s.studentId] === "Present"}
                      onChange={(e) =>
                        handleCheckboxChange(s.studentId, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit} className="submit-btn">
            Submit Attendance
          </button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default MarkAttendance;
