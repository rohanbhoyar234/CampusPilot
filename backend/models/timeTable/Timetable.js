import mongoose from 'mongoose';


const timetableSchema = new mongoose.Schema({
  branch: String,
  year: String,
  schedule: Object,
  published: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Timetable', timetableSchema);