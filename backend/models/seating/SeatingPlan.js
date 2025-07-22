import mongoose from "mongoose";


const StudentSchema = new mongoose.Schema({
  rollNo: String,
  roomNo: String,
  row: Number,
  column: Number,
  branch: String,     
  year: String,
  className: String
});


const InvigilatorSchema = new mongoose.Schema({
  teacherName: String,
  roomNo: String
});

const ClassroomSchema = new mongoose.Schema({
  roomNo: String,
  capacity: Number,
  floor: String,
  type: String,
  rows: Number,
  columns: Number
});

const SeatingPlanSchema = new mongoose.Schema({
  examDate: { type: Date, default: Date.now },
  students: [StudentSchema],
  invigilators: [InvigilatorSchema],
  classrooms: [ClassroomSchema]
});

export default mongoose.model("SeatingPlan", SeatingPlanSchema);
