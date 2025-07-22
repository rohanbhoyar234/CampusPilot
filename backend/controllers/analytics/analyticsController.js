import Analytics from "../../models/analytics/Analytics.js";
import { parseExcel } from "../../utils/analytics/parseExcel.js";

export const uploadAnalytics = async (req, res) => {
  try {
    console.log("Received file:", req.file); 

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const records = parseExcel(fileBuffer);

    console.log("Parsed Records:", records);

    for (let record of records) {
      await Analytics.findOneAndUpdate(
        { studentId: record.studentId },
        record,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Analytics uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading analytics" });
  }
};

export const getAllAnalytics = async (req, res) => {
  try {
    const records = await Analytics.find();
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { published } = req.body;

    const updated = await Analytics.findOneAndUpdate(
      { studentId },
      { published },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Status updated", data: updated });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ message: "Toggle failed" });
  }
};


// average sub score
export const getAverageAnalytics = async (req, res) => {
  try {
    
    const allRecords = await Analytics.find();



    if (!allRecords.length) {
      return res.status(200).json([]);
    }

    const subjectTotals = {};
    const subjectCounts = {};

    allRecords.forEach((record) => {
      const scores = record.subjectScores || {};
      for (const [subject, score] of Object.entries(scores)) {
        if (!isNaN(score)) {
          subjectTotals[subject] = (subjectTotals[subject] || 0) + score;
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        }
      }
    });

    const averages = Object.keys(subjectTotals).map((subject) => ({
      subject,
      average: Number(
        (subjectTotals[subject] / subjectCounts[subject]).toFixed(2)
      ),
    }));
        console.log("Subject Totals:", subjectTotals);
console.log("Subject Counts:", subjectCounts);
console.log("Calculated Averages:", averages);

    res.status(200).json(averages);
  } catch (err) {
    console.error("Average analytics error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// respective student data
export const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Analytics.findOne({
      studentId,
      published: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Analytics not published or student not found." });
    }

    res.json(student);
  } catch (err) {
    console.error("Error in getStudentAnalytics:", err.message);
    res.status(500).json({ message: "Server error while fetching student analytics." });
  }
};



