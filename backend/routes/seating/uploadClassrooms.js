// routes/uploadClassrooms.js


import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Classroom from '../../models/seating/Classroom.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const classroomData = xlsx.utils.sheet_to_json(sheet);

    let inserted = 0;
    let skipped = 0;

    for (const row of classroomData) {
      const roomNo = row.RoomNo || row.roomNo;
      const capacity = Number(row.Capacity || row.capacity);
      const type = row.Type || row.type;
      const floor = row.Floor || row.floor;
      const rowsCount = Number(row.Rows || row.rows);         
      const columnsCount = Number(row.Columns || row.columns); 

      if (
        !roomNo || isNaN(capacity) || !type || !floor ||
        isNaN(rowsCount) || isNaN(columnsCount)  
      ) {
        skipped++;
        continue;
      }

      await Classroom.updateOne(
        { roomNo: roomNo.toString().trim() },
        {
          roomNo: roomNo.toString().trim(),
          capacity,
          type: type.toString().trim(),
          floor: floor.toString().trim(),
          rows: rowsCount,
          columns: columnsCount,
        },
        { upsert: true }
      );
      inserted++;
    }

    res.status(200).json({
      message: 'Classroom data upload complete.',
      inserted,
      skipped
    });
  } catch (error) {
    console.error('Upload classroom error:', error);
    res.status(500).json({
      message: 'Failed to upload classroom data.',
      error: error.message
    });
  }
});

export default router;
