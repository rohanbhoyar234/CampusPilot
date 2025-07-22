// models/Student.js

import mongoose from 'mongoose';


const studentSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  course: String,
  semester: Number,
  branch: String,
  year: String,
  className: String,
});


export default mongoose.model('Student', studentSchema);