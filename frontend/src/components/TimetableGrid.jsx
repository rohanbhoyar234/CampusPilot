import React from "react";
import "./TimetableGrid.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5"];

const TimetableGrid = ({ timetable }) => {
  return (
    <div>
      {Object.entries(timetable).map(([className, schedule]) => (
        <div key={className} className="class-grid">
          <h2>{className}</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                {PERIODS.map((p, i) => (
                  <th key={i}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td>{day}</td>
                  {schedule[day].map((entry, i) => (
                    <td key={i}>
                      {entry ? (
                        `${entry.subject} (${entry.teacher})`
                      ) : (
                        <span className="free">Free</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TimetableGrid;
