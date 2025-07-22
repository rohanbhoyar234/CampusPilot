import mongoose from "mongoose";

const StudentAttendanceSchema = new mongoose.Schema({
  studentId: String,
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

const AttendanceSchema = new mongoose.Schema({
  facultyId: String,
  subject: String,
  className: String,
  date: String, 
  students: [StudentAttendanceSchema],
});

export default mongoose.model("Attendance", AttendanceSchema);
