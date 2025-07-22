import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./GenerateTimetable.css";
import TimetableGrid from "../../components/TimetableGrid";

const GenerateTimetable = () => {
  const [excelData, setExcelData] = useState(null);
  const [timetable, setTimetable] = useState({});
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(new Uint8Array(evt.target.result), {
        type: "array",
      });
      const sheet = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setExcelData(parseData(sheet));
    };
    reader.readAsArrayBuffer(file);
  };

  const parseData = (data) => {
    const classes = {};
    const teachers = [];

    data.forEach((row) => {
      if (row.type === "class") {
        classes[row.name] = row["subjects / teaches"].split(",").map((s) => {
          const [subject, count] = s.trim().split(":");
          return {
            name: subject.trim(),
            sessionsPerWeek: parseInt(count.trim()),
          };
        });
      } else if (row.type === "teacher") {
        teachers.push({
          name: row.name.trim(),
          facultyId: row.facultyId?.trim() || "",
          teaches: row["subjects / teaches"].split(",").map((s) => s.trim()),
        });
      }
    });

    return { classes, teachers };
  };

  const uploadData = async () => {
    try {
      await axios.post("http://localhost:5000/api/timetable/upload", excelData);
      const res = await axios.post("http://localhost:5000/api/timetable/auto");
      setTimetable(res.data.timetable);
      setMessage("Timetable generated successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to generate timetable");
    }
  };

  const publishAll = async () => {
    try {
      const publishRequests = Object.keys(timetable).map((key) => {
        const [branch, year] = key.split("_");
        return axios.post("http://localhost:5000/api/timetable/publish", {
          branch,
          year,
          published: true,
        });
      });
      await Promise.all(publishRequests);
      setMessage("All timetables published successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to publish timetables");
    }
  };

  return (
    <div className="timetable-page">
      <h2>Auto Generate Timetable</h2>

      <div className="timetable-card centered-card">
        <input
          type="file"
          onChange={handleFile}
          accept=".xlsx,.xls"
          className="file-input"
        />

        <button onClick={uploadData} className="generate-btn">
          Generate Timetable
        </button>

        {timetable && Object.keys(timetable).length > 0 && (
          <button onClick={publishAll} className="publish-btn">
            Publish All
          </button>
        )}

        <p className="message">{message}</p>
      </div>

      {timetable && Object.keys(timetable).length > 0 && (
        <div className="timetable-container">
          <TimetableGrid timetable={timetable} />
        </div>
      )}
    </div>
  );
};

export default GenerateTimetable;
