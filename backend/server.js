import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth & Seating Routes
import authRoutes from "./routes/authRoutes.js";
import addRoomRoutes from "./routes/seating/addRoom.js";
import uploadStudentRoutes from "./routes/seating/uploadStudents.js";
import uploadClassroomRoutes from "./routes/seating/uploadClassrooms.js";
import generatePlanRoutes from "./routes/seating/generatePlan.js";
import latestPlanRoute from "./routes/seating/latestplan.js";
import uploadTeacherRoutes from "./routes/seating/uploadTeachers.js";
import uploadTimetable from "./routes/timeTable/upload.js";
import generateAuto from "./routes/timeTable/generateAuto.js";
import publishRoutes from "./routes/publishSeating.js";
import userAdmin from "./routes/userAdmin.js";
import timeTablePublishRoutes from "./routes/timeTable/publish.js";
import TimetableStudentRoutes from "./routes/timeTable/student.js";
import facultyTimetableRoutes from './routes/timeTable/facultyTimetable.js';
import analyticsRoutes from "./routes/analytics/analyticsRoutes.js";
import attendanceRoutes from "./routes/attendance/attendanceRoutes.js";

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/seating/add-room", addRoomRoutes);
app.use("/api/seating/upload-students", uploadStudentRoutes);
app.use("/api/seating/upload-teachers", uploadTeacherRoutes);
app.use("/api/seating/upload-classrooms", uploadClassroomRoutes);
app.use("/api/seating/generate-plan", generatePlanRoutes);
app.use("/api/seating", latestPlanRoute); 
app.use("/api/timeTable", uploadTimetable);
app.use("/api/timeTable", generateAuto);
app.use("/api/publish", publishRoutes);

// User Management routes 
app.use("/api/admin", userAdmin);

app.use("/api/timetable/student", TimetableStudentRoutes);
app.use("/api/timetable", timeTablePublishRoutes);
app.use("/api/timetable", facultyTimetableRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", analyticsRoutes); 

// health checking 
app.get("/", (req, res) => {
  res.send("Server is up and running.");
});

// starting the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
