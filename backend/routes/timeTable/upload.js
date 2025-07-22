// routes/timeTable/upload.js

import express from 'express';
import Class from '../../models/timeTable/Class.js';
import Teacher from '../../models/timeTable/Teacher.js';

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const { classes, teachers } = req.body;

    await Class.deleteMany();
    await Teacher.deleteMany();

    for (const [name, subjects] of Object.entries(classes)) {
      const match = name.match(/^(FY|SY|TY|1st|2nd|3rd|4th)(.*)$/);
      if (!match) continue;
      const [_, year, branch] = match;
      await Class.create({ branch: branch.trim(), year, subjects });
    }

    for (const teacher of teachers) {
      const { name, facultyId, teaches } = teacher;
      await Teacher.create({ name, facultyId, teaches });
    }

    res.json({ message: 'Uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
