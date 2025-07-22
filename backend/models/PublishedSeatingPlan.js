import mongoose from "mongoose";

const publishedSeatingSchema = new mongoose.Schema(
  {
    examDate: Date,
    classrooms: [
      {
        roomNo: String,
        rows: Number,
        columns: Number,
      },
    ],
    students: [
      {
        rollNo: { type: String },
        roomNo: { type: String },
        row: { type: Number },
        column: { type: Number },
        branch: { type: String, default: "N/A" },
        year: { type: String, default: "N/A" },
        className: { type: String, default: "N/A" },
        _id: false, 
      },
    ],
    invigilators: [
      {
        roomNo: String,
        teacherName: String,
      },
    ],
  },
  { strict: true } 
);

export default mongoose.model("PublishedSeatingPlan", publishedSeatingSchema);
