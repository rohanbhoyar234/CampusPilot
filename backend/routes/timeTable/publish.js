import express from 'express';
import Timetable from '../../models/timeTable/Timetable.js';

const router = express.Router();

router.post('/publish', async (req, res) => {
  const { branch, year, published } = req.body;
  try {
    const updated = await Timetable.findOneAndUpdate(
      { branch, year },
      { published },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Timetable not found' });
    res.json({ message: `Timetable ${published ? 'published' : 'unpublished'}` });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ message: 'Failed to update publish state' });
  }
});

export default router;