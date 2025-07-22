
import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subjectScores: { type: Object },
  published: { type: Boolean, default: false },
});

export default mongoose.model("Analytics", AnalyticsSchema);
