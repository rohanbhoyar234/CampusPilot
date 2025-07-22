import React, { useEffect, useState } from "react";
import axios from "axios";
import TimetableGrid from "../components/TimetableGrid";
import "./StudentTimetable.css";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "student" || !user.branch || !user.year) {
      setMessage("Invalid or missing student information");
      return;
    }

    const fetchTimetable = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/timetable/student`,
          {
            params: {
              branch: user.branch,
              year: user.year,
            },
          }
        );
        setTimetable(res.data.schedule);
      } catch (err) {
        console.error(err);
        setMessage("Timetable not published yet");
        setTimetable(null);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="student-timetable-page">
      <h2>My Timetable</h2>
      <p className="message">{message}</p>
      {timetable ? (
        <TimetableGrid
          timetable={{
            [`${JSON.parse(localStorage.getItem("user")).year}_${
              JSON.parse(localStorage.getItem("user")).branch
            }`]: timetable,
          }}
        />
      ) : (
        <p>No timetable to display</p>
      )}
    </div>
  );
};

export default StudentTimetable;
