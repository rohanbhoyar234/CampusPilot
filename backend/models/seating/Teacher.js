// models/Teacher.js

import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: String,
  department: String,
  available: { type: Boolean, default: true }
});

export default mongoose.model('SeatingTeacher', teacherSchema);