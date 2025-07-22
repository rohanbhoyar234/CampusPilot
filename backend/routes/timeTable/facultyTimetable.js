// routes/timetable/facultyTimetable.js


import express from "express";
import Timetable from "../../models/timeTable/Timetable.js";
import User from "../../models/User.js";

const router = express.Router();


router.get("/faculty/:facultyId", async (req, res) => {
  const { facultyId } = req.params;

  try {
    const faculty = await User.findOne({ facultyId, role: "faculty" });
    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }

    const teacherName = faculty.fullName?.trim();
    if (!teacherName) {
      return res.status(400).json({ msg: "Faculty name missing" });
    }

    const allPublished = await Timetable.find({ published: true });

    const results = [];

    for (const tt of allPublished) {
      const filteredSchedule = {};
      let hasPeriods = false;

      for (const day of Object.keys(tt.schedule)) {
        filteredSchedule[day] = tt.schedule[day].map((period) => {
          if (period?.teacher?.trim() === teacherName) {
            hasPeriods = true;
            return period;
          }
          return null;
        });
      }

      if (hasPeriods) {
        results.push({
          branch: tt.branch,
          year: tt.year,
          schedule: filteredSchedule,
        });
      }
    }

    return res.json({
      facultyName: teacherName,
      timetables: results,
    });
  } catch (err) {
    console.error("Faculty Timetable Error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default router;
