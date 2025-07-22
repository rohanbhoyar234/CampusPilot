import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

const AdminAnalytics = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [averageData, setAverageData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [studentAnalytics, setStudentAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/admin/upload-analytics",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message || "Upload successful");
      fetchAnalytics();
      fetchAverages();
    } catch (err) {
      console.error("Upload failed:", err.response || err.message);
      alert(
        "Upload failed: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/analytics");
      if (Array.isArray(res.data)) setAnalyticsData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // average
  const fetchAverages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/average");
      console.log("Averages API returned:", res.data);
      if (Array.isArray(res.data)) {
        setAverageData(res.data);
      } else {
        setAverageData([]);
      }
    } catch (err) {
      console.error("Failed to fetch averages:", err);
      setAverageData([]);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchAverages();
  }, []);

  // student search
  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/analytics/student/${searchId.trim()}`
      );
      setStudentAnalytics(res.data);
    } catch (err) {
      alert("Student not found or data not published");
      setStudentAnalytics(null);
    }
  };

  // publish for single
  const togglePublish = async (studentId, currentStatus) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/analytics/publish/${studentId}`,
        {
          published: !currentStatus,
        }
      );
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to toggle publish:", err);
    }
  };

  // Publish for All
  const handlePublishAll = async () => {
    try {
      await Promise.all(
        analyticsData.map((record) =>
          axios.post(
            `http://localhost:5000/api/admin/analytics/publish/${record.studentId}`,
            { published: true }
          )
        )
      );
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to publish all:", err);
    }
  };

  return (
    <div className="analytics-wrapper">
      <h2 className="analytics-heading">Upload Student Analytics</h2>

      <div className="analytics-card">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleFileUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Excel"}
        </button>
      </div>

      <div className="analytics-card">
        <button onClick={() => setShowAnalytics(!showAnalytics)}>
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </button>
      </div>

      {showAnalytics && (
        <>
          {/* Average Subject Performance */}
          <h3 className="analytics-subheading">Average Subject Performance</h3>
          {averageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics-note">No average data available.</p>
          )}

          <div className="analytics-card">
            <h4>Search Student Analytics</h4>
            <input
              type="text"
              placeholder="Enter Student ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {studentAnalytics && (
            <div className="analytics-card">
              <h4>
                Student: {studentAnalytics.name} ({studentAnalytics.studentId})
              </h4>
              <ul>
                {Object.entries(studentAnalytics.subjectScores).map(
                  ([subject, score]) => (
                    <li key={subject}>
                      {subject}: {score}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <div className="analytics-card">
            <button onClick={handlePublishAll}>Publish All</button>
          </div>

          <h3 className="analytics-subheading">Uploaded Records</h3>
          {analyticsData.length > 0 ? (
            <>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Subjects</th>
                    <th>Status</th>
                    <th>Publish</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? analyticsData : analyticsData.slice(0, 20)).map(
                    (record) => (
                      <tr key={record.studentId || record.name}>
                        <td>{record.studentId || "N/A"}</td>
                        <td>{record.name}</td>
                        <td>
                          {Object.entries(record.subjectScores).map(
                            ([subject, score]) => (
                              <div key={subject}>
                                {subject}: {score}
                              </div>
                            )
                          )}
                        </td>
                        <td>
                          {record.published ? "Published" : "Unpublished"}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              togglePublish(record.studentId, record.published)
                            }
                          >
                            {record.published ? "Unpublish" : "Publish"}
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {!showAll && analyticsData.length > 20 && (
                <div className="analytics-card" style={{ textAlign: "center" }}>
                  <button onClick={() => setShowAll(true)}>View All</button>
                </div>
              )}
            </>
          ) : (
            <p className="analytics-note">No analytics records yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
