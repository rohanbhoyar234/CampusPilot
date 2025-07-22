import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./StudentAnalytics.css";
import { GrAchievement } from "react-icons/gr";
import { FaChartLine, FaRegTired } from "react-icons/fa";

const StudentAnalytics = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URI}/api/admin/student/${studentId}`
        );
        setStudentData(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [studentId]);

  const hasScores =
    studentData &&
    studentData.subjectScores &&
    Object.keys(studentData.subjectScores).length > 0;

  const chartData = studentData
    ? Object.entries(studentData.subjectScores).map(([subject, score]) => ({
        subject,
        score,
      }))
    : [];

  const getBarColor = (score) => {
    if (score > 70) return "#26a69a";
    if (score >= 35) return "#ffa726";
    return "#ef5350";
  };

  const renderLegend = () => (
    <ul className="custom-legend">
      <li>
        <span className="legend-box" style={{ backgroundColor: "#26a69a" }} />
        Excellent (71+)
      </li>
      <li>
        <span className="legend-box" style={{ backgroundColor: "#ffa726" }} />
        Needs Improvement (35–70)
      </li>
      <li>
        <span className="legend-box" style={{ backgroundColor: "#ef5350" }} />
        Poor (&lt; 35)
      </li>
    </ul>
  );

  const scores = chartData.map((s) => s.score);
  const average = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
    : null;

  const topSubject = chartData.reduce(
    (top, curr) => (curr.score > top.score ? curr : top),
    { subject: "", score: -1 }
  );

  const weakSubject = chartData.reduce(
    (min, curr) => (curr.score < min.score ? curr : min),
    { subject: "", score: 101 }
  );

  const getMessage = (avg) => {
    if (avg >= 85) {
      return (
        <>
          <GrAchievement style={{ marginRight: "6px", color: "#4caf50" }} />
          You're doing great! Keep it up!
        </>
      );
    }
    if (avg >= 60) {
      return (
        <>
          <FaChartLine style={{ marginRight: "6px", color: "#ffa726" }} />
          You're on the right track. A little more effort!
        </>
      );
    }
    return (
      <>
        {/* <FaRegTired style={{ marginRight: "6px", color: "#ef5350" }} /> */}
        Let’s focus more on improvement!
      </>
    );
  };

  // 📊 Pie Chart Distribution
  const distribution = { excellent: 0, average: 0, poor: 0 };
  chartData.forEach(({ score }) => {
    if (score > 70) distribution.excellent++;
    else if (score >= 35) distribution.average++;
    else distribution.poor++;
  });

  const pieData = [
    {
      name: "Excellent (71+)",
      value: distribution.excellent,
      color: "#26a69a",
    },
    {
      name: "Needs Improvement (35–70)",
      value: distribution.average,
      color: "#ffa726",
    },
    { name: "Poor (<35)", value: distribution.poor, color: "#ef5350" },
  ];

  // 🎯 Progress to Goal
  // Target Score Logic
  const [targetScore, setTargetScore] = useState(
    () => localStorage.getItem("targetScore") || ""
  );

  const handleTargetChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 1 && value <= 100)) {
      setTargetScore(value);
      localStorage.setItem("targetScore", value);
    }
  };

  const progressToGoal =
    average && targetScore
      ? Math.min((average / targetScore) * 100, 100).toFixed(1)
      : 0;

  return (
    <div className="student-analytics-container">
      <h2>Your Analytics Dashboard</h2>

      {loading && <p>Loading your data...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && studentData && (
        <div className="student-analytics-card">
          <h3>
            {studentData.name || "Student"} ({studentData.studentId || "N/A"})
          </h3>

          {hasScores ? (
            <>
              {/* Summary */}
              <div className="summary-box">
                <p className="motivator">{getMessage(average)}</p>
                <p>
                  <strong>Top Subject:</strong> {topSubject.subject} (
                  {topSubject.score})
                </p>
                <p>
                  <strong>Weakest Subject:</strong> {weakSubject.subject} (
                  {weakSubject.score})
                </p>
                <p>
                  <strong>Average Score:</strong> {average}
                </p>
                <div className="progress-bar">
                  <div
                    className="fill"
                    style={{
                      width: `${average}%`,
                      backgroundColor: getBarColor(average),
                    }}
                  ></div>
                </div>
                {/* 🎯 Goal Target Setter */}
                {/* <div className="goal-setting">
                  <label htmlFor="targetInput">
                    <strong>🎯 Set Your Target Score:</strong>
                  </label>
                  <input
                    id="targetInput"
                    type="number"
                    min="1"
                    max="100"
                    value={targetScore}
                    onChange={handleTargetChange}
                    placeholder="e.g., 75"
                    className="target-input"
                  />
                </div> */}

                {targetScore && (
                  <div className="goal-tracker">
                    <h4>📊 Progress Toward Your Goal</h4>
                    <div className="goal-chart">
                      <CircularProgressbar
                        value={progressToGoal}
                        text={`${progressToGoal}%`}
                        styles={buildStyles({
                          pathColor:
                            average >= targetScore ? "#26a69a" : "#ffa726",
                          textColor: "#003366",
                          trailColor: "#d6e0f5",
                          textSize: "14px",
                        })}
                      />
                    </div>
                    <p className="goal-text">
                      You're at <strong>{average}%</strong> of your goal of{" "}
                      <strong>{targetScore}%</strong>
                    </p>
                  </div>
                )}

                {/* 🎯 Goal Progress */}
              </div>

              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" tick={window.innerWidth > 768} />
                  <YAxis />
                  <Tooltip />
                  <Legend content={renderLegend} />
                  <Bar dataKey="score">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.score)}
                      />
                    ))}
                    <LabelList
                      dataKey="subject"
                      position="top"
                      content={({ x, y, width, value }) => {
                        if (window.innerWidth <= 768) {
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 5}
                              textAnchor="middle"
                              fontSize="12"
                              fill="#003366"
                            >
                              {value}
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Pie Chart */}
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <h4>Score Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p className="no-data">
              No analytics data available yet. Please contact your
              administrator.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;
