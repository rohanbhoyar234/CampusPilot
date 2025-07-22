import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewSeatingPlan.css";

const ViewSeatingPlan = () => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/seating/latest-plan"
        );
        console.log("📦 Seating Plan Fetched:", res.data);
        setPlan(res.data);
      } catch (err) {
        console.error("Failed to fetch plan", err);
      }
    };

    fetchPlan();
  }, []);

  if (!plan) return <p>Loading seating plan...</p>;

  return (
    <div className="view-plan-container">
      <h2>Generated Seating Plan</h2>

      {plan.examDate && (
        <h4>
          Exam Date:{" "}
          {new Date(plan.examDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </h4>
      )}

      <h3>Students</h3>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Room No</th>
          </tr>
        </thead>
        <tbody>
          {plan.students && plan.students.length > 0 ? (
            plan.students.map((s, i) => (
              <tr key={i}>
                <td>{s.rollNo}</td>
                <td>{s.roomNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No students assigned</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Invigilators</h3>
      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Room No</th>
          </tr>
        </thead>
        <tbody>
          {plan.invigilators && plan.invigilators.length > 0 ? (
            plan.invigilators.map((t, i) => (
              <tr key={i}>
                <td>{t.teacherName || "N/A"}</td>
                <td>{t.roomNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No invigilators assigned</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSeatingPlan;
