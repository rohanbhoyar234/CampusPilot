import express from 'express';
import Timetable from '../../models/timeTable/Timetable.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { branch, year } = req.query;
  try {
    const timetable = await Timetable.findOne({ branch, year, published: true });
    if (!timetable) return res.status(404).json({ message: "No published timetable found" });

    res.json(timetable);
  } catch (err) {
    console.error("Student timetable error:", err);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
});

export default router;