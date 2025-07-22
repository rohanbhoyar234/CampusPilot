import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentExamPage.css";

const StudentExamPage = () => {
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(" Logged in user:", parsedUser);
      setUser(parsedUser);
    }

    axios
      .get("http://localhost:5000/api/publish/seating")
      .then((res) => {
        console.log(" Fetched seating plan:", res.data);
        setPlan(res.data);
      })
      .catch((err) => console.error(" Error fetching seating:", err));
  }, []);

  if (!plan || !user) return <p>Loading or No Seating Plan Published</p>;

  const groupByRoom = (list) => {
    return list.reduce((acc, item) => {
      acc[item.roomNo] = acc[item.roomNo] || [];
      acc[item.roomNo].push(item);
      return acc;
    }, {});
  };

  const filteredStudents = (plan.students || []).filter((s) => {
    const match =
      s.branch?.trim().toLowerCase() === user.branch?.trim().toLowerCase() &&
      s.year?.trim().toLowerCase() === user.year?.trim().toLowerCase();

    const rollMatch = s.rollNo === user.rollNo;

    console.log(" Comparing:", {
      rollNoMatch: rollMatch,
      branchMatch: s.branch,
      yearMatch: s.year,
      classMatch: s.className,
    });

    return match || rollMatch;
  });

  const groupedStudents = groupByRoom(filteredStudents);
  const groupedInvigilators = groupByRoom(plan.invigilators || []);
  const classroomMeta = plan.classrooms || [];

  const getClassroomLayout = (roomNo) => {
    const room = classroomMeta.find((r) => r.roomNo === roomNo);
    return {
      rows: room?.rows || 1,
      columns: room?.columns || 1,
    };
  };

  // ✅ Correct exam time to fall within 10 AM – 3 PM
  let examDate = new Date(plan.examDate);
  let hour = examDate.getHours();

  if (hour < 10) {
    examDate.setHours(10, 0, 0); // force to 10:00 AM
  } else if (hour > 15) {
    examDate.setHours(15, 0, 0); // force to 3:00 PM
  }

  return (
    <div className="exam-page">
      <h2> Published Seating Plan</h2>

      {plan.examDate && (
        <p>
          <strong>Exam Date:</strong> {examDate.toLocaleDateString()} |{" "}
          <strong>Time:</strong>{" "}
          {examDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      )}

      <h3> Your Seating Grid</h3>

      {filteredStudents.length === 0 && (
        <p className="no-seating-msg">
          No seating assigned for your class or section.
        </p>
      )}

      {Object.entries(groupedStudents).map(([roomNo, students]) => {
        const { rows, columns } = getClassroomLayout(roomNo);

        const grid = Array.from({ length: rows }, () =>
          Array.from({ length: columns }, () => "")
        );

        students.forEach((s) => {
          if (
            s.row >= 0 &&
            s.row < rows &&
            s.column >= 0 &&
            s.column < columns
          ) {
            grid[s.row][s.column] = s.rollNo;
          }
        });

        return (
          <div className="room-grid-section" key={roomNo}>
            <h4>Room: {roomNo}</h4>
            <div className="room-grid">
              {grid.map((row, i) => (
                <div className="grid-row" key={i}>
                  {row.map((cell, j) => (
                    <div
                      className={`grid-cell ${
                        cell === user.rollNo ? "highlight-me" : ""
                      }`}
                      key={j}
                    >
                      {cell || "-"}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <h3 className="invigilator-title"> Invigilators</h3>
      <div className="invigilator-section">
        {Object.entries(groupedInvigilators).map(([room, teachers]) => (
          <div className="invigilator-room-card" key={room}>
            <div className="invigilator-room-title">Room: {room}</div>
            <ul>
              {teachers.map((t, idx) => (
                <li className="invigilator-name" key={idx}>
                  {t.teacherName}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentExamPage;
