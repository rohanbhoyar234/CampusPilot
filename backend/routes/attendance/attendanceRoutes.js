// routes/attendance/attendanceRoutes.js

import express from "express";
import Attendance from "../../models/attendance/Attendance.js";
import User from "../../models/User.js";
import Timetable from "../../models/timeTable/Timetable.js";

const router = express.Router();


router.post("/mark", async (req, res) => {
  const { facultyId, subject, className, date, students } = req.body;

  try {
    const existing = await Attendance.findOne({
      facultyId,
      subject,
      className,
      date: new Date(date).toISOString().split("T")[0],
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this class and date." });
    }

    const newAttendance = new Attendance({
      date,
      facultyId,
      subject,
      className,
      students,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance marked successfully." });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// faculty 
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const faculty = await User.findOne({ facultyId: req.params.facultyId });
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json(faculty);
  } catch (err) {
    console.error("Error fetching faculty info:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/students/:year/:branch/:subject", async (req, res) => {
  const { year, branch, subject } = req.params;

  try {
   
    const timetable = await Timetable.findOne({ year, branch });

    if (!timetable) {
      return res.status(404).json({
        message: `No timetable found for ${year} - ${branch}`,
      });
    }

    
    const schedule = timetable.schedule || {};
    const allSubjects = new Set();

    Object.values(schedule).forEach((dayArray) => {
      if (Array.isArray(dayArray)) {
        dayArray.forEach((period) => {
          if (period && typeof period === "object" && period.subject) {
            allSubjects.add(period.subject);
          }
        });
      }
    });

    
    if (!allSubjects.has(subject)) {
      return res.status(400).json({
        message: `"${subject}" is not part of the timetable for ${branch} - ${year}`,
      });
    }

    const students = await User.find({
      role: "student",
      year,
      branch,
    });

    res.json(students);
  } catch (err) {
    console.error("Error fetching students by year, branch, subject:", err);
    res.status(500).json({ message: "Server error" });
  }
});






router.get("/student/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const records = await Attendance.find({
      "students.studentId": studentId,
    });

    
    const result = {};

    records.forEach((rec) => {
      const matched = rec.students.find((s) => s.studentId === studentId);
      if (!matched) return;

      if (!result[rec.subject]) {
        result[rec.subject] = [];
      }

      result[rec.subject].push({
        date: rec.date,
        status: matched.status,
      });
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching student attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
