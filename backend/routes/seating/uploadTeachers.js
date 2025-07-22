//routes/uploadTeachers.js

import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Teacher from '../../models/seating/Teacher.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const teachers = jsonData.map((item) => ({
      name: item.Name?.trim(),
      department: item.Department,
      available: item.Available?.toString().toLowerCase() !== 'no'
    }));

    await Teacher.insertMany(teachers);
    res.status(200).json({ message: 'Teachers uploaded successfully' });
  } catch (error) {
    console.error('Teacher Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload teachers' });
  }
});

export default router;