import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [loginCount, setLoginCount] = useState(0);
  const [loginTrend, setLoginTrend] = useState([]);
  const [courseEngagement, setCourseEngagement] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    setLoginCount(4332);
    setLoginTrend([
      { date: "Mon", logins: 210 },
      { date: "Tue", logins: 300 },
      { date: "Wed", logins: 430 },
      { date: "Thu", logins: 320 },
      { date: "Fri", logins: 480 },
    ]);
    setCourseEngagement([
      { name: "CSE", value: 45 },
      { name: "ECE", value: 25 },
      { name: "IT", value: 20 },
      { name: "ME", value: 10 },
    ]);
    setRecentActivities([
      "Uploaded Exam Timetable",
      "Updated Class Roster",
      "Seating Plan Published",
      "New User Registered",
    ]);
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title"> Academic Dashboard</h2>

      <div className="dashboard-grid">
        <div className="card card-highlight">
          <h3>Students Logged In Today</h3>
          <p className="card-value">{loginCount.toLocaleString()}</p>
          <p className="card-subtext">+830 since yesterday</p>
        </div>

        <div className="card card-highlight">
          <h3>Course Engagement</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={courseEngagement}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  label
                >
                  {courseEngagement.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-highlight">
          <h3>System Performance</h3>
          <ul className="perf-list">
            <li>
              Server Load: <span>60%</span>
            </li>
            <li>
              Uptime: <span>99.9%</span>
            </li>
            <li>
              Status: <span className="online-status"> Online</span>
            </li>
          </ul>
        </div>

        <div className="card card-highlight">
          <h3>Recent Activities</h3>
          <ul className="activity-list">
            {recentActivities.map((item, i) => (
              <li key={i}> {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-chart">
        <h3> Daily Logins Overview</h3>
        <div className="chart-box-line">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loginTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#4a90e2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
