// models/Teacher.js

import mongoose from 'mongoose';


const teachersSchema = new mongoose.Schema({
  name: String,
  facultyId: {
    type: String,
    required: true,
    unique: true,
  },
  teaches: [String]
});
export default mongoose.model('Teachers', teachersSchema);