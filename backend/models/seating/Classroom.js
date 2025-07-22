// models/Classroom.js

import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  type: { type: String, enum: ["Hall", "Lab", "Classroom"], required: true },
  floor: { type: String, required: true },
  rows: { type: Number, required: true },      
  columns: { type: Number, required: true },    
});

export default mongoose.model('Classroom', classroomSchema);
