import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: {
    type: String,
    unique: true,
    required: function () {
      return this.role === "student";
    },
  },
  facultyId: {
  type: String,
  unique: true,
  required: function () {
    return this.role === "faculty";
  },
},
  teaches: {
    type: [String],
    default: [],
    required: function () {
      return this.role === "faculty";
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    required: true,
  },
  branch: { type: String, default: null },
  year: { type: String, default: null },
  className: { type: String, default: null },
}, {
  timestamps: true,
});

export default mongoose.model("User", userSchema);
