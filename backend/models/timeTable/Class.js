// models/Class.js

import mongoose from 'mongoose';


const classSchema = new mongoose.Schema({
  name: String,
  branch: String,
  year: String,
  subjects: [{ name: String, sessionsPerWeek: Number }]
});
export default mongoose.model('Class', classSchema);