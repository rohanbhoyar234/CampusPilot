import React, { useState } from "react";
import "./UploadSeatingPlan.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadSeatingPlan = () => {
  const [studentFile, setStudentFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [classroomFile, setClassroomFile] = useState(null);
  const [status, setStatus] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file, type) => {
    if (!file) {
      setStatus(`Please upload a ${type} file`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setStatus(`Uploading ${type}...`);

    try {
      const url = `http://localhost:5000/api/seating/upload-${type}`;
      await axios.post(url, formData);
      setStatus(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`
      );
    } catch (error) {
      console.error(error);
      setStatus(`Failed to upload ${type}`);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setStatus("Generating seating plan...");
      const res = await axios.post(
        "http://localhost:5000/api/seating/generate-plan"
      );

      console.log("Generated Seating Plan Response:", res.data);

      if (res.data?.plan) {
        setGeneratedPlan(res.data.plan);
        setStatus(
          "Seating plan generated. Please publish to make it visible to students."
        );
      } else {
        setStatus("No valid seating plan received.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Failed to generate seating plan.");
    }
  };

  const handlePublishPlan = async () => {
    try {
      if (!generatedPlan) {
        setStatus("No seating plan available to publish.");
        return;
      }

      setStatus("Publishing seating plan...");

      await axios.post("http://localhost:5000/api/publish/seating", {
        data: JSON.parse(JSON.stringify(generatedPlan)),
      });

      setStatus("Seating plan published successfully.");
      setTimeout(() => navigate("/admin/view-seating"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("Failed to publish seating plan.");
    }
  };

  return (
    <div className="seating-container">
      <h2>Seating Arrangement Inputs</h2>

      <div className="file-sections">
        <div className="section">
          <h3>Upload Students Excel</h3>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setStudentFile(e.target.files[0])}
          />
          <button onClick={() => handleFileUpload(studentFile, "students")}>
            Upload Students
          </button>
        </div>

        <div className="section">
          <h3>Upload Teachers Excel</h3>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setTeacherFile(e.target.files[0])}
          />
          <button onClick={() => handleFileUpload(teacherFile, "teachers")}>
            Upload Teachers
          </button>
        </div>

        <div className="section">
          <h3>Upload Classrooms Excel</h3>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setClassroomFile(e.target.files[0])}
          />
          <button onClick={() => handleFileUpload(classroomFile, "classrooms")}>
            Upload Classrooms
          </button>
        </div>
      </div>

      <div>
        <button onClick={handleGeneratePlan}>Generate Seating Plan</button>
      </div>

      {generatedPlan && (
        <div className="publish-btn">
          <button onClick={handlePublishPlan}>Publish Seating Plan</button>
        </div>
      )}

      <p className="status-msg">{status}</p>
    </div>
  );
};

export default UploadSeatingPlan;
