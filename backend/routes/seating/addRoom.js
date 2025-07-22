// routes/addRoom.js

import express from 'express';
import Classroom from '../../models/seating/Classroom.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { roomNo, capacity, type, floor } = req.body;

    const newRoom = new Classroom({
      roomNo,
      capacity: Number(capacity),
      type,
      floor
    });

    await newRoom.save();
    res.status(200).json({ message: 'Room added successfully' });
  } catch (error) {
    console.error('Add Room Error:', error);
    res.status(500).json({ message: 'Failed to add room' });
  }
});

export default router;