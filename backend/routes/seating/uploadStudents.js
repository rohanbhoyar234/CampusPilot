// uploadStudents.js

import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Student from '../../models/seating/Student.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const students = jsonData.map((item) => ({
      rollNo: item.RollNo?.toString().trim(),
      name: item.Name?.toString().trim(),
      course: item.Course?.toString().trim(),
      semester: Number(item.Semester),
      branch: item.Branch?.toString().trim(),       
      year: item.Year?.toString().trim(),           
      className: item.ClassName?.toString().trim(), 
    }));

    await Student.insertMany(students);
    res.status(200).json({ message: 'Students uploaded successfully' });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload students' });
  }
});

export default router;
