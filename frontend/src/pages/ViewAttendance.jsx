import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./ViewAttendance.css";

const COLORS = ["#00C49F", "#FF8042"]; // Present: green, Absent: orange

const ViewAttendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.studentId;

  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URI
          }/api/attendance/student/${studentId}`
        );
        setAttendanceData(res.data || {});
      } catch (err) {
        console.error("Error loading attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  const getChartData = (records) => {
    const presentCount = records.filter((r) => r.status === "Present").length;
    const absentCount = records.length - presentCount;

    return [
      { name: "Present", value: presentCount },
      { name: "Absent", value: absentCount },
    ];
  };

  return (
    <div className="attendance-view-container">
      <h2>Your Attendance</h2>

      <div className="attendance-search-wrapper">
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="attendance-search"
        />
      </div>

      {loading ? (
        <p>Loading attendance data...</p>
      ) : Object.keys(attendanceData).length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        Object.entries(attendanceData)
          .filter(([subject]) =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([subject, records]) => (
            <div key={subject} className="subject-block">
              <h3>{subject}</h3>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getChartData(records)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {getChartData(records).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Table */}
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={idx}>
                      <td>{rec.date}</td>
                      <td
                        style={{
                          color: rec.status === "Present" ? "green" : "red",
                        }}
                      >
                        {rec.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="summary">
                Present: {records.filter((r) => r.status === "Present").length}{" "}
                / Total: {records.length} —{" "}
                {Math.round(
                  (records.filter((r) => r.status === "Present").length /
                    records.length) *
                    100
                )}
                %
              </p>
            </div>
          ))
      )}
    </div>
  );
};

export default ViewAttendance;
