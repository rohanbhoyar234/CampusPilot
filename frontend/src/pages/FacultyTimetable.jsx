import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentTimetable.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [
  "Lecture 1",
  "Lecture 2",
  "Lecture 3",
  "Lecture 4",
  "Lecture 5",
];

const FacultyTimetable = () => {
  const [mergedSchedule, setMergedSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [facultyName, setFacultyName] = useState("");

  const facultyId = localStorage.getItem("facultyId");

  useEffect(() => {
    if (!facultyId) return;

    const fetchTimetable = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URI}/api/timetable/faculty/${facultyId}`
        );

        setFacultyName(res.data.facultyName);
        const timetables = res.data.timetables || [];

        const combined = {};
        for (const day of DAYS) {
          combined[day] = Array(5)
            .fill()
            .map(() => []);
        }

        timetables.forEach((tt) => {
          for (const day of DAYS) {
            if (!tt.schedule[day]) continue;

            tt.schedule[day].forEach((period, idx) => {
              if (period) {
                combined[day][idx].push({
                  subject: period.subject,
                  class: `${tt.year} ${tt.branch}`,
                });
              }
            });
          }
        });

        setMergedSchedule(combined);
      } catch (err) {
        console.error("Error loading faculty timetable", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [facultyId]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title"> Timetable for {facultyName}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="timetable-grid">
          <table className="time-table">
            <thead>
              <tr>
                <th>Period / Day</th>
                {DAYS.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td>{PERIODS[i]}</td>
                  {DAYS.map((day) => (
                    <td key={day}>
                      {mergedSchedule[day] &&
                      mergedSchedule[day][i] &&
                      mergedSchedule[day][i].length > 0
                        ? mergedSchedule[day][i].map((entry, idx) => (
                            <div key={idx} style={{ marginBottom: "5px" }}>
                              <strong>{entry.subject}</strong>
                              <br />
                              <small>{entry.class}</small>
                            </div>
                          ))
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="timetable-message">
            <h3> Have a Great Day !! </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyTimetable;
